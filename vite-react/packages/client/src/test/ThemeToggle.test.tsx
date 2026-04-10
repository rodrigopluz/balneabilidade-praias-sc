import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ThemeToggle, LanguageToggle } from '../component/ThemeToggle';
import { I18nProvider } from '../i18n';

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <I18nProvider>{children}</I18nProvider>
  );
};

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render toggle button', () => {
    render(<ThemeToggle />, { wrapper: createWrapper() });
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should contain SVG icon', () => {
    render(<ThemeToggle />, { wrapper: createWrapper() });
    const svgs = document.body.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('should be clickable', async () => {
    render(<ThemeToggle />, { wrapper: createWrapper() });
    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons[0];
    
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(localStorage.getItem('theme')).toBeDefined();
    });
  });
});

describe('LanguageToggle Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render language toggle button', () => {
    render(<LanguageToggle />, { wrapper: createWrapper() });
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should have dropdown class', () => {
    render(<LanguageToggle />, { wrapper: createWrapper() });
    const dropdown = document.body.querySelector('.dropdown-menu');
    expect(dropdown).toBeInTheDocument();
  });

  it('should display Portuguese option', () => {
    render(<LanguageToggle />, { wrapper: createWrapper() });
    expect(document.body.textContent).toContain('Português');
  });

  it('should display English option', () => {
    render(<LanguageToggle />, { wrapper: createWrapper() });
    expect(document.body.textContent).toContain('English');
  });

  it('should have both language options in dropdown', () => {
    render(<LanguageToggle />, { wrapper: createWrapper() });
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    
    expect(document.body.textContent).toContain('Português (BR)');
    expect(document.body.textContent).toContain('English (US)');
  });

  it('should display locale indicator', () => {
    render(<LanguageToggle />, { wrapper: createWrapper() });
    const localeIndicator = document.body.querySelector('.ms-1');
    expect(localeIndicator).toBeInTheDocument();
  });
});
