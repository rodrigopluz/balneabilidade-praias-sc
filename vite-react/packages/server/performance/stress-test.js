import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 5 },
    { duration: '10s', target: 20 },
    { duration: '10s', target: 50 },
    { duration: '10s', target: 100 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export default function () {
  const municipio = Math.floor(Math.random() * 30) + 1;
  const ano = 2024 + Math.floor(Math.random() * 3);

  http.post(
    `${BASE_URL}/api/ima/chart`,
    JSON.stringify({ municipio: String(municipio), ano: String(ano) }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  sleep(0.1);
}
