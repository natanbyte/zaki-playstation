import type { ConsoleType } from "@/types";

export type SessionType = "loss_time" | "package_3h";

export interface CanteenItemOrder {
  id: string;
  name: string;
  qty: number;
  price: number; // In integer Rupiah
  subtotal: number;
}

export interface PlaySession {
  id: string;
  unitId: string;
  unitName: string;
  consoleType: ConsoleType;
  sessionType: SessionType;
  startTime: number; // UTC timestamp in milliseconds
  endTime: number | null;
  durationMinutes: number;
  rentalCost: number; // Integer Rupiah
  canteenTotal: number; // Integer Rupiah
  totalCost: number; // rentalCost + canteenTotal
  status: "active" | "completed" | "cancelled";
  canteenOrders: CanteenItemOrder[];
  createdAt: number;
  updatedAt: number;
}
