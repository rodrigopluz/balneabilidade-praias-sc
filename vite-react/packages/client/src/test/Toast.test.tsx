import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ToastContainer } from '../component/Toast';
import { I18nProvider } from '../i18n';

const mockOnClose = vi.fn();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nProvider>{children}</I18nProvider>
);

describe('Toast Component', () => {
  describe('ToastContainer', () => {
    it('should render toasts when provided', () => {
      const toasts = [
        { id: '1', message: 'Message 1', type: 'danger' as const },
      ];
      
      render(<ToastContainer toasts={toasts} onRemove={mockOnClose} />, { wrapper });
      expect(document.body.textContent).toContain('Message 1');
    });

    it('should not render messages when empty', () => {
      render(<ToastContainer toasts={[]} onRemove={mockOnClose} />, { wrapper });
      expect(document.body.textContent).not.toContain('Message');
    });
  });
});
