import { formatAmount } from '@/lib/currency';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const formatMoney = (value: number): string => formatAmount(value, { cents: true });

export const formatDate = (value?: string | null): string => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateTime = (value?: string | null): string => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const shortId = (id: string): string => id.slice(0, 8).toUpperCase();

/** Page header used by every admin page */
export const PageHeader = ({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
    <div>
      <h1 className="font-display text-3xl md:text-4xl text-[#0A0A0A] leading-tight">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-[#5B5852] mt-1.5 !leading-normal md:!text-sm">{description}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
  </div>
);

/** White card with 1px warm border */
export const Panel = ({
  children,
  className,
  bodyClassName,
  title,
  description,
  action,
}: {
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}) => (
  <section className={cn('bg-white border border-[#E4E0D7] rounded-xl shadow-sm', className)}>
    {(title || action) && (
      <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-[#E4E0D7]">
        <div>
          {title && (
            <h2 className="font-display text-lg text-[#0A0A0A] leading-snug">{title}</h2>
          )}
          {description && (
            <p className="text-xs text-[#8C887F] mt-0.5 !leading-normal md:!text-xs">{description}</p>
          )}
        </div>
        {action}
      </header>
    )}
    <div className={cn('p-6', bodyClassName)}>{children}</div>
  </section>
);

/** Large figure KPI tile */
export const StatTile = ({
  label,
  value,
  caption,
}: {
  label: string;
  value: string | number;
  caption?: string;
}) => (
  <div className="bg-white border border-[#E4E0D7] rounded-xl shadow-sm px-6 py-5">
    <p className="text-[11px] uppercase tracking-[0.14em] text-[#8C887F] !leading-normal md:!text-[11px]">
      {label}
    </p>
    <p className="font-sans text-3xl font-semibold tabular-nums text-[#0A0A0A] mt-2 !leading-tight md:!text-3xl">
      {typeof value === 'number' ? value.toLocaleString('en-GB') : value}
    </p>
    {caption && (
      <p className="text-xs text-[#5B5852] mt-1.5 !leading-normal md:!text-xs">{caption}</p>
    )}
  </div>
);

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#F4EBD8] text-[#85601F]',
  processing: 'bg-[#F5F2EC] text-[#5B5852]',
  shipped: 'bg-[#F5F2EC] text-[#5B5852]',
  delivered: 'bg-[#E6F0E9] text-[#2E6B45]',
  cancelled: 'bg-[#F6E3E1] text-[#A4302A]',
  in_stock: 'bg-[#E6F0E9] text-[#2E6B45]',
  low_stock: 'bg-[#F4EBD8] text-[#85601F]',
  out_of_stock: 'bg-[#F6E3E1] text-[#A4302A]',
};

export const StatusPill = ({ status }: { status: string }) => (
  <span
    className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide capitalize',
      STATUS_STYLES[status] ?? 'bg-[#F5F2EC] text-[#5B5852]'
    )}
  >
    {status.replace(/_/g, ' ')}
  </span>
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
  <div className="text-center py-12 px-4">
    <p className="font-display text-lg text-[#0A0A0A]">{title}</p>
    {description && (
      <p className="text-sm text-[#5B5852] mt-1.5 !leading-normal md:!text-sm">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <div className="text-center py-12 px-4 bg-white border border-[#E4E0D7] rounded-xl">
    <p className="font-display text-lg text-[#0A0A0A]">Something went wrong</p>
    <p className="text-sm text-[#5B5852] mt-1.5 !leading-normal md:!text-sm">{message}</p>
    {onRetry && (
      <Button variant="outline" className="mt-5" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4">
        {Array.from({ length: cols }).map((__, c) => (
          <Skeleton key={c} className="h-4 flex-1 bg-[#F5F2EC]" />
        ))}
      </div>
    ))}
  </div>
);

export const StatSkeleton = () => (
  <div className="bg-white border border-[#E4E0D7] rounded-xl shadow-sm px-6 py-5">
    <Skeleton className="h-3 w-24 bg-[#F5F2EC]" />
    <Skeleton className="h-8 w-32 mt-3 bg-[#F5F2EC]" />
  </div>
);

export const BackLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-[#5B5852] hover:text-[#A27627] transition-colors mb-6"
  >
    <span aria-hidden>←</span> {label}
  </Link>
);
