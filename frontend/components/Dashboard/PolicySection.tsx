"use client";
import { useState } from "react";
import type { Concert } from "@/lib/types";

interface Props {
  concert: Concert;
}

interface Rule {
  icon: string;
  color: string;
  label: string;
  detail: string;
  type: "prohibited" | "allowed" | "info";
}

interface RuleGroup {
  id: string;
  icon: string;
  title: string;
  rules: Rule[];
}

const SHARED_DANGER: Rule[] = [
  { icon: "fa-ban",          color: "text-red-500", label: "ห้ามสูบบุหรี่ / บุหรี่ไฟฟ้า / vape",    detail: "ห้ามสูบบุหรี่ บุหรี่ไฟฟ้า และ vape ทุกรูปแบบในบริเวณงาน",                                     type: "prohibited" },
  { icon: "fa-fire",         color: "text-red-500", label: "ห้ามดอกไม้ไฟ / pyro / วัตถุไวไฟ",       detail: "สเปรย์แรงดัน ดอกไม้ไฟ และวัตถุไวไฟทุกชนิดไม่อนุญาต",                                          type: "prohibited" },
  { icon: "fa-star",         color: "text-red-500", label: "ห้ามปากกาเลเซอร์ / ไฟฉาย",             detail: "Laser pointer และไฟฉายทุกชนิดไม่อนุญาต เนื่องจากรบกวนความปลอดภัย",                             type: "prohibited" },
  { icon: "fa-pills",        color: "text-red-500", label: "ห้ามสารเสพติดทุกชนิด",                 detail: "ห้ามนำและใช้สารเสพติด ฝ่าฝืนถูกดำเนินคดีตามกฎหมายไทย",                                         type: "prohibited" },
  { icon: "fa-shield-halved",color: "text-red-500", label: "ห้ามอาวุธ / ของมีคม / สายโซ่",         detail: "ห้ามอาวุธ มีด กรรไกร สายโซ่ และวัตถุที่อาจใช้เป็นอาวุธทุกชนิด",                               type: "prohibited" },
  { icon: "fa-wine-bottle",  color: "text-red-500", label: "ห้ามกระป๋องโลหะ / ขวดแก้ว",            detail: "กระป๋องโลหะและขวดแก้วทุกชนิดไม่อนุญาต",                                                         type: "prohibited" },
];

const SHARED_CONDUCT: Rule[] = [
  { icon: "fa-flag",         color: "text-red-500",    label: "ห้ามป้าย / banner ขนาดเกิน A4",       detail: "ป้ายที่ใหญ่กว่า A4 หรือมีก้าน/ไม้ไม่อนุญาต",                                                   type: "prohibited" },
  { icon: "fa-landmark",     color: "text-red-500",    label: "ห้ามสัญลักษณ์ทางการเมือง",            detail: "ป้ายหรือสัญลักษณ์ที่มีเนื้อหาทางการเมืองทุกรูปแบบไม่อนุญาต",                                   type: "prohibited" },
  { icon: "fa-tag",          color: "text-red-500",    label: "ห้ามซื้อขายสินค้าผิดลิขสิทธิ์",       detail: "ห้ามซื้อ ขาย หรือแจกสินค้า unofficial ในบริเวณงาน",                                             type: "prohibited" },
  { icon: "fa-circle-check", color: "text-emerald-500",label: "Lightstick อนุญาต",                   detail: "Official lightstick ที่ผู้จัดกำหนดอนุญาตให้นำเข้า",                                             type: "allowed"    },
  { icon: "fa-circle-check", color: "text-emerald-500",label: "Fan banner ≤ A4 อนุญาต (ไม่มีก้าน)", detail: "Banner/sign ขนาดไม่เกิน A4 และไม่มีก้าน/ไม้อนุญาตในส่วนใหญ่",                                  type: "allowed"    },
];

