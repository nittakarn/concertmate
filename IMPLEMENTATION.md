# ConcertMate AI — Implementation Log

---

## Stack
- **Frontend:** Next.js + React 19 + TypeScript + Tailwind CSS v4
- **Backend:** Python FastAPI + Pydantic v2 + uvicorn

## วิธีรัน
```bash
# Terminal 1 (Backend) — รันจาก root เสมอ
cd ~/Desktop/concertmate
python backend/run.py

# Terminal 2 (Frontend)
cd ~/Desktop/concertmate/frontend
npm run dev
```

---

## สิ่งที่ implement ไปแล้ว

### Backend

| ไฟล์ | สิ่งที่ทำ |
|---|---|
| `backend/main.py` | FastAPI app + CORS (`allow_origins=["*"]`, `allow_credentials=False`) |
| `backend/run.py` | helper script รันจาก root เพื่อแก้ ImportError |
| `backend/routers/concerts.py` | GET /api/concerts, GET /api/concerts/{id} |
| `backend/routers/recommend.py` | POST /api/recommend — DSS logic: hotel ranking ก่อน → ticket DSS |
| `backend/models/concert.py` | Pydantic models ทั้งหมด |
| `backend/data/concerts.py` | ข้อมูล 4 concerts: babymonster, postmalone, straykids, brunomars |

### Frontend

| ไฟล์ | สิ่งที่ทำ |
|---|---|
| `app/page.tsx` | Main page flow: home → modal → wizard → loading → dashboard |
| `app/globals.css` | Custom styles: dreamer-card, hero-vivid, ticket-perforation, animate-bounce-in |
| `lib/api.ts` | fetchConcerts(), fetchRecommendation() → FastAPI only (Supabase ถูก revert แล้ว) |
| `lib/types.ts` | TypeScript types ทั้งหมด |
| `components/HomeScreen.tsx` | Hero section + 3 feature cards + 4 concert cards (gradient fallback ถ้าไม่มีรูป) |
| `components/ConcertModal.tsx` | Modal เลือกรอบ — hardcode `"have-ticket"` mode เท่านั้น |
| `components/WizardFlow/index.tsx` | 4-step wizard: Budget → ZonePicker → Hotel → Travel |
| `components/WizardFlow/Step1Budget.tsx` | ตั้งงบรวม (default ฿2,000) |
| `components/WizardFlow/StepZonePicker.tsx` | เลือกโซนบัตรที่มีแล้ว |
| `components/WizardFlow/Step3Hotel.tsx` | เลือก hotel priority + จำนวนคืน |
| `components/WizardFlow/Step4Travel.tsx` | งบเดินทาง + merch + อาหาร + อื่นๆ |
| `components/Dashboard/index.tsx` | Dashboard หลัก: ticket card + modal system + share + toast |
| `components/Dashboard/BudgetSection.tsx` | Pie chart + budget editor — `useMemo` fix infinite re-render |
| `components/Dashboard/HotelSection.tsx` | แสดง hotel ranking จาก API + ปุ่ม "จองที่พัก" เปิด Agoda |
| `components/Dashboard/TransitSection.tsx` | Smart Route Timeline ไป-กลับ + `wantMerch` prop |
| `components/Dashboard/ChecklistSection.tsx` | Checklist ปรับตาม ticketType + isOutdoor + daysUntil |
| `components/Dashboard/PolicySection.tsx` | กฎของงาน |
| `components/Dashboard/ShareTicketModal.tsx` | html2canvas export PNG — mobile: navigator.share, desktop: download |
| `components/Dashboard/DashCard.tsx` | Card component สำหรับแต่ละ section ใน dashboard |

---

## Bugs ที่แก้ไปแล้ว

