import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Shared primitives for admin pages. Palette: charcoal #1F1F1F, off-white #FAF8F5,
 * surface white, borders #ECE7E0, muted #6B6B6B / #999999, gold accent #B68D40.
 */

export const PageHeader = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
    <div>
      <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-[#1F1F1F] tracking-tight">{title}</h1>
      {description && <p className="text-sm text-[#6B6B6B] mt-1">{description}</p>}
    </div>
    {action && <div className="flex items-center gap-3">{action}</div>}
  </div>
);

export const Panel = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white border border-[#ECE7E0] rounded-xl shadow-sm ${className}`}>{children}</div>
);

export const GoldButton = ({
  children,
  className = '',
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    {...props}
    className={`bg-[#B68D40] hover:bg-[#A37C34] text-white border border-transparent rounded-md ${className}`}
  >
    {children}
  </Button>
);

export const OutlineButton = ({
  children,
  className = '',
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    variant="outline"
    {...props}
    className={`border-[#ECE7E0] bg-white text-[#1F1F1F] hover:bg-[#FAF8F5] hover:text-[#1F1F1F] rounded-md ${className}`}
  >
    {children}
  </Button>
);

/** Small muted chip */
export const Chip = ({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'gold' | 'amber' | 'green' | 'red' }) => {
  const tones: Record<string, string> = {
    neutral: 'bg-[#F5F2EC] text-[#6B6B6B]',
    gold: 'bg-[#F3EFE7] text-[#6B5A2E]',
    amber: 'bg-[#FAF1E1] text-[#8A6420]',
    green: 'bg-[#EAF2EA] text-[#3F6B45]',
    red: 'bg-[#F8ECEB] text-[#8A3A34]',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide uppercase ${tones[tone]}`}>
      {children}
    </span>
  );
};

export const OrderStatusPill = ({ status }: { status: string }) => {
  const tone =
    status === 'delivered' ? 'green' :
    status === 'cancelled' ? 'red' :
    status === 'shipped' ? 'gold' :
    status === 'processing' ? 'amber' : 'neutral';
  return <Chip tone={tone as any}>{status}</Chip>;
};

export const AvailabilityPill = ({ availability }: { availability: string }) => {
  const label = availability.replace(/_/g, ' ');
  const tone = availability === 'in_stock' ? 'green' : availability === 'low_stock' ? 'amber' : 'red';
  return <Chip tone={tone as any}>{label}</Chip>;
};

export const LoadingRows = ({ rows = 5 }: { rows?: number }) => (
  <div className="p-6 space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-10 w-full bg-[#F5F2EC]" />
    ))}
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="p-12 text-center">
    <p className="text-[#1F1F1F] font-medium">Something went wrong</p>
    <p className="text-sm text-[#6B6B6B] mt-1">{message}</p>
    {onRetry && (
      <OutlineButton className="mt-5" onClick={onRetry}>
        Try again
      </OutlineButton>
    )}
  </div>
);

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) => (
  <div className="p-12 text-center">
    <p className="font-playfair text-xl text-[#1F1F1F]">{title}</p>
    {description && <p className="text-sm text-[#6B6B6B] mt-1">{description}</p>}
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </div>
);

export const BackLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="inline-flex items-center text-sm text-[#6B6B6B] hover:text-[#B68D40] transition-colors mb-4">
    ← {children}
  </Link>
);

export const PLACEHOLDER_IMAGE = '/images/handbags-category.png';

export const Thumb = ({ src, alt, size = 'h-12 w-12' }: { src?: string | null; alt: string; size?: string }) =>
  src ? (
    <img src={src} alt={alt} className={`${size} object-cover rounded-md border border-[#ECE7E0] bg-[#FAF8F5]`} />
  ) : (
    <div className={`${size} rounded-md border border-dashed border-[#ECE7E0] bg-[#FAF8F5] flex items-center justify-center text-[10px] text-[#999999]`}>
      No image
    </div>
  );

/** Extract a human-readable error message from an axios error */
export const errorMessage = (err: any, fallback = 'Request failed'): string =>
  err?.response?.data?.error?.message || err?.response?.data?.error || err?.message || fallback;

export const inputClass =
  'border-[#ECE7E0] bg-white text-[#1F1F1F] placeholder:text-[#999999] focus-visible:ring-[#B68D40] focus-visible:ring-1 focus-visible:ring-offset-0';
