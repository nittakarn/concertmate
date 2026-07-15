"use client";
import type { Concert, TicketZone } from "@/lib/types";

interface Props {
  concert: Concert;
  ticketZone: TicketZone;
  wantMerch?: boolean;
}

function isVIPStandingZone(zone: TicketZone): boolean {
  if (zone.type !== "VIP") return false;
  const name = (zone.zone + " " + zone.perks).toLowerCase();
  // Only detect by standing/ยืน — not "early entry", because early entry can apply to seated VIP too
  return name.includes("standing") || name.includes("ยืน");
}

// Compute "HH:MM" by adding delta minutes to a "HH:MM" or "HH:MM น." time string
function addMin(t: string, delta: number): string {
  const clean = t.replace(/\s*น\.\s*$/, "").trim();
  const [h, m] = clean.split(":").map(Number);
  const total = ((h * 60 + m + delta) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function fmtHours(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return `${h} ชม.`;
  if (h === 0) return `${m} นาที`;
  return `${h}.${m === 30 ? "5" : m} ชม.`;
}

export default function TransitSection({ concert, ticketZone, wantMerch = false }: Props) {
  const isVip          = ticketZone.type === "VIP";
  const vipStanding    = isVIPStandingZone(ticketZone);
  const vipSeated      = isVip && !vipStanding;
  const isStanding     = ticketZone.type === "Standing" || vipStanding;
  const hasSoundcheck  = ticketZone.hasSoundcheck ?? false;
  const hasEarlyEntry  = ticketZone.hasEarlyEntry ?? false;
  const scheduleKnown  = concert.id === "xg"; // ตารางเวลา XG mock จากผู้จัด (คอนอื่นยังรอ)

  // Milestone times — relative to concert.doorTime (General doors)
  // Reference: BABYMONSTER structure (General doors 15:30, VIP doors 14:30, Soundcheck 15:00)
  const vipDoorTime     = addMin(concert.doorTime, -60);   // VIP doors 1h before General
  const vipMerchTime    = addMin(concert.doorTime, -150);  // VIP merch 2.5h before General
  const soundcheckTime  = addMin(concert.doorTime, -30);   // Soundcheck 30m before General
  const genMerchTime    = addMin(concert.doorTime, -90);   // General merch 1.5h before General
  const standingArrTime = addMin(concert.doorTime, -120);  // Standing queue 2h before General
  const seatedArrTime   = addMin(concert.doorTime, -60);   // Seated arrival 1h before General

  // Target arrival time at venue (= first milestone the user needs to hit)
  let arrivalTime: string;
  let arrivalDeltaMins: number;
  let arrivalDesc: string;

  if (hasSoundcheck) {
    // XG VVIP / XG VIP2 / Baby Monster VIP — ต้องถึงก่อน Soundcheck เริ่ม
    arrivalDeltaMins = 180;
    arrivalTime = addMin(concert.doorTime, -180);
    arrivalDesc = wantMerch
      ? "ถ่ายรูปหน้างานก่อนคนเยอะ รับ Merch VIP แล้วลงทะเบียนเตรียมเข้า Soundcheck"
      : "ถ่ายรูปหน้างานก่อนคนเยอะ แล้วลงทะเบียน VIP เตรียมเข้า Soundcheck ก่อนประตูเปิดทั่วไป";
  } else if (vipStanding) {
    // Post Malone VIP Early Entry (ยืน) / The Weeknd VIP3 Early Entry (ยืน) — จับตำแหน่งหน้า
    arrivalDeltaMins = 180;
    arrivalTime = addMin(concert.doorTime, -180);
    arrivalDesc = wantMerch
      ? "ถ่ายรูปหน้างานก่อนคนเยอะ รับ Merch VIP แล้วใช้สิทธิ์ Early Entry เข้าโซนยืนก่อน General"
      : "ถ่ายรูปหน้างานก่อนคนเยอะ แล้วใช้สิทธิ์ Early Entry เข้าโซนยืนก่อน General จับตำแหน่งหน้าสเตจ";
  } else if (vipSeated && hasEarlyEntry) {
    // The Weeknd VIP1 Ultimate / VIP2 Gold Lounge — ที่นั่ง + Early Entry เข้า VIP Area
    arrivalDeltaMins = 120;
    arrivalTime = addMin(concert.doorTime, -120);
    arrivalDesc = wantMerch
      ? "ถ่ายรูปหน้างานก่อนคนเยอะ รับ Package + Merch VIP แล้วใช้สิทธิ์ Early Entry เข้าพื้นที่ VIP ก่อนใคร"
      : "ถ่ายรูปหน้างานก่อนคนเยอะ แล้วรับ VIP Package และใช้สิทธิ์ Early Entry เข้าพื้นที่ VIP ก่อนประตูเปิด";
  } else if (isVip && wantMerch) {
    // VIP Seated ไม่มี soundcheck / early entry + ซื้อของ (เช่น Post Malone VIP Premium + Merch)
    arrivalDeltaMins = 150;
    arrivalTime = vipMerchTime;
    arrivalDesc = "ถ่ายรูปหน้างานก่อนคนเยอะ แล้วทันบูธ Merch VIP และลงทะเบียนรับ Package";
  } else if (vipSeated) {
    // VIP Seated ทั่วไป — Post Malone VIP Premium (ไม่มี merch, ไม่มี early entry)
    arrivalDeltaMins = 90;
    arrivalTime = addMin(concert.doorTime, -90);
    arrivalDesc = "ถ่ายรูปหน้างานก่อนคนเยอะ แล้วลงทะเบียน VIP รับ Package ก่อนประตูเปิดทั่วไป";
  } else if (hasEarlyEntry) {
    // The Weeknd "Early Entry Standing" — บัตรยืนธรรมดาแต่มีสิทธิ์เข้าก่อน
    arrivalDeltaMins = 150;
    arrivalTime = addMin(concert.doorTime, -150);
    arrivalDesc = wantMerch
      ? "ถ่ายรูปหน้างานก่อนคนเยอะ ซื้อ Merch แล้วใช้สิทธิ์ Early Entry เข้าโซนยืนก่อนบัตรทั่วไป"
      : "ถ่ายรูปหน้างานก่อนคนเยอะ แล้วใช้สิทธิ์ Early Entry เข้าโซนยืนก่อนบัตรทั่วไป จับตำแหน่งหน้าสเตจ";
  } else if (wantMerch) {
    arrivalDeltaMins = 120;
    arrivalTime = addMin(concert.doorTime, -120);
    arrivalDesc = "เผื่อ 30 นาทีถ่ายรูปหน้างานก่อนคนเยอะ แล้วทันบูธ Merch เปิดพอดี";
  } else if (isStanding) {
    arrivalDeltaMins = 120;
    arrivalTime = standingArrTime;
    arrivalDesc = "ถ่ายรูปหน้างานก่อนคนเยอะ แล้วจับตำแหน่งยืนใกล้เวทีได้เลย";
  } else {
    arrivalDeltaMins = 60;
    arrivalTime = seatedArrTime;
    arrivalDesc = "ที่นั่งจองแล้ว ไม่ต้องรีบ — ถ่ายรูปหน้างาน backdrop ก่อนเข้าฮอลล์";
  }

  const arrivalChips: string[] =
    hasSoundcheck
      ? wantMerch ? ["VIP Seated", "Soundcheck", "Merch"] : ["VIP Seated", "Soundcheck"]
    : vipStanding
      ? wantMerch ? ["VIP Standing", "Merch"] : ["VIP Standing"]
    : vipSeated && hasEarlyEntry
      ? wantMerch ? ["VIP Seated", "Early Entry", "Merch"] : ["VIP Seated", "Early Entry"]
    : vipSeated
      ? wantMerch ? ["VIP Seated", "Merch"] : ["VIP Seated"]
    : hasEarlyEntry
      ? wantMerch ? ["Standing", "Early Entry", "Merch"] : ["Standing", "Early Entry"]
    : wantMerch
      ? ["Merch"]
    : isStanding
      ? ["Standing"]
    : ["Seated"];

  const outboundItems = [
    // ── Arrival (first item, highlighted) ──
    {
      title: scheduleKnown
        ? `${arrivalTime} น. — ควรถึงบริเวณ${concert.venueName.split(" ")[0]} (ก่อนประตูเปิด ${fmtHours(arrivalDeltaMins)})`
        : `ก่อนประตูเปิด ${fmtHours(arrivalDeltaMins)} — ควรถึงบริเวณ${concert.venueName.split(" ")[0]}`,
      desc: arrivalDesc,
      pending: !scheduleKnown,
      chips: arrivalChips,
    },
    // ── VIP milestones ──
    ...(isVip ? [{
      title: scheduleKnown
        ? `${vipDoorTime} น. — ประตูฮอลล์เปิดสำหรับ VIP`
        : `ก่อนประตูเปิด ${fmtHours(60)} — ประตูฮอลล์เปิดสำหรับ VIP`,
      desc: hasSoundcheck
        ? "เข้าฮอลล์ก่อน General 1 ชม. — ลงทะเบียน VIP เตรียมตัว Soundcheck"
        : vipStanding
        ? "เข้าฮอลล์ก่อน General 1 ชม. — ลงทะเบียน VIP แล้วจับตำแหน่งยืนได้เลย"
        : "เข้าฮอลล์ก่อน General 1 ชม. — ลงทะเบียน VIP รับ Package และเตรียมเข้าที่นั่ง",
      pending: !scheduleKnown,
    }] : []),
    // Soundcheck — แสดงเฉพาะ VIP ที่มีสิทธิ์ Soundcheck จริงเท่านั้น
    ...(isVip && hasSoundcheck ? [{
      title: scheduleKnown
        ? `${soundcheckTime} น. — กิจกรรม Soundcheck เริ่ม`
        : `ก่อนประตูเปิด ${fmtHours(30)} — กิจกรรม Soundcheck เริ่ม`,
      desc: scheduleKnown
        ? "เข้าร่วม Soundcheck ตามจุดที่ผู้จัดกำหนด"
        : "เวลา/จุดรวมที่แน่นอน ผู้จัดจะประกาศก่อนวันงาน",
      pending: !scheduleKnown,
    }] : []),

    // ── General merch (only when arrival ≠ merch open time, i.e. wantMerch with 30min buffer) ──
    ...(!isVip && wantMerch ? [{
      title: scheduleKnown
        ? `${genMerchTime} น. — บูธ Merch + จุดตรวจเปิด`
        : `ก่อนประตูเปิด ${fmtHours(90)} — บูธ Merch + จุดตรวจเปิด`,
      desc: "คิวซื้อ Merch มักยาวมาก — ยิ่งถึงเร็วยิ่งได้ของครบและคิวสั้น",
      pending: !scheduleKnown,
    }] : []),

    // ── Always ──
    { title: `${concert.doorTime} น. ประตูเปิด`, desc: "เข้าคิวตามโซนบัตรของคุณ รับของสะสมถ้ามีแจกหน้างาน", pending: false },
    { title: `${concert.showTime} น. เริ่มการแสดง`, desc: "เวลาเริ่มโชว์ที่ประกาศทางการแล้ว ยืนยันแน่นอน", pending: false },
  ];

  const returnItems = [
    { title: "ช่วงเพลงสุดท้าย/encore : เตรียมตัวออก", desc: "ถ้าอยากรีบออกให้ขยับตัวเข้าใกล้ทางออกของโซนตัวเองไว้ก่อน", pending: false },
    { title: "จบการแสดง (ประมาณ 2.5–3 ชม. หลังเริ่ม)", desc: "เวลาจบจริงไม่มีประกาศ — ขึ้นอยู่กับ setlist และ encore ของศิลปิน", pending: false },
    { title: "+10-15 นาทีหลังจบ : เดินออกจากพื้นที่จัดงาน", desc: "เลี่ยงจุดคิวหนาแน่นหน้าทางออกหลัก เดินทะลุไปทางซอยย่อยหรือจุดรองแทน", pending: false },
    { title: "+30-60 นาทีหลังจบ (ถ้ารถแน่นมาก)", desc: "แวะรอที่ร้านอาหาร/ที่พักใกล้เคียงให้คนบางลงก่อน แล้วเรียกวินมอเตอร์ไซค์ที่มีป้ายราคาชัดเจนเท่านั้น", pending: false },
  ];

  const TimelineItem = ({ item, colorClass, highlight }: { item: { title: string; desc: string; pending: boolean; chips?: string[] }; colorClass: string; highlight?: boolean }) => (
    <div className="relative">
      <span className={`absolute -left-[21px] top-1 ${highlight ? "bg-teal-500" : "bg-white"} border ${colorClass} rounded-full w-2 h-2`}></span>
      {highlight ? (
        <div className="border border-teal-300 bg-teal-50 rounded-xl px-3 py-2.5">
          {item.chips && item.chips.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              {item.chips.map((chip, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-[9px] font-bold">{chip}</span>
              ))}
              {item.pending && <span className="pending-chip px-1.5 py-0.5 rounded text-amber-700 text-[9px] font-bold">ประมาณการ</span>}
            </div>
          )}
          <p className="font-bold text-slate-800 text-xs">{item.title}</p>
          <p className="text-[11.5px] text-slate-500 mt-0.5">{item.desc}</p>
        </div>
      ) : (
        <>
          <span className="font-bold block text-slate-800 text-xs">
            {item.title}{" "}
            {item.pending && <span className="pending-chip px-1.5 py-0.5 rounded text-amber-700 text-[9px] font-bold ml-1">รอข้อมูล</span>}
          </span>
          <p className="text-[11.5px] text-slate-500 mt-0.5">{item.desc}</p>
        </>
      )}
    </div>
  );

  return (
    <div className="dreamer-card rounded-3xl p-6 space-y-6">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <h4 className="font-bold text-lg text-[#1E293B] flex items-center gap-2" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
          <i className="fa-solid fa-train text-xl"></i> Route Timeline
        </h4>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold text-[9px] uppercase tracking-wider">ไป-กลับฮอลล์</span>
      </div>

      {!scheduleKnown && (
        <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-600 flex items-start gap-2">
          <span className="text-base text-blue-600 mt-0.5"><i className="fa-solid fa-circle-info"></i></span>
          <div>
            <span className="font-bold text-slate-800 block"><i className="fa-solid fa-triangle-exclamation mr-1"></i> ตอนนี้เป็นกรอบเวลาโดยประมาณ ยังไม่ใช่เวลาทางการ</span>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
              เวลาด้านล่างอ้างอิงจากประตูเปิด/เวลาเริ่มโชว์ที่ประกาศแล้วเท่านั้น รายการที่มีตรา <span className="pending-chip px-1 py-0.5 rounded text-amber-700 font-bold text-[9px]">รอข้อมูล</span> จะได้รับการอัปเดตจากผู้จัด <b>ภายใน 7 วันก่อนวันงาน</b>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 text-xs text-slate-600 md:divide-x md:divide-dashed md:divide-slate-200">
        <div className="space-y-3 md:pr-8">
          <h5 className="font-bold text-teal-700 flex items-center gap-1.5 bg-teal-50 px-3 py-2 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            ขาไป — แผนถึง{concert.venueName.split(" ")[0]}
          </h5>

          <div className="border-l-2 border-teal-200 pl-4 space-y-4 pt-2">
            {outboundItems.map((item, i) => (
              <TimelineItem key={i} item={item} colorClass="border-teal-500" highlight={i === 0} />
            ))}
          </div>
        </div>
        <div className="space-y-3 md:pl-8 pt-6 md:pt-0">
          <h5 className="font-bold text-[#FF007F] flex items-center gap-1.5 bg-[#FFF0F6] px-3 py-2 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF007F] animate-pulse shrink-0"></span>
            ขากลับ — แผนรอดปลอดภัย (Return)
          </h5>
          <div className="border-l-2 border-[#FF007F]/25 pl-4 space-y-4 pt-2">
            {returnItems.map((item, i) => <TimelineItem key={i} item={item} colorClass="border-[#FF007F]" />)}
          </div>
        </div>
      </div>

      {/* Transit info */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h5 className="font-bold text-sm text-[#1E293B]" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
          <i className="fa-solid fa-map-signs text-[#0D9488] mr-2"></i> ข้อมูลการเดินทางทุกรูปแบบ
        </h5>

        {concert.transit.boat && (
          <div className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
            <div className="w-8 h-8 rounded-xl text-blue-500 bg-blue-50 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-ship text-sm"></i>
            </div>
            <div>
              <p className="font-bold text-xs text-slate-700 mb-0.5">เรือโดยสาร (คลองแสนแสบ)</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">{concert.transit.boat}</p>
            </div>
          </div>
        )}

        {/* Public transit — split by | into bullet list */}
        <div className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
          <div className="w-8 h-8 rounded-xl text-teal-600 bg-teal-50 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-bus text-sm"></i>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs text-slate-700 mb-1.5">รถไฟฟ้า / รถเมล์สาธารณะ</p>
            <ul className="space-y-1">
              {[
                ...(concert.transit.bts ? [`BTS สายสีชมพู: ${concert.transit.bts}`] : []),
                ...concert.transit.public.split("|"),
              ].map((line, i) => (
                <li key={i} className="flex gap-1.5 text-[11px] text-slate-500 leading-relaxed">
                  <span className="text-teal-400 shrink-0 mt-0.5">•</span>
                  <span>{line.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {[
          { icon: "fa-car", color: "text-indigo-600 bg-indigo-50", title: "ขับรถส่วนตัว / แท็กซี่", text: concert.transit.driving },
          { icon: "fa-taxi", color: "text-[#FF007F] bg-[#FFF0F6]", title: "Grab / เรียกรถแอป", text: concert.transit.grab },
          { icon: "fa-rotate-left", color: "text-amber-600 bg-amber-50", title: "แผนขากลับ", text: concert.transit.returnNote },
        ].map((t, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
            <div className={`w-8 h-8 rounded-xl ${t.color} flex items-center justify-center shrink-0`}>
              <i className={`fa-solid ${t.icon} text-sm`}></i>
            </div>
            <div>
              <p className="font-bold text-xs text-slate-700 mb-0.5">{t.title}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">{t.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
