import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Shared primitives for admin pages. Palette: charcoal #0A0A0A, off-white #F5F2EC,
 * surface white, borders #E4E0D7, muted #5B5852 / #8C887F, gold accent #A27627.
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
      <h1 className="font-display text-3xl md:text-4xl text-[#0A0A0A] tracking-tight">{title}</h1>
      {description && <p className="text-sm text-[#5B5852] mt-1">{description}</p>}
    </div>
    {action && <div className="flex items-center gap-3">{action}</div>}
  </div>
);

export const Panel = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white border border-[#E4E0D7] rounded-xl shadow-sm ${className}`}>{children}</div>
);

export const GoldButton = ({
  children,
  className = '',
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    {...props}
    className={`bg-[#A27627] hover:bg-[#85601F] text-white border border-transparent rounded-md ${className}`}
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
    className={`border-[#E4E0D7] bg-white text-[#0A0A0A] hover:bg-[#F5F2EC] hover:text-[#0A0A0A] rounded-md ${className}`}
  >
    {children}
  </Button>
);

/** Small muted chip */
export const Chip = ({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'gold' | 'amber' | 'green' | 'red' }) => {
  const tones: Record<string, string> = {
    neutral: 'bg-[#F5F2EC] text-[#5B5852]',
    gold: 'bg-[#F4EBD8] text-[#85601F]',
    amber: 'bg-[#F4EBD8] text-[#85601F]',
    green: 'bg-[#E6F0E9] text-[#2E6B45]',
    red: 'bg-[#F6E3E1] text-[#A4302A]',
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
    <p className="text-[#0A0A0A] font-medium">Something went wrong</p>
    <p className="text-sm text-[#5B5852] mt-1">{message}</p>
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
    <p className="font-display text-xl text-[#0A0A0A]">{title}</p>
    {description && <p className="text-sm text-[#5B5852] mt-1">{description}</p>}
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </div>
);

export const BackLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="inline-flex items-center text-sm text-[#5B5852] hover:text-[#A27627] transition-colors mb-4">
    ← {children}
  </Link>
);

export const PLACEHOLDER_IMAGE = '/images/handbags-category.png';

export const Thumb = ({ src, alt, size = 'h-12 w-12' }: { src?: string | null; alt: string; size?: string }) =>
  src ? (
    <img src={src} alt={alt} className={`${size} object-cover rounded-md border border-[#E4E0D7] bg-[#F5F2EC]`} />
  ) : (
    <div className={`${size} rounded-md border border-dashed border-[#E4E0D7] bg-[#F5F2EC] flex items-center justify-center text-[10px] text-[#8C887F]`}>
      No image
    </div>
  );

/** Extract a human-readable error message from an axios error */
export const errorMessage = (err: any, fallback = 'Request failed'): string =>
  err?.response?.data?.error?.message || err?.response?.data?.error || err?.message || fallback;

export const inputClass =
  'border-[#E4E0D7] bg-white text-[#0A0A0A] placeholder:text-[#8C887F] focus-visible:ring-[#A27627] focus-visible:ring-1 focus-visible:ring-offset-0';
