import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Skeleton } from '../component/Loading';

describe('Loading Components', () => {
  describe('Skeleton', () => {
    it('should render skeleton element', () => {
      render(<Skeleton />);
      const skeleton = document.querySelector('.skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render text variant by default', () => {
      render(<Skeleton />);
      const skeleton = document.querySelector('.skeleton.text');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render circular variant', () => {
      render(<Skeleton variant="circular" />);
      const skeleton = document.querySelector('.skeleton.circular');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render rectangular variant', () => {
      render(<Skeleton variant="rectangular" />);
      const skeleton = document.querySelector('.skeleton.rectangular');
      expect(skeleton).toBeInTheDocument();
    });
  });
});
