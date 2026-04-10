import { describe, it, expect } from 'vitest';
import {
  normalizeKey,
  validateMunicipioId,
  validateYear,
  parseEcoliValue,
  formatDate,
  getBathingCondition
} from './utils';

describe('normalizeKey', () => {
  it('should normalize keys with accents', () => {
    expect(normalizeKey('Localização')).toBe('localizacao');
  });

  it('should normalize keys with special characters', () => {
    expect(normalizeKey('Ponto de Coleta')).toBe('ponto_de_coleta');
  });

  it('should normalize keys with HTML entities', () => {
    expect(normalizeKey('Município&nbsp;de&nbsp;Teste')).toBe('municipiondenteste');
  });

  it('should lowercase all characters', () => {
    expect(normalizeKey('PONTO_DE_COLETA')).toBe('ponto_de_coleta');
  });

  it('should handle empty string', () => {
    expect(normalizeKey('')).toBe('');
  });

  it('should handle Brazilian Portuguese characters', () => {
    expect(normalizeKey('São José')).toBe('sao_jose');
  });

  it('should handle multiple spaces', () => {
    expect(normalizeKey('Ponto    de    Coleta')).toBe('ponto_de_coleta');
  });
});

describe('validateMunicipioId', () => {
  it('should accept valid numeric string', () => {
    expect(validateMunicipioId('123')).toBe(true);
  });

  it('should accept valid number', () => {
    expect(validateMunicipioId(456)).toBe(true);
  });

  it('should reject non-numeric string', () => {
    expect(validateMunicipioId('abc')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(validateMunicipioId('')).toBe(false);
  });

  it('should accept single digit', () => {
    expect(validateMunicipioId('1')).toBe(true);
  });
});

describe('validateYear', () => {
  it('should accept valid year string', () => {
    expect(validateYear('2026')).toBe(true);
  });

  it('should accept valid year number', () => {
    expect(validateYear(2025)).toBe(true);
  });

  it('should accept undefined', () => {
    expect(validateYear(undefined)).toBe(true);
  });

  it('should reject 2-digit year', () => {
    expect(validateYear('26')).toBe(false);
  });

  it('should reject non-numeric year', () => {
    expect(validateYear('abcd')).toBe(false);
  });
});

describe('parseEcoliValue', () => {
  it('should parse valid number string', () => {
    expect(parseEcoliValue('100')).toBe(100);
  });

  it('should parse zero', () => {
    expect(parseEcoliValue('0')).toBe(0);
  });

  it('should return 0 for invalid string', () => {
    expect(parseEcoliValue('abc')).toBe(0);
  });

  it('should parse large numbers', () => {
    expect(parseEcoliValue('10000')).toBe(10000);
  });
});

describe('formatDate', () => {
  it('should convert DD/MM/YYYY to YYYY-MM-DD', () => {
    expect(formatDate('01/01/2026')).toBe('2026-01-01');
  });

  it('should handle two-digit day and month', () => {
    expect(formatDate('25/12/2025')).toBe('2025-12-25');
  });

  it('should return original for invalid format', () => {
    expect(formatDate('2026-01-01')).toBe('2026-01-01');
  });

  it('should handle single-digit day', () => {
    expect(formatDate('5/1/2026')).toBe('2026-1-5');
  });
});

describe('getBathingCondition', () => {
  it('should return PRÓPRIA for ecoli <= 800', () => {
    expect(getBathingCondition(100)).toBe('PRÓPRIA');
    expect(getBathingCondition(800)).toBe('PRÓPRIA');
  });

  it('should return IMPRÓPRIA for ecoli > 800', () => {
    expect(getBathingCondition(801)).toBe('IMPRÓPRIA');
    expect(getBathingCondition(1000)).toBe('IMPRÓPRIA');
  });

  it('should return PRÓPRIA for zero ecoli', () => {
    expect(getBathingCondition(0)).toBe('PRÓPRIA');
  });
});
