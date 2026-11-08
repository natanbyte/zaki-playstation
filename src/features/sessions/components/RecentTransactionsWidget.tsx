import React from "react";
import { LABELS } from "@/config/labels";

interface TransactionItem {
  id: string;
  unit: string;
  desc: string;
  time: string;
  method: "Tunai" | "QRIS";
  amount: string;
}

const DUMMY_TRANSACTIONS: TransactionItem[] = [
  { id: "t1", unit: "PS4-01", desc: "Paket 3 Jam + 2 Teh Pucuk", time: "14:12", method: "Tunai", amount: "Rp 26.000" },
  { id: "t2", unit: "PS3-02", desc: "Loss Time 1 Jam 20m", time: "13:50", method: "QRIS", amount: "Rp 8.000" },
  { id: "t3", unit: "PS4-03", desc: "Paket 3 Jam", time: "13:05", method: "Tunai", amount: "Rp 18.000" },
  { id: "t4", unit: "PS3-04", desc: "Sewa Harian (Take Home)", time: "12:30", method: "QRIS", amount: "Rp 70.000" },
  { id: "t5", unit: "PS4-02", desc: "Order 2 Indomie + Kopi", time: "11:45", method: "Tunai", amount: "Rp 26.000" },
];

export const RecentTransactionsWidget: React.FC = () => {
  return (
    <div className="p-4 rounded-lg bg-[#15171A] border border-white/[0.07]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-[#EDEDED]">
          {LABELS.dashboard.sidebar.recentTransactionsTitle}
        </h3>
        <span className="font-mono text-[10px] text-[#8E9299]">Hari Ini</span>
      </div>

      <div className="flex flex-col gap-2 font-mono">
        {DUMMY_TRANSACTIONS.map((tx) => (
          <div
            key={tx.id}
            className="p-2.5 rounded bg-[#111215] border border-white/[0.04] flex items-center justify-between"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 rounded bg-white/[0.05] border border-white/[0.06] text-[#C8F135] text-xs font-bold flex items-center justify-center shrink-0">
                {tx.unit.replace("PS", "")}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-[#EDEDED] font-medium truncate max-w-[140px]">
                  {tx.desc}
                </p>
                <p className="text-[10px] text-[#8E9299]">
                  {tx.time} · {tx.method}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-[#EDEDED] font-bold block">
                {tx.amount}
              </span>
              <span className="text-[9px] text-[#C8F135] uppercase">
                Lunas
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

