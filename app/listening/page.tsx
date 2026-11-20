"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const gif = (id: string) => `https://media.giphy.com/media/${id}/giphy.gif`;

// Три гифки из твоего кода (рабочие) — они же запасные, если другая не загрузится
const SAFE = ["VbnUQpnihPSIgIXuZv", "GeimqsH0TLDt4tScGw", "mlvseq9yvZhba"].map(gif);

const CATS = [
  ...SAFE,
  ...[
    "JIX9t2j0ZTN9S",
    "MDJ9IbxxvDUQM",
    "ule4vhcY1xEKQ",
    "13CoXDiaCcCoyk",
    "Ju7l5y9osyymQ",
    "11s7Ke7jcNxCHS",
    "BzyTuYCmvSORqs1ABM",
    "lJNoBCvQYp7nq",
    "vFKqnCdLPNOKc",
  ].map(gif),
];

const EMOJI = ["💖", "💗", "💕", "💘", "💝", "💞", "🩷", "❤️"];

// Псевдослучайные числа без Math.random — чтобы сервер и браузер совпадали
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 100) / 100;
};

type Burst = { id: number; x: number; y: number };

function Cat({ src, i, className }: { src: string; i: number; className: string }) {
  return (
    <motion.img
      src={src}
      alt="Котик"
      loading="lazy"
      className={`${className} rounded-3xl object-cover border-4 border-white shadow-xl`}
      whileHover={{ scale: 1.2, rotate: i % 2 ? 8 : -8 }}
      onError={(e) => {
        const el = e.currentTarget;
        if (!el.dataset.fb) {
          el.dataset.fb = "1";
          el.src = SAFE[i % SAFE.length];
        }
      }}
    />
  );
}

function Marquee({ reverse = false, still = false }: { reverse?: boolean; still?: boolean }) {
  const items = reverse ? [...CATS].reverse() : CATS;
  const loop = [...items, ...items];
  return (
    <div className="w-screen overflow-hidden py-3">
      <motion.div
        className="flex w-max"
        animate={still ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 45, ease: "linear", repeat: Infinity }}
      >
        {loop.map((src, i) => (
          <div key={i} className="mr-4 shrink-0">
            <Cat src={src} i={i} className="w-28 h-28 md:w-36 md:h-36" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function ListeningPage() {
  const reduce = !!useReducedMotion();
  const [bursts, setBursts] = useState<Burst[]>([]);

  const burst = (e: React.MouseEvent) => {
    if (reduce) return;
    const id = Date.now() + Math.random();
    setBursts((b) => [...b, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 1600);
  };

  const rain = reduce ? [] : Array.from({ length: 36 }, (_, i) => i);

  return (
    <div
      onClick={burst}
      className="min-h-screen bg-[#fffaf8] text-[#4a2433] py-24 font-sans relative overflow-hidden flex flex-col items-center justify-center"
    >
      <Link
        href="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-[#d6567c] hover:text-[#a67f8c] transition-colors z-50"
      >
        <ArrowLeft size={20} /> Назад
      </Link>

      {/* Дождь из сердечек */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        {rain.map((i) => {
          const sway = 20 + rnd(i, 5) * 50;
          const dur = 8 + rnd(i, 3) * 8;
          const delay = rnd(i, 4) * 8;
          return (
            <motion.span
              key={i}
              className="absolute top-0 select-none"
              style={{ left: `${rnd(i, 1) * 100}%`, fontSize: 16 + rnd(i, 2) * 28 }}
              initial={{ y: "110vh", opacity: 0 }}
              animate={{
                y: ["110vh", "-20vh"],
                x: [0, sway, -sway, 0],
                rotate: [-20, 20, -20],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                y: { duration: dur, repeat: Infinity, ease: "linear", delay },
                x: { duration: dur / 2, repeat: Infinity, ease: "easeInOut", delay },
                rotate: { duration: 3, repeat: Infinity, ease: "easeInOut", delay },
                opacity: { duration: dur, repeat: Infinity, times: [0, 0.1, 0.9, 1], delay },
              }}
            >
              {EMOJI[i % EMOJI.length]}
            </motion.span>
          );
        })}
      </div>

      {/* Большое сердце с пульсом и расходящиеся кольца */}
      {!reduce && (
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" aria-hidden>
          {[0, 1, 2].map((k) => (
            <motion.div
              key={k}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-[#d6567c]"
              initial={{ scale: 0.4, opacity: 0.5 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 3.6, repeat: Infinity, delay: k * 1.2, ease: "easeOut" }}
            >
              <Heart size={260} strokeWidth={1.5} />
            </motion.div>
          ))}
          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-[#f4a6bd] opacity-40"
            animate={{ scale: [1, 1.18, 1, 1.25, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, times: [0, 0.15, 0.3, 0.45, 1] }}
          >
            <Heart size={340} fill="currentColor" strokeWidth={0} />
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full text-center relative z-10 px-6"
      >
        <h1
          className="text-4xl md:text-6xl font-medium mb-6 leading-tight"
          style={{ fontFamily: "'Shippori Mincho', serif" }}
        >
          Напиши своему любимому,
          <br />
          <motion.span
            className="text-[#d6567c] inline-block"
            animate={reduce ? undefined : { scale: [1, 1.06, 1, 1.09, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, times: [0, 0.15, 0.3, 0.45, 1] }}
          >
            чтобы он составил вопросы
          </motion.span>
          <br />и отправь ему аудиофайл
        </h1>

        <motion.p
          className="text-[#a67f8c]"
          animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          Нажимай куда угодно 💗
        </motion.p>
      </motion.div>

      {/* Бегущие ряды котиков */}
      <div className="relative z-10 mt-12 w-full">
        <Marquee still={reduce} />
        <Marquee reverse still={reduce} />
      </div>

      {/* Центральная стена котиков */}
      <div className="relative z-10 flex flex-wrap justify-center gap-6 mt-10 px-6 max-w-5xl">
        {CATS.slice(0, 8).map((src, i) => (
          <motion.div
            key={src + i}
            animate={reduce ? undefined : { y: [0, -14, 0], rotate: [0, i % 2 ? 3 : -3, 0] }}
            transition={{ duration: 3 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
          >
            <Cat src={src} i={i} className="w-32 h-32 md:w-44 md:h-44" />
          </motion.div>
        ))}
      </div>

      {/* Взрыв сердечек по клику */}
      <div className="fixed inset-0 pointer-events-none z-40" aria-hidden>
        <AnimatePresence>
          {bursts.map((b) =>
            Array.from({ length: 14 }, (_, k) => {
              const angle = (k / 14) * Math.PI * 2;
              const dist = 80 + rnd(k, b.id % 97) * 120;
              return (
                <motion.span
                  key={`${b.id}-${k}`}
                  className="absolute select-none text-2xl"
                  style={{ left: b.x, top: b.y }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist - 40,
                    scale: [0, 1.4, 0.7],
                    opacity: [1, 1, 0],
                    rotate: (k % 2 ? 1 : -1) * 90,
                  }}
                  transition={{ duration: 1.3, ease: "easeOut" }}
                >
                  {EMOJI[k % EMOJI.length]}
                </motion.span>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
