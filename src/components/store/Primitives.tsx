import * as React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { StoreButton } from './Button';

/** Page-width wrapper shared by every storefront screen */
export const Container = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('site-container', className)}>{children}</div>
);

/** Editorial section heading: small gold label, display title, optional link */
export const SectionHeading = ({
  eyebrow,
  title,
  description,
  link,
  align = 'left',
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  link?: { to: string; label: string };
  align?: 'left' | 'center';
  className?: string;
}) => (
  <div
    className={cn(
      'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
      align === 'center' && 'sm:flex-col sm:items-center text-center',
      className
    )}
  >
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
      {eyebrow && <p className="brand-label text-gold-deep mb-3">{eyebrow}</p>}
      <h2 className="text-display-md">{title}</h2>
      {description && <p className="mt-3 text-sm sm:text-base text-soft leading-relaxed max-w-prose">{description}</p>}
    </div>
    {link && (
      <Link to={link.to} className="brand-link shrink-0 self-start sm:self-auto">
        {link.label}
      </Link>
    )}
  </div>
);

/** Page title block for shop, account and content pages */
export const PageHeading = ({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <header className={cn('py-10 sm:py-14 lg:py-16', className)}>
    {eyebrow && <p className="brand-label text-gold-deep mb-3">{eyebrow}</p>}
    <h1 className="text-display-lg">{title}</h1>
    {description && <p className="mt-4 max-w-xl text-sm sm:text-base text-soft leading-relaxed">{description}</p>}
    {children}
  </header>
);

/** Skeleton block */
export const Skeleton = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cn('animate-pulse bg-stone', className)} />
);

/** Skeleton grid that mirrors the product grid */
export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Loading products">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        <Skeleton className="aspect-[4/5] w-full" />
        <Skeleton className="mt-4 h-3 w-16" />
        <Skeleton className="mt-3 h-4 w-3/4" />
        <Skeleton className="mt-2 h-3 w-12" />
      </div>
    ))}
  </div>
);

/** Error state with a retry action */
export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We could not load this right now.',
  onRetry,
  className,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}) => (
  <div role="alert" className={cn('mx-auto max-w-md py-16 text-center', className)}>
    <p className="brand-label text-danger mb-3">Unavailable</p>
    <h2 className="text-display-sm">{title}</h2>
    <p className="mt-3 text-sm text-soft">{message}</p>
    {onRetry && (
      <StoreButton variant="secondary" size="sm" className="mt-8" onClick={onRetry}>
        Try again
      </StoreButton>
    )}
  </div>
);

/** Empty state with an optional next action */
export const EmptyState = ({
  title,
  message,
  action,
  className,
}: {
  title: string;
  message?: string;
  action?: { to: string; label: string } | { onClick: () => void; label: string };
  className?: string;
}) => (
  <div className={cn('mx-auto max-w-md py-16 text-center', className)}>
    <h2 className="text-display-sm">{title}</h2>
    {message && <p className="mt-3 text-sm text-soft">{message}</p>}
    {action && 'to' in action && (
      <StoreButton asChild variant="secondary" size="sm" className="mt-8">
        <Link to={action.to}>{action.label}</Link>
      </StoreButton>
    )}
    {action && 'onClick' in action && (
      <StoreButton variant="secondary" size="sm" className="mt-8" onClick={action.onClick}>
        {action.label}
      </StoreButton>
    )}
  </div>
);

/** Availability pill used on cards, detail page and cart */
export const AvailabilityPill = ({ availability, stock }: { availability: 'in_stock' | 'low_stock' | 'out_of_stock'; stock?: number }) => {
  if (availability === 'out_of_stock' || stock === 0) {
    return <span className="brand-label text-soft">Sold out</span>;
  }
  if (availability === 'low_stock' || (typeof stock === 'number' && stock > 0 && stock <= 5)) {
    return <span className="brand-label text-warning">Only a few left</span>;
  }
  return <span className="brand-label text-success">In stock</span>;
};

/** Form field wrapper: label, control, error */
export const Field = ({
  id,
  label,
  error,
  hint,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('space-y-2', className)}>
    <label htmlFor={id} className="brand-label text-ink flex items-baseline gap-2">
      {label}
      {optional && <span className="normal-case tracking-normal text-faint font-normal">(optional)</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-faint">{hint}</p>}
    {error && (
      <p id={`${id}-error`} role="alert" className="text-xs text-danger">
        {error}
      </p>
    )}
  </div>
);

/** Storefront text input styling (sharp, 1px, gold focus) */
export const inputClass =
  'h-12 w-full border border-line bg-paper px-4 font-sans text-base text-ink placeholder:text-faint transition-colors focus:border-ink focus-ring disabled:opacity-50 aria-[invalid=true]:border-danger';

export const selectClass = cn(inputClass, 'appearance-none pr-10');

/** Chevron used as a background for native selects (position/size live here so
 *  tailwind-merge never mistakes them for a background colour) */
export const selectChevron: React.CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230A0A0A' stroke-width='1.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  backgroundSize: '12px 12px',
};
