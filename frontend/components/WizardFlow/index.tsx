"use client";
import { useState } from "react";
import Image from "next/image";
import type { Concert, WizardState } from "@/lib/types";
import Step1Budget from "./Step1Budget";
import Step2Ticket from "./Step2Ticket";
import Step3Hotel from "./Step3Hotel";
import Step4Travel from "./Step4Travel";
import StepZonePicker from "./StepZonePicker";
import type { TicketZone } from "@/lib/types";

interface WizardFlowProps {
  concert: Concert;
  roundKey: string;
  mode?: "plan" | "have-ticket";
  onBack: () => void;
  onFinish: (state: WizardState) => void;
}

const SEATING_IMAGES: Record<string, string> = {
  babymonster: "/images/babymonster-poster.jpg",
  postmalone: "/images/postmalone-poster.jpg",
  theweeknd: "/images/weeknd-poster.png",
  xg: "/images/xg-poster.png",
};

const PLAN_LABELS = [
  "สเต็ป 1 จาก 4 : ตั้งงบเดินทางสุทธิ",
  "สเต็ป 2 จาก 4 : สไตล์ตั๋วเป้าหมาย",
  "สเต็ป 3 จาก 4 : การจองที่พักนอน",
  "สเต็ป 4 จาก 4 : ค่าใช้จ่ายระหว่างทริป",
];

const HAVE_TICKET_LABELS = [
  "สเต็ป 1 จาก 4 : โซนบัตรที่มีแล้ว",
  "สเต็ป 2 จาก 4 : งบรวมสำหรับทริปนี้",
  "สเต็ป 3 จาก 4 : การจองที่พักนอน",
  "สเต็ป 4 จาก 4 : ค่าใช้จ่ายระหว่างทริป",
];

const DEFAULT_STATE: WizardState = {
  budget: 2000,
  ticketType: "VIP",
  ticketPrefs: ["closest"],
  needHotel: true,
  hotelNights: 1,
  hotelPriorities: ["closest"],
  transportCost: 600,
  merchCost: 1500,
  foodCost: 1000,
  otherCost: 200,
};

export default function WizardFlow({ concert, roundKey, mode = "plan", onBack, onFinish }: WizardFlowProps) {
  const isHaveTicket = mode === "have-ticket";
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>({
    ...DEFAULT_STATE,
    haveTicket: isHaveTicket,
  });

  const round = concert.rounds.find((r) => r.key === roundKey) || concert.rounds[0];
  const labels = isHaveTicket ? HAVE_TICKET_LABELS : PLAN_LABELS;
  const pct = step * 25;

  const update = (partial: Partial<WizardState>) => setState((s) => ({ ...s, ...partial }));

  const canNext = isHaveTicket && step === 1 ? !!state.preselectedZone : true;
  const selectedZone: TicketZone | undefined = concert.prices.find((p) => p.zone === state.preselectedZone);

  const handleNext = () => {
    if (step < 4) setStep((s) => s + 1);
    else onFinish(state);
  };

  return (
    <section className="step-transition space-y-6 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#FF007F] transition-colors"
      >
        <i className="fa-solid fa-chevron-left"></i> กลับเลือกคอนเสิร์ต
      </button>

      {/* Concert info header */}
      <div className="dreamer-card rounded-3xl p-5 flex gap-4 items-center border border-white/60">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 overflow-hidden relative shrink-0 border border-slate-100">
          {SEATING_IMAGES[concert.id] && (
            <Image src={SEATING_IMAGES[concert.id]} alt="seating" fill className="object-cover" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sm text-[#1E293B] leading-snug truncate" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
              {concert.name}
            </h3>
            {isHaveTicket && (
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-extrabold uppercase tracking-widest border border-emerald-100">
                <i className="fa-solid fa-ticket mr-1"></i>มีตั๋วแล้ว
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            <i className="fa-solid fa-calendar-days text-[#FF007F] mr-1"></i>{round.label}
          </p>
          <p className="text-[11px] text-slate-500">
            <i className="fa-solid fa-location-dot text-[#4F46E5] mr-1"></i>{concert.venueName}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-500">
          <span>{labels[step - 1]}</span>
          <span className="text-[#FF007F]">{pct}% Complete</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#FF007F] to-[#4F46E5] h-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          ></div>
        </div>
      </div>

      {/* Step panels */}
      <div className="dreamer-card rounded-3xl p-6 border border-white/60 space-y-6">
        {isHaveTicket ? (
          <>
            {step === 1 && <StepZonePicker concert={concert} state={state} onChange={update} />}
            {step === 2 && <Step1Budget state={state} onChange={update} haveTicket ticketZone={selectedZone} />}
            {step === 3 && <Step3Hotel state={state} onChange={update} />}
            {step === 4 && <Step4Travel state={state} onChange={update} />}
          </>
        ) : (
          <>
            {step === 1 && <Step1Budget state={state} onChange={update} />}
            {step === 2 && <Step2Ticket concert={concert} state={state} onChange={update} />}
            {step === 3 && <Step3Hotel state={state} onChange={update} />}
            {step === 4 && <Step4Travel state={state} onChange={update} />}
          </>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              ย้อนกลับ
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            disabled={!canNext}
            className="ml-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF007F] to-[#4F46E5] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === 4 ? (
              <>
                <span>ดูแผนทริปเลย!</span> <i className="fa-solid fa-wand-magic-sparkles"></i>
              </>
            ) : (
              <>
                <span>ขั้นตอนต่อไป</span> <i className="fa-solid fa-chevron-right"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
