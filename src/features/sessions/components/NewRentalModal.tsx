"use client";

import React, { useState, useEffect } from "react";
import { LABELS } from "@/config/labels";
import { PRICING_CONFIG } from "@/config/pricing";
import { formatRupiah } from "@/lib/money";
import type { PlaystationUnit } from "@/types";
import type { SessionType } from "../types";

interface NewRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUnits: PlaystationUnit[];
  selectedUnit: PlaystationUnit | null;
  onConfirmRental: (
    unitId: string,
    playerName: string,
    sessionType: SessionType
  ) => Promise<boolean>;
}

export const NewRentalModal: React.FC<NewRentalModalProps> = ({
  isOpen,
  onClose,
  availableUnits,
  selectedUnit,
  onConfirmRental,
}) => {
  const [targetUnitId, setTargetUnitId] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [sessionType, setSessionType] = useState<SessionType>("loss_time");
  const [stickCount, setStickCount] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUnit) {
      setTargetUnitId(selectedUnit.id);
    } else if (availableUnits.length > 0) {
      setTargetUnitId(availableUnits[0].id);
    }
  }, [selectedUnit, availableUnits, isOpen]);

  if (!isOpen) return null;

  const currentChosenUnit =
    availableUnits.find((u) => u.id === targetUnitId) || selectedUnit;
  const consoleType = currentChosenUnit?.type || "PS4";
  const ratePerMinute = PRICING_CONFIG.ratesPerMinute[consoleType];
  const package3hPrice = PRICING_CONFIG.threeHourPackage[consoleType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUnitId) {
      setErrorMsg("Pilih unit konsol terlebih dahulu");
      return;
    }
    if (!playerName.trim()) {
      setErrorMsg("Nama pemain / pelanggan harus diisi");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const success = await onConfirmRental(targetUnitId, playerName.trim(), sessionType);
    setIsSubmitting(false);

    if (success) {
      setPlayerName("");
      onClose();
    } else {
      setErrorMsg("Gagal mengaktifkan unit. Periksa koneksi Firestore.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-[#15171A] border border-white/[0.1] shadow-2xl p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8F135]" />
            <h2 className="text-base font-semibold text-[#EDEDED]">
              {LABELS.dashboard.modal.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8E9299] hover:text-[#EDEDED] font-mono text-sm px-1"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded mb-3 bg-red-950/30 border border-red-500/30 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Target Unit Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-[#8E9299] uppercase">
              {LABELS.dashboard.modal.selectUnit}
            </label>
            <select
              value={targetUnitId}
              onChange={(e) => setTargetUnitId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#111215] text-[#EDEDED] text-sm border border-white/[0.08] focus:border-[#C8F135]/80 focus:outline-none"
            >
              {availableUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.type}) - Siap Sewa
                </option>
              ))}
            </select>
          </div>

          {/* Player Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-[#8E9299] uppercase">
              {LABELS.dashboard.modal.customerName}
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={LABELS.dashboard.modal.customerPlaceholder}
              className="w-full px-3 py-2 rounded bg-[#111215] text-[#EDEDED] text-sm border border-white/[0.08] focus:border-[#C8F135]/80 focus:outline-none placeholder-[#555860]"
            />
          </div>

          {/* Session Mode (Loss-time vs Paket 3 Jam) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-[#8E9299] uppercase">
              {LABELS.dashboard.modal.sessionMode}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSessionType("loss_time")}
                className={`p-2.5 rounded border text-left font-mono text-xs transition-colors ${
                  sessionType === "loss_time"
                    ? "bg-[#C8F135]/10 border-[#C8F135] text-[#C8F135]"
                    : "bg-[#111215] border-white/[0.08] text-[#8E9299] hover:text-[#EDEDED]"
                }`}
              >
                <span className="font-semibold block">Loss Time</span>
                <span className="text-[10px] opacity-80">
                  Rp{ratePerMinute}/menit
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSessionType("package_3h")}
                className={`p-2.5 rounded border text-left font-mono text-xs transition-colors ${
                  sessionType === "package_3h"
                    ? "bg-[#C8F135]/10 border-[#C8F135] text-[#C8F135]"
                    : "bg-[#111215] border-white/[0.08] text-[#8E9299] hover:text-[#EDEDED]"
                }`}
              >
                <span className="font-semibold block">Paket 3 Jam</span>
                <span className="text-[10px] opacity-80">
                  {formatRupiah(package3hPrice)}
                </span>
              </button>
            </div>
          </div>

          {/* Stick Count */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-[#8E9299] uppercase">
              {LABELS.dashboard.modal.stickCount}
            </label>
            <div className="flex gap-2 font-mono text-xs">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setStickCount(count)}
                  className={`flex-1 py-1.5 rounded border transition-colors ${
                    stickCount === count
                      ? "bg-[#C8F135]/10 border-[#C8F135] text-[#C8F135] font-semibold"
                      : "bg-[#111215] border-white/[0.08] text-[#8E9299]"
                  }`}
                >
                  {count} Stik {count === 2 ? "(Standar)" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08] mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded text-xs font-mono text-[#8E9299] hover:text-[#EDEDED]"
            >
              {LABELS.dashboard.modal.btnCancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded text-xs font-mono font-semibold text-black bg-[#C8F135] hover:bg-[#BCE32A] disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Mengaktifkan..." : LABELS.dashboard.modal.btnSubmit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

