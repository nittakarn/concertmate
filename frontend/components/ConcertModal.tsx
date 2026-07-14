"use client";
import { useState } from "react";
import Image from "next/image";
import type { Concert } from "@/lib/types";

interface ConcertModalProps {
  concert: Concert;
  onClose: () => void;
  onStart: (roundKey: string, mode: "plan" | "have-ticket") => void;
}

const SEATING_IMAGES: Record<string, string> = {
  babymonster: "/images/babymonster-seating.jpg",
  postmalone: "/images/postmalone-seating.jpg",
  theweeknd: "/images/weeknd-seating.png",
  xg: "/images/xg-seating.png",
};

const POSTER_IMAGES: Record<string, string> = {
  babymonster: "/images/babymonster-poster.jpg",
  postmalone: "/images/postmalone-poster.jpg",
  theweeknd: "/images/weeknd-poster.png",
  xg: "/images/xg-poster.png",
};

export default function ConcertModal({ concert, onClose, onStart }: ConcertModalProps) {
  const [selectedRound, setSelectedRound] = useState(concert.rounds[0].key);
  const [showFullChart, setShowFullChart] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 z-10"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Poster */}
        <div className="relative h-56 bg-slate-900 rounded-t-3xl overflow-hidden">
          {POSTER_IMAGES[concert.id] && (
            <Image src={POSTER_IMAGES[concert.id]} alt={concert.name} fill className="object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
            <div className="space-y-1">
              <h2 className="font-bold text-white text-xl leading-tight" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
                {concert.name}
              </h2>
              <p className="text-white/70 text-xs">
                <i className="fa-solid fa-location-dot mr-1"></i>{concert.venueName}
              </p>
              <p className="text-white/70 text-xs">
                <i className="fa-solid fa-door-open text-[#FF007F] mr-1"></i>
                ประตูเปิด: ~{concert.doorTime} (เริ่มตรงเวลา {concert.showTime})
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Round selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              <i className="fa-solid fa-calendar-days mr-1"></i> เลือกรอบที่ต้องการ
            </label>
            {concert.rounds.length > 1 ? (
              <div className="grid grid-cols-2 gap-3">
                {concert.rounds.map((r) => (
                  <label key={r.key} className="cursor-pointer">
                    <input
                      type="radio"
                      name="round"
                      value={r.key}
                      checked={selectedRound === r.key}
                      onChange={() => setSelectedRound(r.key)}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-xl border text-center transition-all ${selectedRound === r.key ? "border-[#FF007F] bg-[#FFF0F6]" : "border-slate-200 bg-white hover:border-[#FF007F]"}`}>
                      <span className="font-bold text-xs text-slate-700 block">{r.label}</span>
                      <span className="text-[10px] text-slate-400 block mt-1">แสดงเวลา {concert.showTime}</span>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-[#FF007F] bg-[#FFF0F6] text-center">
                <span className="font-bold text-xs text-[#FF007F] block">
                  <i className="fa-solid fa-circle-check mr-1"></i>{concert.rounds[0].label}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">รอบการแสดงเดียว • เวลา {concert.showTime}</span>
              </div>
            )}
          </div>

          {/* Price list */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              <i className="fa-solid fa-ticket mr-1"></i> ราคาบัตรทุกโซน
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {concert.prices.map((p) => (
                <div key={p.zone} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }}></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{p.zone}</p>
                    <p className="text-[10px] text-slate-400">{p.type}</p>
                  </div>
                  <span className="font-bold text-xs text-[#4F46E5] shrink-0">฿{p.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seating chart */}
          {SEATING_IMAGES[concert.id] && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <i className="fa-solid fa-map mr-1"></i> ผังที่นั่ง
                </label>
                <button
                  onClick={() => setShowFullChart(true)}
                  className="text-xs text-[#4F46E5] font-bold hover:underline"
                >
                  <i className="fa-solid fa-expand mr-1"></i> ดูขยาย
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-100 h-52 relative bg-slate-900 cursor-pointer" onClick={() => setShowFullChart(true)}>
                <Image src={SEATING_IMAGES[concert.id]} alt="Seating chart" fill className="object-contain" />
              </div>
            </div>
          )}

          <button
            onClick={() => onStart(selectedRound, "have-ticket")}
            className="w-full py-4 bg-gradient-to-r from-[#FF007F] to-[#4F46E5] text-white font-extrabold rounded-2xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i> เริ่มวางแผนคอนเสิร์ตเลย!
          </button>
        </div>
      </div>

      {/* Full chart overlay */}
      {showFullChart && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowFullChart(false)}>
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
