"use client";

interface Props {
  color: string;
  icon: string;
  title: string;
  lines: { label: string; value: string }[];
  badge?: string;
  badgeColor?: string;
  onClick: () => void;
}

export default function DashCard({ color, icon, title, lines, badge, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-stretch rounded-2xl overflow-hidden group hover:scale-[1.015] hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer"
      style={{
        boxShadow: `0 8px 32px -6px ${color}45, 0 2px 8px -2px rgba(0,0,0,0.07)`,
        border: `1.5px solid ${color}28`,
      }}
    >
      {/* ── Left festival-badge tab (fixed height so all cards equal) ── */}
      <div
        className="w-[90px] shrink-0 flex flex-col items-center justify-center gap-3 py-5 px-3 relative overflow-hidden min-h-[120px]"
        style={{ background: `linear-gradient(155deg, ${color} 0%, ${color}bb 100%)` }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-5 -right-5 w-16 h-16 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-white/10" />

        {/* Icon */}
        <div
          className="relative z-10 w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,255,255,0.20)", backdropFilter: "blur(4px)" }}
        >
          <i className={`fa-solid ${icon} text-white text-lg`} />
        </div>

        {/* Title */}
        <span className="relative z-10 text-white font-black text-[11px] text-center leading-tight tracking-wide">
          {title}
        </span>

        {/* Badge — lives here only, never adds height to right side */}
        {badge && (
          <span
            className="relative z-10 text-[9px] font-extrabold px-2 py-0.5 rounded-full leading-none"
            style={{ background: "rgba(255,255,255,0.28)", color: "white" }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* ── Perforation ── */}
      <div className="relative shrink-0 w-5 bg-white flex flex-col items-center justify-between py-0">
        <div className="w-4 h-4 rounded-full -mt-2 border border-slate-100 bg-slate-50 shrink-0" />
        <div className="flex-1 w-0 my-1" style={{ borderLeft: `2px dashed ${color}35` }} />
        <div className="w-4 h-4 rounded-full -mb-2 border border-slate-100 bg-slate-50 shrink-0" />
      </div>

      {/* ── Right stub ── */}
      <div
        className="flex-1 px-5 py-5 flex items-center justify-between gap-4"
        style={{ background: `linear-gradient(120deg, #ffffff 55%, ${color}09 100%)` }}
      >
        <div className="space-y-2.5 min-w-0 flex-1">
          {lines.map((l, i) => (
            <div key={i} className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                {l.label}
              </span>
              <span className="text-[14px] font-bold text-slate-800 leading-snug truncate">
                {l.value}
              </span>
            </div>
          ))}
        </div>

        {/* Tap arrow circle */}
        <div
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
          style={{ background: `${color}18` }}
        >
          <i className="fa-solid fa-arrow-right text-sm" style={{ color }} />
        </div>
      </div>
    </button>
  );
}
