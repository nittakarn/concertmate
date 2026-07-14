"use client";
import { useState } from "react";
import type { Concert } from "@/lib/types";

interface Props {
  concert: Concert;
  daysUntil: number;
  ticketType: string;
  needHotel: boolean;
  hotelBooked: boolean;
}

interface Phase {
  id: string;
  title: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  triggerDays: number; // phase is "current" when daysUntil <= triggerDays
  tasks: { text: string; pending?: boolean }[];
}

function buildPhases(concert: Concert, ticketType: string, needHotel: boolean, hotelBooked: boolean): Phase[] {
  const phases: Phase[] = [
    {
      id: "got-ticket",
      title: "ได้บัตรแล้ว — เริ่มวางแผน",
      icon: "fa-ticket",
      color: "text-[#FF007F]",
      bg: "bg-[#FFF0F6]",
      border: "border-[#FF007F]",
      triggerDays: 9999,
      tasks: [
        { text: "บันทึกวันคอนเสิร์ตใส่ปฏิทิน ตั้งแจ้งเตือน 7 วันก่อน" },
        { text: "ถ่ายรูปบัตร/สกรีนช็อตอีเมลยืนยันเก็บไว้" },
        ...(needHotel && !hotelBooked ? [{ text: "จองโรงแรมทันที — ราคาพุ่งใกล้วันงาน", pending: true }] : []),
        ...(needHotel && hotelBooked ? [{ text: "โรงแรมจองเรียบร้อยแล้ว ✓" }] : []),
      ],
    },
    {
      id: "prep-30d",
      title: "30+ วันก่อนคอน",
      icon: "fa-calendar-days",
      color: "text-[#4F46E5]",
      bg: "bg-[#EEF2FF]",
      border: "border-[#4F46E5]",
      triggerDays: 30,
      tasks: [
        { text: "เช็ค merch pre-order อย่าปล่อยให้ของหมด" },
        { text: "ตรวจสอบ set list คอนเสิร์ตรอบอื่น (ถ้ามี) จาก setlist.fm" },
        { text: "ชวนเพื่อนที่จะไปด้วยวางแผนนัดเจอ" },
        ...(ticketType === "VIP" ? [{ text: "ติดตาม social ผู้จัดเรื่องสิทธิ์ VIP และ Soundcheck", pending: true }] : []),
      ],
    },
    {
      id: "prep-7d",
      title: "7 วันก่อนคอน",
      icon: "fa-hourglass-half",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-400",
      triggerDays: 7,
      tasks: [
        { text: "เช็ค QR code / บัตรตัวจริงว่าสแกนได้ไหม" },
        { text: "ยืนยันแผนการเดินทางและนัดเวลากับเพื่อน" },
        { text: "เช็ค weather forecast ช่วงวันงาน" },
        ...(concert.isOutdoor ? [{ text: "เตรียมร่มพับ/เสื้อกันฝน (สนามกลางแจ้ง)" }] : []),
        ...(ticketType === "VIP" ? [{ text: "เช็คเวลา VIP check-in จากประกาศผู้จัด", pending: true }] : []),
      ],
    },
    {
      id: "prep-1d",
      title: "1 วันก่อนคอน",
      icon: "fa-bag-shopping",
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-400",
      triggerDays: 1,
      tasks: [
        { text: "จัดกระเป๋า — บัตร, พาวเวอร์แบงก์, พาวเวอร์แบงก์สำรอง" },
        { text: "ชาร์จแบตมือถือและพาวเวอร์แบงก์ให้เต็ม" },
        { text: "วางแผนออกจากบ้านกี่โมง (เผื่อรถติด + หาที่จอด)" },
        { text: "เตรียมเสื้อกันหนาวบาง" + (concert.isOutdoor ? " และร่ม" : " เผื่อลมแอร์") },
        { text: "กินข้าวให้อิ่มก่อนไปหรือวางแผนร้านอาหารใกล้งาน" },
      ],
    },
    {
      id: "day-of",
      title: `วันคอน! — ${concert.doorTime} ประตูเปิด`,
      icon: "fa-star",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-400",
      triggerDays: 0,
      tasks: [
        { text: `ออกจากบ้านก่อนเวลาอย่างน้อย 2 ชม. (ประตูเปิด ${concert.doorTime})` },
        { text: "เช็ค QR/บัตร + บัตรประชาชนอีกครั้งก่อนออกบ้าน" },
        { text: "โหลดแผนที่ offline ไว้เผื่อสัญญาณแย่ในงาน" },
        { text: "เข้าห้องน้ำก่อนเข้าฮอลล์ — คิวในงานยาวมาก" },
        { text: "สนุกกับคอนเสิร์ตให้เต็มที่! 🎵" },
      ],
    },
  ];

  return phases;
}

