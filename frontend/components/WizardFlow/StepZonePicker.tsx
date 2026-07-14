"use client";
import { useState } from "react";
import Image from "next/image";
import type { Concert, WizardState } from "@/lib/types";

const SEATING_IMAGES: Record<string, string> = {
  babymonster: "/images/babymonster-seating.jpg",
  postmalone: "/images/postmalone-seating.jpg",
  theweeknd: "/images/weeknd-seating.png",
  xg: "/images/xg-seating.png",
};

interface Props {
  concert: Concert;
  state: WizardState;
  onChange: (partial: Partial<WizardState>) => void;
}

export default function StepZonePicker({ concert, state, onChange }: Props) {
  const [showFullChart, setShowFullChart] = useState(false);

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h3 className="font-bold text-2xl text-[#1E293B]" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
          <i className="fa-solid fa-ticket text-[#FF007F] mr-2"></i> คุณได้บัตรโซนไหนมา?
        </h3>
        <p className="text-xs text-slate-500">เลือกโซนที่ซื้อมาแล้ว ดูผังด้านล่างประกอบได้เลย</p>
      </div>

      {/* Seating chart */}
      {SEATING_IMAGES[concert.id] && (
        <div
          className="rounded-2xl overflow-hidden border border-slate-100 h-44 relative bg-slate-900 cursor-pointer"
          onClick={() => setShowFullChart(true)}
        >
          <Image src={SEATING_IMAGES[concert.id]} alt="Seating chart" fill className="object-contain" />
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg">
            <i className="fa-solid fa-expand mr-1"></i>ดูขยาย
          </div>
        </div>
      )}

      {/* Zone cards */}
      <div className="space-y-2">
        {concert.prices.map((p) => {
          const selected = state.preselectedZone === p.zone;
          return (
            <button
              key={p.zone}
              onClick={() => onChange({ preselectedZone: p.zone, ticketType: p.type })}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                selected
                  ? "border-[#FF007F] bg-[#FFF0F6] shadow-sm"
                  : "border-slate-200 bg-white hover:border-[#FF007F]/50"
              }`}
            >
              <span className="w-4 h-4 rounded-full shrink-0" style={{ background: p.color }}></span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-700">{p.zone}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{p.perks}</p>
              </div>
              <span className="font-bold text-xs text-[#4F46E5] shrink-0">฿{p.price.toLocaleString()}</span>
              {selected && <i className="fa-solid fa-circle-check text-[#FF007F] shrink-0"></i>}
            </button>
          );
        })}
      </div>

      {/* Full chart overlay */}
      {showFullChart && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          onClick={() => setShowFullChart(false)}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowFullChart(false)}
              className="absolute -top-10 right-0 text-white font-bold text-sm"
            >
              <i className="fa-solid fa-xmark mr-1"></i> ปิด
            </button>
            <div className="relative w-full h-[80vh] bg-slate-900 rounded-2xl overflow-hidden">
              <Image src={SEATING_IMAGES[concert.id]} alt="Full seating chart" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