| Bug | ไฟล์ | วิธีแก้ |
|---|---|---|
| Backend ImportError | `backend/run.py` | รันจาก root เสมอ |
| `cats` array infinite re-render | `Dashboard/BudgetSection.tsx` | wrap ด้วย `useMemo` |
| Round lookup ผิด | `Dashboard/index.tsx` | prop เป็น `roundKey`, lookup ด้วย `.key` |
| CORS error Safari | `backend/main.py` | `allow_origins=["*"]`, `allow_credentials=False` |
| Turbopack cache corruption | — | `rm -rf .next` |
| Zone hero layout แปลกๆ ชื่อยาว | `Dashboard/index.tsx` | dynamic font size + max-w-[150px] |
| Share ticket alert() | `Dashboard/ShareTicketModal.tsx` | ใช้ html2canvas แทน |
| Zone name แสดงสีภาษาไทย | `Dashboard/index.tsx`, `TicketSection.tsx`, `ShareTicketModal.tsx` | regex strip สีไทย + วงเล็บ (ไม่ใช้ `\b` เพราะไทยไม่รองรับ) |
| Hotel image โหลดไม่ได้ (hotlink) | `backend/data/concerts.py` | เปลี่ยนจาก CloudFront เป็น ahstatic.com (Accor CDN) |

---

## Features ที่เพิ่มล่าสุด

### Smart Route — wantMerch (2026-07-12)
- `TransitSection.tsx` — เพิ่ม prop `wantMerch?: boolean`
  - `true` → timeline "ออกก่อน 3–4 ชม." + item "ต่อคิวซื้อ Merchandise"
  - `false` → timeline เดิม "2–3 ชม."
- `Dashboard/index.tsx` — ส่ง `wantMerch={wizardState.merchCost > 0}`

### Hotel Images + Booking Links (2026-07-14)
- `backend/models/concert.py` — เพิ่ม field `image` และ `bookingUrl` ใน Hotel model
- `lib/types.ts` — เพิ่ม `image?` และ `bookingUrl?` ใน Hotel interface
- `backend/data/concerts.py` — อัปเดตรูปโรงแรมจริงและ Agoda link ครบทุกคอนเสิร์ต
- `Dashboard/HotelSection.tsx` — เพิ่มปุ่ม "จองที่พัก" (เปิด Agoda ใน new tab)

---

## Hotel Data Reference

### อิมแพ็ค อารีน่า (babymonster, straykids)
| โรงแรม | Image CDN | Agoda |
|--------|-----------|-------|
| Novotel Bangkok IMPACT | ahstatic.com | `/novotel-bangkok-impact-hotel/` |
| ibis Bangkok IMPACT | CloudFront ibisbangkokimpact.com | `/ibis-bangkok-impact/` |
| Popular Condo Ville C3 | Unsplash fallback | `/great-location-at-impact-arena-muangthong-thani/` |
| Amari Don Muang Airport | onyx-hospitality.com | `/amari-don-muang-airport-bangkok-hotel/` |

### ราชมังคลา (postmalone, brunomars)
| โรงแรม | Image CDN | Agoda |
|--------|-----------|-------|
| Baan Thai Boutique | ak-d.tripcdn.com | `/baan-thai-boutique-hotel/` |
| Regent Ramkhamhaeng 22 | ak-d.tripcdn.com | `/regent-ramkhamhaeng-22/` |
| Livotel Hotel Hua Mak | ak-d.tripcdn.com | `/livotel-hotel-hua-mak-bangkok/` |
| Mintel Huamark | ak-d.tripcdn.com | `/mintel/` |

---

## สิ่งที่ยังค้างอยู่

| รายการ | หมายเหตุ |
|---|---|
| Weather API จริง | ตอนนี้ใช้ hardcode `weatherNote` จาก concert data |
| Hotel score ใช้งบ/คืนจริง | `recommend.py` ใช้ hardcode ceiling 5,000 บาท ไม่ใช่งบ/คืนจริงของ user |
| straykids / brunomars seating image | `SEATING_IMAGES` ใน WizardFlow มีแค่ babymonster + postmalone |

---

### PolicySection — กฎของงาน แบบ grouped (2026-07-13)

**ไฟล์:** `frontend/components/Dashboard/PolicySection.tsx`

