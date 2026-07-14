"use client";
import { useState, useEffect } from "react";
import type { Concert, TicketZone } from "@/lib/types";
import type { WeatherDay } from "@/lib/weather";

interface Props {
  concert: Concert;
  ticketZone: TicketZone;
  daysUntil: number;
  weather?: WeatherDay | null;
  onProgressChange?: (pct: number) => void;
}

interface Item {
  text: string;
  pending?: boolean;
  icon: string;
}

const WEATHER_EMOJI: Record<string, string> = {
  "fa-sun":                  "☀️",
  "fa-cloud-sun":            "🌤️",
  "fa-cloud":                "☁️",
  "fa-smog":                 "🌫️",
  "fa-cloud-drizzle":        "🌦️",
  "fa-cloud-rain":           "🌧️",
  "fa-cloud-showers-heavy":  "🌧️",
  "fa-bolt":                 "⛈️",
};

function weatherGradient(icon: string): string {
  if (icon === "fa-sun") return "linear-gradient(135deg,#F59E0B,#FBBF24)";
  if (icon.includes("cloud-sun")) return "linear-gradient(135deg,#64748B,#94A3B8)";
  if (icon === "fa-cloud") return "linear-gradient(135deg,#475569,#64748B)";
  if (icon.includes("rain") || icon.includes("drizzle") || icon.includes("shower"))
    return "linear-gradient(135deg,#0369A1,#0EA5E9)";
  if (icon === "fa-bolt") return "linear-gradient(135deg,#1E3A8A,#4F46E5)";
  if (icon === "fa-smog") return "linear-gradient(135deg,#78716C,#A8A29E)";
  return "linear-gradient(135deg,#0EA5E9,#38BDF8)";
}

function detectWeather(note: string, isOutdoor: boolean) {
  const lower = note.toLowerCase();
  return {
    rain:    lower.includes("ฝน"),
    cold:    lower.includes("หนาว") || lower.includes("เย็น"),
    hot:     lower.includes("ร้อน"),
    outdoor: isOutdoor,
  };
}

function weatherIcon(w: ReturnType<typeof detectWeather>): { icon: string; color: string } {
  if (w.outdoor && w.rain) return { icon: "fa-cloud-showers-heavy", color: "text-blue-500" };
  if (w.rain)              return { icon: "fa-cloud-rain",          color: "text-blue-400" };
  if (w.cold)              return { icon: "fa-wind",                color: "text-sky-500"  };
  if (w.hot && w.outdoor)  return { icon: "fa-sun",                 color: "text-yellow-500" };
  if (w.outdoor)           return { icon: "fa-cloud-sun",           color: "text-orange-400" };
  return { icon: "fa-temperature-half", color: "text-slate-500" };
}

function isVIPStandingZone(zone: TicketZone): boolean {
  if (zone.type !== "VIP") return false;
  const name = (zone.zone + " " + zone.perks).toLowerCase();
  return name.includes("standing") || name.includes("ยืน");
}

