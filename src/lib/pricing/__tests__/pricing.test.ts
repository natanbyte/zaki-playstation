import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateSessionCost } from "../calculateSessionCost.ts";
import { calculateLateFee } from "../calculateLateFee.ts";
import { isBookingExpired } from "../isBookingExpired.ts";

describe("Pricing Rules Verification", () => {
  it("calculates PS3 40 min loss-time = Rp4.000", () => {
    const cost = calculateSessionCost("PS3", "loss_time", 40);
    assert.equal(cost, 4000);
  });

  it("calculates PS4 40 min loss-time = Rp6.000", () => {
    const cost = calculateSessionCost("PS4", "loss_time", 40);
    assert.equal(cost, 6000);
  });

  it("calculates PS4 3-hour package 200 min = Rp21.000 (18.000 + 20 x 150)", () => {
    const cost = calculateSessionCost("PS4", "package_3h", 200);
    // 18.000 + (20 * 150) = 18.000 + 3.000 = 21.000
    assert.equal(cost, 21000);
  });

  it("calculates PS3 3-hour package within 180 min = Rp12.000", () => {
    const cost = calculateSessionCost("PS3", "package_3h", 120);
    assert.equal(cost, 12000);
  });

  it("calculates daily rental late fee 2h10m (130 min) = Rp15.000 (2h free, 1 started hour)", () => {
    const fee = calculateLateFee(130);
    assert.equal(fee, 15000);
  });

  it("calculates daily rental late fee 5h (300 min) = Rp45.000 (2h free, 3 started hours)", () => {
    const fee = calculateLateFee(300);
    assert.equal(fee, 45000);
  });

  it("calculates daily rental within 2h grace period = Rp0 late fee", () => {
    const fee = calculateLateFee(110);
    assert.equal(fee, 0);
  });

  it("correctly identifies booking expiry", () => {
    const now = Date.now();
    const sixteenMinsAgo = now - 16 * 60 * 1000;
    const tenMinsAgo = now - 10 * 60 * 1000;

    // Unpaid expires after 15 mins
    assert.equal(isBookingExpired(sixteenMinsAgo, false, now), true);
    assert.equal(isBookingExpired(tenMinsAgo, false, now), false);

    // DP Paid expires after 60 mins
    const sixtyOneMinsAgo = now - 61 * 60 * 1000;
    const fiftyMinsAgo = now - 50 * 60 * 1000;
    assert.equal(isBookingExpired(sixtyOneMinsAgo, true, now), true);
    assert.equal(isBookingExpired(fiftyMinsAgo, true, now), false);
  });
});
