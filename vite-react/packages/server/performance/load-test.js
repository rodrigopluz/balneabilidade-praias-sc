import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const healthDuration = new Trend('health_duration');
const chartDuration = new Trend('chart_duration');

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '30s', target: 50 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export function setup() {
  const res = http.get(`${BASE_URL}/health`);
  if (res.status !== 200) {
    throw new Error(`Server not ready: ${res.status}`);
  }
  return { baseUrl: BASE_URL };
}

export default function (data) {
  const baseUrl = data.baseUrl;

  // Health check
  const healthStart = Date.now();
  const healthRes = http.get(`${baseUrl}/health`);
  healthDuration.add(Date.now() - healthStart);

  check(healthRes, {
    'health status is 200': (r) => r.status === 200,
    'health has timestamp': (r) => r.json('timestamp') !== undefined,
    'health has status': (r) => r.json('status') === 'healthy',
  });
  errorRate.add(healthRes.status !== 200);

  sleep(1);

  // Chart endpoint
  const chartStart = Date.now();
  const chartRes = http.post(
    `${baseUrl}/api/ima/chart`,
    JSON.stringify({ municipio: '1', ano: '2026' }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  chartDuration.add(Date.now() - chartStart);

  check(chartRes, {
    'chart status is 200': (r) => r.status === 200,
    'chart has data': (r) => r.json() !== undefined,
  });
  errorRate.add(chartRes.status !== 200);

  sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    'performance/results.json': JSON.stringify(
      {
        http_reqs: data.metrics.http_reqs.values.count,
        http_req_duration_p95: data.metrics.http_req_duration.values['p(95)'],
        errors_rate: data.metrics.errors ? data.metrics.errors.values.rate : 0,
        health_duration_avg: data.metrics.health_duration ? data.metrics.health_duration.values.avg : 0,
        chart_duration_avg: data.metrics.chart_duration ? data.metrics.chart_duration.values.avg : 0,
      },
      null,
      2
    ),
  };
}

function textSummary(data, opts) {
  let output = '\n';

  output += '===========================================\n';
  output += '   PERFORMANCE TEST RESULTS\n';
  output += '===========================================\n\n';

  if (data.metrics.http_reqs) {
    output += `Total Requests:     ${data.metrics.http_reqs.values.count}\n`;
  }

  if (data.metrics.http_req_duration) {
    const duration = data.metrics.http_req_duration.values;
    output += `Response Time (avg): ${duration.avg.toFixed(2)} ms\n`;
    output += `Response Time (p95): ${duration['p(95)'].toFixed(2)} ms\n`;
    output += `Response Time (max): ${duration.max.toFixed(2)} ms\n`;
  }

  if (data.metrics.http_req_failed) {
    output += `Failed Requests:    ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%\n`;
  }

  output += '\n===========================================\n';

  return output;
}
