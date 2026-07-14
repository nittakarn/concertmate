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
| `components/HomeScreen.tsx` | Hero section + 5 feature cards + 4 concert cards (gradient fallback ถ้าไม่มีรูป) |
| `components/ConcertModal.tsx` | Modal เลือกรอบ — hardcode `"have-ticket"` mode เท่านั้น |
| `components/WizardFlow/index.tsx` | 4-step wizard: Budget → ZonePicker → Hotel → Travel |
| `components/WizardFlow/Step1Budget.tsx` | ตั้งงบรวม |
| `components/WizardFlow/StepZonePicker.tsx` | เลือกโซนบัตรที่มีแล้ว |
| `components/WizardFlow/Step3Hotel.tsx` | เลือก hotel priority + จำนวนคืน |
| `components/WizardFlow/Step4Travel.tsx` | งบเดินทาง + merch + อาหาร + อื่นๆ |
| `components/Dashboard/index.tsx` | Dashboard หลัก: ticket card + modal system + share + toast |
| `components/Dashboard/BudgetSection.tsx` | Pie chart + budget editor — `useMemo` fix infinite re-render |
| `components/Dashboard/HotelSection.tsx` | แสดง hotel ranking จาก API |
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

---

## Feature ที่เพิ่มล่าสุด

### Smart Route — wantMerch (2026-07-12)
**ไฟล์ที่แก้:**
- `components/Dashboard/TransitSection.tsx` — เพิ่ม prop `wantMerch?: boolean`
  - `wantMerch = true` → timeline "ออกก่อน 3–4 ชม." + item "ต่อคิวซื้อ Merchandise"
  - `wantMerch = false` → timeline เดิม "2–3 ชม."
- `components/Dashboard/index.tsx` — ส่ง `wantMerch={wizardState.merchCost > 0}`

---

## สิ่งที่ยังค้างอยู่ / ยังไม่ได้ทำ

| รายการ | หมายเหตุ |
|---|---|
| Weather API จริง | ตอนนี้ใช้ hardcode weatherNote จาก concert data |
| Hotel score ใช้งบ/คืนจริง | ปัจจุบัน `recommend.py` ใช้ hardcode ceiling 5,000 บาท ไม่ใช่งบ/คืนจริงของ user |
| Verify "Failed to fetch" หายแล้วไหม | รอ restart backend + hard-refresh browser (Cmd+Shift+R) |
| straykids / brunomars seating image | `SEATING_IMAGES` ใน WizardFlow มีแค่ babymonster + postmalone |

---

## นำเสนอ
วันพฤหัสบดีหน้า (นำเสนอครั้งสุดท้าย)
Content อยู่ใน `PRESENTATION.md`
