import React from "react";
import { LABELS } from "@/config/labels";
import type { PlaystationUnit } from "@/types";

interface DashboardMetricsProps {
  units: PlaystationUnit[];
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ units }) => {
  // Compute real-time occupancy from live units in Firestore
  const totalUnits = units.length || 8;
  const activeCount = units.filter((u) => u.status === "dipakai").length;
  const readyCount = units.filter((u) => u.status === "kosong").length;
  const bookingCount = units.filter((u) => u.status === "dibooking").length;
  const maintenanceCount = units.filter((u) => u.status === "maintenance").length;
  const occupancyPercent = Math.round((activeCount / totalUnits) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 mb-6">
      {/* KPI 1: Omzet Hari Ini */}
      <div className="p-4 rounded-lg bg-[#15171A] border border-white/[0.07] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E9299]">
            {LABELS.dashboard.kpi.revenueToday}
          </span>
          <span className="font-mono text-[10px] text-[#C8F135] bg-[#C8F135]/10 px-1.5 py-0.5 rounded border border-[#C8F135]/20">
            {LABELS.dashboard.kpi.revenueGrowth}
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-[#EDEDED] my-1">
          Rp 845.000
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.05] text-xs font-mono text-[#8E9299]">
          <span>{LABELS.dashboard.kpi.rental}: <strong className="text-[#EDEDED]">690k</strong></span>
          <span>•</span>
          <span>{LABELS.dashboard.kpi.canteen}: <strong className="text-[#EDEDED]">155k</strong></span>
        </div>
        <div className="w-full h-1 rounded-full bg-white/[0.05] mt-2 overflow-hidden flex">
          <div className="bg-[#C8F135] h-full" style={{ width: "81%" }} />
          <div className="bg-sky-400 h-full" style={{ width: "19%" }} />
        </div>
      </div>

      {/* KPI 2: Okupansi Unit Konsol (Live Firestore) */}
      <div className="p-4 rounded-lg bg-[#15171A] border border-white/[0.07] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E9299]">
            {LABELS.dashboard.kpi.occupancyTitle}
          </span>
          <span className="font-mono text-[10px] text-[#C8F135] bg-[#C8F135]/10 px-1.5 py-0.5 rounded border border-[#C8F135]/20">
            {occupancyPercent}% Terisi
          </span>
        </div>
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-2xl font-bold text-[#EDEDED]">{activeCount}</span>
          <span className="text-xs text-[#8E9299] font-mono">/ {totalUnits} Unit Main</span>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.05] text-[11px] font-mono text-[#8E9299]">
          <span className="text-[#C8F135]">{readyCount} Siap</span>
          <span>•</span>
          <span className="text-sky-400">{bookingCount} Book</span>
          <span>•</span>
          <span className="text-amber-400">{maintenanceCount} Maint</span>
        </div>
        {/* 8-cell Hardware Status Matrix */}
        <div className="grid grid-cols-8 gap-1 mt-2">
          {units.map((u) => {
            let color = "bg-white/[0.08]";
            if (u.status === "dipakai") color = "bg-[#C8F135]";
            if (u.status === "dibooking") color = "bg-sky-400";
            if (u.status === "maintenance") color = "bg-amber-400";
            return <div key={u.id} className={`h-1 rounded-sm ${color}`} title={`${u.name}: ${u.status}`} />;
          })}
        </div>
      </div>

      {/* KPI 3: Total Jam Berputar */}
      <div className="p-4 rounded-lg bg-[#15171A] border border-white/[0.07] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E9299]">
            {LABELS.dashboard.kpi.rentalHoursTitle}
          </span>
          <span className="font-mono text-[10px] text-[#8E9299]">Target: 50 Jam</span>
        </div>
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-2xl font-bold text-[#EDEDED]">42</span>
          <span className="text-xs text-[#8E9299] font-mono">Jam Berputar</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-xs font-mono text-[#8E9299]">
          <span>{LABELS.dashboard.kpi.targetShift}</span>
          <span className="text-[#C8F135]">84% Tercapai</span>
        </div>
        <div className="w-full h-1 rounded-full bg-white/[0.05] mt-2 overflow-hidden">
          <div className="bg-[#C8F135] h-full rounded-full" style={{ width: "84%" }} />
        </div>
      </div>

      {/* KPI 4: Kas di Laci (Cash Drawer) */}
      <div className="p-4 rounded-lg bg-[#15171A] border border-white/[0.07] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E9299]">
            {LABELS.dashboard.kpi.cashDrawerTitle}
          </span>
          <span className="font-mono text-[10px] text-[#EDEDED] bg-white/[0.06] px-1.5 py-0.5 rounded">
            Kasir 01
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-[#EDEDED] my-1">
          Rp 845.000
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-xs font-mono text-[#8E9299]">
          <span>Tunai: <strong className="text-[#EDEDED]">520k</strong></span>
          <span>QRIS: <strong className="text-[#EDEDED]">325k</strong></span>
        </div>
        <div className="w-full h-1 rounded-full bg-white/[0.05] mt-2 overflow-hidden flex">
          <div className="bg-[#C8F135] h-full" style={{ width: "61.5%" }} />
          <div className="bg-sky-400 h-full" style={{ width: "38.5%" }} />
        </div>
      </div>
    </div>
  );
};