function buildGroups(concert: Concert): RuleGroup[] {
  const cid = concert.id;

  /* ── XG — IMPACT Arena, iMe Thailand (Japanese-artist standard) ── */
  if (cid === "xg") {
    return [
      {
        id: "media", icon: "fa-camera", title: "อุปกรณ์บันทึก",
        rules: [
          { icon: "fa-camera",             color: "text-red-500",   label: "ห้ามกล้อง DSLR / Mirrorless / GoPro / Compact",      detail: "กล้องทุกชนิดที่ไม่ใช่กล้องโทรศัพท์ไม่อนุญาต รวม action cam ทุกรุ่น",                                            type: "prohibited" },
          { icon: "fa-magnifying-glass",   color: "text-red-500",   label: "ห้ามเลนส์แยก (clip-on lens) สำหรับโทรศัพท์",         detail: "Clip-on telephoto/wide-angle lens สำหรับโทรศัพท์ไม่อนุญาต",                                                      type: "prohibited" },
          { icon: "fa-tablet-screen-button",color:"text-red-500",   label: "ห้ามแท็บเล็ต 7 นิ้วขึ้นไป / แล็ปท็อป",             detail: "อุปกรณ์หน้าจอขนาด 7 นิ้วขึ้นไปและ laptop ไม่อนุญาต",                                                            type: "prohibited" },
          { icon: "fa-expand",             color: "text-red-500",   label: "ห้ามไม้เซลฟี / ขาตั้งกล้อง / monopod",               detail: "Selfie stick, tripod, monopod ทุกขนาดไม่อนุญาต",                                                                  type: "prohibited" },
          { icon: "fa-plane",              color: "text-red-500",   label: "ห้ามโดรน / อากาศยานไร้คนขับ",                        detail: "ห้ามนำโดรนและอุปกรณ์บินไร้คนขับทุกชนิด",                                                                        type: "prohibited" },
          { icon: "fa-video",              color: "text-red-500",   label: "ห้ามบันทึกวิดีโอ / ไลฟ์สด (มาตรฐาน Japanese Artist)",detail: "iMe Thailand ใช้นโยบาย strict — ห้ามบันทึกวิดีโอและ livestream เช็ค @imethai บน social media ก่อนวันงาน",          type: "prohibited" },
          { icon: "fa-mobile-screen",      color: "text-amber-500", label: "ถ่ายรูปโทรศัพท์ — ติดตาม iMe Thailand ก่อนงาน",      detail: "นโยบายกล้องโทรศัพท์ยังไม่ประกาศอย่างเป็นทางการ ติดตาม Facebook / X : @imethai เพื่ออัปเดต",                       type: "info"      },
        ],
      },
      { id: "danger", icon: "fa-triangle-exclamation", title: "สิ่งของอันตราย", rules: SHARED_DANGER },
      {
        id: "items", icon: "fa-bag-shopping", title: "สิ่งของส่วนตัว",
        rules: [
          { icon: "fa-arrow-up",     color: "text-red-500",   label: "ห้ามเก้าอี้พับ / บันได",                               detail: "เก้าอี้พับและบันไดทุกชนิดไม่อนุญาต เนื่องจากบดบังสายตาผู้อื่น",                                                   type: "prohibited" },
          { icon: "fa-burger",       color: "text-red-500",   label: "ห้ามนำอาหาร / เครื่องดื่มจากภายนอก",                  detail: "อาหารและเครื่องดื่มจากภายนอกไม่อนุญาต มีจำหน่ายภายในงาน",                                                         type: "prohibited" },
          { icon: "fa-paw",          color: "text-red-500",   label: "ห้ามสัตว์เลี้ยง",                                     detail: "ห้ามนำสัตว์เลี้ยงทุกชนิด ยกเว้นสุนัขนำทางพร้อมเอกสารรับรอง",                                                     type: "prohibited" },
          { icon: "fa-bag-shopping", color: "text-amber-500", label: "กระเป๋าขนาดเล็ก — เช็คขนาดที่อนุญาตจาก iMe Thailand", detail: "ขนาดที่อนุญาตจะประกาศก่อนงาน แนะนำนำกระเป๋าขนาด A4 หรือเล็กกว่า",                                               type: "info"      },
          { icon: "fa-umbrella",     color: "text-amber-500", label: "ห้ามร่มยาว — ร่มพับพกพาได้",                           detail: "ร่มแบบยาว (classic) ไม่อนุญาต นำเฉพาะร่มพับขนาดพกพา",                                                              type: "info"      },
          { icon: "fa-battery-full", color: "text-amber-500", label: "พาวเวอร์แบงก์ไม่เกิน 20,000 mAh",                     detail: "ความจุเกินกำหนดอาจโดนยึดหน้าประตู ตรวจสอบตัวเลขบน label ก่อน",                                                     type: "info"      },
        ],
      },
      { id: "conduct", icon: "fa-flag", title: "กฎพฤติกรรม", rules: SHARED_CONDUCT },
    ];
  }

  /* ── BABYMONSTER — IMPACT Arena, Live Nation Tero ── */
  if (cid === "babymonster") {
    return [
      {
        id: "media", icon: "fa-camera", title: "อุปกรณ์บันทึก",
        rules: [
          { icon: "fa-camera",              color: "text-red-500",    label: "ห้ามกล้องทุกประเภท / อุปกรณ์วิดีโอ / อุปกรณ์บันทึกภาพ", detail: "ThaiTicketMajor ประกาศ: 'ห้ามนำกล้องถ่ายรูปทุกประเภท อุปกรณ์วิดีโอและอุปกรณ์บันทึกภาพเข้าในพื้นที่การแสดง'",       type: "prohibited" },
          { icon: "fa-magnifying-glass",    color: "text-red-500",    label: "ห้ามเลนส์แยก (clip-on lens) สำหรับโทรศัพท์",              detail: "Clip-on telephoto/wide-angle lens สำหรับโทรศัพท์ไม่อนุญาต (มาตรฐาน Live Nation BABYMONSTER World Tour)",               type: "prohibited" },
          { icon: "fa-tablet-screen-button",color: "text-red-500",    label: "ห้ามแท็บเล็ต / แล็ปท็อป",                               detail: "Tablet ทุกขนาดและ laptop ไม่อนุญาต (มาตรฐาน Live Nation BABYMONSTER World Tour)",                                       type: "prohibited" },
          { icon: "fa-expand",              color: "text-red-500",    label: "ห้ามไม้เซลฟี / ขาตั้งกล้อง",                            detail: "Selfie stick, tripod, monopod ทุกชนิดไม่อนุญาต",                                                                        type: "prohibited" },
          { icon: "fa-plane",               color: "text-red-500",    label: "ห้ามโดรน / อากาศยานไร้คนขับ",                           detail: "ห้ามนำโดรนและอุปกรณ์บินไร้คนขับทุกชนิด",                                                                               type: "prohibited" },
          { icon: "fa-video",               color: "text-red-500",    label: "ห้ามบันทึกวิดีโอ / ไลฟ์สด",                             detail: "ห้าม video recording และ live broadcast ทุกรูปแบบ",                                                                      type: "prohibited" },
          { icon: "fa-mobile-screen",       color: "text-emerald-500",label: "โทรศัพท์มือถือ ถ่ายรูปได้",                             detail: "ThaiTicketMajor ยืนยัน: smartphone cameras are permitted — แนะนำปิดแฟลชเพื่อไม่รบกวนผู้อื่น",                          type: "allowed"   },
        ],
      },
      { id: "danger", icon: "fa-triangle-exclamation", title: "สิ่งของอันตราย", rules: SHARED_DANGER },
      {
        id: "items", icon: "fa-bag-shopping", title: "สิ่งของส่วนตัว",
        rules: [
          { icon: "fa-arrow-up",     color: "text-red-500",   label: "ห้ามเก้าอี้พับ / บันได",                                 detail: "เก้าอี้พับและบันไดทุกชนิดไม่อนุญาต",                                                               type: "prohibited" },
          { icon: "fa-burger",       color: "text-red-500",   label: "ห้ามนำอาหาร / เครื่องดื่มจากภายนอก",                    detail: "อาหารและเครื่องดื่มจากภายนอกไม่อนุญาต มีจำหน่ายภายในงาน",                                         type: "prohibited" },
          { icon: "fa-paw",          color: "text-red-500",   label: "ห้ามสัตว์เลี้ยง",                                       detail: "ห้ามนำสัตว์เลี้ยงทุกชนิด ยกเว้นสุนัขนำทางพร้อมเอกสารรับรอง",                                     type: "prohibited" },
          { icon: "fa-bag-shopping", color: "text-amber-500", label: "กระเป๋าขนาดไม่เกิน 38×30×20 cm",                    detail: "มาตรฐาน Live Nation BABYMONSTER World Tour — กระเป๋าที่ใหญ่กว่านี้ไม่ผ่านประตู",                     type: "info"      },
          { icon: "fa-umbrella",     color: "text-amber-500", label: "ห้ามร่มยาว — ร่มพับพกพาได้",                     detail: "ร่มแบบยาว (classic) ไม่อนุญาต นำเฉพาะร่มพับขนาดพกพา",                                              type: "info"      },
          { icon: "fa-droplet",      color: "text-amber-500", label: "เครื่องดื่มในขวด — ต้องเปิดฝาก่อนเข้างาน",      detail: "มาตรฐาน Live Nation BABYMONSTER World Tour — ขวดน้ำที่ได้รับอนุญาตต้องเปิดฝาออกก่อนผ่านประตู",   type: "info"      },
          { icon: "fa-battery-full", color: "text-amber-500", label: "พาวเวอร์แบงก์ไม่เกิน 20,000 mAh",               detail: "ความจุเกินกำหนดอาจโดนยึดหน้าประตู ตรวจสอบตัวเลขบน label ก่อน",                                 type: "info"      },
        ],
      },
      { id: "conduct", icon: "fa-flag", title: "กฎพฤติกรรม", rules: SHARED_CONDUCT },
    ];
  }

  /* ── Post Malone / The Weeknd — Rajamangala Stadium (Outdoor, Live Nation Tero) ── */
  return [
    {
      id: "media", icon: "fa-camera", title: "อุปกรณ์บันทึก",
      rules: [
        { icon: "fa-camera",          color: "text-red-500",   label: "ห้ามกล้อง DSLR / Mirrorless / กล้องถอดเลนส์ได้", detail: "กล้อง professional ทุกชนิดที่ถอดเลนส์ได้ไม่อนุญาต กล้อง compact / กล้องโทรศัพท์ใช้ได้",         type: "prohibited" },
        { icon: "fa-expand",          color: "text-red-500",   label: "ห้ามไม้เซลฟี / ขาตั้งกล้อง",                    detail: "Selfie stick, tripod, monopod ทุกชนิดไม่อนุญาต (มาตรฐาน Live Nation Tero)",                       type: "prohibited" },
        { icon: "fa-plane",           color: "text-red-500",   label: "ห้ามโดรน / อากาศยานไร้คนขับ",                   detail: "ห้ามนำโดรนและอุปกรณ์บินไร้คนขับทุกชนิดเข้าบริเวณงาน",                                           type: "prohibited" },
        { icon: "fa-video",           color: "text-amber-500", label: "วิดีโอส่วนตัวสั้นๆ ได้ — ห้ามไลฟ์สด",           detail: "Live Nation Tero อนุญาตถ่ายวิดีโอสั้นๆ เพื่อ personal use แต่ห้าม livestream / commercial recording", type: "info"      },
      ],
    },
    { id: "danger", icon: "fa-triangle-exclamation", title: "สิ่งของอันตราย", rules: SHARED_DANGER },
    {
      id: "items", icon: "fa-bag-shopping", title: "สิ่งของส่วนตัว",
      rules: [
        { icon: "fa-burger",       color: "text-red-500",     label: "ห้ามนำอาหาร / เครื่องดื่มจากภายนอก",           detail: "อาหารและเครื่องดื่มจากภายนอกไม่อนุญาต มีจำหน่ายภายในงาน",                                           type: "prohibited" },
        { icon: "fa-paw",          color: "text-red-500",     label: "ห้ามสัตว์เลี้ยง",                              detail: "ห้ามนำสัตว์เลี้ยงทุกชนิด ยกเว้นสุนัขนำทางพร้อมเอกสารรับรอง",                                     type: "prohibited" },
        { icon: "fa-bag-shopping", color: "text-amber-500",   label: "กระเป๋าขนาดเล็ก — เช็คขนาดจาก Live Nation Tero", detail: "Live Nation Tero จะประกาศขนาดที่อนุญาตก่อนงาน แนะนำกระเป๋า A4 หรือเล็กกว่า",                      type: "info"      },
        { icon: "fa-battery-full", color: "text-amber-500",   label: "พาวเวอร์แบงก์ไม่เกิน 20,000 mAh",              detail: "ความจุเกินกำหนดอาจโดนยึดหน้าประตู ตรวจสอบตัวเลขบน label ก่อน",                                   type: "info"      },
        { icon: "fa-umbrella",     color: "text-emerald-500", label: "ร่มพับพกได้ — งานกลางแจ้ง",                    detail: "ร่มพับขนาดพกพาอนุญาต (outdoor stadium) สนามเปิดโล่ง ฝนตกได้ตลอดช่วงงาน",                         type: "allowed"   },
      ],
    },
    { id: "conduct", icon: "fa-flag", title: "กฎพฤติกรรม", rules: SHARED_CONDUCT },
  ];
}

