import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

/**
 * Reusable Empty State Component
 * @param {Object} props
 * @param {string} props.title - Title text
 * @param {string} props.description - Description text
 * @param {LucideIcon} props.icon - Icon component from lucide-react
 * @param {React.ReactNode} props.action - Optional action button/component
 * @param {string} props.className - Additional CSS classes
 */
export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className = '',
}) {
  return (
    <Card className={`border-0 shadow-lg bg-white/90 backdrop-blur-sm ${className}`}>
      <CardContent className="pt-12 pb-16 px-8">
        <div className="text-center">
          {Icon && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
              <Icon className="h-8 w-8 text-slate-400" />
            </div>
          )}
          <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">{description}</p>
          {action && <div className="flex justify-center">{action}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

