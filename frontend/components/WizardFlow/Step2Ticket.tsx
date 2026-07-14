"use client";
import type { Concert, WizardState } from "@/lib/types";

interface Props {
  concert: Concert;
  state: WizardState;
  onChange: (partial: Partial<WizardState>) => void;
}

const TICKET_PREF_OPTIONS: Record<string, { label: string; attr: string }[]> = {
  VIP: [
    { label: "อยากได้ตำแหน่งใกล้สเตจที่สุด", attr: "closest" },
    { label: "ต้องการลุ้นเข้าร่วม Soundcheck / กิจกรรมพิเศษ VIP", attr: "perk" },
    { label: "อยากได้ของที่ระลึกเฉพาะสิทธิ์ VIP", attr: "perk" },
  ],
  Seated: [
    { label: "เน้นมุมมองเห็นเวทีชัดไม่มีอะไรบัง", attr: "closest" },
    { label: "เน้นบรรยากาศทะเลไฟทั้งฮอลล์แบบมุมสูง", attr: "panoramic" },
    { label: "เน้นราคาประหยัดที่สุดในโซนนั่ง", attr: "cheapest" },
  ],
  Standing: [
    { label: "เน้นเข้าใกล้สเตจโซนยืนให้มากที่สุด", attr: "closest" },
    { label: "อยากโบกแท่งไฟ เต้น ขยับตัวได้เต็มที่", attr: "energy" },
    { label: "เน้นออกจากงานได้เร็ว หนีรถติดขากลับ", attr: "easyexit" },
  ],
};

const TICKET_TYPES = [
  { value: "VIP", label: "VIP Package", icon: "fa-crown" },
  { value: "Seated", label: "บัตรนั่ง Standard", icon: "fa-chair" },
  { value: "Standing", label: "บัตรยืนแดนซ์", icon: "fa-person-running" },
];

export default function Step2Ticket({ concert, state, onChange }: Props) {
  const hasType = (type: string) => concert.prices.some((p) => p.type === type);

  const togglePref = (attr: string) => {
    const next = state.ticketPrefs.includes(attr)
      ? state.ticketPrefs.filter((a) => a !== attr)
      : [...state.ticketPrefs, attr];
    onChange({ ticketPrefs: next });
  };

  const setTicketType = (type: string) => {
    const defaultPref = TICKET_PREF_OPTIONS[type]?.[0]?.attr ?? "";
    onChange({ ticketType: type, ticketPrefs: defaultPref ? [defaultPref] : [] });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h3 className="font-bold text-2xl text-[#1E293B]" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
          <i className="fa-solid fa-ticket text-[#4F46E5] mr-2"></i> สไตล์ตั๋วที่ต้องการ
        </h3>
        <p className="text-xs text-slate-500">เลือกประเภทบัตรที่ตรงกับสไตล์การดูคอนเสิร์ตของคุณ</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {TICKET_TYPES.filter((t) => hasType(t.value)).map((t) => (
          <label key={t.value} className="cursor-pointer text-center">
            <input
              type="radio"
              name="ticketType"
              value={t.value}
              checked={state.ticketType === t.value}
              onChange={() => setTicketType(t.value)}
              className="sr-only"
            />
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                state.ticketType === t.value
                  ? "border-[#FF007F] bg-[#FFF0F6]"
                  : "border-slate-200 bg-white hover:border-[#FF007F]"
              }`}
            >
              <span className="text-2xl block mb-1">
                <i className={`fa-solid ${t.icon}`}></i>
              </span>
              <span className="font-bold text-xs text-[#1E293B]">{t.label}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 block">
          <i className="fa-solid fa-bullseye mr-1"></i> ติ๊กสิ่งที่คุณต้องการเสริมเป็นพิเศษ:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {(TICKET_PREF_OPTIONS[state.ticketType] || []).map((opt, i) => (
            <label key={i} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={state.ticketPrefs.includes(opt.attr)}
                onChange={() => togglePref(opt.attr)}
                className="w-4 h-4 rounded accent-[#FF007F]"
              />
              <span className="text-[11px] text-slate-600">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
