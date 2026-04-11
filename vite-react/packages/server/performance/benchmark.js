#!/usr/bin/env node

const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const SAMPLES = parseInt(process.env.SAMPLES) || 100;

const endpoints = [
  { name: 'GET /', method: 'GET', path: '/' },
  { name: 'GET /health', method: 'GET', path: '/health' },
  { name: 'GET /api/municipalities', method: 'GET', path: '/api/municipalities' },
  { name: 'POST /api/ima/chart', method: 'POST', path: '/api/ima/chart', body: { municipio: '1', ano: '2026' } },
];

function makeRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const data = endpoint.body ? JSON.stringify(endpoint.body) : null;

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: endpoint.path,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({
          duration: Date.now() - start,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 400,
        });
      });
    });

    req.on('error', (err) => {
      resolve({ duration: Date.now() - start, status: 0, success: false, error: err.message });
    });

    if (data) req.write(data);
    req.end();
  });
}

async function runBenchmark() {
  console.log('===========================================');
  console.log('   API BENCHMARK');
  console.log('===========================================');
  console.log(`Samples per endpoint: ${SAMPLES}`);
  console.log(`Target: ${BASE_URL}`);
  console.log('===========================================\n');

  const results = {};

  for (const endpoint of endpoints) {
    const durations = [];
    let errors = 0;

    console.log(`Testing ${endpoint.name}...`);

    for (let i = 0; i < SAMPLES; i++) {
      const result = await makeRequest(endpoint);
      durations.push(result.duration);
      if (!result.success) errors++;

      if ((i + 1) % 20 === 0) process.stdout.write('.');
    }
    console.log(' done');

    const sorted = durations.sort((a, b) => a - b);
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    results[endpoint.name] = { avg, p50, p95, p99, errors, samples: SAMPLES };
  }

  console.log('\n===========================================');
  console.log('   BENCHMARK RESULTS');
  console.log('===========================================');
  console.log(`${'Endpoint'.padEnd(35)} ${'Avg'.padStart(8)} ${'P50'.padStart(8)} ${'P95'.padStart(8)} ${'P99'.padStart(8)} ${'Errors'.padStart(8)}`);
  console.log('-'.repeat(85));

  for (const [name, data] of Object.entries(results)) {
    const r = data;
    const status = r.errors === 0 ? '✅' : '❌';
    console.log(
      `${name.padEnd(35)} ${r.avg.toFixed(2).padStart(8)} ms ${r.p50.toFixed(2).padStart(7)} ms ${r.p95.toFixed(2).padStart(7)} ms ${r.p99.toFixed(2).padStart(7)} ms ${r.errors.toString().padStart(8)}`
    );
  }

  console.log('===========================================\n');

  const allPassed = Object.values(results).every(r => r.errors === 0 && r.p95 < 500);
  console.log(allPassed ? '✅ All benchmarks PASSED' : '❌ Some benchmarks FAILED');

  process.exit(allPassed ? 0 : 1);
}

runBenchmark().catch(console.error);
