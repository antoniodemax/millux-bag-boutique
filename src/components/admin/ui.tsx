import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const formatMoney = (value: number): string =>
  `£${(Number.isFinite(value) ? value : 0).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

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
      <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-[#1F1F1F] leading-tight">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-[#6B6B6B] mt-1.5 !leading-normal md:!text-sm">{description}</p>
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
  <section className={cn('bg-white border border-[#ECE7E0] rounded-xl shadow-sm', className)}>
    {(title || action) && (
      <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-[#ECE7E0]">
        <div>
          {title && (
            <h2 className="font-playfair text-lg font-semibold text-[#1F1F1F] leading-snug">{title}</h2>
          )}
          {description && (
            <p className="text-xs text-[#999999] mt-0.5 !leading-normal md:!text-xs">{description}</p>
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
  <div className="bg-white border border-[#ECE7E0] rounded-xl shadow-sm px-6 py-5">
    <p className="text-[11px] uppercase tracking-[0.14em] text-[#999999] !leading-normal md:!text-[11px]">
      {label}
    </p>
    <p className="font-playfair text-3xl font-semibold text-[#1F1F1F] mt-2 !leading-tight md:!text-3xl">
      {typeof value === 'number' ? value.toLocaleString('en-GB') : value}
    </p>
    {caption && (
      <p className="text-xs text-[#6B6B6B] mt-1.5 !leading-normal md:!text-xs">{caption}</p>
    )}
  </div>
);

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#FBF3E3] text-[#8A6A2B]',
  processing: 'bg-[#EEF1F6] text-[#3D4C66]',
  shipped: 'bg-[#EAF0F4] text-[#2F5468]',
  delivered: 'bg-[#EAF3EC] text-[#2E5E3E]',
  cancelled: 'bg-[#F6ECEC] text-[#7A3B3B]',
  in_stock: 'bg-[#EAF3EC] text-[#2E5E3E]',
  low_stock: 'bg-[#FBF3E3] text-[#8A6A2B]',
  out_of_stock: 'bg-[#F6ECEC] text-[#7A3B3B]',
};

export const StatusPill = ({ status }: { status: string }) => (
  <span
    className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide capitalize',
      STATUS_STYLES[status] ?? 'bg-[#F3F0EB] text-[#6B6B6B]'
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
    <p className="font-playfair text-lg text-[#1F1F1F]">{title}</p>
    {description && (
      <p className="text-sm text-[#6B6B6B] mt-1.5 !leading-normal md:!text-sm">{description}</p>
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
  <div className="text-center py-12 px-4 bg-white border border-[#ECE7E0] rounded-xl">
    <p className="font-playfair text-lg text-[#1F1F1F]">Something went wrong</p>
    <p className="text-sm text-[#6B6B6B] mt-1.5 !leading-normal md:!text-sm">{message}</p>
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
          <Skeleton key={c} className="h-4 flex-1 bg-[#F3F0EB]" />
        ))}
      </div>
    ))}
  </div>
);

export const StatSkeleton = () => (
  <div className="bg-white border border-[#ECE7E0] rounded-xl shadow-sm px-6 py-5">
    <Skeleton className="h-3 w-24 bg-[#F3F0EB]" />
    <Skeleton className="h-8 w-32 mt-3 bg-[#F3F0EB]" />
  </div>
);

export const BackLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-[#6B6B6B] hover:text-[#B68D40] transition-colors mb-6"
  >
    <span aria-hidden>←</span> {label}
  </Link>
);