const SOURCE_LABEL: Record<string, string> = {
  xg:          "อ้างอิง: iMe Thailand — เช็ค @imethai ก่อนวันงาน (July 19)",
  babymonster: "อ้างอิง: ThaiTicketMajor / Live Nation Tero Thailand — เช็ค official announcement ก่อนวันงาน (Nov 7-8)",
  postmalone:  "อ้างอิง: Live Nation Tero — เช็ค official announcement ก่อนวันงาน (Sep 22)",
  theweeknd:   "อ้างอิง: Live Nation Tero — เช็ค official announcement ก่อนวันงาน (The Weeknd)",
};

const TYPE_BG: Record<Rule["type"], string> = {
  prohibited: "bg-red-50 border-red-100",
  allowed:    "bg-emerald-50 border-emerald-100",
  info:       "bg-amber-50 border-amber-100",
};

const TYPE_BADGE: Record<Rule["type"], { label: string; cls: string }> = {
  prohibited: { label: "ห้าม",     cls: "bg-red-100 text-red-600"       },
  allowed:    { label: "ได้",       cls: "bg-emerald-100 text-emerald-600"},
  info:       { label: "ข้อควรรู้", cls: "bg-amber-100 text-amber-700"   },
};

const GROUP_STYLE: Record<string, string> = {
  media:   "text-indigo-600 bg-indigo-50 border-indigo-200",
  danger:  "text-red-600 bg-red-50 border-red-200",
  items:   "text-amber-600 bg-amber-50 border-amber-200",
  conduct: "text-violet-600 bg-violet-50 border-violet-200",
};

