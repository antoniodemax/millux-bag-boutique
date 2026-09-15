import { formatAmount } from '@/lib/currency';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Price in the visitor's selected currency (KES, or ≈ USD) */
export const formatPrice = (price: number): string => formatAmount(price);

/** Price in the charged currency, for order messages and records */
export { formatKES } from '@/lib/currency';
