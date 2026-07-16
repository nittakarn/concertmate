"use client";
import { useState } from "react";
import type { RankedHotel, Hotel } from "@/lib/types";

interface Props {
  rankedHotels: RankedHotel[];
  hotelNights: number;
  selectedHotelId: string;
  onSelect: (hotel: Hotel) => void;
}

const RANK = [
  {
    medal: "🥇", label: "BEST PICK",
    imgGrad: "linear-gradient(135deg,#78350F 0%,#B45309 40%,#F59E0B 100%)",
    accentGrad: "linear-gradient(135deg,#F59E0B,#D97706)",
  },
  {
    medal: "🥈", label: "2ND CHOICE",
    imgGrad: "linear-gradient(135deg,#1E3A5F 0%,#1D4ED8 50%,#60A5FA 100%)",
    accentGrad: "linear-gradient(135deg,#94A3B8,#64748B)",
  },
  {
    medal: "🥉", label: "3RD CHOICE",
    imgGrad: "linear-gradient(135deg,#431407 0%,#9A3412 50%,#CD7C2F 100%)",
    accentGrad: "linear-gradient(135deg,#CD7C2F,#92400E)",
  },
];

function buildHighlights(rh: RankedHotel): string[] {
  const h = rh.hotel;
  return [
    `ห่างฮอลล์ ${h.dist}`,
    h.rating >= 4.5 ? "รีวิวดีเยี่ยม 4.5+ ดาว" : h.rating >= 4.0 ? "รีวิวดี 4.0+ ดาว" : `คะแนนรีวิว ${h.rating} ดาว`,
    rh.rank === 1 ? "คะแนน AI สูงสุดในทริปนี้" : rh.rank === 2 ? "ตัวเลือกสำรองคุ้มค่า" : "ราคาดี เหมาะงบประหยัด",
  ];
}

