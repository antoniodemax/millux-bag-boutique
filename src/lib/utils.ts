import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number): string => {
  const isWhole = Number.isInteger(price);
  return `£${price.toLocaleString('en-GB', { minimumFractionDigits: isWhole ? 0 : 2, maximumFractionDigits: 2 })}`;
}
