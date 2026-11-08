// Global types shared across features.
// Strict union types prevent magic strings and typos.

export type UnitStatus =
  | "kosong"
  | "dipakai"
  | "dibooking"
  | "disewa_harian"
  | "maintenance";

export type ConsoleType = "PS3" | "PS4";

export interface PlaystationUnit {
  id: string; // e.g. "unit-1"
  name: string; // e.g. "PS 01"
  type: ConsoleType;
  status: UnitStatus;
  currentSessionId?: string | null;
  updatedAt: number; // UTC timestamp in milliseconds
}

export type UserRole = "admin" | "owner";

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string | null;
}

