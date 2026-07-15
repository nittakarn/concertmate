"use client";
import { useState, useCallback, useEffect } from "react";
import type { Concert, RecommendResponse, WizardState, Hotel } from "@/lib/types";
import { fetchConcertWeather, type WeatherDay } from "@/lib/weather";
import BudgetSection from "./BudgetSection";
import TicketSection from "./TicketSection";
import HotelSection from "./HotelSection";
import TransitSection from "./TransitSection";
import ChecklistSection from "./ChecklistSection";
import PolicySection from "./PolicySection";
import DashCard from "./DashCard";
import ModalOverlay from "./ModalOverlay";
import ShareTicketModal from "./ShareTicketModal";

interface Props {
  concert: Concert;
  roundKey: string;
  recommendation: RecommendResponse;
  wizardState: WizardState;
}

function getTimeLeft(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return null;
  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return { days, hours, mins, secs, totalSec };
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
}

type ModalKey = "ticket" | "hotel" | "transit" | "checklist" | "policy" | null;

const MODAL_TITLES: Record<Exclude<ModalKey, null>, string> = {
  ticket: "My Concert Ticket",
  hotel: "ที่พักแนะนำ",
  transit: "Route Timeline",
  checklist: "สิ่งที่ต้องเตรียม",
  policy: "กฎ & Policy สถานที่",
};

