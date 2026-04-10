import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import express, { Express } from 'express';

let app: Express;
let port: number;

beforeAll(async () => {
  app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '2.0.0',
    });
  });

  app.get('/', (_req, res) => {
    res.json({
      name: 'Balneabilidade API',
      version: '2.0.0',
      endpoints: {
        health: '/health',
        chart: '/api/ima/chart',
      },
    });
  });

  app.get('/test', (_req, res) => {
    res.json({ message: 'Test endpoint' });
  });

  app.post('/test-post', (req, res) => {
    res.json({ received: req.body });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado.' });
  });

  port = 3456;
  app.listen(port);
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
});

describe('Express Server', () => {
  describe('Health Endpoint', () => {
    it('should return health status', async () => {
      const response = await fetch(`http://localhost:${port}/health`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.version).toBe('2.0.0');
      expect(data.timestamp).toBeDefined();
      expect(data.uptime).toBeDefined();
    });
  });

  describe('Root Endpoint', () => {
    it('should return API info', async () => {
      const response = await fetch(`http://localhost:${port}/`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.name).toBe('Balneabilidade API');
      expect(data.version).toBe('2.0.0');
      expect(data.endpoints).toBeDefined();
      expect(data.endpoints.health).toBe('/health');
      expect(data.endpoints.chart).toBe('/api/ima/chart');
    });
  });

  describe('Test Endpoint', () => {
    it('should return test message', async () => {
      const response = await fetch(`http://localhost:${port}/test`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.message).toBe('Test endpoint');
    });
  });

  describe('POST Test Endpoint', () => {
    it('should receive and return body', async () => {
      const response = await fetch(`http://localhost:${port}/test-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' }),
      });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.received.test).toBe('data');
    });

    it('should handle empty body', async () => {
      const response = await fetch(`http://localhost:${port}/test-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.received).toEqual({});
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await fetch(`http://localhost:${port}/unknown`);
      
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Endpoint não encontrado.');
    });
  });

  describe('Content-Type', () => {
    it('should return JSON content-type', async () => {
      const response = await fetch(`http://localhost:${port}/health`);
      
      expect(response.headers.get('content-type')).toContain('application/json');
    });
  });
});
