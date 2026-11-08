import { PRICING_CONFIG } from "../../config/pricing.ts";
import type { ConsoleType } from "../../types/index.ts";
import type { SessionType } from "../../features/sessions/types.ts";

// Calculates on-spot gaming session cost based on console rate and session mode.
// Pure function: no side effects, deterministic, safe for unit testing.
export const calculateSessionCost = (
  consoleType: ConsoleType,
  sessionType: SessionType,
  durationMinutes: number
): number => {
  const safeMinutes = Math.max(0, Math.ceil(durationMinutes));
  const ratePerMinute = PRICING_CONFIG.ratesPerMinute[consoleType];

  if (sessionType === "loss_time") {
    return safeMinutes * ratePerMinute;
  }

  // 3-Hour Package pricing
  const basePackagePrice = PRICING_CONFIG.threeHourPackage[consoleType];
  const packageDuration = PRICING_CONFIG.threeHourPackage.durationMinutes; // 180 mins

  if (safeMinutes <= packageDuration) {
    return basePackagePrice;
  }

  // Time beyond package is charged per minute at the normal rate
  const overtimeMinutes = safeMinutes - packageDuration;
  return basePackagePrice + overtimeMinutes * ratePerMinute;
};
