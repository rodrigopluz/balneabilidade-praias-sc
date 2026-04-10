import { ReactNode } from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ variant = 'text', width, height, className = '' }: SkeletonProps) {
  const defaultHeight = variant === 'circular' ? 40 : variant === 'rectangular' ? 200 : 20;
  
  return (
    <div
      className={`skeleton ${variant} ${className}`}
      style={{
        width: width ?? (variant === 'circular' ? 40 : '100%'),
        height: height ?? defaultHeight,
      }}
      aria-hidden="true"
    />
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function LoadingSpinner({ size = 'md', label = 'Carregando...' }: LoadingSpinnerProps) {
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border',
  }[size];

  return (
    <div 
      className="d-flex justify-content-center align-items-center py-5" 
      role="status"
      aria-live="polite"
    >
      <div className={`spinner-border text-primary ${sizeClass}`} aria-hidden="true" />
      <span className="visually-hidden ms-2">{label}</span>
    </div>
  );
}

interface ChartSkeletonProps {
  height?: number;
}

export function ChartSkeleton({ height = 400 }: ChartSkeletonProps) {
  return (
    <div 
      className="chart-skeleton" 
      style={{ height }}
      role="img"
      aria-label="Carregando gráfico..."
    >
      <div className="d-flex flex-column h-100">
        <Skeleton variant="rectangular" height={50} className="mb-3" />
        <Skeleton variant="rectangular" height={height - 100} />
        <div className="d-flex justify-content-center gap-2 mt-3">
          <Skeleton variant="circular" width={12} height={12} />
          <Skeleton variant="circular" width={12} height={12} />
          <Skeleton variant="circular" width={12} height={12} />
        </div>
      </div>
    </div>
  );
}

interface SuspenseFallbackProps {
  children: ReactNode;
  isLoading: boolean;
  fallback?: ReactNode;
}

export function SuspenseFallback({ 
  children, 
  isLoading, 
  fallback 
}: SuspenseFallbackProps) {
  if (isLoading) {
    return fallback ?? <LoadingSpinner />;
  }
  return <>{children}</>;
}