export default function HotelSection({ rankedHotels, hotelNights, selectedHotelId, onSelect }: Props) {
  const [mapHotel, setMapHotel] = useState<RankedHotel | null>(null);

  return (
    <div className="space-y-5">

      {/* ── Hotel cards ── */}
      {rankedHotels.map((rh) => {
        const cfg = RANK[Math.min(rh.rank - 1, 2)];
        const isSelected = rh.hotel.id === selectedHotelId;
        const total = rh.hotel.price * hotelNights;
        const hl = buildHighlights(rh);

        return (
          <div
            key={rh.hotel.id}
            className="rounded-3xl overflow-hidden transition-all duration-200"
            style={{
              border: isSelected ? "2.5px solid #4F46E5" : "1.5px solid #E2E8F0",
              boxShadow: isSelected
                ? "0 8px 32px -6px rgba(79,70,229,0.28)"
                : "0 4px 16px -4px rgba(0,0,0,0.09)",
            }}
          >
            {/* ── Hotel image area ── */}
            <div className="relative h-48 overflow-hidden" style={{ background: cfg.imgGrad }}>
              {rh.hotel.image && (
                <img
                  src={rh.hotel.image}
                  alt={rh.hotel.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              {/* Dark gradient overlay bottom */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }} />

              {/* Rank badge top-left */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span
                  className="text-[10px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  style={{ background: cfg.accentGrad, color: "white" }}
                >
                  <span className="text-base leading-none">{cfg.medal}</span>
                  {cfg.label}
                </span>
              </div>

              {/* Budget / selected badge top-right */}
              <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                {isSelected && (
                  <span className="px-3 py-1.5 rounded-full text-[10px] font-extrabold bg-white text-[#4F46E5] shadow">
                    ✓ เลือกแล้ว
                  </span>
                )}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow ${rh.withinBudget ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
                  {rh.withinBudget ? "ในงบ ✓" : "เกินงบ"}
                </span>
              </div>

              {/* Hotel name + info overlay on image bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                <h4
                  className="font-black text-white text-xl leading-snug drop-shadow-md"
                  style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}
                >
                  {rh.hotel.name}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-white/80 flex items-center gap-1">
                    <i className="fa-solid fa-location-dot text-[10px]" />
                    {rh.hotel.dist}
                  </span>
                  <span className="text-white/40 text-[10px]">·</span>
                  <span className="text-[11px] text-white/80 flex items-center gap-1">
                    <i className="fa-solid fa-star text-amber-300 text-[10px]" />
                    {rh.hotel.rating}/5
                  </span>
                  <span className="text-white/40 text-[10px]">·</span>
                  <span className="text-[11px] text-white/80">AI Score {rh.score}</span>
                </div>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="px-5 py-5 bg-white space-y-4">

              {/* AI reasoning */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <p className="text-[10px] font-extrabold text-indigo-500 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                  <i className="fa-solid fa-brain" /> AI เลือกให้เพราะ...
                </p>
                <p className="text-[13px] text-slate-700 leading-relaxed">{rh.reasoning}</p>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                {hl.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[13px] text-slate-600 font-medium">
                    <i className="fa-solid fa-circle-check text-emerald-500 text-sm shrink-0" />
                    {h}
                  </div>
                ))}
              </div>

              {/* Price + CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-3">
                <div>
                  <span className="font-black text-[#4F46E5] text-xl">฿{rh.hotel.price.toLocaleString()}</span>
                  <span className="text-slate-400 text-xs"> /คืน</span>
                  {hotelNights > 1 && (
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      รวม {hotelNights} คืน = <b className="text-slate-700">฿{total.toLocaleString()}</b>
                    </span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setMapHotel(rh)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-map-location-dot" /> แผนที่
                  </button>
                  {rh.hotel.bookingUrl && (
                    <a
                      href={rh.hotel.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors"
                      style={{ color: "#0EA5E9", borderColor: "#BAE6FD", background: "#F0F9FF" }}
                    >
                      <i className="fa-solid fa-calendar-check" /> จองที่พัก
                    </a>
                  )}
                  <button
                    onClick={() => onSelect(rh.hotel)}
                    className="px-6 py-2.5 rounded-xl text-sm font-extrabold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg,#10B981,#059669)"
                        : "linear-gradient(135deg,#FF007F,#4F46E5)",
                    }}
                  >
                    {isSelected
                      ? <><i className="fa-solid fa-check mr-1.5" />เลือกแล้ว</>
                      : "เลือกที่นี่ →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Map modal ── */}
      {mapHotel && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMapHotel(null)} />
          <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
              <div>
                <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">Hotel Map</p>
                <h4 className="font-bold text-base text-slate-800 leading-snug mt-0.5" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
                  {mapHotel.hotel.name}
                </h4>
              </div>
              <button
                onClick={() => setMapHotel(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="h-64">
              <iframe
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapHotel.hotel.mapQuery)}&output=embed`}
              />
            </div>
            <div className="px-5 py-4 flex justify-between items-center gap-3 flex-wrap">
              <div>
                <span className="font-black text-[#4F46E5] text-lg">฿{mapHotel.hotel.price.toLocaleString()}</span>
                <span className="text-slate-400 text-xs"> /คืน</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  {hotelNights} คืน = <b className="text-slate-700">฿{(mapHotel.hotel.price * hotelNights).toLocaleString()}</b>
                </span>
              </div>
              <div className="flex gap-2">
                {mapHotel.hotel.bookingUrl && (
                  <a
                    href={mapHotel.hotel.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-1.5 border"
                    style={{ color: "#0EA5E9", borderColor: "#BAE6FD", background: "#F0F9FF" }}
                  >
                    <i className="fa-solid fa-calendar-check" /> จองที่พัก
                  </a>
                )}
                <button
                  onClick={() => { onSelect(mapHotel.hotel); setMapHotel(null); }}
                  className="px-6 py-3 rounded-xl text-sm font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg,#FF007F,#4F46E5)" }}
                >
                  เลือกที่พักนี้
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