function buildPrep(concert: Concert, ticketZone: TicketZone, weather?: WeatherDay | null): Item[] {
  const ticketType  = ticketZone.type;
  const vipStanding = isVIPStandingZone(ticketZone);
  const vipSeated   = ticketType === "VIP" && !vipStanding;
  const isStanding  = ticketType === "Standing" || vipStanding;
  const w           = detectWeather(concert.weatherNote, concert.isOutdoor);

  const realRain = weather && (
    weather.icon.includes("rain") || weather.icon.includes("drizzle") ||
    weather.icon.includes("shower") || weather.icon === "fa-bolt"
  );
  const realHighRain = !realRain && weather && weather.precipProb >= 40;
  const expectRain   = realRain || w.rain;

  /* ── 1. Documents & electronics ── */
  const items: Item[] = [
    { icon: "fa-ticket",       text: "บัตรคอนเสิร์ต — บัตรกระดาษ/card จริง หรือ QR code ใน app/email แล้วแต่ประเภทที่ซื้อ" },
    { icon: "fa-id-card",      text: "บัตรประชาชน — ชื่อสะกดภาษาอังกฤษต้องตรงกับชื่อที่ซื้อบัตร" },
    { icon: "fa-battery-full", text: "พาวเวอร์แบงก์ ≤ 20,000 mAh — ชาร์จเต็มก่อนออกจากบ้าน" },
    { icon: "fa-wallet",       text: "เงินสด/บัตรเดบิต — เผื่ออาหาร, ค่าเดินทางกลับ, ซื้อ merch หน้างาน" },
  ];

  /* ── 2. Bag & shoes — differ by zone ── */
  if (isStanding) {
    items.push({ icon: "fa-bag-shopping", text: "กระเป๋าสะพายข้าง/คาดเอวขนาดเล็ก — ต้องยืน/เต้นตลอด อย่าพกหนัก" });
    items.push({ icon: "fa-shoe-prints",  text: "รองเท้าผ้าใบหุ้มส้น นุ่มสบาย — ห้ามส้นสูงหรือเปิดนิ้วเด็ดขาด" });
  } else {
    items.push({ icon: "fa-bag-shopping", text: `กระเป๋าขนาดไม่เกิน A4 ตามกฎ${concert.isOutdoor ? "สนาม" : "ฮอลล์"} — กระเป๋าเล็กผ่านง่ายที่สุด` });
    items.push({ icon: "fa-shoe-prints",  text: "รองเท้าสบาย เดินได้นาน — เดินจากที่จอดรถ/MRT เข้าฮอลล์ไกลพอดู" });
  }

  /* ── 3. Health & hygiene ── */
  items.push({ icon: "fa-kit-medical",   text: "ยาประจำตัว + ยาแก้ปวดหัว + ยาดม — เผื่อเวียนหัวในพื้นที่แออัด" });
  items.push({ icon: "fa-hand-sparkles", text: "ทิชชูเปียก + เจลแอลกอฮอล์ — สุขอนามัยในสถานที่คนเยอะ" });
  items.push({ icon: "fa-bowl-food",     text: "กินอาหารให้อิ่มก่อน หรือวางแผนร้านใกล้งานไว้ล่วงหน้า" });

  /* ── 4. Weather × venue ── */
  if (expectRain) {
    if (concert.isOutdoor) {
      items.push({ icon: "fa-umbrella", text: "เสื้อกันฝน/พอนโชแบบพกพา — กลางแจ้งทั้งคืน ร่มบังสายตาคนรอบข้างและบางงานห้ามใช้" });
    } else {
      items.push({ icon: "fa-umbrella", text: "ร่มพับเล็ก — เผื่อเดินจากที่จอดรถ/MRT Pink Line เข้าฮอลล์ ข้างในมีหลังคา" });
    }
  } else if (realHighRain) {
    if (concert.isOutdoor) {
      items.push({ icon: "fa-umbrella", text: `เสื้อกันฝนหรือพอนโช — กลางแจ้ง โอกาสฝน ${weather!.precipProb}% ควรเตรียมไว้` });
    } else {
      items.push({ icon: "fa-umbrella", text: `ร่มพับสำรอง — โอกาสฝน ${weather!.precipProb}% เผื่อช่วงเดินเข้า-ออก` });
    }
  }

  if (concert.isOutdoor) {
    if (!expectRain) {
      items.push({ icon: "fa-face-smile-beam",    text: "ครีมกันแดด SPF50+ + หมวก — แดดสนามก่อนพระอาทิตย์ตกแรงมาก" });
      items.push({ icon: "fa-wind",               text: "พัดลมพับพกพา — กลางแจ้งก่อนค่ำอาจร้อนถึง 35°C+" });
    }
    items.push({ icon: "fa-droplet",              text: "น้ำดื่มขวดพลาสติกเล็ก ≤ 350ml — ขวดใหญ่/กระบอก/กระป๋องไม่ผ่านจุดตรวจ" });
    items.push({ icon: "fa-spray-can-sparkles",   text: "สเปรย์กันยุง — สนามกลางแจ้งยามค่ำมียุงชุม โดยเฉพาะช่วงฤดูฝน" });
  } else {
    if (w.cold) {
      items.push({ icon: "fa-shirt", text: "เสื้อกันหนาวหนาพอสมควร — ฮอลล์เปิดแอร์แรง ยิ่งถ้าอากาศข้างนอกเย็นด้วย" });
    } else {
      items.push({ icon: "fa-shirt", text: "เสื้อกันหนาวบาง/jacket — แอร์ฮอลล์เย็นกว่าข้างนอกมาก" });
    }
    items.push({ icon: "fa-glass-water", text: "ดื่มน้ำให้หมดก่อนเข้าประตูตรวจ — ฮอลล์ห้ามนำเครื่องดื่มเข้า ซื้อข้างในได้" });
  }

  /* ── 5. VIP-specific ── */
  const scheduleKnown = concert.id === "xg";
  if (ticketType === "VIP") {
    if (!scheduleKnown) {
      items.push({ icon: "fa-star", text: "เช็คขั้นตอนรับสิทธิ์ VIP Package จากผู้จัดล่วงหน้า — จุดรับและเวลาประกาศก่อนงาน", pending: true });
    }
    if (vipSeated && !scheduleKnown) {
      items.push({ icon: "fa-clock", text: "เช็คเวลา Soundcheck / Special Activity จากผู้จัดก่อนวันงาน", pending: true });
    }
    if (vipStanding) {
      items.push({ icon: "fa-stopwatch", text: "เตรียมร่างกาย — ยืนต่อคิวนาน 3–4 ชม.ก่อนโชว์ พักผ่อนให้พอก่อนวันงาน" });
    }
  }

  /* ── 6. Standing-specific ── */
  if (isStanding) {
    items.push({ icon: "fa-store", text: "ซื้อ official merch ก่อนเข้าคิวยืน หรือรอหลังงานจบ — ช่วงประตูเปิดคิวยาวมาก" });
  }

  /* ── 7. Concert-specific extras ── */
  if (concert.checklistExtra?.length) {
    concert.checklistExtra.forEach((e) =>
      items.push({ icon: "fa-circle-plus", text: e.text, pending: e.pending })
    );
  }

  return items;
}