เปลี่ยนจาก flat list ~8 ข้อ → 4 หมวด collapsible รวม 24 กฎ ตามโปสเตอร์ RULES & REGULATIONS จริงของ IMPACT Arena

| หมวด | จำนวน | ตัวอย่างกฎ |
|------|--------|-----------|
| 📷 อุปกรณ์บันทึก | 6 | กล้อง, วิดีโอ/ไลฟ์, ขาตั้ง/ไม้เซลฟี, แท็บเล็ต, โดรน |
| ⚠️ สิ่งของอันตราย | 6 | บุหรี่/กัญชา, ไวไฟ/ดอกไม้ไฟ, เลเซอร์, ยาเสพติด, อาวุธ |
| 🎒 สิ่งของส่วนตัว | 7 | อาหารนอก, กระเป๋าใหญ่/ร่มยาว, บันได, ชุดใหญ่, สัตว์เลี้ยง |
| 📋 กฎพฤติกรรม | 5 | ป้าย unofficial, ป้ายการเมือง, ขาย merch ผิดลิขสิทธิ์ |

- กด group header → collapse/expand ทั้ง section (default: ขยายทุกหมวด)
- กดกฎแต่ละข้อ → ดูรายละเอียด (accordion เดิม)
- badge: ห้าม = แดง / ข้อควรรู้ = เหลือง / ได้ = เขียว

---

### Transit — ข้อมูลการเดินทางเพิ่มเติม (2026-07-14)

#### Data model — Transit เพิ่ม 2 optional field

| ไฟล์ | การเปลี่ยน |
|------|-----------|
| `backend/models/concert.py` | เพิ่ม `bts: Optional[str] = None` และ `boat: Optional[str] = None` |
| `frontend/lib/types.ts` | เพิ่ม `bts?: string` และ `boat?: string` ใน Transit interface |

#### IMPACT Arena (babymonster + straykids)

- **`transit.bts`**: เส้นทาง BTS สายสีชมพู → สถานีเมืองทองธานี (MT01) → CHALLENGER HALL 1 → THE PORTAL → IMPACT ARENA
- **`transit.public`**: อัปเดตครบ — สาย 166 (อนุสาวรีย์ชัยฯ ฝั่งพหลโยธิน), สาย 52 ต่อสองแถว, รถตู้จากอนุสาวรีย์ / BTS หมอชิต
- **`transit.driving`**: เพิ่มถนนแจ้งวัฒนะ และทางด่วนศรีรัช

#### ราชมังคลา (postmalone + brunomars)

- **`transit.public`**: ครบทุกสาย — ARL (หัวหมาก A4 / รามคำแหง ประตู 1), BTS→ARL พญาไท, MRT สีน้ำเงิน→มักกะสัน, MRT สีเหลือง (มหาดไทย/ลาดพร้าว 101), รถเมล์ สาย 22, 60, 71, 92, 93, 95ก, 115, 126, 137, 168, 545
- **`transit.boat`**: เรือคลองแสนแสบ → ท่ารามคำแหง หรือมหาดไทย → เดินข้ามสะพานเข้าสนาม
- **`transit.returnNote`**: เพิ่มข้อมูลหลังโชว์ — รถสองแถว/มอเตอร์ไซค์หน้าสนามรับส่ง ARL หัวหมาก / MRT พระราม 9

#### TransitSection UI (`frontend/components/Dashboard/TransitSection.tsx`)

- Card "รถไฟฟ้า / รถเมล์สาธารณะ" แสดงเป็น bullet list (split ด้วย `|`)
- `transit.bts` prepend เป็น bullet แรกในลิสต์เดียวกัน (ไม่แยก card)
- Card เรือ (สีฟ้า ไอคอน fa-ship) แสดงเฉพาะเมื่อมี `transit.boat` (ราชมังคลาเท่านั้น)

---

## นำเสนอ
วันพฤหัสบดี 2026-07-16 (นำเสนอครั้งสุดท้าย)

