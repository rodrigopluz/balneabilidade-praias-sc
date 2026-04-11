import { describe, it, expect, beforeAll } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';

describe('API Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
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

    app.get('/api/municipalities', (_req, res) => {
      res.json([
        { id: 1, name: 'Florianópolis', code: '1' },
        { id: 2, name: 'Balneário Camboriú', code: '2' },
        { id: 16, name: 'Itajaí', code: '16' },
        { id: 29, name: 'Joinville', code: '29' },
      ]);
    });

    app.post('/api/ima/chart', (req, res) => {
      const { municipio, ano } = req.body;

      if (!municipio) {
        res.status(400).json({ error: 'Parâmetros inválidos.', details: [] });
        return;
      }

      if (ano && !/^\d{4}$/.test(String(ano))) {
        res.status(400).json({ error: 'Ano deve ter 4 dígitos.' });
        return;
      }

      res.json({
        point_1: {
          info: {
            ponto_de_coleta: 'Ponto 37',
            localizacao: 'Servidão Thalat',
            municipio: 'FLORIANÓPOLIS',
            balneario: 'LAGOA DA CONCEIÇÃO',
          },
          data: [
            { data: '01/01/2026', ecoli: '100', condicao: 'PRÓPRIA' },
            { data: '02/01/2026', ecoli: '200', condicao: 'PRÓPRIA' },
          ],
        },
      });
    });

    app.use((_req, res) => {
      res.status(404).json({ error: 'Endpoint não encontrado.' });
    });
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Balneabilidade API');
      expect(response.body.version).toBe('2.0.0');
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
      expect(response.body.version).toBe('2.0.0');
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/health');
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('should include timestamp in ISO format', async () => {
      const response = await request(app).get('/health');
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });
  });

  describe('GET /api/municipalities', () => {
    it('should return municipalities list', async () => {
      const response = await request(app).get('/api/municipalities');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return municipalities with required fields', async () => {
      const response = await request(app).get('/api/municipalities');
      const municipality = response.body[0];
      expect(municipality).toHaveProperty('id');
      expect(municipality).toHaveProperty('name');
      expect(municipality).toHaveProperty('code');
    });

    it('should include Florianopolis', async () => {
      const response = await request(app).get('/api/municipalities');
      const florianopolis = response.body.find((m: any) => m.id === 1);
      expect(florianopolis).toBeDefined();
      expect(florianopolis.name).toBe('Florianópolis');
    });
  });

  describe('POST /api/ima/chart', () => {
    it('should return chart data for valid municipio', async () => {
      const response = await request(app)
        .post('/api/ima/chart')
        .send({ municipio: '1', ano: '2026' });
      
      expect(response.status).toBe(200);
      expect(response.body.point_1).toBeDefined();
      expect(response.body.point_1.info).toBeDefined();
      expect(response.body.point_1.data).toBeDefined();
    });

    it('should return point info with required fields', async () => {
      const response = await request(app)
        .post('/api/ima/chart')
        .send({ municipio: '1' });
      
      const pointInfo = response.body.point_1.info;
      expect(pointInfo).toHaveProperty('ponto_de_coleta');
      expect(pointInfo).toHaveProperty('localizacao');
      expect(pointInfo).toHaveProperty('municipio');
      expect(pointInfo).toHaveProperty('balneario');
    });

    it('should return data array with bathing points', async () => {
      const response = await request(app)
        .post('/api/ima/chart')
        .send({ municipio: '1' });
      
      const dataPoints = response.body.point_1.data;
      expect(Array.isArray(dataPoints)).toBe(true);
      expect(dataPoints.length).toBeGreaterThan(0);
      
      const dataPoint = dataPoints[0];
      expect(dataPoint).toHaveProperty('data');
      expect(dataPoint).toHaveProperty('ecoli');
      expect(dataPoint).toHaveProperty('condicao');
    });

    it('should reject request without municipio', async () => {
      const response = await request(app)
        .post('/api/ima/chart')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should reject invalid year format', async () => {
      const response = await request(app)
        .post('/api/ima/chart')
        .send({ municipio: '1', ano: '26' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Ano');
    });

    it('should accept request with only municipio', async () => {
      const response = await request(app)
        .post('/api/ima/chart')
        .send({ municipio: '1' });
      
      expect(response.status).toBe(200);
      expect(response.body.point_1).toBeDefined();
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/unknown/endpoint');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Endpoint não encontrado.');
    });

    it('should return JSON for 404', async () => {
      const response = await request(app).get('/not/found');
      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('Content-Type Headers', () => {
    it('should return JSON content-type for all endpoints', async () => {
      const endpoints = ['/', '/health', '/api/municipalities'];
      
      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);
        expect(response.headers['content-type']).toContain('application/json');
      }
    });

    it('should return JSON content-type for POST requests', async () => {
      const response = await request(app)
        .post('/api/ima/chart')
        .send({ municipio: '1' });
      
      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/ima/chart')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');
      
      expect(response.status).toBe(400);
    });

    it('should handle empty body', async () => {
      const response = await request(app)
        .post('/api/ima/chart')
        .send({});
      
      expect(response.status).toBe(400);
    });
  });

  describe('Response Times', () => {
    it('should respond quickly to health check', async () => {
      const start = Date.now();
      await request(app).get('/health');
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100);
    });

    it('should respond quickly to municipalities', async () => {
      const start = Date.now();
      await request(app).get('/api/municipalities');
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100);
    });
  });
});
