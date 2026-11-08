"use client";

import React, { useState } from "react";
import { LABELS } from "@/config/labels";
import { loginSchema, type LoginFormData } from "../types";
import { useAuth } from "../hooks/useAuth";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading, error: authError, clearError } = useAuth();

  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof LoginFormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    clearError();
  };

  const handleForgotPassword = () => {
    alert(LABELS.auth.forgotPasswordAlert);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation with Zod (untouched)
    const validation = loginSchema.safeParse(form);
    if (!validation.success) {
      const formattedErrors: Partial<Record<keyof LoginFormData, string>> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof LoginFormData;
        formattedErrors[fieldName] = issue.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    setFieldErrors({});
    const success = await login(form);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full" noValidate>
      {/* Error Callout */}
      {authError && (
        <div className="p-3 rounded-md border border-red-500/25 bg-red-950/20 text-xs text-red-300">
          <p className="font-medium text-red-200 mb-0.5">{LABELS.auth.errorTitle}</p>
          <p className="text-red-300/80 leading-relaxed">{authError}</p>
        </div>
      )}

      {/* Email Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono tracking-wider uppercase text-[#8E9299]" htmlFor="emailInput">
          {LABELS.auth.emailLabel}
        </label>
        <input
          id="emailInput"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          disabled={isLoading}
          placeholder={LABELS.auth.emailPlaceholder}
          className="w-full px-3.5 py-2.5 rounded-md bg-[#111215] text-[#EDEDED] text-sm placeholder-[#555860] border border-white/[0.07] focus:outline-none focus:border-[#C8F135]/80 focus:ring-1 focus:ring-[#C8F135]/40 transition-colors disabled:opacity-50"
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-400 font-mono mt-0.5">{fieldErrors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono tracking-wider uppercase text-[#8E9299]" htmlFor="passwordInput">
            {LABELS.auth.passwordLabel}
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs text-[#8E9299] hover:text-[#EDEDED] transition-colors focus:outline-none"
          >
            {LABELS.auth.forgotPassword}
          </button>
        </div>
        <div className="relative flex items-center">
          <input
            id="passwordInput"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            disabled={isLoading}
            placeholder={LABELS.auth.passwordPlaceholder}
            className="w-full pl-3.5 pr-10 py-2.5 rounded-md bg-[#111215] text-[#EDEDED] text-sm placeholder-[#555860] border border-white/[0.07] focus:outline-none focus:border-[#C8F135]/80 focus:ring-1 focus:ring-[#C8F135]/40 transition-colors tracking-wider disabled:opacity-50 font-mono"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="Tampilkan atau sembunyikan kata sandi"
            className="absolute right-3 p-1 text-[#8E9299] hover:text-[#EDEDED] transition-colors focus:outline-none"
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-xs text-red-400 font-mono mt-0.5">{fieldErrors.password}</p>
        )}
      </div>

      {/* Primary Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-2.5 px-4 rounded-md text-sm font-semibold text-black bg-[#C8F135] hover:bg-[#BCE32A] transition-colors active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-black shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
            </svg>
            <span className="font-mono text-xs">{LABELS.auth.loggingIn}</span>
          </>
        ) : (
          <span>{LABELS.auth.loginButton}</span>
        )}
      </button>

      {/* Bottom Subdued Footnote */}
      <p className="text-xs text-[#555860] leading-relaxed mt-2 text-center">
        {LABELS.auth.footerNote}
      </p>
    </form>
  );
};
