"use client";
import type { WizardState } from "@/lib/types";

interface Props {
  state: WizardState;
  onChange: (partial: Partial<WizardState>) => void;
}

const HOTEL_PRIORITIES = [
  { value: "closest", label: "ใกล้ฮอลล์ที่สุด", icon: "fa-location-dot" },
  { value: "value", label: "คุ้มค่าที่สุด", icon: "fa-money-bill-wave" },
  { value: "rated", label: "รีวิวดีที่สุด", icon: "fa-star" },
];

export default function Step3Hotel({ state, onChange }: Props) {
  const togglePriority = (p: string) => {
    const next = state.hotelPriorities.includes(p)
      ? state.hotelPriorities.filter((x) => x !== p)
      : [...state.hotelPriorities, p];
    onChange({ hotelPriorities: next.length > 0 ? next : ["closest"] });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h3 className="font-bold text-2xl text-[#1E293B]" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
          <i className="fa-solid fa-hotel text-amber-500 mr-2"></i> ที่พักสำหรับทริปนี้
        </h3>
        <p className="text-xs text-slate-500">จะเข้าพักก่อนวันคอนหรือค้างหลังโชว์จบก็ได้ — หาโรงแรมใกล้สนามไว้รอเลย</p>
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">ฉันต้องการหาที่พักค้างคืน</span>
          <input
            type="checkbox"
            checked={state.needHotel}
            onChange={(e) => onChange({ needHotel: e.target.checked })}
            className="w-5 h-5 accent-[#FF007F]"
          />
        </div>

        <div
          className="space-y-4 transition-all"
          style={{ opacity: state.needHotel ? 1 : 0.3, pointerEvents: state.needHotel ? "auto" : "none" }}
        >
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400 uppercase">จำนวนคืนที่พัก</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange({ hotelNights: Math.max(1, state.hotelNights - 1) })}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 font-bold"
              >
                −
              </button>
              <span className="w-8 text-center font-black text-[#4F46E5]">{state.hotelNights}</span>
              <button
                type="button"
                onClick={() => onChange({ hotelNights: Math.min(5, state.hotelNights + 1) })}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 font-bold"
              >
                +
              </button>
              <span className="text-[10px] text-slate-400">คืน</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase block">เลือกปัจจัยโรงแรมที่เหมาะสม (เลือกได้มากกว่า 1):</label>
            <div className="grid grid-cols-3 gap-2">
              {HOTEL_PRIORITIES.map((p) => (
                <label key={p.value} className="cursor-pointer text-center">
                  <input
                    type="checkbox"
                    checked={state.hotelPriorities.includes(p.value)}
                    onChange={() => togglePriority(p.value)}
                    className="sr-only"
                  />
                  <div
                    className={`p-2.5 rounded-xl border text-[10.5px] font-bold transition-all ${
                      state.hotelPriorities.includes(p.value)
                        ? "border-[#FF007F] bg-[#FFF0F6] text-[#FF007F]"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    <i className={`fa-solid ${p.icon} mr-1`}></i> {p.label}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
