import React from "react";
import Image from "next/image";

export const ConsoleLedger: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-8 sm:p-10 relative overflow-hidden border-r border-white/[0.08] min-h-[560px]">
      {/* Background Wallpaper Image: Posisi digeser ke atas (objectPosition: center 85%) agar logo PlayStation terlihat jelas di atas card */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/login-bg.jpg"
          alt="PlayStation Aesthetic Background"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          style={{ objectPosition: "center 85%" }}
          className="object-cover"
        />
        {/* Soft edge gradient only (tengah tetap jernih untuk logo PS) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-black/15 to-[#0D0E10]/75" />
      </div>

      {/* Top Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 bg-[#0D0E10]/60 backdrop-blur-md w-fit px-3 py-1.5 rounded-md border border-white/[0.08]">
          <svg className="w-5 h-5 text-[#C8F135]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth={1.75} />
            <circle cx="8" cy="12" r="1.5" fill="currentColor" />
            <path d="M15 10v4M13 12h4" strokeWidth={1.75} strokeLinecap="round" />
          </svg>
          <span className="text-sm font-semibold tracking-tight text-[#EDEDED]">
            Zaki Playstation
          </span>
          <span className="font-mono text-[10px] tracking-wider uppercase text-[#8E9299]">
            v2.4
          </span>
        </div>
      </div>

      {/* Bottom Words: Studio Typography with subtle backdrop blur */}
      <div className="relative z-10 flex flex-col gap-2.5 mt-auto pt-6">
        <div className="p-4 rounded-lg bg-[#0D0E10]/75 backdrop-blur-md border border-white/[0.08] flex flex-col gap-1.5">
          <span className="font-mono text-[10px] tracking-wider uppercase text-[#C8F135]">
            Pusat Kendali Operasional
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#EDEDED] leading-snug">
            Presisi di setiap sesi permainan.
          </h2>
          <p className="text-xs text-[#8E9299] leading-relaxed">
            Pencatatan waktu akurat, pengelolaan billing otomatis, dan keteraturan kasir rental dalam satu terminal terpadu.
          </p>
        </div>

        {/* Quiet Bottom Heartbeat */}
        <div className="px-3 py-2 rounded-md bg-[#0D0E10]/60 backdrop-blur-md border border-white/[0.06] flex items-center justify-between font-mono text-[11px] text-[#8E9299]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135]" />
            <span className="text-[#EDEDED]">Sistem Siap Operasi</span>
          </div>
          <span>Stasiun Kasir 01</span>
        </div>
      </div>
    </div>
  );
};
