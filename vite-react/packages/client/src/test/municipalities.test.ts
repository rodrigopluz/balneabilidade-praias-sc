import { describe, it, expect } from 'vitest';
import { municipalities, getYearOptions } from '../data/municipalities';

describe('municipalities data', () => {
  describe('municipalities array', () => {
    it('should have at least 25 municipalities', () => {
      expect(municipalities.length).toBeGreaterThanOrEqual(25);
    });

    it('should have valid id for each municipality', () => {
      municipalities.forEach(m => {
        expect(typeof m.id).toBe('number');
        expect(m.id).toBeGreaterThan(0);
      });
    });

    it('should have valid name for each municipality', () => {
      municipalities.forEach(m => {
        expect(typeof m.name).toBe('string');
        expect(m.name.length).toBeGreaterThan(0);
      });
    });

    it('should have unique ids', () => {
      const ids = municipalities.map(m => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have Florianopolis', () => {
      const florianopolis = municipalities.find(m => m.id === 2);
      expect(florianopolis).toBeDefined();
      expect(florianopolis?.name).toBe('Florianópolis');
    });

    it('should have Biguaçu', () => {
      const biguacu = municipalities.find(m => m.id === 1);
      expect(biguacu).toBeDefined();
      expect(biguacu?.name).toBe('Biguaçu');
    });
  });

  describe('getYearOptions', () => {
    it('should return 5 year options', () => {
      const years = getYearOptions();
      expect(years.length).toBe(5);
    });

    it('should include current year', () => {
      const years = getYearOptions();
      const currentYear = new Date().getFullYear();
      expect(years.some(y => y.value === currentYear)).toBe(true);
    });

    it('should have correct value/label format', () => {
      const years = getYearOptions();
      years.forEach(y => {
        expect(typeof y.value).toBe('number');
        expect(typeof y.label).toBe('string');
        expect(y.label).toBe(String(y.value));
      });
    });

    it('should return years in descending order', () => {
      const years = getYearOptions();
      for (let i = 1; i < years.length; i++) {
        expect(years[i - 1].value).toBeGreaterThan(years[i].value);
      }
    });

    it('should have valid year values', () => {
      const years = getYearOptions();
      const currentYear = new Date().getFullYear();
      years.forEach(y => {
        expect(y.value).toBeLessThanOrEqual(currentYear);
        expect(y.value).toBeGreaterThan(currentYear - 5);
      });
    });
  });
});
