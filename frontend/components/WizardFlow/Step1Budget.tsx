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

  // in have-ticket mode: state.budget = total (ticket + other)
  // nonTicketBudget = what user controls
  const nonTicketBudget = haveTicket && ticketZone ? Math.max(0, state.budget - ticketPrice) : state.budget;
  const totalBudget = haveTicket && ticketZone ? nonTicketBudget + ticketPrice : state.budget;

  const handleNonTicketChange = (val: number) => {
    onChange({ budget: val + ticketPrice });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h3 className="font-bold text-2xl text-[#1E293B]" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
          <i className="fa-solid fa-coins text-[#FF007F] mr-2"></i>
          {haveTicket && ticketZone ? "งบนอกเหนือราคาบัตร" : "งบประมาณรวมทั้งทริป"}
        </h3>
        <p className="text-xs text-slate-500">
          {haveTicket && ticketZone
            ? "ตั้งงบสำหรับค่าใช้จ่ายอื่นๆ นอกเหนือจากค่าบัตรที่ซื้อไปแล้ว"
            : "ตั้งงบรวมทั้งหมดที่คุณมีสำหรับทริปนี้ รวมบัตร ที่พัก เดินทาง กิน และของที่ระลึก"}
        </p>
      </div>

      <div className="space-y-4">
        {/* Main budget display */}
        <div className="p-4 rounded-2xl bg-[#FFF0F6]/40 border border-[#FF007F]/10 text-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
            {haveTicket && ticketZone ? "งบนอกเหนือค่าบัตร" : "งบรวมของฉัน"}
          </span>
          <span className="font-black text-4xl text-[#FF007F]" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
            ฿{(haveTicket && ticketZone ? nonTicketBudget : state.budget).toLocaleString()}
          </span>
        </div>

        {/* Slider */}
        <div className="space-y-2">
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

        {/* Breakdown for have-ticket mode */}
        {haveTicket && ticketZone && (
          <div className="rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
            <div className="flex justify-between items-center px-4 py-3 bg-white">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <i className="fa-solid fa-wallet text-[#4F46E5]"></i>
                งบนอกเหนือค่าบัตร
              </span>
              <span className="text-xs font-bold text-slate-700">฿{nonTicketBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <i className="fa-solid fa-ticket text-[#FF007F]"></i>
                ราคาบัตร ({ticketZone.zone.split("(")[0].trim()})
              </span>
              <span className="text-xs font-bold text-slate-700">฿{ticketPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 bg-[#FFF0F6]/30">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check text-[#FF007F]"></i>
                รวมงบทั้งทริป
              </span>
              <span className="text-sm font-black text-[#FF007F]">฿{totalBudget.toLocaleString()}</span>
            </div>
          </div>
        )}

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
