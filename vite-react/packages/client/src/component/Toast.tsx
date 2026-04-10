import { useI18n } from '../i18n';

interface ToastProps {
  message: string;
  type?: 'success' | 'danger' | 'warning' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'danger', onClose }: ToastProps) {
  const { translationKey } = useI18n();
  
  return (
    <div 
      className={`toast show position-fixed bottom-0 end-0 p-3`} 
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ zIndex: 1100 }}
    >
      <div className={`toast-header bg-${type} text-white`}>
        <strong className="me-auto">{translationKey('error')}</strong>
        <button 
          type="button" 
          className="btn-close btn-close-white" 
          onClick={onClose}
          aria-label={translationKey('close')}
        />
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'danger' | 'warning' | 'info';
  }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
