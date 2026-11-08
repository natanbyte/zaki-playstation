"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LABELS } from "@/config/labels";
import { useUnits } from "@/features/sessions/hooks/useUnits";
import { DashboardMetrics } from "@/features/sessions/components/DashboardMetrics";
import { ConsoleUnitCard } from "@/features/sessions/components/ConsoleUnitCard";
import { QuickCanteenWidget } from "@/features/sessions/components/QuickCanteenWidget";
import { RecentTransactionsWidget } from "@/features/sessions/components/RecentTransactionsWidget";
import { NewRentalModal } from "@/features/sessions/components/NewRentalModal";
import type { PlaystationUnit, UnitStatus } from "@/types";
import type { SessionType } from "@/features/sessions/types";

export default function DashboardPage() {
  const { units, isLoading, error, changeStatus } = useUnits();

  // Filter tabs state
  const [filterType, setFilterType] = useState<"all" | "PS3" | "PS4" | "ready">("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [targetUnitForModal, setTargetUnitForModal] = useState<PlaystationUnit | null>(null);

  // Real-time clock in WIB (Asia/Jakarta)
  const [clockStr, setClockStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setClockStr(now.toLocaleDateString("id-ID", options) + " WIB");
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered unit list
  const filteredUnits = units.filter((u) => {
    if (filterType === "PS3") return u.type === "PS3";
    if (filterType === "PS4") return u.type === "PS4";
    if (filterType === "ready") return u.status === "kosong";
    return true;
  });

  const availableUnits = units.filter((u) => u.status === "kosong");
  const activeUnits = units.filter((u) => u.status === "dipakai");

  // Handlers for unit cards
  const handleOpenRentalModal = (unit?: PlaystationUnit) => {
    setTargetUnitForModal(unit || null);
    setIsModalOpen(true);
  };

  const handleStopSession = async (unitId: string) => {
    const confirmStop = window.confirm("Hentikan sesi rental dan kembalikan unit ke status kosong?");
    if (!confirmStop) return;
    await changeStatus(unitId, "kosong", null);
  };

  const handleOpenUnit = async (unitId: string) => {
    await changeStatus(unitId, "kosong", null);
  };

  const handleConfirmRental = async (
    unitId: string,
    playerName: string,
    sessionType: SessionType
  ): Promise<boolean> => {
    // In our simplified workflow, updating status to "dipakai" in Firestore
    return await changeStatus(unitId, "dipakai", `sess-${Date.now()}`);
  };

  return (
    <div className="bg-[#0D0E10] text-[#EDEDED] min-h-screen flex flex-col font-sans selection:bg-[#C8F135] selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0D0E10]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-[#C8F135]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth={1.75} />
            <circle cx="8" cy="12" r="1.5" fill="currentColor" />
            <path d="M15 10v4M13 12h4" strokeWidth={1.75} strokeLinecap="round" />
          </svg>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-base tracking-tight text-[#EDEDED]">
              {LABELS.app.title}
            </span>
            <span className="font-mono text-[10px] text-[#8E9299] uppercase">
              {LABELS.app.version}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[#EDEDED] font-medium">Kasir 01</span>
            <span className="text-[#8E9299] text-[11px]">{clockStr || "Memuat waktu..."}</span>
          </div>

          <Link
            href="/"
            className="px-2.5 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-[#8E9299] hover:text-[#EDEDED] transition-colors"
            title="Keluar ke Portal Login"
          >
            Logout
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Welcome & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#EDEDED]">
                {LABELS.dashboard.greeting}
              </h1>
              <span className="font-mono text-[10px] text-[#C8F135] bg-[#C8F135]/10 px-2 py-0.5 rounded border border-[#C8F135]/30">
                {LABELS.dashboard.statusOnline}
              </span>
            </div>
            <p className="text-xs text-[#8E9299] font-mono mt-1">
              {LABELS.dashboard.shiftBadge} · Single Station Unit Control
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => handleOpenRentalModal()}
              disabled={availableUnits.length === 0}
              className="px-3.5 py-2 rounded font-semibold text-black bg-[#C8F135] hover:bg-[#BCE32A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <span>+</span>
              <span>{LABELS.dashboard.btnNewRental}</span>
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded bg-[#15171A] hover:bg-white/[0.06] text-[#EDEDED] border border-white/[0.08] transition-colors"
            >
              {LABELS.dashboard.btnOrderCanteen}
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded bg-[#15171A] hover:bg-white/[0.06] text-[#8E9299] hover:text-red-300 border border-white/[0.08] transition-colors"
            >
              {LABELS.dashboard.btnCloseShift}
            </button>
          </div>
        </div>

        {/* 4 Top KPI Metric Cards */}
        <DashboardMetrics units={units} />

        {/* Work Arena: 8 Units Matrix (Left) + Sidebar Widgets (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: 8 Unit Cards Arena */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#15171A] border border-white/[0.07]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F135]" />
                <h2 className="text-sm font-semibold text-[#EDEDED]">
                  {LABELS.dashboard.sectionUnitsTitle}
                </h2>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 font-mono text-xs">
                {(["all", "PS3", "PS4", "ready"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilterType(tab)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      filterType === tab
                        ? "bg-[#C8F135] text-black font-semibold"
                        : "bg-[#111215] text-[#8E9299] hover:text-[#EDEDED]"
                    }`}
                  >
                    {tab === "all" ? "Semua (8)" : tab === "ready" ? "Siap" : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading / Error States */}
            {isLoading && (
              <div className="p-8 rounded-lg bg-[#15171A] border border-white/[0.07] text-center font-mono text-xs text-[#8E9299]">
                Memuat data 8 unit konsol dari Firestore...
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/30 text-xs font-mono text-red-300">
                Error: {error}
              </div>
            )}

            {/* Grid of 8 Units */}
            {!isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                {filteredUnits.map((unit) => (
                  <ConsoleUnitCard
                    key={unit.id}
                    unit={unit}
                    onStartRental={handleOpenRentalModal}
                    onStopSession={handleStopSession}
                    onOpenUnit={handleOpenUnit}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Fast POS Sidebar Widgets */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Alarm Widget: Sisa Sewa < 10m */}
            <div className="p-4 rounded-lg bg-[#15171A] border border-amber-500/25">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  {LABELS.dashboard.sidebar.alarmTitle}
                </span>
                <span className="font-mono text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                  Monitoring
                </span>
              </div>
              <p className="text-xs font-mono text-[#8E9299] leading-relaxed">
                Unit yang mendekati batas waktu akan memunculkan alarm otomatis di sini untuk memudahkan kasir menawari perpanjangan sesi.
              </p>
            </div>

            {/* Quick Canteen & F&B Ordering Widget */}
            <QuickCanteenWidget activeUnits={activeUnits} />

            {/* Recent Completed Transactions */}
            <RecentTransactionsWidget />
          </div>
        </div>
      </main>

      {/* Interactive Rental Creation Modal */}
      <NewRentalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableUnits={availableUnits}
        selectedUnit={targetUnitForModal}
        onConfirmRental={handleConfirmRental}
      />

      {/* Minimal Footer */}
      <footer className="w-full border-t border-white/[0.07] py-4 px-6 text-center font-mono text-xs text-[#555860]">
        {LABELS.app.copyright} · Stasiun Kasir 01 · Asia/Jakarta
      </footer>
    </div>
  );
}

