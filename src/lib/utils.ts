import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format integer kobo amount into display Naira string
 * E.g. 20000 kobo -> ₦200
 */
export function formatMoney(amountInKobo: number, showDecimals: boolean = false): string {
  const naira = amountInKobo / 100;
  if (!showDecimals && naira % 1 === 0) {
    return '₦' + naira.toLocaleString('en-NG');
  }
  return '₦' + naira.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Get greeting based on current local time of the day
 */
export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

/**
 * Determine a clean, friendly location name from device timezone or user setting
 */
export function getFriendlyLocation(customLocation?: string): string {
  if (customLocation && customLocation.trim()) {
    return customLocation.trim();
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz.includes('/')) {
      const parts = tz.split('/');
      const city = parts[parts.length - 1].replace(/_/g, ' ');
      return city;
    }
    return tz || 'Local';
  } catch {
    return 'Nigeria';
  }
}
