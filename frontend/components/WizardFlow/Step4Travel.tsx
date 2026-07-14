"use client";
import type { WizardState } from "@/lib/types";

interface Props {
  state: WizardState;
  onChange: (partial: Partial<WizardState>) => void;
}

const FIELDS = [
  { key: "transportCost" as const, label: "งบการเดินทางคร่าวๆ (บาท)", icon: "fa-bus", color: "text-teal-600" },
  { key: "merchCost" as const, label: "งบของที่ระลึก / แท่งไฟ (บาท)", icon: "fa-bag-shopping", color: "text-[#FF007F]" },
  { key: "foodCost" as const, label: "งบอาหารและเบ็ดเตล็ด (บาท)", icon: "fa-bowl-food", color: "text-slate-700" },
  { key: "otherCost" as const, label: "อื่นๆ เช่น ค่าจอดรถ (บาท)", icon: "fa-plus", color: "text-amber-600" },
];

export default function Step4Travel({ state, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h3 className="font-bold text-2xl text-[#1E293B]" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
          <i className="fa-solid fa-bag-shopping text-[#FF8E53] mr-2"></i> ค่าใช้จ่ายระหว่างทริป
        </h3>
        <p className="text-xs text-slate-500">แค่ประมาณๆ ก็ได้นะ — แก้ได้อีกทีในหน้าแดชบอร์ด</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map((f) => (
          <div key={f.key} className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 block">
              <i className={`fa-solid ${f.icon} mr-1`}></i> {f.label}
            </label>
            <input
              type="number"
              value={state[f.key]}
              onChange={(e) => onChange({ [f.key]: Number(e.target.value) || 0 })}
              className={`w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-right ${f.color} focus:outline-none focus:border-[#FF007F]`}
            />
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 pl-1">
        <i className="fa-solid fa-lightbulb mr-1"></i> ประมาณการคร่าวๆ พอ ทุกช่องแก้ไขได้อีกทีในหน้าแดชบอร์ด
      </p>
    </div>
  );
}
