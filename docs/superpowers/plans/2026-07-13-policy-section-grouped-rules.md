# PolicySection Grouped Rules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `PolicySection.tsx` to display all concert rules (existing 8 + 18 new from official poster) grouped into 4 collapsible category sections.

**Architecture:** Change `buildRules()` to return `RuleGroup[]` instead of `Rule[]`. Each group has a collapsible header toggle; rules inside each group retain the existing per-rule accordion (click to expand detail). Single component file, no new files needed.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Font Awesome (CDN icons already loaded)

---

## File Map

| Action | Path |
|--------|------|
| Modify | `frontend/components/Dashboard/PolicySection.tsx` |

---

### Task 1: Define `RuleGroup` type and rewrite `buildRules()`

**Files:**
- Modify: `frontend/components/Dashboard/PolicySection.tsx`

- [ ] **Step 1: Add `RuleGroup` interface and replace `buildRules()` with grouped version**

Replace the entire file content with the following (keep the `Rule` and `TYPE_BG`/`TYPE_BADGE` constants — add `RuleGroup` interface and new `buildRules`):

```tsx
"use client";
import { useState } from "react";
import type { Concert } from "@/lib/types";

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

function buildGroups(concert: Concert): RuleGroup[] {
  return [
    {
      id: "media",
      icon: "fa-camera",
      title: "อุปกรณ์บันทึก",
      rules: [
        {
          icon: "fa-camera",
          color: "text-red-500",
          label: "ห้ามกล้องทุกชนิด (DSLR / Mirrorless / Compact)",
          detail: "กล้องทุกชนิดที่ไม่ใช่กล้องโทรศัพท์ไม่อนุญาตให้นำเข้างาน",
          type: "prohibited",
        },
        {
          icon: "fa-video",
          color: "text-red-500",
          label: "ห้ามบันทึกเสียง / วิดีโอ / ไลฟ์สด",
          detail: "ห้ามใช้อุปกรณ์บันทึกเสียงหรือวิดีโอ และห้าม live broadcast ทุกรูปแบบ",
          type: "prohibited",
        },
        {
          icon: "fa-clapperboard",
          color: "text-red-500",
          label: "ห้ามขาตั้งกล้อง / ไม้เซลฟี",
          detail: "tripod และ selfie stick ทุกขนาดไม่อนุญาต รวมถึง monopod",
          type: "prohibited",
        },
        {
          icon: "fa-tablet-screen-button",
          color: "text-red-500",
          label: "ห้ามแท็บเล็ตขนาด 7 นิ้วขึ้นไป / แลป็อป",
          detail: "แท็บเล็ตที่มีหน้าจอ 7 นิ้วขึ้นไปและคอมพิวเตอร์โน้ตบุ๊กไม่อนุญาต",
          type: "prohibited",
        },
        {
          icon: "fa-plane",
          color: "text-red-500",
          label: "ห้ามอากาศยานไร้คนขับ (โดรน)",
          detail: "ห้ามนำโดรนหรืออากาศยานไร้คนขับทุกชนิดเข้าบริเวณงาน",
          type: "prohibited",
        },
        {
          icon: "fa-video",
          color: "text-amber-500",
          label: "ถ่ายวิดีโอส่วนตัวได้ไม่เกิน 1 นาที/คลิป",
          detail: "นโยบายส่วนใหญ่อนุญาตถ่ายสั้นๆ เพื่อ personal use ห้าม livestream",
          type: "info",
        },
      ],
    },
    {
      id: "danger",
      icon: "fa-triangle-exclamation",
      title: "สิ่งของอันตราย",
      rules: [
        {
          icon: "fa-smoking",
          color: "text-red-500",
          label: "ห้ามสูบบุหรี่ / บุหรี่ไฟฟ้า / กัญชา",
          detail: "ห้ามสูบบุหรี่ บุหรี่ไฟฟ้า vape และผลิตภัณฑ์กัญชาทุกรูปแบบในบริเวณงาน",
          type: "prohibited",
        },
        {
          icon: "fa-fire",
          color: "text-red-500",
          label: "ห้ามวัตถุไวไฟ / ดอกไม้ไฟ",
          detail: "ห้ามนำวัตถุไวไฟ สเปรย์แรงดัน ดอกไม้ไฟ หรืออุปกรณ์ที่ก่อให้เกิดเปลวไฟทุกชนิด",
          type: "prohibited",
        },
        {
          icon: "fa-wand-sparkles",
          color: "text-red-500",
          label: "ห้ามปากกาเลเซอร์ / ไฟฉาย",
          detail: "ปากกาเลเซอร์และไฟฉายทุกชนิดไม่อนุญาต เนื่องจากอาจรบกวนความปลอดภัย",
          type: "prohibited",
        },
        {
          icon: "fa-pills",
          color: "text-red-500",
          label: "ห้ามใช้สารเสพติดทุกชนิด",
          detail: "ห้ามนำและใช้สารเสพติดทุกประเภทภายในบริเวณงาน ฝ่าฝืนจะถูกดำเนินการทางกฎหมาย",
          type: "prohibited",
        },
        {
          icon: "fa-gun",
          color: "text-red-500",
          label: "ห้ามอาวุธทุกชนิด / สายโซ่เหล็ก",
          detail: "ห้ามอาวุธ มีด กรรไกร สายโซ่เหล็ก และวัตถุที่อาจใช้เป็นอาวุธทุกชนิด",
          type: "prohibited",
        },
        {
          icon: "fa-wine-bottle",
          color: "text-red-500",
          label: "ห้ามกระป๋อง / ขวดแก้ว / ของมีคม",
          detail: "กระป๋องโลหะ ขวดแก้ว และของมีคมทุกชนิดไม่อนุญาตให้นำเข้างาน",
          type: "prohibited",
        },
      ],
    },
    {
      id: "items",
      icon: "fa-bag-shopping",
      title: "สิ่งของส่วนตัว",
      rules: [
        {
          icon: "fa-burger",
          color: "text-red-500",
          label: "ห้ามนำอาหาร / เครื่องดื่มจากภายนอก",
          detail: "อาหารและเครื่องดื่มจากภายนอกไม่อนุญาต มีจำหน่ายภายในงาน",
          type: "prohibited",
        },
        {
          icon: "fa-umbrella",
          color: "text-red-500",
          label: "ห้ามกระเป๋าขนาดใหญ่ / ร่มขนาดยาว",
          detail: "กระเป๋าขนาดเกิน A4 และร่มแบบยาว (ไม่ใช่ร่มพับ) ไม่อนุญาต",
          type: "prohibited",
        },
        {
          icon: "fa-chair",
          color: "text-red-500",
          label: "ห้ามบันได / เก้าอี้พับ",
          detail: "บันไดและเก้าอี้พับทุกชนิดไม่อนุญาต เนื่องจากบดบังสายตาผู้อื่น",
          type: "prohibited",
        },
        {
          icon: "fa-person",
          color: "text-red-500",
          label: "ห้ามเครื่องแต่งกายขนาดใหญ่",
          detail: "ชุดแฟนซีหรืออุปกรณ์ประดับกายที่มีขนาดใหญ่ผิดปกติไม่อนุญาต",
          type: "prohibited",
        },
        {
          icon: "fa-box",
          color: "text-red-500",
          label: "ห้ามกล่อง / ของขวัญ",
          detail: "ห้ามนำกล่องของขวัญและพัสดุขนาดใหญ่เข้างาน เพื่อเหตุผลด้านความปลอดภัย",
          type: "prohibited",
        },
        {
          icon: "fa-paw",
          color: "text-red-500",
          label: "ห้ามสัตว์เลี้ยง",
          detail: "ห้ามนำสัตว์เลี้ยงทุกชนิดเข้าบริเวณงาน ยกเว้นสุนัขนำทางพร้อมเอกสารรับรอง",
          type: "prohibited",
        },
        {
          icon: "fa-battery-full",
          color: "text-amber-500",
          label: "พาวเวอร์แบงก์ไม่เกิน 20,000 mAh",
          detail: "ความจุเกินกำหนดอาจโดนยึดหน้าประตู ตรวจสอบตัวเลขบน label ก่อนออกบ้าน",
          type: "info",
        },
      ],
    },
    {
      id: "conduct",
      icon: "fa-flag",
      title: "กฎพฤติกรรม",
      rules: [
        {
          icon: "fa-flag",
          color: "text-red-500",
          label: "ห้ามป้ายแบนเนอร์ผิดลิขสิทธิ์ / ป้ายไฟขนาดเกิน A4",
          detail: "ป้ายแบนเนอร์ที่ไม่ใช่ official merch และป้ายไฟทุกชนิดขนาดเกิน A4 ไม่อนุญาต",
          type: "prohibited",
        },
        {
          icon: "fa-landmark",
          color: "text-red-500",
          label: "ห้ามป้าย / สัญลักษณ์ทางการเมือง",
          detail: "ป้าย สัญลักษณ์ หรือสิ่งที่มีเนื้อหาทางการเมืองทุกรูปแบบไม่อนุญาต",
          type: "prohibited",
        },
        {
          icon: "fa-store-slash",
          color: "text-red-500",
          label: "ห้ามซื้อขายสินค้าที่ระลึกผิดลิขสิทธิ์",
          detail: "ห้ามซื้อ ขาย หรือแจกจ่ายสินค้า unofficial ในบริเวณงาน",
          type: "prohibited",
        },
        {
          icon: "fa-circle-check",
          color: "text-emerald-500",
          label: "สามารถนำ lightstick ที่ผู้จัดกำหนดได้",
          detail: "Lightstick ขนาดมาตรฐานที่ผู้จัดระบุ หรือขายในงาน อนุญาตให้นำเข้า",
          type: "allowed",
        },
        {
          icon: "fa-circle-check",
          color: "text-emerald-500",
          label: "สามารถนำ banner ขนาดเล็กได้",
          detail: "Banner/sign ขนาดไม่เกิน A4 และไม่มีไม้/ก้านเหล็ก อนุญาตในส่วนใหญ่",
          type: "allowed",
        },
      ],
    },
  ];
}

const TYPE_BG: Record<Rule["type"], string> = {
  prohibited: "bg-red-50 border-red-100",
  allowed: "bg-emerald-50 border-emerald-100",
  info: "bg-amber-50 border-amber-100",
};

const TYPE_BADGE: Record<Rule["type"], { label: string; cls: string }> = {
  prohibited: { label: "ห้าม", cls: "bg-red-100 text-red-600" },
  allowed: { label: "ได้", cls: "bg-emerald-100 text-emerald-600" },
  info: { label: "ข้อควรรู้", cls: "bg-amber-100 text-amber-700" },
};

const GROUP_COLOR: Record<string, string> = {
  media: "text-indigo-500 bg-indigo-50 border-indigo-100",
  danger: "text-red-500 bg-red-50 border-red-100",
  items: "text-amber-500 bg-amber-50 border-amber-100",
  conduct: "text-violet-500 bg-violet-50 border-violet-100",
};

export default function PolicySection({ concert }: Props) {
  const groups = buildGroups(concert);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.id, true]))
  );
  const [openRules, setOpenRules] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) =>
    setOpenGroups((s) => ({ ...s, [id]: !s[id] }));
  const toggleRule = (key: string) =>
    setOpenRules((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="dreamer-card rounded-3xl p-6 space-y-5">
      <div className="pb-3 border-b border-slate-100">
        <h4
          className="font-bold text-lg text-[#1E293B] flex items-center gap-2"
          style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}
        >
          <i className="fa-solid fa-shield-halved text-[#4F46E5] text-xl"></i>{" "}
          กฎ & Policy สถานที่
        </h4>
        <p className="text-[10px] text-slate-400 mt-0.5">
          กฎของงานคอนเสิร์ต — อ่านก่อนเข้างาน
        </p>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="space-y-1.5">
            {/* Group header */}
            <button
              onClick={() => toggleGroup(group.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left ${GROUP_COLOR[group.id]}`}
            >
              <i className={`fa-solid ${group.icon} text-sm shrink-0`}></i>
              <span
                className="flex-1 text-[11px] font-extrabold uppercase tracking-wider"
                style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}
              >
                {group.title}
              </span>
              <span className="text-[10px] text-slate-400 font-normal normal-case tracking-normal">
                {group.rules.length} ข้อ
              </span>
              <i
                className={`fa-solid fa-chevron-${openGroups[group.id] ? "up" : "down"} text-[9px] text-slate-400`}
              ></i>
            </button>

            {/* Rules inside group */}
            {openGroups[group.id] && (
              <div className="space-y-1.5 pl-2">
                {group.rules.map((rule, i) => {
                  const key = `${group.id}-${i}`;
                  return (
                    <div
                      key={key}
                      className={`rounded-xl border overflow-hidden ${TYPE_BG[rule.type]}`}
                    >
                      <button
                        onClick={() => toggleRule(key)}
                        className="w-full flex items-center gap-3 p-3 text-left"
                      >
                        <i
                          className={`fa-solid ${rule.icon} ${rule.color} text-sm shrink-0 w-4`}
                        ></i>
                        <span className="flex-1 text-[11px] font-bold text-slate-700">
                          {rule.label}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${TYPE_BADGE[rule.type].cls}`}
                        >
                          {TYPE_BADGE[rule.type].label}
                        </span>
                        <i
                          className={`fa-solid fa-chevron-${openRules[key] ? "up" : "down"} text-[9px] text-slate-400 ml-1`}
                        ></i>
                      </button>
                      {openRules[key] && (
                        <div className="px-4 pb-3">
                          <p className="text-[10.5px] text-slate-600 leading-relaxed">
                            {rule.detail}
                          </p>
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
        นโยบายขึ้นอยู่กับผู้จัดและสถานที่จริง ควรเช็ค official announcement อีกครั้งก่อนวันงาน
      </p>
    </div>
  );
}
```

Note: The `Props` interface at the top of the file stays unchanged — only replace from `interface Rule` onwards.

- [ ] **Step 2: Type-check**

```bash
cd /Users/nittakarn/Desktop/concertmate/frontend && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Add `Props` interface back at the top (it was removed in the paste)**

The full file must start with:
```tsx
"use client";
import { useState } from "react";
import type { Concert } from "@/lib/types";

interface Props {
  concert: Concert;
}
```

Then `interface Rule { ... }` follows.

- [ ] **Step 4: Visual verify — start dev server and open modal**

```bash
cd /Users/nittakarn/Desktop/concertmate/frontend && npm run dev
```

Open `http://localhost:3000`, pick a concert, complete the wizard, then click the **"กฎของงาน"** card on the dashboard.

Expected:
- 4 collapsible section headers visible (อุปกรณ์บันทึก / สิ่งของอันตราย / สิ่งของส่วนตัว / กฎพฤติกรรม)
- Each header shows rule count (e.g. "6 ข้อ")
- Clicking header collapses/expands its rules
- Clicking a rule item expands its detail text
- Badge colours correct: red = ห้าม, amber = ข้อควรรู้, green = ได้
