import { z } from "zod";
import type { AppUser } from "@/types";

// Schema for login form validation
export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  error: string | null;
}

