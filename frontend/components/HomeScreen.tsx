"use client";
import Image from "next/image";
import type { Concert } from "@/lib/types";

interface HomeScreenProps {
  concerts: Concert[];
  onSelectConcert: (concert: Concert) => void;
}

const CONCERT_META: Record<string, { image?: string; dates: string; priceRange: string; tag: string; tagColor: string }> = {
  babymonster: {
    image: "/images/babymonster-poster.jpg",
    dates: "เสาร์ 7 – อาทิตย์ 8 พ.ย. 2569",
    priceRange: "฿2,800 – ฿7,300",
    tag: "K-POP",
    tagColor: "#EC4899",
  },
  postmalone: {
    image: "/images/postmalone-poster.jpg",
    dates: "อังคาร 22 ก.ย. 2569",
    priceRange: "฿2,800 – ฿13,400",
    tag: "HIP-HOP",
    tagColor: "#6366F1",
  },
  xg: {
    image: "/images/xg-poster.png",
    dates: "อาทิตย์ 19 ก.ค. 2569",
    priceRange: "฿2,500 – ฿7,800",
    tag: "J-POP",
    tagColor: "#A855F7",
  },
  theweeknd: {
    image: "/images/weeknd-poster.png",
    dates: "อา. 11 – อ. 13 ต.ค. 2569",
    priceRange: "฿2,835 – ฿21,935",
    tag: "R&B / POP",
    tagColor: "#EAB308",
  },
};

const GRADIENT_BG: Record<string, string> = {
  babymonster: "linear-gradient(135deg,#1a0a2e 0%,#EC4899 100%)",
  postmalone:  "linear-gradient(135deg,#0f1729 0%,#6366F1 100%)",
  xg:          "linear-gradient(135deg,#1a0a2e 0%,#A855F7 100%)",
  theweeknd:   "linear-gradient(135deg,#1a1200 0%,#EAB308 100%)",
};

const FEATURES = [
  {
    step: "01",
    icon: "fa-coins",
    grad: "from-[#FF007F] to-[#FF6B6B]",
    title: "Concert Trip Budget",
    desc: "ตั้งงบทริป แจกแจงทุกค่าใช้จ่าย พร้อมเลือกโซนบัตรที่มีอยู่",
  },
  {
    step: "02",
    icon: "fa-hotel",
    grad: "from-[#F59E0B] to-[#FBBF24]",
    title: "Hotel Matching",
    desc: "จับคู่โรงแรมตามเงื่อนไข ใกล้ฮอลล์ คุ้มค่า หรือรีวิวดีที่สุด",
  },
  {
    step: "03",
    icon: "fa-list-check",
    grad: "from-[#7C3AED] to-[#A78BFA]",
    title: "Checklist Plan",
    desc: "ควรถึงก่อนประตูเปิดกี่ชั่วโมง กฎข้อห้ามของงาน และของที่ต้องเตรียม",
  },
];

