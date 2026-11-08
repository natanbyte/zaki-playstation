"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LABELS } from "@/config/labels";
import { ConsoleLedger } from "@/features/auth/components/ConsoleLedger";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 text-[#EDEDED] overflow-hidden selection:bg-[#C8F135] selection:text-black">
      {/* Full Page Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/login-bg.jpg"
          alt="PlayStation Wallpaper Background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark Vignette Overlay for High-Contrast Clean Focus */}
        <div className="absolute inset-0 bg-[#0D0E10]/85 backdrop-blur-[3px]" />
      </div>

      {/* Centered Console Control Room Frame */}
      <div className="w-full max-w-4xl rounded-xl bg-[#15171A]/95 border border-white/[0.08] overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-11 min-h-[560px]">
          {/* Left Column: PlayStation Artwork & Words */}
          <ConsoleLedger />

          {/* Right Column: Authentication Terminal */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-center bg-[#15171A]/90">
            {/* Header for Mobile */}
            <div className="lg:hidden flex items-center gap-2.5 mb-6 pb-4 border-b border-white/[0.08]">
              <svg className="w-5 h-5 text-[#C8F135]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth={1.75} />
                <circle cx="8" cy="12" r="1.5" fill="currentColor" />
                <path d="M15 10v4M13 12h4" strokeWidth={1.75} strokeLinecap="round" />
              </svg>
              <span className="text-base font-semibold tracking-tight text-[#EDEDED]">
                Zaki Playstation
              </span>
            </div>

            {/* Terminal Title */}
            <div className="mb-6">
              <span className="font-mono text-[11px] tracking-wider uppercase text-[#8E9299] block mb-1">
                Terminal Otentikasi
              </span>
              <h1 className="text-xl font-semibold tracking-tight text-[#EDEDED]">
                {LABELS.auth.portalTitle}
              </h1>
              <p className="text-xs text-[#8E9299] mt-1">
                {LABELS.auth.portalSubtitle}
              </p>
            </div>

            {/* Connected Login Form with Redirect to Dashboard */}
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        </div>
      </div>

      {/* Quiet Minimal Footer */}
      <div className="mt-6 text-center">
        <p className="font-mono text-[11px] text-[#8E9299]/70">
          {LABELS.app.copyright}
        </p>
      </div>
    </div>
  );
}
