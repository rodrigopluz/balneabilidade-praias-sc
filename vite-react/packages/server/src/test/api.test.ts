import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';

describe('API Endpoints', () => {
  let app: Express;
  let server: ReturnType<typeof app.listen>;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.get('/api/municipalities', (_req, res) => {
      res.json([
        { id: 1, name: 'Florianópolis' },
        { id: 2, name: 'Balneário Camboriú' }
      ]);
    });

    app.get('/api/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.get('/api/error', (_req, _res) => {
      throw new Error('Test error');
    });

    app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.status(500).json({ error: err.message });
    });
  });

  afterEach(() => {
    if (server) {
      server.close();
    }
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('GET /api/municipalities', () => {
    it('should return municipalities list', async () => {
      const response = await request(app).get('/api/municipalities');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should have correct municipality structure', async () => {
      const response = await request(app).get('/api/municipalities');
      const municipality = response.body[0];
      expect(municipality).toHaveProperty('id');
      expect(municipality).toHaveProperty('name');
    });
  });

  describe('Error handling', () => {
    it('should handle errors gracefully', async () => {
      const response = await request(app).get('/api/error');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});

describe('Input Validation', () => {
  it('should validate numeric municipality ID', () => {
    const validMunicipio = '123';
    const invalidMunicipio = 'abc';
    
    expect(/^\d+$/.test(validMunicipio)).toBe(true);
    expect(/^\d+$/.test(invalidMunicipio)).toBe(false);
  });

  it('should validate 4-digit year', () => {
    const validYear = '2026';
    const invalidYear = '26';
    
    expect(/^\d{4}$/.test(validYear)).toBe(true);
    expect(/^\d{4}$/.test(invalidYear)).toBe(false);
  });

  it('should handle optional year', () => {
    const withYear = { municipio: '1', ano: '2026' };
    const withoutYear = { municipio: '1' };
    
    expect(withYear.ano).toBeDefined();
    expect(withoutYear.ano).toBeUndefined();
  });
});

describe('Data Processing', () => {
  it('should normalize Brazilian Portuguese characters', () => {
    const normalize = (str: string) => 
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    
    expect(normalize('São José')).toBe('sao jose');
    expect(normalize('Florianópolis')).toBe('florianopolis');
    expect(normalize('Balneário')).toBe('balneario');
  });

  it('should replace spaces with underscores', () => {
    const normalize = (str: string) => 
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').toLowerCase();
    
    expect(normalize('Ponto de Coleta')).toBe('ponto_de_coleta');
    expect(normalize('Municipio de Teste')).toBe('municipio_de_teste');
  });

  it('should handle HTML entities', () => {
    const normalize = (str: string) => 
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&([a-z])[a-z]+;/gi, '$1').toLowerCase();
    
    expect(normalize('Test&nbsp;Value')).toBe('testnvalue');
    expect(normalize('M&nbsp;S')).toBe('mns');
  });

  it('should parse table data structure', () => {
    interface Point {
      [key: string]: string;
    }

    const cellsData: Point = {
      'data': '01/01/2026',
      'ecoli': '100',
      'condicao': 'PRÓPRIA'
    };

    expect(cellsData['data']).toBe('01/01/2026');
    expect(cellsData['ecoli']).toBe('100');
    expect(cellsData['condicao']).toBe('PRÓPRIA');
  });

  it('should handle bathing data structure', () => {
    interface PointInfo {
      ponto_de_coleta: string;
      localizacao: string;
      municipio: string;
      balneario: string;
    }

    interface BathingDataPoint {
      ecoli: string;
      data: string;
      condicao: string;
    }

    const bathings: { [key: string]: { info: PointInfo; data: BathingDataPoint[] } } = {};

    bathings['point_1'] = {
      info: {
        ponto_de_coleta: 'Ponto 37',
        localizacao: 'Servidão Thalat',
        municipio: 'FLORIANÓPOLIS',
        balneario: 'LAGOA DA CONCEIÇÃO'
      },
      data: [
        { data: '01/01/2026', ecoli: '100', condicao: 'PRÓPRIA' }
      ]
    };

    expect(bathings['point_1'].info.ponto_de_coleta).toBe('Ponto 37');
    expect(bathings['point_1'].data.length).toBe(1);
    expect(bathings['point_1'].data[0].ecoli).toBe('100');
  });
});
