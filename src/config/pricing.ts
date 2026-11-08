// Single source of truth for all business rates and pricing rules.
// Values here must never be hardcoded into components.

export const PRICING_CONFIG = {
  // Rate per minute for on-spot play (in Rupiah)
  ratesPerMinute: {
    PS3: 100,
    PS4: 150,
  },

  // 3-hour fixed package price (in Rupiah)
  threeHourPackage: {
    durationMinutes: 180,
    PS3: 12000,
    PS4: 18000,
  },

  // Daily take-home rental configuration
  dailyRental: {
    pricePerDay: 70000, // Same for PS3 & PS4
    gracePeriodHours: 2, // Free buffer after 24h scheduled return time
    lateFeePerHour: 15000, // Fee per started hour after grace period
  },

  // Booking expiry thresholds from booking creation time (in minutes)
  bookingExpiryMinutes: {
    unpaid: 15, // Canceled automatically if no DP within 15 mins
    dpPaid: 60, // Canceled if customer does not show up within 60 mins
  },
} as const;

export type ConsoleType = keyof typeof PRICING_CONFIG.ratesPerMinute;

