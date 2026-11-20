"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BookOpen, Headphones, PenTool, X, Timer } from "lucide-react";
import SakuraFall from "@/components/SakuraFall";
import { useRouter } from "next/navigation";

const MINCHO = "'Shippori Mincho','Cormorant Garamond',serif";
const SANS = "'Zen Maru Gothic','Nunito',system-ui,sans-serif";
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Shippori+Mincho:wght@400;500;600&family=Zen+Maru+Gothic:wght@400;500;700&display=swap');`;

const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .55 0 0 0 0 .3 0 0 0 0 .35 0 0 0 .09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const Seigaiha = () => (
  <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[34vh] w-full" style={{ opacity: 0.85, maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }}>
    <defs>
      <pattern id="seigaiha" width="80" height="40" patternUnits="userSpaceOnUse">
        {[[40, -20], [0, 0], [80, 0], [40, 20], [0, 40], [80, 40], [40, 60]].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`} fill="none" stroke="#f2b3c5" strokeWidth="1.2">
            <circle cx={cx} cy={cy} r="40" fill="#fff4f7" /><circle cx={cx} cy={cy} r="30" /><circle cx={cx} cy={cy} r="20" /><circle cx={cx} cy={cy} r="10" />
          </g>
        ))}
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#seigaiha)" />
  </svg>
);

const Blossom = ({ x, y, s = 1, r = 0 }: { x: number; y: number; s?: number; r?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    {[0, 72, 144, 216, 288].map((a) => (<path key={a} transform={`rotate(${a})`} d="M0 0 C-8 -5 -9 -15 -4 -20 L0 -17 L4 -20 C9 -15 8 -5 0 0 Z" fill="url(#blossom-g)" stroke="#f08fab" strokeWidth="0.5" />))}
    {[20, 92, 164, 236, 308].map((a) => (<line key={a} x1="0" y1="0" x2={Math.cos((a * Math.PI) / 180) * 6.5} y2={Math.sin((a * Math.PI) / 180) * 6.5} stroke="#e0678a" strokeWidth="0.7" strokeLinecap="round" />))}
    <circle r="2" fill="#d6567c" />
  </g>
);

const Branch = () => {
  const reduce = useReducedMotion();
  return (
    <motion.svg aria-hidden viewBox="0 0 440 300" className="pointer-events-none absolute -top-4 right-0 z-[1] w-[min(78vw,560px)] overflow-visible" style={{ transformOrigin: "100% 0%" }} animate={reduce ? undefined : { rotate: [0.6, -1.2, 0.6] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
      <defs><linearGradient id="blossom-g" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#f08fab" /><stop offset="55%" stopColor="#ffd3df" /><stop offset="100%" stopColor="#fff3f7" /></linearGradient></defs>
      <g fill="none" stroke="#7a4457" strokeLinecap="round">
        <path d="M445 8 C380 26 330 62 262 98 C214 123 168 128 112 168 C90 184 70 200 40 214" strokeWidth="5" /><path d="M330 54 C322 92 296 118 282 156" strokeWidth="3" /><path d="M262 98 C246 70 214 58 196 26" strokeWidth="3" /><path d="M170 130 C160 160 168 188 150 224" strokeWidth="2.5" /><path d="M112 168 C96 150 70 148 52 128" strokeWidth="2.5" />
      </g>
      {[[350, 100], [205, 100], [70, 172], [238, 150]].map(([cx, cy]) => (<circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#f4a6bd" />))}
      <Blossom x={396} y={28} s={0.9} r={10} /><Blossom x={330} y={54} s={1} r={32} /><Blossom x={300} y={78} s={0.8} r={-20} /><Blossom x={262} y={98} s={1.15} r={50} /><Blossom x={224} y={60} s={0.75} r={5} /><Blossom x={196} y={26} s={1.1} r={-30} /><Blossom x={170} y={130} s={1} r={18} /><Blossom x={282} y={156} s={0.9} r={60} /><Blossom x={112} y={168} s={1.1} r={-12} /><Blossom x={150} y={224} s={0.85} r={40} /><Blossom x={52} y={128} s={0.9} r={25} /><Blossom x={40} y={214} s={0.8} r={-35} />
    </motion.svg>
  );
};

const Hanko = ({ char = "桜", className = "" }: { char?: string; className?: string }) => (
  <div className={`flex items-center justify-center rounded-md bg-[#d6455d] text-[#fff5f7] shadow-[inset_0_0_0_2px_rgba(255,245,247,0.55),0_6px_16px_rgba(214,69,93,0.35)] ${className}`} style={{ fontFamily: MINCHO, transform: "rotate(-6deg)" }} aria-hidden>
    <span className="leading-none">{char}</span>
  </div>
);

function Field({ id, label, type, value, onChange, delay }: { id: string; label: string; type: "email" | "password"; value: string; onChange: (v: string) => void; delay: number }) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6 }} className="group relative pt-4">
      <input id={id} type={type} value={value} required autoComplete={type === "email" ? "email" : "current-password"} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="w-full border-b border-[#ecc3d1] bg-transparent px-1 pb-2 pt-3 text-base text-[#4a2433] outline-none" />
      <label htmlFor={id} className={`pointer-events-none absolute left-1 transition-all duration-300 ${floated ? "top-0 text-xs text-[#d6567c]" : "top-[1.6rem] text-base text-[#a67f8c]"}`}>{label}</label>
      <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#f4a6bd] to-[#d6567c] transition-transform duration-500 group-focus-within:scale-x-100" />
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [essay, setEssay] = useState("");
  const [timeLeft, setTimeLeft] = useState(2400);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Проверяем, не залогинена ли уже Дарика
  useEffect(() => {
    const isAuth = localStorage.getItem("darikaAuth");
    if (isAuth === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Берем пароль из .env.local
    const secretEmail = process.env.NEXT_PUBLIC_AUTH_EMAIL || "darika@love.com";
    const secretPassword = process.env.NEXT_PUBLIC_AUTH_PASSWORD || "lyubov2026";

    if (email === secretEmail && password === secretPassword) {
      setLoading(true);
      setTimeout(() => { 
        setLoading(false); 
        setIsLoggedIn(true); 
        localStorage.setItem("darikaAuth", "true"); // Запоминаем вход
      }, 1500);
    } else {
      alert("Неверный email или пароль. Доступ только для Дарики!");
    }
  };

  const modules = [
    { icon: <BookOpen size={26} strokeWidth={1.5} />, title: "Reading", desc: "Тексты уровня Cambridge", kanji: "読", action: () => router.push("/reading") },
    { icon: <Headphones size={26} strokeWidth={1.5} />, title: "Listening", desc: "Аудио с британским акцентом", kanji: "聴", action: () => router.push("/listening") },
    { icon: <PenTool size={26} strokeWidth={1.5} />, title: "Writing", desc: "Тренажер эссе", kanji: "書", action: () => { setIsModalOpen(true); setIsTimerRunning(true); } },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden text-[#4a2433] selection:bg-[#f4a6bd]/50" style={{ fontFamily: SANS, background: "linear-gradient(180deg,#fffaf8 0%,#ffeef3 55%,#ffdfe8 100%)" }}>
      <style>{FONT_IMPORT}</style>
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-[42%] h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, #ffcfdc 0%, #ffe0e8 48%, rgba(255,235,241,0) 70%)" }} />
        <div className="absolute inset-0 opacity-70 mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
      </div>
      <Seigaiha /><Branch />
      
      <div aria-hidden className="pointer-events-none absolute left-6 top-1/2 z-[1] hidden -translate-y-1/2 text-sm tracking-[0.6em] text-[#c98aa0] md:block" style={{ writingMode: "vertical-rl", fontFamily: MINCHO }}>桜の季節</div>
      <SakuraFall />

      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div key="login" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 flex min-h-screen items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-[2rem] border border-[#f1c4d2] bg-white/70 p-10 pt-12 shadow-[0_30px_80px_rgba(224,103,138,0.18)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-2 rounded-[1.5rem] border border-[#f4c6d3]/70" />
              <div className="relative flex flex-col items-center text-center">
                <Hanko char="桜" className="mb-7 h-16 w-16 text-4xl" />
                <h1 className="text-5xl font-medium tracking-[0.06em] text-[#4a2433]" style={{ fontFamily: MINCHO }}>Darika</h1>
                <p className="mt-3 text-sm tracking-[0.5em] text-[#d6567c]" style={{ fontFamily: MINCHO }}>IELTS</p>
                <p className="mt-6 max-w-[16rem] text-sm leading-relaxed text-[#8a6672]">Маленький шаг каждый день, и вот уже цветёт целая ветка.</p>
              </div>
              <form onSubmit={handleLogin} className="relative mt-9 space-y-4">
                <Field id="email" label="Email" type="email" value={email} onChange={setEmail} delay={0.4} />
                <Field id="password" label="Пароль" type="password" value={password} onChange={setPassword} delay={0.5} />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="mt-8 flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#f08fab] to-[#d6567c] text-base font-bold tracking-wider text-white shadow-[0_12px_30px_rgba(214,86,124,0.35)] transition-shadow hover:shadow-[0_16px_40px_rgba(214,86,124,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6567c] focus-visible:ring-offset-2">
                  {loading ? (<motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-6 w-6 rounded-full border-2 border-white/40 border-t-white" />) : ("Войти")}
                </motion.button>
              </form>
              <p className="relative mt-8 text-center text-xs text-[#b58a98]">Сделано с любовью для тебя ♡</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative z-10 mx-auto min-h-screen max-w-6xl px-6 py-16 md:px-16 md:py-24">
            <motion.header initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="mb-16 flex flex-col items-center text-center">
              <Hanko char="桜" className="mb-6 h-14 w-14 text-3xl" />
              <h1 className="text-4xl font-medium tracking-wide text-[#4a2433] md:text-6xl" style={{ fontFamily: MINCHO }}>Привет, Дарика</h1>
              <p className="mt-5 text-lg text-[#8a6672] md:text-xl">Сакура цветёт, а твой прогресс растёт.</p>
              <p className="mt-6 text-sm tracking-[0.5em] text-[#c98aa0]" style={{ fontFamily: MINCHO }}>頑張って</p>
            </motion.header>
            <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
              {modules.map((item, index) => (
                <motion.button key={item.title} type="button" onClick={item.action} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 + index * 0.15, duration: 0.6 }} whileHover={{ y: -6, borderColor: "#f08fab", boxShadow: "0px 18px 40px rgba(224,103,138,0.2)" }} className="group relative overflow-hidden rounded-[1.75rem] border border-[#f1c4d2] bg-white/70 p-8 pb-12 text-left backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6567c]">
                  <span aria-hidden className="pointer-events-none absolute -bottom-8 -right-2 select-none text-[9rem] leading-none text-[#f4a6bd]/25 transition-transform duration-500 group-hover:scale-105" style={{ fontFamily: MINCHO }}>{item.kanji}</span>
                  <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#ffe4ec] text-[#d6567c] transition-colors group-hover:bg-[#ffd3df]">{item.icon}</div>
                  <h2 className="relative mb-2 text-2xl font-medium" style={{ fontFamily: MINCHO }}>{item.title}</h2>
                  <p className="relative text-sm leading-relaxed text-[#8a6672]">{item.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#4a2433]/35 p-4 backdrop-blur-md">
            <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[#f1c4d2] bg-[#fffaf8] p-8 shadow-[0_30px_80px_rgba(224,103,138,0.3)] md:p-10">
              <div className="pointer-events-none absolute inset-2 rounded-[1.5rem] border border-[#f4c6d3]/70" />
              <button onClick={() => setIsModalOpen(false)} aria-label="Закрыть" className="absolute right-6 top-6 rounded-full p-1 text-[#b58a98] transition-colors hover:text-[#d6567c]"><X size={24} /></button>
              <div className="relative">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-medium text-[#4a2433]" style={{ fontFamily: MINCHO }}>Writing Practice</h2>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg font-bold ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-[#ffe4ec] text-[#d6567c]'}`}>
                    <Timer size={20} />
                    {formatTime(timeLeft)}
                  </div>
                </div>
                
                <textarea className="mb-4 h-[40vh] w-full resize-none rounded-2xl border border-[#ecc3d1] bg-white/80 p-6 text-[#4a2433] placeholder-[#b58a98] outline-none transition-colors focus:border-[#d6567c] leading-relaxed text-lg" placeholder="Напиши свое эссе на английском..." value={essay} onChange={(e) => setEssay(e.target.value)} />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#8a6672]">Слов: {essay.trim() ? essay.trim().split(/\s+/).length : 0}</span>
                  <button onClick={() => { setTimeLeft(2400); setIsTimerRunning(true); setEssay(""); }} className="text-sm text-[#d6567c] hover:underline">Сбросить</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