export default function ChecklistSection({ concert, ticketZone, daysUntil, weather, onProgressChange }: Props) {
  const w           = detectWeather(concert.weatherNote, concert.isOutdoor);
  const wi          = weatherIcon(w);
  const items       = buildPrep(concert, ticketZone, weather);
  const weatherReady = daysUntil <= 7 && daysUntil >= 0;
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const done = Object.values(checked).filter(Boolean).length;
  const pct  = items.length > 0 ? Math.round((done / items.length) * 100) : 0;

  useEffect(() => { onProgressChange?.(pct); }, [pct, onProgressChange]);

  return (
    <div className="dreamer-card rounded-3xl p-6 space-y-5">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <h4 className="font-bold text-lg text-[#1E293B] flex items-center gap-2" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
          <i className="fa-solid fa-list-check text-[#FF007F] text-xl"></i> สิ่งที่ต้องเตรียม
        </h4>
        <span className="text-xs font-bold text-[#4F46E5]">{pct}%</span>
      </div>

      {/* Weather banner */}
      {weatherReady ? (
        <div className="rounded-2xl overflow-hidden" style={{ background: weather ? weatherGradient(weather.icon) : "#e0f2fe" }}>
          {weather ? (
            <div className="relative px-4 py-4 overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl leading-none">{WEATHER_EMOJI[weather.icon] ?? "🌡️"}</span>
                    <span className="text-sm font-bold text-white">{weather.desc}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block"></span>
                    <span className="text-[9px] font-extrabold text-white/60 uppercase tracking-[0.18em]">Live</span>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-5xl font-black text-white leading-none">{weather.tempMax}°</p>
                    <p className="text-[11px] text-white/60 mt-1">ต่ำสุด {weather.tempMin}°C</p>
                  </div>
                  <div className="text-right pb-1 space-y-1">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xl font-black ${weather.precipProb >= 50 ? "bg-white/30 text-white" : "bg-white/15 text-white/75"}`}>
                      {weather.precipProb}%
                    </div>
                    <p className="text-xs text-white/60 font-bold">โอกาสฝน</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sky-600 text-xs p-4">
              <i className="fa-solid fa-spinner animate-spin"></i> กำลังโหลดพยากรณ์อากาศ...
            </div>
          )}
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <i className={`fa-solid ${wi.icon} ${wi.color} text-lg shrink-0`}></i>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">สภาพอากาศวันงาน</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">{concert.weatherNote}</p>
          <div className="flex items-start gap-2 pt-1 border-t border-slate-200 mt-1">
            <i className="fa-solid fa-clock text-amber-400 text-sm shrink-0 mt-0.5"></i>
            <p className="text-[10.5px] text-amber-700 leading-relaxed">
              พยากรณ์อากาศจริงจะโหลดให้อัตโนมัติเมื่อเหลือ{" "}
              <span className="font-bold">7 วัน</span>{" "}ก่อนวันคอน
            </p>
          </div>
        </div>
      )}

      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#FF007F] to-[#4F46E5] h-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <label key={i} className="flex items-start gap-3 p-2.5 bg-white rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={!!checked[i]}
              onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
              className="mt-0.5 w-4 h-4 accent-[#FF007F] shrink-0"
            />
            <i className={`fa-solid ${item.icon} text-[#FF007F] text-sm shrink-0 mt-0.5`}></i>
            <span className={`text-[11px] flex-1 leading-relaxed ${checked[i] ? "line-through text-slate-400" : "text-slate-600"}`}>
              {item.text}
            </span>
            {item.pending && !checked[i] && (
              <span className="shrink-0 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-bold">รอข้อมูล</span>
            )}
          </label>
        ))}
      </div>

      {pct >= 80 && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-bold text-center">
          <i className="fa-solid fa-party-horn mr-1"></i> เกือบพร้อมแล้ว! ไปสนุกกันได้เลย!
        </div>
      )}
    </div>
  );
}
