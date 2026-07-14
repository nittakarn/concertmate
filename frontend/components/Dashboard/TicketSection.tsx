"use client";
import type { Concert, TicketZone } from "@/lib/types";

interface Props {
  concert: Concert;
  round: { label: string; date: string };
  selectedZone: TicketZone;
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("th-TH", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TicketSection({ concert, round, selectedZone }: Props) {
  const share = async () => {
    const text = `🎫 ${concert.name}\n📍 ${concert.venueName}\n📅 ${round.label}\n🎟️ ${selectedZone.zone} — ฿${selectedZone.price.toLocaleString()}\n⏰ ประตูเปิด ${concert.doorTime} | Show ${concert.showTime}\n\n✨ วางแผนด้วย ConcertMate`;
    if (navigator.share) {
      navigator.share({ title: `${concert.name} — Concert Ticket`, text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
      alert("คัดลอกข้อมูลตั๋วแล้ว! นำไปใส่สตอรี่หรือส่งให้เพื่อนได้เลย 🎉");
    }
  };

  return (
    <div className="dreamer-card rounded-3xl p-6 space-y-5">
      <h4 className="font-bold text-lg text-[#1E293B] flex items-center gap-2 pb-3 border-b border-slate-100" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
        <i className="fa-solid fa-ticket text-xl"></i> My Concert Ticket
      </h4>

      {/* ── Ticket card ── */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-md bg-white">
        {/* Color stripe top */}
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${selectedZone.color}, ${selectedZone.color}66)` }} />

        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-2">
          <div>
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-[0.18em] block">Concert Pass</span>
            <h3
              className="font-black text-[#1E293B] text-sm leading-snug mt-0.5 max-w-[200px]"
              style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}
            >
              {concert.name}
            </h3>
          </div>
          <span
            className="shrink-0 mt-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border"
            style={{ background: `${selectedZone.color}18`, color: selectedZone.color, borderColor: `${selectedZone.color}44` }}
          >
            {selectedZone.type}
          </span>
        </div>

        {/* Zone hero */}
        <div className="px-5 pb-4">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Zone</span>
          {(() => {
            const COLOR_WORDS = /\s*(เหลืองทอง|น้ำเงิน|เหลือง|ชมพู|ม่วง|เขียว|แดง|ส้ม|ทอง|เงิน|ขาว|ดำ)/g;
            const match = selectedZone.zone.match(/^([^(]+?)(\s*\(.+\))?$/);
            const zoneName = (match?.[1]?.trim() ?? selectedZone.zone).replace(COLOR_WORDS, "").trim();
            const zoneSub = match?.[2]?.trim() ?? "";
            return (
              <>
                <span className="font-black text-xl leading-tight block" style={{ color: selectedZone.color }}>
                  {zoneName}
                </span>
                {zoneSub && (
                  <span className="text-[11px] font-medium text-slate-400 mt-0.5 block">{zoneSub}</span>
                )}
                <span className="font-bold text-base text-slate-400 mt-0.5 block">฿{selectedZone.price.toLocaleString()}</span>
              </>
            );
          })()}
          <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed line-clamp-2">{selectedZone.perks}</p>
        </div>

        {/* Perforated divider */}
        <div className="flex items-center">
          <div className="w-3.5 h-3.5 rounded-full bg-slate-100 -ml-1.5 shrink-0 border border-slate-200" />
          <div className="flex-1 border-t-2 border-dashed border-slate-200" />
          <div className="w-3.5 h-3.5 rounded-full bg-slate-100 -mr-1.5 shrink-0 border border-slate-200" />
        </div>

        {/* Stub — info grid */}
        <div className="px-5 py-4 grid grid-cols-2 gap-x-4 gap-y-3 bg-slate-50/50">
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">
              <i className="fa-solid fa-calendar-days mr-1"></i>วันที่
            </span>
            <span className="text-[11px] font-bold text-slate-700 mt-0.5 block leading-snug">{formatDateShort(round.date)}</span>
          </div>
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">
              <i className="fa-solid fa-location-dot mr-1"></i>สถานที่
            </span>
            <span className="text-[10px] font-bold text-slate-700 mt-0.5 block leading-snug">{concert.venueName}</span>
          </div>
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">
              <i className="fa-solid fa-door-open mr-1"></i>ประตูเปิด
            </span>
            <span className="text-[11px] font-bold text-slate-700 mt-0.5 block">{concert.doorTime}</span>
          </div>
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">
              <i className="fa-solid fa-music mr-1"></i>เริ่มโชว์
            </span>
            <span className="text-[11px] font-bold text-slate-700 mt-0.5 block">{concert.showTime}</span>
          </div>
        </div>

        {/* Branding + share */}
        <div className="px-5 py-3 flex items-center justify-between border-t border-slate-100">
          <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest">
            ConcertMate ✦
          </span>
          <button
            onClick={share}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all hover:opacity-90 active:scale-95"
            style={{ background: `${selectedZone.color}18`, color: selectedZone.color }}
          >
            <i className="fa-solid fa-share-nodes text-xs"></i>
            แชร์
          </button>
        </div>
      </div>

    </div>
  );
}
