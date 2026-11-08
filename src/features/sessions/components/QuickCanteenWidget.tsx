"use client";

import React, { useState } from "react";
import { LABELS } from "@/config/labels";
import type { PlaystationUnit } from "@/types";

interface QuickCanteenWidgetProps {
  activeUnits: PlaystationUnit[];
}

interface CanteenPreset {
  id: string;
  name: string;
  price: number;
  stock: string;
}

const PRESET_ITEMS: CanteenPreset[] = [
  { id: "c1", name: "Indomie Gr. Telur", price: 10000, stock: "24 porsi" },
  { id: "c2", name: "Teh Pucuk Dingin", price: 4000, stock: "42 botol" },
  { id: "c3", name: "Kopi Susu Es", price: 6000, stock: "18 cup" },
  { id: "c4", name: "Snack Taro Net", price: 5000, stock: "15 bks" },
];

export const QuickCanteenWidget: React.FC<QuickCanteenWidgetProps> = ({
  activeUnits,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddItem = (item: CanteenPreset) => {
    const target = activeUnits.find((u) => u.id === selectedUnitId) || activeUnits[0];
    const targetName = target ? target.name : "Unit";

    setFeedback(`+ ${item.name} ditambahkan ke nota ${targetName}!`);
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
  };

  return (
    <div className="p-4 rounded-lg bg-[#15171A] border border-white/[0.07]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-[#EDEDED]">
          {LABELS.dashboard.sidebar.canteenTitle}
        </h3>
        <span className="font-mono text-[10px] text-[#8E9299]">1-Klik Tambah</span>
      </div>

      {/* Target Unit Dropdown */}
      <div className="mb-3">
        <select
          value={selectedUnitId}
          onChange={(e) => setSelectedUnitId(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded bg-[#111215] text-[#EDEDED] text-xs font-mono border border-white/[0.08] focus:border-[#C8F135]/80 focus:outline-none"
        >
          {activeUnits.length === 0 ? (
            <option value="">Belum ada unit yang aktif</option>
          ) : (
            activeUnits.map((u) => (
              <option key={u.id} value={u.id}>
                Target: {u.name} ({u.type})
              </option>
            ))
          )}
        </select>
      </div>

      {/* Menu Item Grid */}
      <div className="grid grid-cols-2 gap-2 mb-2 font-mono">
        {PRESET_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleAddItem(item)}
            className="p-2.5 rounded bg-[#111215] hover:bg-white/[0.04] border border-white/[0.05] hover:border-[#C8F135]/40 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#EDEDED] font-medium group-hover:text-[#C8F135] truncate max-w-[90px]">
                {item.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#C8F135]">Rp{item.price.toLocaleString("id-ID")}</span>
              <span className="text-[#555860] text-[10px]">{item.stock}</span>
            </div>
          </button>
        ))}
      </div>

      {feedback && (
        <div className="p-2 rounded bg-[#C8F135]/10 border border-[#C8F135]/30 text-xs font-mono text-[#C8F135] text-center transition-all">
          {feedback}
        </div>
      )}
    </div>
  );
};

