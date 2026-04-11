#!/usr/bin/env node

const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const DURATION = parseInt(process.env.DURATION) || 10000;
const CONNECTIONS = parseInt(process.env.CONNECTIONS) || 10;

const stats = {
  requests: 0,
  errors: 0,
  durations: [],
  startTime: Date.now(),
};

function makeRequest() {
  return new Promise((resolve) => {
    const start = Date.now();
    const data = JSON.stringify({ municipio: '1', ano: '2026' });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/ima/chart',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        const duration = Date.now() - start;
        stats.requests++;
        stats.durations.push(duration);
        if (res.statusCode >= 400) {
          stats.errors++;
          console.log(`Error ${res.statusCode} after ${duration}ms`);
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      stats.errors++;
      console.log(`Request error: ${err.message}`);
      resolve();
    });

    req.write(data);
    req.end();
  });
}

async function runLoadTest() {
  console.log('===========================================');
  console.log('   PERFORMANCE LOAD TEST');
  console.log('===========================================');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Duration: ${DURATION}ms`);
  console.log(`Connections: ${CONNECTIONS}`);
  console.log('===========================================\n');

  const interval = setInterval(() => {
    const promises = [];
    for (let i = 0; i < CONNECTIONS; i++) {
      promises.push(makeRequest());
    }
  }, 100);

  await new Promise((resolve) => setTimeout(resolve, DURATION));
  clearInterval(interval);

  await new Promise((resolve) => setTimeout(resolve, 500));

  const totalDuration = Date.now() - stats.startTime;
  const sortedDurations = stats.durations.sort((a, b) => a - b);
  const avgDuration = stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length || 0;
  const p50 = sortedDurations[Math.floor(sortedDurations.length * 0.5)] || 0;
  const p95 = sortedDurations[Math.floor(sortedDurations.length * 0.95)] || 0;
  const p99 = sortedDurations[Math.floor(sortedDurations.length * 0.99)] || 0;
  const maxDuration = sortedDurations[sortedDurations.length - 1] || 0;
  const rps = (stats.requests / totalDuration) * 1000;

  console.log('\n===========================================');
  console.log('   RESULTS');
  console.log('===========================================');
  console.log(`Total Requests:     ${stats.requests}`);
  console.log(`Successful:        ${stats.requests - stats.errors}`);
  console.log(`Errors:            ${stats.errors}`);
  console.log(`Error Rate:        ${((stats.errors / stats.requests) * 100).toFixed(2)}%`);
  console.log(`Requests/sec:      ${rps.toFixed(2)}`);
  console.log(`\nResponse Times:`);
  console.log(`  Average:         ${avgDuration.toFixed(2)} ms`);
  console.log(`  P50 (median):    ${p50.toFixed(2)} ms`);
  console.log(`  P95:             ${p95.toFixed(2)} ms`);
  console.log(`  P99:             ${p99.toFixed(2)} ms`);
  console.log(`  Max:             ${maxDuration.toFixed(2)} ms`);
  console.log('===========================================\n');

  const passed = stats.errors / stats.requests < 0.01 && p95 < 500;
  console.log(passed ? '✅ Performance test PASSED' : '❌ Performance test FAILED');
  
  process.exit(passed ? 0 : 1);
}

runLoadTest().catch(console.error);
