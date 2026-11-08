import { PRICING_CONFIG } from "../../config/pricing.ts";

// Checks if a reservation has expired based on payment status and elapsed time.
// Rule: unpaid = 15 minutes, DP paid = 60 minutes.
export const isBookingExpired = (
  bookingTimeMs: number,
  isDpPaid: boolean,
  currentTimeMs: number = Date.now()
): boolean => {
  const elapsedMinutes = (currentTimeMs - bookingTimeMs) / (1000 * 60);
  const allowedMinutes = isDpPaid
    ? PRICING_CONFIG.bookingExpiryMinutes.dpPaid
    : PRICING_CONFIG.bookingExpiryMinutes.unpaid;

  return elapsedMinutes > allowedMinutes;
};
