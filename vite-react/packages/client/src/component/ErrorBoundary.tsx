import { Component, ReactNode } from 'react';
import { useI18n } from '../i18n';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function ErrorFallback({ error, resetError }: { error: Error | null; resetError: () => void }) {
  const { t } = useI18n();
  
  return (
    <div className="container py-5">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">{t('errorTitle')}</h4>
        <p className="mb-3">{t('processingError')}</p>
        {error && (
          <details className="small">
            <summary>Detalhes técnicos</summary>
            <pre className="mt-2 text-break">{error.message}</pre>
          </details>
        )}
        <hr />
        <button 
          className="btn btn-outline-danger" 
          onClick={resetError}
          aria-label="Tentar novamente"
        >
          {t('loadingData')}
        </button>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, _errorInfo: unknown) {
    console.error('ErrorBoundary caught:', error);
    
    if (typeof window !== 'undefined' && 'Sentry' in window) {
      const Sentry = (window as unknown as { Sentry: { captureException: (e: Error, context?: object) => void } }).Sentry;
      Sentry.captureException(error, { context: 'ErrorBoundary' });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
