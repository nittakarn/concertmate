"use client";
import { useEffect, useState } from "react";

const STATUS_TEXTS = [
  "คัดสรรจัดสรรงบประมาณคงเหลือและช็อปสะสม...",
  "วิเคราะห์ประเภทโซนตั๋วและความหนาแน่นคน...",
  "ค้นหาระบบ Google Places จัดแจงโรงแรมใกล้ฮอลล์...",
  "รวบรวมแผนการเดินทางขากลับและมุขหลบภัยจราจร...",
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 10;
        if (next % 30 === 0 && next < 100) setStatusIdx((i) => Math.min(i + 1, STATUS_TEXTS.length - 1));
        return Math.min(next, 95);
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="step-transition py-16 text-center max-w-md mx-auto space-y-8">
      <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#FF007F] animate-spin"></div>
        <div className="absolute inset-4 rounded-full border-2 border-[#4F46E5] border-t-transparent animate-pulse"></div>
        <div className="absolute inset-8 rounded-full bg-white flex items-center justify-center text-3xl shadow-[0_20px_50px_-12px_rgba(79,70,229,.12)] text-[#FF007F]">
          <i className="fa-solid fa-wand-magic-sparkles animate-bounce"></i>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="font-bold text-xl text-slate-800" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>กำลังวางแผนทริปให้คุณ...</h3>
        <p className="text-xs text-[#4F46E5] font-bold uppercase tracking-widest">{STATUS_TEXTS[statusIdx]}</p>
        <div className="w-2/3 bg-slate-100 h-2 rounded-full overflow-hidden mx-auto">
          <div
            className="bg-gradient-to-r from-[#FF007F] to-[#4F46E5] h-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </section>
  );
}
