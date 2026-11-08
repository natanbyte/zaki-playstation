import { PRICING_CONFIG } from "../../config/pricing.ts";

// Calculates late fee for take-home daily rentals.
// Rule: after 24h scheduled return time, 2 hours grace period is free,
// then Rp15.000 per started hour beyond the grace period.
export const calculateLateFee = (lateMinutes: number): number => {
  const safeMinutes = Math.max(0, lateMinutes);
  const graceMinutes = PRICING_CONFIG.dailyRental.gracePeriodHours * 60; // 120 mins

  if (safeMinutes <= graceMinutes) {
    return 0;
  }

  const billableMinutes = safeMinutes - graceMinutes;
  const startedHours = Math.ceil(billableMinutes / 60);

  return startedHours * PRICING_CONFIG.dailyRental.lateFeePerHour;
};
