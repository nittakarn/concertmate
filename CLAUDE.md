# ConcertMate AI — Project Context for Claude

## วิธีรัน

**Terminal 1 (Backend)** — ต้องรันจาก project root เสมอ:
```bash
cd ~/Desktop/concertmate
python backend/run.py
# หรือ: uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 (Frontend)**:
```bash
cd ~/Desktop/concertmate/frontend
npm run dev
```
เปิด `http://localhost:3000`

## โครงสร้างโปรเจค

```
concertmate/
├── backend/
│   ├── main.py              # FastAPI app + CORS (allow_origins=["*"])
│   ├── run.py               # helper script รันจาก root
│   ├── routers/
│   │   ├── concerts.py      # GET /api/concerts, GET /api/concerts/{id}
│   │   └── recommend.py     # POST /api/recommend (DSS logic)
│   ├── models/concert.py    # Pydantic models ทั้งหมด
│   └── data/concerts.py     # ข้อมูล babymonster + postmalone
└── frontend/
    ├── app/page.tsx          # Main page: home→modal→wizard→loading→dashboard
    ├── components/
    │   ├── Dashboard/
    │   │   ├── index.tsx         # Dashboard หลัก (prop: roundKey ไม่ใช่ roundLabel)
    │   │   ├── BudgetSection.tsx # Pie chart + budget editor (useMemo สำคัญมาก)
    │   │   ├── TicketSection.tsx
    │   │   ├── HotelSection.tsx
    │   │   ├── TransitSection.tsx
    │   │   └── ChecklistSection.tsx
    │   ├── HomeScreen/
    │   ├── WizardFlow/
    │   ├── ConcertModal/
    │   └── LoadingScreen/
    ├── lib/
    │   ├── api.ts            # fetchConcerts(), fetchRecommendation()
    │   └── types.ts          # TypeScript types
    └── .env.local            # NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Tech Stack
- **Frontend**: Next.js 16.2.10, React 19, TypeScript, Tailwind CSS v4 (ใช้ `@theme` directive ไม่ใช่ tailwind.config.ts)
- **Backend**: Python FastAPI, Pydantic v2, uvicorn

## Bugs ที่แก้ไปแล้ว (อย่าแก้ซ้ำ)

| Bug | ไฟล์ | วิธีแก้ |
|-----|------|--------|
| Backend ImportError (relative import) | `backend/run.py` | รันจาก root เสมอ ด้วย `python backend/run.py` |
| `cats` array infinite re-render | `Dashboard/BudgetSection.tsx` | wrap `cats` ด้วย `useMemo` |
| Round lookup ผิด | `Dashboard/index.tsx` | prop เป็น `roundKey` (ไม่ใช่ `roundLabel`), lookup ด้วย `.key` |
| TypeScript error `roundLabel` | `Dashboard/index.tsx` | share function ใช้ `round.label` |
| DSS ไม่รองรับ panoramic/energy | `routers/recommend.py` | เพิ่ม branch ให้ครบ |
| Hotel ranking ลำดับผิด | `routers/recommend.py` | คำนวณ hotel ranking ก่อน ticket DSS |
| Safari CORS "Load failed" | `backend/main.py` | `allow_origins=["*"]`, `allow_credentials=False` |

## สถานะล่าสุด (2026-07-11)
- Backend: รันได้ปกติ, CORS แก้แล้ว
- Frontend: build ผ่าน, TypeScript error ไม่มี
- **ยังรอ verify**: "Failed to fetch" หายหรือยังหลัง restart backend + hard-refresh browser (Cmd+Shift+R)

## Next Steps
1. ยืนยันว่า frontend เชื่อม backend ได้แล้ว (ลอง click คอนเสิร์ตบน home screen)
2. ถ้ายังเจอ error ให้ดู DevTools → Network → เช็ค request ไป `http://localhost:8000/api/concerts`
