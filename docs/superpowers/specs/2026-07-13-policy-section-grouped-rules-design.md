# PolicySection — Grouped Rules Design

**Date:** 2026-07-13  
**File:** `frontend/components/Dashboard/PolicySection.tsx`

## Goal

Add 18 new prohibited items sourced from the official concert RULES & REGULATIONS poster to the existing PolicySection. Organise all rules (old + new) into 4 collapsible category sections for readability.

## Approach

Grouped sections (Approach B). Each section has a collapsible header; rules inside retain the existing accordion-per-rule pattern (click to expand detail). Badges remain: ห้าม (red) / ข้อควรรู้ (amber) / ได้ (green).

## 4 Sections

### 1. 📷 อุปกรณ์บันทึก
| Rule | Type |
|------|------|
| ห้ามกล้อง DSLR / Mirrorless (existing) | prohibited |
| ห้ามบันทึกเสียง / วิดีโอ / ไลฟ์สด | prohibited |
| ห้ามขาตั้งกล้อง / ไม้เซลฟี | prohibited |
| ห้ามแท็บเล็ตขนาด 7 นิ้วขึ้นไป / แลป็อป | prohibited |
| ห้ามอากาศยานไร้คนขับ (โดรน) | prohibited |
| ถ่ายวิดีโอส่วนตัวได้ ≤ 1 นาที/คลิป ห้าม livestream (existing) | info |

### 2. ⚠️ สิ่งของอันตราย
| Rule | Type |
|------|------|
| ห้ามสูบบุหรี่ / บุหรี่ไฟฟ้า / กัญชา | prohibited |
| ห้ามวัตถุไวไฟ / ดอกไม้ไฟ | prohibited |
| ห้ามปากกาเลเซอร์ / ไฟฉาย | prohibited |
| ห้ามใช้สารเสพติดทุกชนิด | prohibited |
| ห้ามอาวุธทุกชนิด / สายโซ่เหล็ก | prohibited |
| ห้ามกระป๋อง / ขวดแก้ว / ของมีคม | prohibited |

### 3. 🎒 สิ่งของส่วนตัว
| Rule | Type |
|------|------|
| ห้ามนำอาหาร / เครื่องดื่มจากภายนอก (existing) | prohibited |
| ห้ามกระเป๋าขนาดใหญ่ / ร่มขนาดยาว | prohibited |
| ห้ามบันได / เก้าอี้พับ | prohibited |
| ห้ามเครื่องแต่งกายขนาดใหญ่ | prohibited |
| ห้ามกล่อง / ของขวัญ | prohibited |
| ห้ามสัตว์เลี้ยง | prohibited |
| พาวเวอร์แบงก์ ≤ 20,000 mAh (existing) | info |

### 4. 📋 กฎพฤติกรรม
| Rule | Type |
|------|------|
| ห้ามป้ายแบนเนอร์ผิดลิขสิทธิ์ / ป้ายไฟขนาดเกิน A4 | prohibited |
| ห้ามป้าย / สัญลักษณ์ทางการเมือง | prohibited |
| ห้ามซื้อขายสินค้าที่ระลึกผิดลิขสิทธิ์ | prohibited |
| สามารถนำ lightstick ที่ผู้จัดกำหนดได้ (existing) | allowed |
| สามารถนำ banner ขนาดเล็กได้ (existing) | allowed |

## Data Shape Change

`buildRules()` returns `RuleGroup[]` instead of `Rule[]`:

```ts
interface RuleGroup {
  id: string;
  icon: string;       // FA icon for group header
  title: string;
  rules: Rule[];
}
```

## UI State

Add `openGroups: Record<string, boolean>` state — all groups default open. Toggle per group.  
Keep existing `open: Record<number, boolean>` for individual rule accordion per group (key = `${groupIdx}-${ruleIdx}`).

## Files Changed

- `frontend/components/Dashboard/PolicySection.tsx` — only file touched