function currentPhaseId(daysUntil: number): string {
  if (daysUntil <= 0) return "day-of";
  if (daysUntil <= 1) return "prep-1d";
  if (daysUntil <= 7) return "prep-7d";
  if (daysUntil <= 30) return "prep-30d";
  return "got-ticket";
}

export default function PrepTimelineSection({ concert, daysUntil, ticketType, needHotel, hotelBooked }: Props) {
  const phases = buildPhases(concert, ticketType, needHotel, hotelBooked);
  const active = currentPhaseId(daysUntil);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ [active]: true });
  const [checked, setChecked] = useState<Record<string, Record<number, boolean>>>({});

  const toggle = (phaseId: string) => setExpanded((e) => ({ ...e, [phaseId]: !e[phaseId] }));
  const check = (phaseId: string, i: number) =>
    setChecked((c) => ({
      ...c,
      [phaseId]: { ...(c[phaseId] ?? {}), [i]: !(c[phaseId]?.[i] ?? false) },
    }));

  const phaseIndex = phases.findIndex((p) => p.id === active);

  return (
    <div className="dreamer-card rounded-3xl p-6 space-y-4">
      <div className="pb-3 border-b border-slate-100">
        <h4 className="font-bold text-lg text-[#1E293B] flex items-center gap-2" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
          <i className="fa-solid fa-map-signs text-[#FF007F] text-xl"></i> Concert Prep Roadmap
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">ไล่ทำตามขั้นตอน ไม่พลาดสิ่งสำคัญก่อนวันจริง</p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100 z-0"></div>

        <div className="space-y-3 relative z-10">
          {phases.map((phase, idx) => {
            const isPast = idx < phaseIndex;
            const isCurrent = phase.id === active;
            const isOpen = !!expanded[phase.id];
            const phaseChecked = checked[phase.id] ?? {};
            const checkedCount = Object.values(phaseChecked).filter(Boolean).length;

            return (
              <div key={phase.id}>
                {/* Phase header */}
                <button
                  onClick={() => toggle(phase.id)}
                  className={`w-full flex items-center gap-3 text-left transition-all`}
                >
                  {/* Circle icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isPast
                      ? "bg-slate-100 border-slate-200"
                      : isCurrent
                      ? `${phase.bg} ${phase.border}`
                      : "bg-white border-slate-200"
                  }`}>
                    <i className={`fa-solid ${isPast ? "fa-check text-slate-400" : phase.icon} text-xs ${isCurrent ? phase.color : "text-slate-400"}`}></i>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold truncate ${
                        isPast ? "text-slate-400" : isCurrent ? "text-[#1E293B]" : "text-slate-500"
                      }`}>
                        {phase.title}
                      </span>
                      {isCurrent && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#FF007F] text-white text-[9px] font-extrabold">
                          ตอนนี้
                        </span>
                      )}
                    </div>
                    {isOpen && (
                      <span className="text-[10px] text-slate-400">
                        {checkedCount}/{phase.tasks.length} รายการ
                      </span>
                    )}
                  </div>

                  <i className={`fa-solid fa-chevron-${isOpen ? "up" : "down"} text-[10px] text-slate-400 shrink-0`}></i>
                </button>

                {/* Tasks */}
                {isOpen && (
                  <div className="ml-11 mt-2 space-y-1.5">
                    {phase.tasks.map((task, i) => (
                      <label
                        key={i}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          phaseChecked[i]
                            ? "bg-slate-50 border-slate-100 opacity-60"
                            : "bg-white border-slate-100 hover:border-[#FF007F]/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!phaseChecked[i]}
                          onChange={() => check(phase.id, i)}
                          className="mt-0.5 w-3.5 h-3.5 accent-[#FF007F] shrink-0"
                        />
                        <span className={`text-[11px] text-slate-600 flex-1 ${phaseChecked[i] ? "line-through text-slate-400" : ""}`}>
                          {task.text}
                        </span>
                        {task.pending && !phaseChecked[i] && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-bold">รอข้อมูล</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
