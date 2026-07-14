"use client";
import { useMemo } from "react";
import type { TicketZone, Hotel } from "@/lib/types";

interface BudgetState {
  budget: number;
  ticketZone: TicketZone;
  hotel: Hotel | null;
  hotelNights: number;
  needHotel: boolean;
  transportCost: number;
  merchCost: number;
  foodCost: number;
  otherCost: number;
}

interface Props extends BudgetState {
  onBudgetChange: (v: number) => void;
  onCostChange: (key: keyof Pick<BudgetState, "transportCost" | "merchCost" | "foodCost" | "otherCost">, v: number) => void;
}

export default function BudgetSection({
  budget, ticketZone, hotel, hotelNights, needHotel,
  transportCost, merchCost, foodCost, otherCost,
  onBudgetChange, onCostChange,
}: Props) {
  const hotelTotal = needHotel && hotel ? hotel.price * hotelNights : 0;
  const actual = ticketZone.price + hotelTotal + transportCost + merchCost + foodCost + otherCost;
  const remaining = budget - actual;
  const bookingFee = 30;
  const isOver = remaining < 0;

  const cats = useMemo(() => [
    { key: "ticket",    label: "บัตรคอนเสิร์ต", icon: "fa-ticket",       value: ticketZone.price, color: "#FF007F", editable: false },
    { key: "hotel",     label: "โรงแรม",         icon: "fa-hotel",        value: hotelTotal,       color: "#4F46E5", editable: false },
    { key: "transport", label: "เดินทาง",         icon: "fa-bus",          value: transportCost,    color: "#0D9488", editable: true  },
    { key: "merch",     label: "ของที่ระลึก",     icon: "fa-bag-shopping", value: merchCost,        color: "#FF8E53", editable: true  },
    { key: "food",      label: "อาหาร",           icon: "fa-bowl-food",    value: foodCost,         color: "#EAB308", editable: true  },
    { key: "other",     label: "อื่นๆ",           icon: "fa-plus",         value: otherCost,        color: "#94A3B8", editable: true  },
  ].filter((c) => c.value > 0 || c.editable), [ticketZone.price, hotelTotal, transportCost, merchCost, foodCost, otherCost]);

  const editableKey = (key: string) => {
    const map: Record<string, "transportCost" | "merchCost" | "foodCost" | "otherCost"> = {
      transport: "transportCost", merch: "merchCost", food: "foodCost", other: "otherCost",
    };
    return map[key] ?? null;
  };

  const budgetPct = Math.min(budget > 0 ? (actual / budget) * 100 : 0, 100);

  return (
    <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 4px -1px rgba(0,0,0,0.05)" }}>

      {/* Colorful header */}
      <div
        className="px-5 py-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)" }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div>
            <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest block">งบประมาณทั้งทริป</span>
            <span className="font-black text-white text-2xl leading-tight" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
              ฿{budget.toLocaleString()}
            </span>
          </div>
          <input
            type="number"
            value={budget}
            onChange={(e) => onBudgetChange(Number(e.target.value) || budget)}
            className="w-24 px-3 py-1.5 rounded-xl text-right text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
          />
        </div>

        {/* Mini stacked bar inside header */}
        <div className="relative z-10 mt-3">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
            {cats.filter(c => c.value > 0).map((c) => (
              <div
                key={c.key}
                className="h-full transition-all duration-500 ease-out"
                style={{ width: `${budget > 0 ? Math.min((c.value / budget) * 100, 100) : 0}%`, background: c.color }}
                title={`${c.label}: ฿${c.value.toLocaleString()}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-white/40">ใช้ ฿{actual.toLocaleString()}</span>
            <span className="text-[9px] text-white/40">{Math.round(budgetPct)}%</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div
        className={`flex items-center justify-between px-5 py-3 text-sm font-bold ${isOver ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}
      >
        <span className="flex items-center gap-2">
          <i className={`fa-solid ${isOver ? "fa-circle-exclamation animate-pulse" : "fa-circle-check"}`} />
          {isOver ? "เกินงบแล้วนะ!" : "อยู่ในงบ ✓"}
        </span>
        <span className="font-black text-base">
          {isOver ? "+" : ""}฿{Math.abs(remaining).toLocaleString()}
        </span>
      </div>

      {/* Body */}
      <div className="bg-white px-5 py-4 space-y-1.5">

        {/* Category rows */}
        {cats.map((c) => {
          const ek = editableKey(c.key);
          return (
            <div
              key={c.key}
              className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0"
            >
              {/* Color dot + icon */}
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${c.color}18` }}
              >
                <i className={`fa-solid ${c.icon} text-[11px]`} style={{ color: c.color }} />
              </div>
              <span className="text-[12px] font-semibold text-slate-600 flex-1 truncate">{c.label}</span>
              {ek ? (
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400">฿</span>
                  <input
                    type="number"
                    value={c.value}
                    onChange={(e) => onCostChange(ek, Number(e.target.value) || 0)}
                    className="w-18 px-2 py-1 border border-slate-200 rounded-lg text-right text-[12px] font-bold text-slate-800 focus:outline-none focus:border-indigo-300 bg-slate-50/80"
                    style={{ width: "72px" }}
                  />
                </div>
              ) : (
                <span className="text-[13px] font-bold text-slate-800">฿{c.value.toLocaleString()}</span>
              )}
            </div>
          );
        })}

        {/* Total row */}
        <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">รวมทั้งหมด</span>
          <span className="text-[15px] font-black text-slate-800">฿{actual.toLocaleString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-amber-50 border-t border-amber-100 flex items-center gap-2 text-[10px] text-amber-700">
        <i className="fa-solid fa-circle-exclamation text-amber-500 shrink-0" />
        <span>ค่าธรรมเนียมออกบัตร <b className="text-[#FF007F]">฿{bookingFee}</b>/ใบ + 3% หากชำระบัตรเครดิต ยังไม่รวมในงบนี้</span>
      </div>
    </div>
  );
}