export default function PolicySection({ concert }: Props) {
  const groups = buildGroups(concert);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.id, true]))
  );
  const [openRules, setOpenRules] = useState<Record<string, boolean>>({});

  return (
    <div className="dreamer-card rounded-3xl p-6 space-y-5">
      <div className="pb-3 border-b border-slate-100">
        <h4
          className="font-bold text-lg text-[#1E293B] flex items-center gap-2"
          style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}
        >
          <i className="fa-solid fa-shield-halved text-[#4F46E5] text-xl"></i> กฎ & Policy ของงาน
        </h4>
        <p className="text-[10px] text-slate-400 mt-0.5">อ่านก่อนเข้างาน — กฎของ{concert.name}</p>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id}>
            <button
              onClick={() => setOpenGroups((s) => ({ ...s, [group.id]: !s[group.id] }))}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left mb-1.5 ${GROUP_STYLE[group.id]}`}
            >
              <i className={`fa-solid ${group.icon} text-sm shrink-0`}></i>
              <span
                className="flex-1 text-[11px] font-extrabold uppercase tracking-wider"
                style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}
              >
                {group.title}
              </span>
              <span className="text-[10px] opacity-60 font-normal normal-case tracking-normal">
                {group.rules.length} ข้อ
              </span>
              <i className={`fa-solid fa-chevron-${openGroups[group.id] ? "up" : "down"} text-[9px] opacity-50 ml-1`}></i>
            </button>

            {openGroups[group.id] && (
              <div className="space-y-1.5 pl-2">
                {group.rules.map((rule, i) => {
                  const key = `${group.id}-${i}`;
                  return (
                    <div key={key} className={`rounded-xl border overflow-hidden ${TYPE_BG[rule.type]}`}>
                      <button
                        onClick={() => setOpenRules((s) => ({ ...s, [key]: !s[key] }))}
                        className="w-full flex items-center gap-3 p-3 text-left"
                      >
                        <i className={`fa-solid ${rule.icon} ${rule.color} text-sm shrink-0 w-4`}></i>
                        <span className="flex-1 text-[11px] font-bold text-slate-700">{rule.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${TYPE_BADGE[rule.type].cls}`}>
                          {TYPE_BADGE[rule.type].label}
                        </span>
                        <i className={`fa-solid fa-chevron-${openRules[key] ? "up" : "down"} text-[9px] text-slate-400 ml-1`}></i>
                      </button>
                      {openRules[key] && (
                        <div className="px-4 pb-3">
                          <p className="text-[10.5px] text-slate-600 leading-relaxed">{rule.detail}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 flex items-start gap-1.5">
        <i className="fa-solid fa-circle-exclamation shrink-0 mt-0.5"></i>
        {SOURCE_LABEL[concert.id] ?? "เช็ค official announcement ของผู้จัดอีกครั้งก่อนวันงาน"}
      </p>
    </div>
  );
}
