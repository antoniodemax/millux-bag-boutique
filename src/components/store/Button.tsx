import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Storefront button system.
 * primary   — the one purchasing/commit action on a screen (ink, like the wordmark)
 * secondary — supporting action (outlined ink)
 * tertiary  — quiet text action with the editorial underline
 * gold      — reserved for a single brand moment per page (hero, sign-in)
 * danger    — remove/delete
 */
export const storeButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-[0.75rem] font-medium uppercase tracking-[0.16em] transition-colors duration-200 focus-ring disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-paper hover:bg-gold-deep',
        secondary: 'border border-ink text-ink bg-transparent hover:bg-ink hover:text-paper',
        tertiary: 'text-ink border-b border-ink pb-1 px-0 h-auto hover:text-gold-deep hover:border-gold-deep rounded-none',
        gold: 'bg-gold text-paper hover:bg-gold-deep',
        danger: 'border border-danger text-danger bg-transparent hover:bg-danger hover:text-paper',
        ghost: 'text-soft hover:text-ink',
      },
      size: {
        md: 'h-12 px-7',
        sm: 'h-10 px-5 text-[0.6875rem]',
        lg: 'h-14 px-9',
        icon: 'h-11 w-11 p-0',
      },
      full: { true: 'w-full', false: '' },
    },
    compoundVariants: [
      { variant: 'tertiary', size: 'md', class: 'h-auto px-0' },
      { variant: 'tertiary', size: 'sm', class: 'h-auto px-0' },
      { variant: 'tertiary', size: 'lg', class: 'h-auto px-0' },
    ],
    defaultVariants: { variant: 'primary', size: 'md', full: false },
  }
);

export interface StoreButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof storeButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const StoreButton = React.forwardRef<HTMLButtonElement, StoreButtonProps>(
  ({ className, variant, size, full, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(storeButtonVariants({ variant, size, full }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
StoreButton.displayName = 'StoreButton';

export default StoreButton;
