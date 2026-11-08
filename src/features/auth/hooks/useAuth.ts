"use client";

import { useEffect, useState } from "react";
import type { AppUser } from "@/types";
import { LABELS } from "@/config/labels";
import {
  loginWithEmail,
  logoutUser,
  subscribeToAuth,
} from "../services/authService";
import type { LoginFormData } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen to Firebase auth changes on mount
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (data: LoginFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const loggedUser = await loginWithEmail(data);
      setUser(loggedUser);
      return true;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error && err.message.includes("invalid-credential")
          ? LABELS.auth.errorInvalidCredentials
          : LABELS.auth.errorGeneric;

      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await logoutUser();
    setUser(null);
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    clearError: () => setError(null),
  };
};

