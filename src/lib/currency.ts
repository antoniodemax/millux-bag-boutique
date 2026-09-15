/**
 * Currency model.
 * Every amount in the database is Kenyan shillings; KES is the currency the
 * customer is charged in. USD is shown for international visitors as a
 * guide, converted at a cached daily rate, and always marked approximate.
 */
export type Currency = 'KES' | 'USD';

export const BASE_CURRENCY: Currency = 'KES';
const STORAGE_KEY = 'millux:currency';
const RATE_KEY = 'millux:usdRate';
const RATE_TTL_MS = 12 * 60 * 60 * 1000;
/** Used only when the live rate cannot be fetched */
const FALLBACK_USD_PER_KES = 1 / 129;

type State = { currency: Currency; usdPerKes: number; rateSource: 'live' | 'cached' | 'fallback'; chosen: boolean };

const safeGet = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeSet = (key: string, value: string) => {
  try { localStorage.setItem(key, value); } catch { /* private mode etc. */ }
};

/** Visitors in Kenya see KES; everyone else starts in USD until they choose */
const detectCurrency = (): Currency => {
  const saved = safeGet(STORAGE_KEY);
  if (saved === 'KES' || saved === 'USD') return saved;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const langs = typeof navigator !== 'undefined' ? [navigator.language, ...(navigator.languages || [])] : [];
    if (tz === 'Africa/Nairobi' || langs.some((l) => /-KE\b/i.test(l || ''))) return 'KES';
  } catch { /* ignore */ }
  return 'USD';
};

const loadCachedRate = (): { rate: number; fresh: boolean } | null => {
  const raw = safeGet(RATE_KEY);
  if (!raw) return null;
  try {
    const { rate, at } = JSON.parse(raw);
    if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) return null;
    return { rate, fresh: Date.now() - Number(at) < RATE_TTL_MS };
  } catch { return null; }
};

const cached = typeof window !== 'undefined' ? loadCachedRate() : null;

let state: State = {
  currency: typeof window !== 'undefined' ? detectCurrency() : BASE_CURRENCY,
  usdPerKes: cached?.rate ?? FALLBACK_USD_PER_KES,
  rateSource: cached ? 'cached' : 'fallback',
  chosen: safeGet(STORAGE_KEY) !== null,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const currencyStore = {
  getSnapshot: () => state,
  subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
  setCurrency: (currency: Currency) => {
    if (state.currency === currency) return;
    state = { ...state, currency, chosen: true };
    safeSet(STORAGE_KEY, currency);
    emit();
  },
  /** Refresh the KES→USD rate at most every 12 hours */
  refreshRate: async () => {
    if (cached?.fresh) return;
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/KES', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const rate = Number(data?.rates?.USD);
      if (!Number.isFinite(rate) || rate <= 0) return;
      state = { ...state, usdPerKes: rate, rateSource: 'live' };
      safeSet(RATE_KEY, JSON.stringify({ rate, at: Date.now() }));
      emit();
    } catch { /* keep cached or fallback rate */ }
  },
};

const kesFormatter = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', currencyDisplay: 'code', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const kesFormatterCents = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', currencyDisplay: 'code', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

const toNumber = (value: number | string | null | undefined): number => {
  const n = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return Number.isFinite(n) ? n : 0;
};

/** Always the charged currency, e.g. "KES 12,500" (cents only when present) */
export const formatKES = (value: number | string | null | undefined, opts: { cents?: boolean } = {}): string => {
  const n = toNumber(value);
  const useCents = opts.cents ?? !Number.isInteger(n);
  return (useCents ? kesFormatterCents : kesFormatter).format(n).replace('KES', 'KES ').replace(/\s+/g, ' ').trim();
};

/**
 * Amount in the currently selected currency. USD is a conversion and is
 * prefixed with "≈" so it is never mistaken for the charged amount.
 */
export const formatAmount = (value: number | string | null | undefined, opts: { cents?: boolean } = {}): string => {
  const n = toNumber(value);
  if (state.currency === 'USD') return `≈ ${usdFormatter.format(n * state.usdPerKes)}`;
  return formatKES(n, opts);
};
