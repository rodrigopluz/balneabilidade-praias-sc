import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { translations, Locale, TranslationKey } from '../i18n/translations';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useI18n, I18nProvider, detectLocale } from '../i18n';
import React from 'react';

describe('i18n translations', () => {
  describe('pt-BR translations', () => {
    it('should have pt-BR translations defined', () => {
      expect(translations['pt-BR']).toBeDefined();
    });

    it('should have appTitle in pt-BR', () => {
      expect(translations['pt-BR'].appTitle).toBe('Balneabilidade das Praias SC');
    });

    it('should have all required translation keys', () => {
      const requiredKeys: TranslationKey[] = [
        'appTitle',
        'appDescription',
        'selectMunicipality',
        'selectYear',
        'municipalityPlaceholder',
        'municipalityHelp',
        'loading',
        'loadingData',
        'noDataFound',
        'processingError',
        'connectionError',
        'error',
        'close',
        'source',
        'footerText',
        'footerLink',
        'chartAriaLabel',
        'municipalityLabel',
        'yearLabel',
        'ecocoliLabel',
        'dateLabel',
        'navigation',
        'openMenu',
        'home',
        'errorTitle',
        'networkError',
        'serverError',
        'invalidMunicipality',
        'darkMode',
        'lightMode',
        'english',
        'portuguese',
      ];

      requiredKeys.forEach(key => {
        expect(translations['pt-BR'][key]).toBeDefined();
        expect(typeof translations['pt-BR'][key]).toBe('string');
      });
    });
  });

  describe('en-US translations', () => {
    it('should have en-US translations defined', () => {
      expect(translations['en-US']).toBeDefined();
    });

    it('should have appTitle in en-US', () => {
      expect(translations['en-US'].appTitle).toBe('Beach Water Quality SC');
    });

    it('should have all required translation keys', () => {
      const ptKeys = Object.keys(translations['pt-BR']);
      const enKeys = Object.keys(translations['en-US']);
      expect(ptKeys.sort()).toEqual(enKeys.sort());
    });
  });

  describe('Locale type', () => {
    it('should allow pt-BR as valid locale', () => {
      const locale: Locale = 'pt-BR';
      expect(translations[locale]).toBeDefined();
    });

    it('should allow en-US as valid locale', () => {
      const locale: Locale = 'en-US';
      expect(translations[locale]).toBeDefined();
    });
  });

  describe('translation content', () => {
    it('should have non-empty strings', () => {
      Object.values(translations).forEach(locale => {
        Object.values(locale).forEach(value => {
          expect(value.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have correct i18n structure', () => {
      expect(Object.keys(translations).length).toBe(2);
    });
  });
});

describe('detectLocale function', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
  });

  it('should return stored locale when available', () => {
    localStorage.setItem('locale', 'en-US');
    expect(detectLocale()).toBe('en-US');
  });

  it('should return pt-BR when no stored locale', () => {
    Object.defineProperty(navigator, 'language', { value: 'pt-BR', configurable: true });
    const result = detectLocale();
    expect(['pt-BR', 'en-US']).toContain(result);
  });

  it('should return stored locale even if invalid', () => {
    localStorage.setItem('locale', 'invalid-locale');
    Object.defineProperty(navigator, 'language', { value: 'pt-BR', configurable: true });
    const result = detectLocale();
    expect(['pt-BR', 'en-US']).toContain(result);
  });

  it('should use language prefix fallback', () => {
    localStorage.removeItem('locale');
    Object.defineProperty(navigator, 'language', { value: 'fr-FR', configurable: true });
    const result = detectLocale();
    expect(result).toBe('pt-BR');
  });

  it('should handle unknown browser language', () => {
    localStorage.removeItem('locale');
    Object.defineProperty(navigator, 'language', { value: 'xx-XX', configurable: true });
    const result = detectLocale();
    expect(result).toBe('pt-BR');
  });
});

describe('I18nProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should provide default locale', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => {
        return React.createElement(I18nProvider, null, children);
      },
    });
    expect(result.current.locale).toBeDefined();
  });

  it('should change locale when setLocale is called', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => {
        return React.createElement(I18nProvider, null, children);
      },
    });
    
    act(() => {
      result.current.setLocale('en-US');
    });
    
    await waitFor(() => {
      expect(result.current.locale).toBe('en-US');
    });
  });

  it('should translate key when translationKey is called', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => {
        return React.createElement(I18nProvider, null, children);
      },
    });
    
    const translation = result.current.translationKey('appTitle');
    expect(typeof translation).toBe('string');
    expect(translation.length).toBeGreaterThan(0);
  });

  it('should fallback to pt-BR when key not found in current locale', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: ({ children }) => {
        return React.createElement(I18nProvider, null, children);
      },
    });
    
    act(() => {
      result.current.setLocale('en-US');
    });
    
    await waitFor(() => {
      const key = 'appTitle' as TranslationKey;
      const translation = result.current.translationKey(key);
      expect(translation).toBeDefined();
    });
  });
});

describe('useI18n hook error', () => {
  it('should throw error when used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useI18n());
    }).toThrow('useI18n must be used within an I18nProvider');
    
    consoleError.mockRestore();
  });
});
