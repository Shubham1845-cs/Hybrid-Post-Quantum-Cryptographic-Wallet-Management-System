import { useError } from '../../hooks/useError';
import type { RecoveryOption } from '../../types/error.types';
import ErrorMessage from './ErrorMessage';

const GlobalErrorDisplay = () => {
  const { appError, clearError } = useError();

  if (!appError) return null;

  const recovery: RecoveryOption[] = [];

  if (appError.category === 'network') {
    recovery.push({
      label: 'Retry',
      variant: 'primary',
      action: () => window.location.reload(),
    });
  }

  if (appError.category === 'auth') {
    recovery.push({
      label: 'Try Again',
      variant: 'primary',
      action: clearError,
    });
  }

  if (appError.category === 'not_found') {
    recovery.push({
      label: 'Go Back',
      variant: 'primary',
      action: () => window.history.back(),
    });
  }

  recovery.push({
    label: 'Dismiss',
    variant: 'ghost',
    action: clearError,
  });

  return (
    <div className="fixed top-4 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4">
      <ErrorMessage
        message={appError.raw}
        recovery={recovery}
        onDismiss={clearError}
      />
    </div>
  );
};

export default GlobalErrorDisplay;