export default function HomeScreen({ concerts, onSelectConcert }: HomeScreenProps) {
  return (
    <section className="step-transition space-y-20">

      {/* ── Hero ── */}
      <div className="relative -mt-8 rounded-b-[2.5rem] overflow-hidden hero-vivid" style={{ minHeight: "560px", width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
        <div className="absolute inset-0 hero-fade" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm text-white text-xs font-bold">
            <span className="flex h-2 w-2 rounded-full bg-[#FF007F] animate-ping" />
            <span><i className="fa-solid fa-wand-magic-sparkles mr-1" /> เพื่อนร่วมทาง ส่วนตัวของคุณ</span>
          </div>
          <h1
            className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight drop-shadow-lg"
            style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}
          >
            <span style={{ textShadow: "0 2px 8px rgba(255,100,200,0.6), 0 1px 2px rgba(0,0,0,0.3)" }}>เพื่อนซี้สายคอนฯ</span><br />
            <span
              className="whitespace-nowrap text-white"
              style={{ textShadow: "0 2px 8px rgba(255,100,200,0.6), 0 1px 2px rgba(0,0,0,0.3)" }}
            >วางแผนครบ จบพร้อมลุย!</span>
          </h1>
          <p className="text-white text-base sm:text-lg max-w-xl mx-auto font-medium leading-relaxed drop-shadow-md">
            ไม่รู้จะเริ่มวางแผนยังไง?<br />
            เราจัดให้ครบ — โรงแรม เดินทาง เตรียมตัว จบในที่เดียว
          </p>
          <a
            href="#concerts"
            className="px-8 py-4 bg-gradient-to-r from-[#FF007F] to-[#4F46E5] text-white text-base font-extrabold rounded-2xl shadow-[0_10px_30px_-5px_rgba(255,0,127,.25)] hover:scale-105 transition-all flex items-center gap-2 mx-auto w-fit"
          >
            ไปกันเลยเพื่อน! Let&apos;s Start
            <i className="fa-solid fa-chevron-down animate-bounce" />
          </a>
        </div>
      </div>

      {/* ── Feature Steps ── */}
      <div className="max-w-5xl mx-auto px-2 space-y-6">
        <div className="text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#4F46E5]">
            <i className="fa-solid fa-bolt mr-1" /> วางแผนทริปคอนเสิร์ตครบ จบในที่เดียว
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.step}
              className="dreamer-card rounded-2xl p-5 border border-white/60 hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden"
            >
              {/* Step number watermark */}
              <span className="absolute top-2 right-3 text-[3rem] font-black text-slate-100 leading-none select-none group-hover:text-[#FF007F]/10 transition-colors">
                {f.step}
              </span>

              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${f.grad} flex items-center justify-center text-white text-lg mb-4 shadow-md`}>
                <i className={`fa-solid ${f.icon}`} />
              </div>
              <h3
                className="font-extrabold text-[13px] text-slate-800 leading-tight"
                style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}
              >
                {f.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Concert Cards ── */}
      <div id="concerts" className="space-y-6 max-w-4xl mx-auto pt-2 px-2">
        <div className="text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#4F46E5]">Curated Hot Destinations</span>
          <h2
            className="font-black text-2xl text-slate-800 mt-1"
            style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}
          >
            เลือกคอนเสิร์ตของคุณ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {concerts.map((concert) => {
            const meta = CONCERT_META[concert.id];
            return (
              <div
                key={concert.id}
                onClick={() => onSelectConcert(concert)}
                className="dreamer-card rounded-3xl cursor-pointer hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                {/* Image / Gradient */}
                <div className="relative h-48 w-full overflow-hidden">
                  {meta?.image ? (
                    <Image
                      src={meta.image}
                      alt={concert.name}
                      fill
                      sizes="(max-width:768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: GRADIENT_BG[concert.id] ?? "linear-gradient(135deg,#1a0a2e,#FF007F)" }}
                    >
                      <i className="fa-solid fa-music text-white/20 text-7xl" />
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Genre tag */}
                  {meta && (
                    <span
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-extrabold text-white uppercase tracking-widest"
                      style={{ background: `${meta.tagColor}cc` }}
                    >
                      {meta.tag}
                    </span>
                  )}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[9px] font-bold text-white bg-[#FF007F] uppercase tracking-wider">
                    <i className="fa-solid fa-fire mr-1" />ON SALE
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3
                    className="font-extrabold text-[15px] text-slate-800 group-hover:text-[#FF007F] transition-colors leading-snug"
                    style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}
                  >
                    {concert.name}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-500 flex items-center gap-2">
                      <i className="fa-solid fa-map-pin text-[#FF007F] w-3" />
                      {concert.venueName}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-2">
                      <i className="fa-solid fa-calendar-days text-[#FF007F] w-3" />
                      {meta?.dates ?? concert.rounds.map(r => r.label).join(" / ")}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">ราคาอย่างเป็นทางการ</span>
                    <span
                      className="font-extrabold text-sm text-[#4F46E5]"
                      style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}
                    >
                      {meta?.priceRange ?? `฿${Math.min(...concert.prices.map(p=>p.price)).toLocaleString()} – ฿${Math.max(...concert.prices.map(p=>p.price)).toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
