import { describe, it, expect } from 'vitest';
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
