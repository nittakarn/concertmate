"use client";
import type { WizardState } from "@/lib/types";

interface Props {
  state: WizardState;
  onChange: (partial: Partial<WizardState>) => void;
  haveTicket?: boolean;
}

export default function Step1Budget({ state, onChange, haveTicket }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h3 className="font-bold text-2xl text-[#1E293B]" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
          <i className="fa-solid fa-coins text-[#FF007F] mr-2"></i> งบประมาณรวมทั้งทริป
        </h3>
        <p className="text-xs text-slate-500">
          {haveTicket
            ? "ตั้งงบรวมทั้งหมดสำหรับทริปนี้ (รวมค่าบัตรที่ซื้อไปแล้ว) เพื่อให้ระบบช่วยคุมยอดที่เหลือได้"
            : "ตั้งงบรวมทั้งหมดที่คุณมีสำหรับทริปนี้ รวมบัตร ที่พัก เดินทาง กิน และของที่ระลึก"}
        </p>
      </div>
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#FFF0F6]/40 border border-[#FF007F]/10 text-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">งบรวมของฉัน</span>
          <span className="font-black text-4xl text-[#FF007F]" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
            ฿{state.budget.toLocaleString()}
          </span>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min="2000"
            max="30000"
            step="500"
            value={state.budget}
            onChange={(e) => onChange({ budget: Number(e.target.value) })}
            className="w-full accent-[#FF007F]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>฿2,000</span>
            <span>฿30,000</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[5000, 8000, 10000, 15000, 20000].map((v) => (
            <button
              key={v}
              onClick={() => onChange({ budget: v })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                state.budget === v
                  ? "bg-[#FF007F] text-white border-[#FF007F]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#FF007F]"
              }`}
            >
              ฿{v.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-slate-600">
          <i className="fa-solid fa-lightbulb text-blue-400 mr-1.5"></i>
          {haveTicket
            ? "ระบบจะแสดงยอดคงเหลือหลังหักค่าบัตร ที่พัก เดินทาง กิน และของที่ระลึก ให้เห็นภาพรวมงบทั้งทริป"
            : "ระบบจะใช้งบนี้คำนวณว่าเหลืองบซื้อบัตรได้เท่าไร หลังหักค่าที่พัก เดินทาง กิน และของที่ระลึกตามที่คุณตั้งในขั้นตอนถัดไป"}
        </div>
      </div>
    </div>
  );
}
