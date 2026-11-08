"use client";

import { useEffect, useState } from "react";
import type { PlaystationUnit, UnitStatus } from "@/types";
import {
  initializeDefaultUnits,
  subscribeToUnits,
  updateUnitStatus,
} from "../services/unitService";

export const useUnits = () => {
  const [units, setUnits] = useState<PlaystationUnit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupUnits = async () => {
      try {
        // Ensure default 8 units exist in Firestore
        await initializeDefaultUnits();

        // Subscribe to real-time changes
        unsubscribe = subscribeToUnits(
          (liveUnits) => {
            setUnits(liveUnits);
            setIsLoading(false);
          },
          (err) => {
            setError(err.message || "Gagal memuat status unit konsol");
            setIsLoading(false);
          }
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal menginisialisasi database unit";
        setError(message);
        setIsLoading(false);
      }
    };

    setupUnits();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const changeStatus = async (
    unitId: string,
    status: UnitStatus,
    currentSessionId: string | null = null
  ) => {
    try {
      await updateUnitStatus(unitId, status, currentSessionId);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui status unit";
      setError(message);
      return false;
    }
  };

  return {
    units,
    isLoading,
    error,
    changeStatus,
  };
};
