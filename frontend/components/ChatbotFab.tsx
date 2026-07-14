"use client";
import { useRef, useState } from "react";

interface Message {
  from: "bot" | "user";
  text: string;
}

const QUICK_REPLIES = [
  "ต้องเตรียมอะไรบ้าง?",
  "ควรไปถึงงานกี่โมง?",
  "พาวเวอร์แบงก์เข้าได้ไหม?",
];

const RESPONSES: { pattern: RegExp; reply: string }[] = [
  { pattern: /เตรียม|ของ|pack/i, reply: "สิ่งสำคัญที่ต้องพก: 🎫 บัตร/QR, 🪪 บัตรประชาชน, 🔋 พาวเวอร์แบงก์ไม่เกิน 20,000 mAh, 💧 น้ำ (เผื่องาน outdoor) และ 🧥 เสื้อกันหนาวบางเผื่อแอร์!" },
  { pattern: /กี่โมง|เวลา|ไปถึง/i, reply: "แนะนำให้ถึงสนาม 1.5-2 ชั่วโมงก่อนประตูเปิด เพื่อรอคิวเข้า ซื้อ merch และหาที่นั่ง/ยืนที่ดีก่อนใคร!" },
  { pattern: /พาวเวอร์แบงก์|power bank/i, reply: "พาวเวอร์แบงก์เข้าได้แต่ต้องไม่เกิน 20,000 mAh ถ้าเกินอาจโดนยึดหน้างาน ควรตรวจดูความจุก่อนออกบ้านนะ!" },
  { pattern: /รถ|เดินทาง|traffic|รถติด/i, reply: "แนะนำ Grab หรือรถสาธารณะ เพราะที่จอดรถแน่มากช่วงคนออกพร้อมกัน ถ้าขับรถเองให้มาเช้าและจอดที่ห้างใกล้เคียงแทนลานจอดหน้างาน" },
  { pattern: /โรงแรม|ที่พัก|นอน/i, reply: "ดูโรงแรมที่แนะนำในหน้า dashboard ได้เลย ระบบ rank ให้ตามความใกล้และงบแล้ว! จองเร็วดีกว่า ราคาพุ่งใกล้วันงาน 📈" },
  { pattern: /merch|ของที่ระลึก|ซื้อ/i, reply: "Merchandise มักเปิดขาย 2-3 ชั่วโมงก่อน show เริ่ม และของหมดเร็วมาก! ถ้าอยากได้แนะนำไปเร็ว และเช็ค pre-order ล่วงหน้าถ้าผู้จัดเปิด" },
  { pattern: /ห้องน้ำ|toilet/i, reply: "เข้าห้องน้ำก่อนเข้าฮอลล์เสมอ! คิวห้องน้ำในงานยาวมาก โดยเฉพาะช่วงพักครึ่ง ถ้าจำเป็นให้เดินไปก่อนที่เพลงจบ" },
  { pattern: /vip|ซาวด์เช็ค|soundcheck/i, reply: "สิทธิ์ VIP และ Soundcheck มักประกาศรายละเอียดใน 7 วันก่อนงาน ติดตาม social ผู้จัดทุกวัน หรือเช็คในหน้า dashboard ที่มีแจ้งเตือนให้อยู่แล้ว!" },
];

function getReply(text: string): string {
  for (const r of RESPONSES) {
    if (r.pattern.test(text)) return r.reply;
  }
  return "ขอบคุณสำหรับคำถาม! 🎵 ลองถามเรื่อง: ของที่ต้องเตรียม, เวลาที่ควรไป, พาวเวอร์แบงก์, การเดินทาง หรือ merch ได้เลย";
}

export default function ChatbotFab() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "สวัสดี! ฉันคือ ConcertMate AI 🎵\nถามเรื่องการเตรียมตัวไปคอนเสิร์ตได้เลย!" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setMessages((m) => [...m, { from: "user", text: msg }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: getReply(msg) }]);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 flex flex-col overflow-hidden max-h-[70vh]">
          <div className="bg-gradient-to-r from-[#FF007F] to-[#4F46E5] p-4 text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-robot text-sm"></i>
            </div>
            <div>
              <p className="font-bold text-sm leading-none">ConcertMate AI</p>
              <p className="text-[10px] opacity-75 mt-0.5">ถามเรื่องการเตรียมตัวได้เลย</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    m.from === "user"
                      ? "bg-gradient-to-r from-[#FF007F] to-[#4F46E5] text-white rounded-br-sm"
                      : "bg-slate-100 text-slate-700 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-[#FFF0F6] hover:text-[#FF007F] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="ถามอะไรก็ได้..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#FF007F]"
            />
            <button
              onClick={() => send()}
              className="w-9 h-9 bg-gradient-to-r from-[#FF007F] to-[#4F46E5] text-white rounded-xl flex items-center justify-center shrink-0 hover:opacity-90"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 w-14 h-14 bg-gradient-to-br from-[#FF007F] to-[#4F46E5] text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-105 transition-transform"
        aria-label="เปิด chatbot"
      >
        <i className={`fa-solid ${open ? "fa-xmark text-xl" : "fa-comment-dots text-xl"}`}></i>
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></span>
        )}
      </button>
    </>
  );
}
