import {
  collection,
  doc,
  getDocs,
  writeBatch,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PlaystationUnit, UnitStatus, ConsoleType } from "@/types";

const COLLECTION_NAME = "units";

// Default initial units for Zaki PlayStation (4x PS3, 4x PS4)
export const DEFAULT_UNITS: Omit<PlaystationUnit, "updatedAt">[] = [
  { id: "PS3-01", name: "PS3 - 01", type: "PS3", status: "kosong", currentSessionId: null },
  { id: "PS3-02", name: "PS3 - 02", type: "PS3", status: "kosong", currentSessionId: null },
  { id: "PS3-03", name: "PS3 - 03", type: "PS3", status: "kosong", currentSessionId: null },
  { id: "PS3-04", name: "PS3 - 04", type: "PS3", status: "kosong", currentSessionId: null },
  { id: "PS4-01", name: "PS4 - 01", type: "PS4", status: "kosong", currentSessionId: null },
  { id: "PS4-02", name: "PS4 - 02", type: "PS4", status: "kosong", currentSessionId: null },
  { id: "PS4-03", name: "PS4 - 03", type: "PS4", status: "kosong", currentSessionId: null },
  { id: "PS4-04", name: "PS4 - 04", type: "PS4", status: "kosong", currentSessionId: null },
];

// Check if units collection exists; if empty, seed default 8 units
export const initializeDefaultUnits = async (): Promise<void> => {
  const unitsRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(unitsRef);

  // If already populated with 8 units, skip seeding
  if (snapshot.size >= DEFAULT_UNITS.length) {
    return;
  }

  const batch = writeBatch(db);
  const now = Date.now();

  for (const unit of DEFAULT_UNITS) {
    const docRef = doc(db, COLLECTION_NAME, unit.id);
    batch.set(docRef, {
      ...unit,
      updatedAt: now,
    });
  }

  await batch.commit();
};

// Real-time listener for all units sorted by ID
export const subscribeToUnits = (
  callback: (units: PlaystationUnit[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const unitsQuery = query(collection(db, COLLECTION_NAME), orderBy("id", "asc"));

  return onSnapshot(
    unitsQuery,
    (snapshot) => {
      const units: PlaystationUnit[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name as string,
          type: data.type as ConsoleType,
          status: data.status as UnitStatus,
          currentSessionId: (data.currentSessionId as string) || null,
          updatedAt: (data.updatedAt as number) || Date.now(),
        };
      });
      callback(units);
    },
    (err) => {
      console.error("Failed to subscribe to units:", err);
      if (onError) onError(err);
    }
  );
};

// Update status of a specific unit
export const updateUnitStatus = async (
  unitId: string,
  status: UnitStatus,
  currentSessionId: string | null = null
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, unitId);
  await updateDoc(docRef, {
    status,
    currentSessionId,
    updatedAt: Date.now(),
  });
};
