"use client";
import { useRef, useState } from "react";
import type { Concert, TicketZone, Round } from "@/lib/types";

interface Props {
  concert: Concert;
  round: Round;
  zone: TicketZone;
  countdownText: string;
  onClose: () => void;
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("th-TH", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function ShareTicketModal({ concert, round, zone, countdownText, onClose }: Props) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const handleShare = async () => {
    if (!ticketRef.current) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/png"));
      const file = new File([blob], "concertmate-ticket.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: concert.name });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "concertmate-ticket.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
      >
        <i className="fa-solid fa-xmark text-lg" />
      </button>

      <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">ตัวอย่างตั๋วที่จะแชร์</p>

      {/* ── Ticket design (captured by html2canvas) ── */}
      <div
        ref={ticketRef}
        className="w-[340px] rounded-3xl overflow-hidden font-sans"
        style={{ fontFamily: "Prompt, Fredoka, sans-serif" }}
      >
        {/* Body */}
        <div
          className="relative px-7 pt-7 pb-6 overflow-hidden"
          style={{
            background: `linear-gradient(145deg, #0D1117 0%, ${zone.color}70 60%, #0F172A 100%)`,
          }}
        >
          {/* Glow */}
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: zone.color }} />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: zone.color }} />

          <div className="relative z-10 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] tracking-[0.22em] text-white/40 font-black uppercase">🎫 CONCERT PASS</span>
              <span
                className="px-2.5 py-1 rounded-full text-[9px] font-extrabold border"
                style={{ color: zone.color, borderColor: `${zone.color}55`, background: `${zone.color}20` }}
              >
                {countdownText}
              </span>
            </div>

            {/* Concert name */}
            <div>
              <h2
                className="font-black text-white text-[22px] leading-tight"
              >
                {concert.name}
              </h2>
              <p className="text-white/50 text-[11px] mt-1 flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot" style={{ color: zone.color }} />
                {concert.venueName}
              </p>
            </div>

            {/* Zone hero */}
            <div
              className="rounded-2xl p-4 flex items-center justify-between"
              style={{ background: `${zone.color}18`, border: `1px solid ${zone.color}35` }}
            >
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-1">ZONE</p>
                <p className="text-white font-black text-[15px] leading-snug">{zone.zone.replace(/\s*\([^)]*\)/g, "").replace(/\s*(เหลืองทอง|น้ำเงิน|เหลือง|ชมพู|ม่วง|เขียว|แดง|ส้ม|ทอง|เงิน|ขาว|ดำ)/g, "").trim()}</p>
                <span
                  className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                  style={{ background: `${zone.color}30`, color: zone.color }}
                >
                  {zone.type}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-1">PRICE</p>
                <p className="font-black text-white text-2xl">฿{zone.price.toLocaleString()}</p>
              </div>
            </div>

            {/* Date / Time row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "fa-calendar-days", label: "DATE", value: fmtDate(round.date) },
                { icon: "fa-door-open",     label: "DOOR", value: concert.doorTime },
                { icon: "fa-music",         label: "SHOW", value: concert.showTime },
              ].map((f) => (
                <div key={f.label} className="rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <i className={`fa-solid ${f.icon} text-[10px] mb-1 block`} style={{ color: zone.color }} />
                  <p className="text-[8px] text-white/35 uppercase tracking-widest font-bold">{f.label}</p>
                  <p className="text-white text-[10px] font-bold mt-0.5 leading-snug">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Perforation */}
        <div className="relative bg-[#0D1117] flex items-center">
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-black/70" />
          <div className="flex-1 mx-3 border-t-2 border-dashed" style={{ borderColor: `${zone.color}40` }} />
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-black/70" />
        </div>

        {/* Stub */}
        <div
          className="px-7 py-4 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg, #0D1117, #1a1040)` }}
        >
          <div>
            <p className="text-white/20 text-[8px] font-bold uppercase tracking-[0.2em]">Powered by</p>
            <p className="text-white/60 text-[11px] font-extrabold mt-0.5">ConcertMate ✦</p>
          </div>
          {/* Decorative QR placeholder */}
          <div className="w-12 h-12 rounded-lg overflow-hidden opacity-30" style={{ background: zone.color }}>
            <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0.5 p-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={`rounded-[2px] ${[0,2,6,8,4].includes(i) ? "bg-white" : "bg-transparent"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 w-[340px]">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl border border-white/20 text-white/70 text-sm font-bold hover:bg-white/10 transition"
        >
          ปิด
        </button>
        <button
          onClick={handleShare}
          disabled={saving}
          className="flex-1 py-3 rounded-2xl text-white text-sm font-extrabold flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-95 disabled:opacity-60"
          style={{ background: `linear-gradient(135deg, ${zone.color}, ${zone.color}aa)` }}
        >
          {saving ? (
            <><i className="fa-solid fa-spinner animate-spin" /> กำลังสร้าง...</>
          ) : (
            <><i className="fa-solid fa-share-nodes" /> แชร์ / บันทึกรูป</>
          )}
        </button>
      </div>
    </div>
  );
}
