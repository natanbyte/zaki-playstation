import React from "react";
import { LABELS } from "@/config/labels";
import { PRICING_CONFIG } from "@/config/pricing";
import { formatRupiah } from "@/lib/money";
import type { PlaystationUnit } from "@/types";

interface ConsoleUnitCardProps {
  unit: PlaystationUnit;
  onStartRental: (unit: PlaystationUnit) => void;
  onStopSession: (unitId: string) => void;
  onOpenUnit: (unitId: string) => void;
  onAddFnb?: (unitId: string) => void;
}

export const ConsoleUnitCard: React.FC<ConsoleUnitCardProps> = ({
  unit,
  onStartRental,
  onStopSession,
  onOpenUnit,
  onAddFnb,
}) => {
  const isAvailable = unit.status === "kosong";
  const isActive = unit.status === "dipakai";
  const isBooking = unit.status === "dibooking";
  const isMaintenance = unit.status === "maintenance";

  const ratePerMinute = PRICING_CONFIG.ratesPerMinute[unit.type];
  const package3hPrice = PRICING_CONFIG.threeHourPackage[unit.type];

  return (
    <div
      className={`relative p-4 rounded-lg bg-[#15171A] border transition-all flex flex-col justify-between min-h-[260px] ${
        isActive
          ? "border-[#C8F135]/40 shadow-lg shadow-[#C8F135]/5"
          : isBooking
          ? "border-sky-400/40"
          : isMaintenance
          ? "border-white/[0.05] opacity-75"
          : "border-white/[0.07] hover:border-white/[0.15]"
      }`}
    >
      {/* Top Header: Unit Name, Console Type & Status */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isActive
                  ? "bg-[#C8F135] animate-pulse"
                  : isBooking
                  ? "bg-sky-400"
                  : isMaintenance
                  ? "bg-amber-400"
                  : "bg-white/40"
              }`}
            />
            <h3 className="font-semibold text-base tracking-tight text-[#EDEDED]">
              {unit.name}
            </h3>
          </div>
          <span
            className={`font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border ${
              isActive
                ? "bg-[#C8F135]/10 text-[#C8F135] border-[#C8F135]/30"
                : isBooking
                ? "bg-sky-400/10 text-sky-400 border-sky-400/30"
                : isMaintenance
                ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                : "bg-white/[0.05] text-[#8E9299] border-white/[0.08]"
            }`}
          >
            {unit.status}
          </span>
        </div>

        {/* Console Spec Subtitle */}
        <p className="font-mono text-[11px] text-[#8E9299] mb-3">
          {unit.type} • TV {unit.type === "PS4" ? '50" 4K' : '43" FHD'}
        </p>

        {/* State 1: Unit Kosong (Available) */}
        {isAvailable && (
          <div className="my-4 py-6 rounded bg-[#111215] border border-white/[0.04] text-center flex flex-col items-center justify-center">
            <span className="font-mono text-xs text-[#8E9299]">
              {LABELS.dashboard.unitCard.emptyNotice}
            </span>
            <span className="font-mono text-[11px] text-[#555860] mt-1">
              Tarif: Rp{ratePerMinute}/mnt · 3 Jam {formatRupiah(package3hPrice)}
            </span>
          </div>
        )}

        {/* State 2: Unit Dipakai (Active Playing) */}
        {isActive && (
          <div className="flex flex-col gap-2 my-2">
            <div className="p-2.5 rounded bg-[#111215] border border-white/[0.05] flex items-center justify-between text-xs font-mono">
              <span className="text-[#8E9299]">Pemain:</span>
              <span className="text-[#EDEDED] font-semibold truncate max-w-[120px]">
                Pelanggan Kasir
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#111215] border border-white/[0.05] text-center">
              <span className="block font-mono text-[10px] text-[#8E9299] uppercase">
                {LABELS.dashboard.unitCard.elapsed}
              </span>
              <span className="font-mono text-xl font-bold tracking-wider text-[#C8F135]">
                01:15:00
              </span>
            </div>
            <div className="flex items-center justify-between font-mono text-xs px-1">
              <span className="text-[#8E9299]">{LABELS.dashboard.unitCard.currentBill}:</span>
              <span className="text-[#EDEDED] font-bold">
                {unit.type === "PS4" ? "Rp 18.000" : "Rp 12.000"}
              </span>
            </div>
          </div>
        )}

        {/* State 3: Unit Dibooking */}
        {isBooking && (
          <div className="my-4 p-3 rounded bg-[#111215] border border-sky-400/20 text-xs font-mono">
            <span className="text-sky-400 font-semibold block mb-1">Slot Booking Aktif</span>
            <span className="text-[#8E9299] block">Penyewa: Booking Kasir</span>
            <span className="text-[#555860] block mt-1">Jadwal Sesi Mendatang</span>
          </div>
        )}

        {/* State 4: Maintenance */}
        {isMaintenance && (
          <div className="my-4 p-3 rounded bg-[#111215] border border-amber-400/20 text-xs font-mono text-center">
            <span className="text-amber-400 font-semibold block">Dalam Pemeliharaan</span>
            <span className="text-[#8E9299] text-[11px] block mt-1">Pembersihan stik & cek sistem</span>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-3 border-t border-white/[0.06]">
        {isAvailable && (
          <button
            type="button"
            onClick={() => onStartRental(unit)}
            className="w-full py-2 px-3 rounded text-xs font-mono font-semibold text-black bg-[#C8F135] hover:bg-[#BCE32A] transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
          >
            <span>▶</span>
            <span>{LABELS.dashboard.unitCard.btnStart}</span>
          </button>
        )}

        {isActive && (
          <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => onAddFnb && onAddFnb(unit.id)}
              className="py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-[#EDEDED] transition-colors text-center cursor-pointer"
            >
              {LABELS.dashboard.unitCard.btnAddFnb}
            </button>
            <button
              type="button"
              onClick={() => onStopSession(unit.id)}
              className="py-1.5 rounded bg-red-950/40 hover:bg-red-950/70 text-red-300 border border-red-500/30 transition-colors text-center cursor-pointer font-semibold"
            >
              {LABELS.dashboard.unitCard.btnStop}
            </button>
          </div>
        )}

        {isBooking && (
          <button
            type="button"
            onClick={() => onStartRental(unit)}
            className="w-full py-1.5 px-3 rounded text-xs font-mono text-black bg-sky-400 hover:bg-sky-300 transition-colors cursor-pointer font-semibold"
          >
            {LABELS.dashboard.unitCard.btnCheckin}
          </button>
        )}

        {isMaintenance && (
          <button
            type="button"
            onClick={() => onOpenUnit(unit.id)}
            className="w-full py-1.5 px-3 rounded text-xs font-mono text-[#EDEDED] bg-white/[0.08] hover:bg-white/[0.15] transition-colors cursor-pointer"
          >
            {LABELS.dashboard.unitCard.btnOpenUnit}
          </button>
        )}
      </div>
    </div>
  );
};

