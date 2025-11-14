import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Reusable Error State Component
 * @param {Object} props
 * @param {string} props.title - Error title
 * @param {string} props.message - Error message
 * @param {string} props.className - Additional CSS classes
 */
export function ErrorState({ title = 'Error', message, className = '' }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center ${className}`}>
      <Card className="w-full max-w-2xl border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="pt-12 pb-16 px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{message || 'An error occurred'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

