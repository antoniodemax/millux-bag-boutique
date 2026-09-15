import { Fragment, useEffect, useSyncExternalStore } from 'react';
import { currencyStore, type Currency } from '@/lib/currency';

export const useCurrency = () => {
  const snap = useSyncExternalStore(currencyStore.subscribe, currencyStore.getSnapshot, currencyStore.getSnapshot);
  return {
    currency: snap.currency,
    usdPerKes: snap.usdPerKes,
    rateSource: snap.rateSource,
    isConverted: snap.currency !== 'KES',
    setCurrency: (c: Currency) => currencyStore.setCurrency(c),
  };
};

/**
 * Keeps the exchange rate fresh and re-renders the routed tree when the
 * visitor switches currency, so every price on screen updates at once.
 */
export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const { currency } = useCurrency();
  useEffect(() => { currencyStore.refreshRate(); }, []);
  return <Fragment key={currency}>{children}</Fragment>;
};
