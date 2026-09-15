import { useCurrency } from '@/context/CurrencyContext';
import type { Currency } from '@/lib/currency';
import { cn } from '@/lib/utils';

const OPTIONS: Currency[] = ['KES', 'USD'];

/** Compact KES | USD toggle. `tone="dark"` for the footer/admin sidebar. */
export const CurrencySwitch = ({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) => {
  const { currency, setCurrency } = useCurrency();
  return (
    <div role="group" aria-label="Currency" className={cn('inline-flex items-center', className)}>
      {OPTIONS.map((c, i) => (
        <button
          key={c}
          type="button"
          aria-pressed={currency === c}
          onClick={() => setCurrency(c)}
          className={cn(
            'brand-label px-2 py-2 transition-colors focus-ring',
            i > 0 && (tone === 'dark' ? 'border-l border-paper/20' : 'border-l border-line'),
            currency === c
              ? tone === 'dark' ? 'text-gold-bright' : 'text-ink'
              : tone === 'dark' ? 'text-paper/60 hover:text-paper' : 'text-faint hover:text-ink'
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
};

export default CurrencySwitch;
