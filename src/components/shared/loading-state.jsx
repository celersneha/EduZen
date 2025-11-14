import { Loader2 } from 'lucide-react';

/**
 * Reusable Loading State Component
 * @param {Object} props
 * @param {string} props.message - Loading message
 * @param {string} props.className - Additional CSS classes
 */
export function LoadingState({ message = 'Loading...', className = '' }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4">
          <Loader2 className="h-6 w-6 text-primary mx-auto mt-3" />
        </div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

