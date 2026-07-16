"use client";
import type { WizardState, TicketZone } from "@/lib/types";

interface Props {
  state: WizardState;
  onChange: (partial: Partial<WizardState>) => void;
  haveTicket?: boolean;
  ticketZone?: TicketZone;
}

export default function Step1Budget({ state, onChange, haveTicket, ticketZone }: Props) {
  const ticketPrice = ticketZone?.price ?? 0;
  const nonTicketBudget = haveTicket && ticketZone ? Math.max(0, state.budget - ticketPrice) : state.budget;
  const totalBudget = haveTicket && ticketZone ? nonTicketBudget + ticketPrice : state.budget;

  const handleNonTicketChange = (val: number) => {
    onChange({ budget: val + ticketPrice });
  };

  const zoneName = ticketZone?.zone.split("(")[0].trim() ?? "";

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h3 className="font-bold text-2xl text-[#1E293B]" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
          <i className="fa-solid fa-coins text-[#FF007F] mr-2"></i> งบประมาณรวมทั้งทริป
        </h3>
        <p className="text-xs text-slate-500">
          {haveTicket && ticketZone
            ? "ตั้งงบสำหรับค่าใช้จ่ายอื่นๆ นอกเหนือจากค่าบัตรที่ซื้อไปแล้ว"
            : "ตั้งงบรวมทั้งหมดที่คุณมีสำหรับทริปนี้ รวมบัตร ที่พัก เดินทาง กิน และของที่ระลึก"}
        </p>
      </div>

      <div className="space-y-4">
        {/* Total hero */}
        <div className="p-4 rounded-2xl bg-[#FFF0F6]/40 border border-[#FF007F]/10 text-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
            งบรวมทั้งทริป
          </span>
          <span className="font-black text-4xl text-[#FF007F]" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
            ฿{totalBudget.toLocaleString()}
          </span>
        </div>

        {/* Two boxes for have-ticket mode */}
        {haveTicket && ticketZone && (
          <div className="grid grid-cols-2 gap-3">
            {/* Ticket price - fixed */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ราคาบัตร</span>
                <i className="fa-solid fa-lock text-[10px] text-slate-300"></i>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">{zoneName}</p>
              <p className="font-black text-lg text-slate-700" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
                ฿{ticketPrice.toLocaleString()}
              </p>
            </div>

            {/* Non-ticket budget - adjustable */}
            <div className="rounded-2xl border border-[#4F46E5]/20 bg-[#F5F3FF]/40 p-4 space-y-1">
              <span className="text-[9px] font-bold text-[#4F46E5] uppercase tracking-widest block">งบนอกเหนือค่าบัตร</span>
              <p className="text-[10px] text-slate-400 leading-snug">ที่พัก · เดินทาง · กิน · ของที่ระลึก</p>
              <p className="font-black text-lg text-[#4F46E5]" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
                ฿{nonTicketBudget.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Slider */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-500">
            {haveTicket && ticketZone ? "ปรับงบนอกเหนือค่าบัตร" : "ปรับงบรวม"}
          </p>
          <input
            type="range"
            min="0"
            max="30000"
            step="500"
            value={haveTicket && ticketZone ? nonTicketBudget : state.budget}
            onChange={(e) =>
              haveTicket && ticketZone
                ? handleNonTicketChange(Number(e.target.value))
                : onChange({ budget: Number(e.target.value) })
            }
            className="w-full accent-[#FF007F]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>฿0</span>
            <span>฿30,000</span>
          </div>
        </div>

        {/* Quick pick buttons */}
        <div className="flex gap-2 flex-wrap">
          {[3000, 5000, 8000, 10000, 15000].map((v) => (
            <button
              key={v}
              onClick={() =>
                haveTicket && ticketZone ? handleNonTicketChange(v) : onChange({ budget: v })
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                (haveTicket && ticketZone ? nonTicketBudget : state.budget) === v
                  ? "bg-[#FF007F] text-white border-[#FF007F]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#FF007F]"
              }`}
            >
              ฿{v.toLocaleString()}
            </button>
          ))}
        </div>

        {!haveTicket && (
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-slate-600">
            <i className="fa-solid fa-lightbulb text-blue-400 mr-1.5"></i>
            ระบบจะใช้งบนี้คำนวณว่าเหลืองบซื้อบัตรได้เท่าไร หลังหักค่าที่พัก เดินทาง กิน และของที่ระลึก
          </div>
        )}
      </div>
    </div>
  );
}
