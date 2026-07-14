"use client";

interface HeaderProps {
  onReset: () => void;
  isHome?: boolean;
}

export default function Header({ onReset, isHome }: HeaderProps) {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center z-40 relative border-b border-white/60 bg-white/40 backdrop-blur-md sticky top-0">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF007F] to-[#4F46E5] flex items-center justify-center text-white text-lg shadow-md hover:scale-105 transition-all">
          <i className="fa-solid fa-microphone-lines"></i>
        </div>
        <div>
          <span className="font-bold text-xl tracking-tight text-[#1E293B] flex items-center gap-1" style={{ fontFamily: "Fredoka, Prompt, sans-serif" }}>
            ConcertMate
          </span>
        </div>
      </div>
      {!isHome && (
        <button
          onClick={onReset}
          className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-[#FF007F] bg-white/80 border border-slate-200/60 rounded-xl hover:shadow-sm transition-all"
        >
          <i className="fa-solid fa-house mr-1"></i> กลับหน้าหลัก
        </button>
      )}
    </header>
  );
}
