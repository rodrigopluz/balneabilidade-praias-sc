import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

const querySchema = z.object({
  municipio: z.string().regex(/^\d+$/, 'Município deve ser numérico').transform(Number),
  ano: z.string().regex(/^\d{4}$/, 'Ano deve ter 4 dígitos').transform(Number).optional(),
});

describe('IMA API Validation Schema', () => {
  describe('municipio validation', () => {
    it('should accept valid municipio string', () => {
      const result = querySchema.safeParse({ municipio: '2' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.municipio).toBe(2);
      }
    });

    it('should reject non-numeric municipio', () => {
      const result = querySchema.safeParse({ municipio: 'abc' });
      expect(result.success).toBe(false);
    });

    it('should reject empty municipio', () => {
      const result = querySchema.safeParse({ municipio: '' });
      expect(result.success).toBe(false);
    });

    it('should accept municipio with leading zeros', () => {
      const result = querySchema.safeParse({ municipio: '01' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.municipio).toBe(1);
      }
    });
  });

  describe('ano validation', () => {
    it('should accept valid ano string', () => {
      const result = querySchema.safeParse({ municipio: '2', ano: '2026' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.ano).toBe(2026);
      }
    });

    it('should make ano optional', () => {
      const result = querySchema.safeParse({ municipio: '2' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.ano).toBeUndefined();
      }
    });

    it('should reject invalid ano format', () => {
      const result = querySchema.safeParse({ municipio: '2', ano: '26' });
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric ano', () => {
      const result = querySchema.safeParse({ municipio: '2', ano: 'abcd' });
      expect(result.success).toBe(false);
    });
  });

  describe('complete validation', () => {
    it('should validate complete input with municipio and ano', () => {
      const result = querySchema.safeParse({ municipio: '16', ano: '2025' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.municipio).toBe(16);
        expect(result.data.ano).toBe(2025);
      }
    });

    it('should validate complete input with only municipio', () => {
      const result = querySchema.safeParse({ municipio: '29' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.municipio).toBe(29);
      }
    });
  });
});

describe('Key Normalization', () => {
  const normalizeKey = (title: string): string => {
    const key = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')
      .replace(/&([a-z])[a-z]+;/gi, '$1')
      .toLowerCase();
    return key;
  };

  it('should normalize keys with accents', () => {
    const result = normalizeKey('Localização');
    expect(result).toBe('localizacao');
  });

  it('should normalize keys with special characters', () => {
    const result = normalizeKey('Ponto de Coleta');
    expect(result).toBe('ponto_de_coleta');
  });

  it('should normalize keys with HTML entities', () => {
    const result = normalizeKey('Município&nbsp;de&nbsp;Teste');
    expect(result).toBe('municipiondenteste');
  });

  it('should lowercase all characters', () => {
    const result = normalizeKey('PONTO_DE_COLETA');
    expect(result).toBe('ponto_de_coleta');
  });

  it('should handle empty string', () => {
    const result = normalizeKey('');
    expect(result).toBe('');
  });

  it('should handle Brazilian Portuguese characters', () => {
    const result = normalizeKey('São José');
    expect(result).toBe('sao_jose');
  });

  it('should handle multiple spaces', () => {
    const result = normalizeKey('Ponto    de    Coleta');
    expect(result).toBe('ponto_de_coleta');
  });
});

describe('Data Structure Interfaces', () => {
  interface Point {
    [key: string]: string;
  }

  interface PointInfo {
    ponto_de_coleta: string;
    localização: string;
    municipio: string;
    balneario: string;
    [key: string]: string;
  }

  interface BathingDataPoint {
    ecoli: string;
    data: string;
    condicao: string;
    [key: string]: string;
  }

  interface BathingData {
    [key: string]: {
      info: PointInfo;
      data: BathingDataPoint[];
    };
  }

  it('should allow Point interface with dynamic keys', () => {
    const point: Point = {
      data: '01/01/2026',
      ecoli: '100',
      condicao: 'PRÓPRIA'
    };
    expect(point.data).toBe('01/01/2026');
    expect(point.ecoli).toBe('100');
  });

  it('should allow PointInfo interface with required fields', () => {
    const info: PointInfo = {
      ponto_de_coleta: 'Ponto 37',
      localização: 'Em frente à Servidão',
      municipio: 'FLORIANÓPOLIS',
      balneario: 'LAGOA DA CONCEIÇÃO'
    };
    expect(info.ponto_de_coleta).toBe('Ponto 37');
    expect(info.municipio).toBe('FLORIANÓPOLIS');
  });

  it('should allow BathingDataPoint interface', () => {
    const dataPoint: BathingDataPoint = {
      data: '01/01/2026',
      hora: '10:30',
      vento: 'Leste',
      mare: 'Enchente',
      chuva: 'Ausente',
      agua: '28ºC',
      ar: '26ºC',
      ecoli: '100',
      condicao: 'PRÓPRIA'
    };
    expect(dataPoint.ecoli).toBe('100');
    expect(dataPoint.condicao).toBe('PRÓPRIA');
  });

  it('should allow BathingData interface', () => {
    const bathings: BathingData = {
      'point_1': {
        info: {
          ponto_de_coleta: 'Ponto 37',
          localização: 'Local',
          municipio: 'TEST',
          balneario: 'TEST'
        },
        data: [
          { data: '01/01/2026', ecoli: '100', condicao: 'PRÓPRIA' }
        ]
      }
    };
    expect(bathings['point_1'].info.ponto_de_coleta).toBe('Ponto 37');
    expect(bathings['point_1'].data.length).toBe(1);
  });
});