export default function Dashboard({ concert, roundKey, recommendation, wizardState }: Props) {
  const round = concert.rounds.find((r) => r.key === roundKey) || concert.rounds[0];
  const zone = concert.prices.find((p) => p.zone === wizardState.preselectedZone) ?? concert.prices[0];

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(round.date));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(round.date)), 1000);
    return () => clearInterval(timer);
  }, [round.date]);

  const days = timeLeft ? timeLeft.days : (new Date(round.date).getTime() < Date.now() ? -1 : 0);

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(recommendation.rankedHotels[0]?.hotel ?? null);
  const [budget, setBudget] = useState(wizardState.budget);
  const [costs, setCosts] = useState({
    transportCost: wizardState.transportCost,
    merchCost: wizardState.merchCost,
    foodCost: wizardState.foodCost,
    otherCost: wizardState.otherCost,
  });
  const [modal, setModal] = useState<ModalKey>(null);
  const [weather, setWeather] = useState<WeatherDay | null>(null);

  useEffect(() => {
    if (days >= 0 && days <= 7) {
      fetchConcertWeather(concert.id, round.date).then(setWeather);
    }
  }, [concert.id, round.date, days]);
  const [checklistPct, setChecklistPct] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const countdownText = timeLeft
    ? timeLeft.days > 0
      ? `เหลืออีก ${timeLeft.days} วัน`
      : "Today! 🎤"
    : "โชว์ผ่านไปแล้ว";

  const shareTicket = () => setShowShare(true);

  return (
    <section className="step-transition py-4 space-y-6">

      {/* ── Ticket Card (full-width) ── */}
      <div className="rounded-3xl overflow-hidden" style={{ boxShadow: `0 8px 40px -8px ${zone.color}50, 0 4px 16px -4px rgba(0,0,0,0.15)` }}>
        {/* Dark gradient body */}
        <div
          className="relative px-6 py-7 overflow-hidden min-h-[220px]"
          style={{ background: `linear-gradient(135deg, #0D1117 0%, ${zone.color}60 55%, #161B22 100%)` }}
        >
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
          {/* Glow blob */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: zone.color, transform: "translate(30%, -40%)" }} />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              {/* Left */}
              <div className="space-y-3 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-black">🎫 CONCERT PASS</span>
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border"
                    style={{ color: zone.color, borderColor: `${zone.color}55`, background: `${zone.color}25` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: zone.color }} />
                    {countdownText}
                  </span>
                </div>
                <h2 className="font-black text-white text-2xl md:text-3xl leading-tight" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
                  {concert.name}
                </h2>
                <p className="text-xs text-white/50 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span><i className="fa-solid fa-location-dot mr-1.5" style={{ color: zone.color }} />{concert.venueName}</span>
                  <span className="text-white/20">·</span>
                  <span><i className="fa-solid fa-calendar-days mr-1.5 text-white/30" />{round.label}</span>
                </p>
                <p className="text-[11px] text-white/35 leading-relaxed line-clamp-1">{zone.perks}</p>
              </div>

              {/* Right: zone hero */}
              <div className="shrink-0 text-right space-y-2 max-w-[150px]">
                <div
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: zone.color, borderColor: `${zone.color}55`, background: `${zone.color}18` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: zone.color }} />
                  ZONE
                </div>
                {(() => {
                  const displayZone = zone.zone
                    .replace(/\s*\([^)]*\)/g, "")
                    .replace(/\s*(เหลืองทอง|น้ำเงิน|เหลือง|ชมพู|ม่วง|เขียว|แดง|ส้ม|ทอง|เงิน|ขาว|ดำ)/g, "")
                    .trim();
                  return (
                    <p
                      className="font-black text-white text-right leading-snug"
                      style={{
                        fontSize: displayZone.length > 20 ? "0.78rem" : displayZone.length > 13 ? "1rem" : displayZone.length > 7 ? "1.35rem" : "1.75rem",
                        textShadow: `0 0 30px ${zone.color}88`,
                      }}
                    >
                      {displayZone}
                    </p>
                  );
                })()}
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border"
                  style={{ color: zone.color, borderColor: `${zone.color}55`, background: `${zone.color}22` }}
                >
                  {zone.type}
                </span>
                <p className="font-black text-xl text-white">฿{zone.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Perforation */}
        <div className="ticket-perforation mx-6" style={{ borderColor: `${zone.color}30` }} />

        {/* Stub */}
        <div
          className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap"
          style={{ background: "linear-gradient(135deg, #ffffff 60%, #F8FAFC 100%)" }}
        >
          <div className="grid grid-cols-4 gap-x-6 gap-y-0.5">
            {[
              { label: "DATE",  value: fmtDate(round.date) },
              { label: "VENUE", value: concert.venueName },
              { label: "DOOR",  value: concert.doorTime },
              { label: "SHOW",  value: concert.showTime },
            ].map((f) => (
              <div key={f.label}>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{f.label}</span>
                <span className="text-[12px] font-bold text-slate-700 mt-0.5 block leading-snug">{f.value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest hidden sm:block">ConcertMate ✦</span>
            <button
              onClick={shareTicket}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all hover:scale-105 active:scale-95 shrink-0 shadow-sm"
              style={{ background: zone.color, color: "#fff" }}
            >
              <i className="fa-solid fa-share-nodes" />
              แชร์ตั๋ว
            </button>
          </div>
        </div>
      </div>

      {/* ── Main: Cards left | Budget right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* ── Left: ticket stubs (order: hotel → prep → rules → transit) ── */}
        <div className="lg:col-span-3">
          <div className="space-y-3">

            {/* 1. ที่พัก */}
            {wizardState.needHotel && (
              <DashCard
                color="#4F46E5"
                icon="fa-hotel"
                title="ที่พัก"
                badge={selectedHotel ? `${wizardState.hotelNights} คืน` : undefined}
                lines={
                  selectedHotel
                    ? [
                        { label: "โรงแรม", value: selectedHotel.name },
                        { label: "ราคา/คืน", value: `฿${selectedHotel.price.toLocaleString()}` },
                        { label: "ห่างจากฮอลล์", value: selectedHotel.dist },
                      ]
                    : recommendation.rankedHotels.slice(0, 3).map((rh, i) => ({
                        label: `${["🥇","🥈","🥉"][i]} อันดับ ${i + 1}`,
                        value: rh.hotel.name,
                      }))
                }
                onClick={() => setModal("hotel")}
              />
            )}

            {/* 2. เตรียมตัวก่อนไป */}
            <DashCard
              color="#FF007F"
              icon="fa-bag-shopping"
              title="เตรียมตัว"
              badge={checklistPct > 0 ? (checklistPct === 100 ? "✓ พร้อมแล้ว!" : `${checklistPct}% เตรียมแล้ว`) : (days <= 7 && days >= 0 ? "เช็คอากาศได้!" : undefined)}
              lines={[
                { label: "สถานที่จัดงาน", value: concert.isOutdoor ? "กลางแจ้ง ☀️" : "ฮอลล์ในร่ม ❄️" },
                { label: "ประเภทบัตร", value: zone.type },
                { label: "สภาพอากาศวันงาน", value: days < 0 ? "โชว์ผ่านไปแล้ว" : days <= 7 ? (weather ? `${weather.desc} · ${weather.tempMax}°C` : "กำลังโหลด...") : "กลับมาดูอีกครั้ง 7 วันก่อน" },
              ]}
              onClick={() => setModal("checklist")}
            />

            {/* 3. กฎของงาน */}
            <DashCard
              color="#7C3AED"
              icon="fa-shield-halved"
              title="กฎของงาน"
              lines={[
                { label: "กล้อง", value: "ห้ามนำ DSLR / Mirrorless" },
                { label: "พาวเวอร์แบงก์", value: "ได้ ≤ 20,000 mAh" },
                { label: "กระเป๋า", value: "ไม่เกินขนาด A4" },
              ]}
              onClick={() => setModal("policy")}
            />

            {/* 4. การเดินทาง (วันจริง — อยู่สุดท้าย) */}
            <DashCard
              color="#0D9488"
              icon="fa-train"
              title="การเดินทาง"
              lines={[
                { label: "ออกจากบ้าน", value: `ก่อนประตูเปิด ${(() => { const n = (zone.zone + " " + zone.perks).toLowerCase(); const vs = zone.type === "VIP" && (n.includes("standing") || n.includes("early entry") || n.includes("ยืน")); return vs ? "3–4 ชม." : zone.type === "VIP" ? "1.5–2 ชม." : zone.type === "Standing" ? "2–3 ชม." : "45–60 นาที"; })()}` },
                { label: "ประตูเปิด", value: concert.doorTime },
                { label: "เริ่มโชว์", value: concert.showTime },
              ]}
              onClick={() => setModal("transit")}
            />
          </div>
        </div>

        {/* ── Right: Budget ── */}
        <div className="lg:col-span-2">
          <BudgetSection
            budget={budget}
            ticketZone={zone}
            hotel={selectedHotel}
            hotelNights={wizardState.hotelNights}
            needHotel={wizardState.needHotel}
            transportCost={costs.transportCost}
            merchCost={costs.merchCost}
            foodCost={costs.foodCost}
            otherCost={costs.otherCost}
            onBudgetChange={setBudget}
            onCostChange={(key, v) => setCosts((c) => ({ ...c, [key]: v }))}
          />
        </div>
      </div>

      {/* ── Modals ── */}
      {modal && (
        <ModalOverlay title={MODAL_TITLES[modal]} onClose={() => setModal(null)}>
          {modal === "ticket" && <TicketSection concert={concert} round={round} selectedZone={zone} />}
          {modal === "hotel" && recommendation.rankedHotels.length > 0 && (
            <HotelSection
              rankedHotels={recommendation.rankedHotels}
              hotelNights={wizardState.hotelNights}
              selectedHotelId={selectedHotel?.id ?? ""}
              onSelect={(h) => { setSelectedHotel(h); setModal(null); }}
            />
          )}
          {modal === "transit" && <TransitSection concert={concert} ticketZone={zone} wantMerch={wizardState.merchCost > 0} />}
          {modal === "checklist" && (
            <ChecklistSection concert={concert} ticketZone={zone} daysUntil={days} weather={weather} onProgressChange={setChecklistPct} />
          )}
          {modal === "policy" && <PolicySection concert={concert} />}
        </ModalOverlay>
      )}

      {/* ── Share Ticket Modal ── */}
      {showShare && (
        <ShareTicketModal
          concert={concert}
          round={round}
          zone={zone}
          countdownText={countdownText}
          onClose={() => setShowShare(false)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
          <div
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-white text-sm font-bold shadow-2xl animate-bounce-in"
            style={{ background: `linear-gradient(135deg, ${zone.color}, ${zone.color}cc)` }}
          >
            <i className="fa-solid fa-circle-check text-base" />
            {toast}
          </div>
        </div>
      )}

    </section>
  );
}
