"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/* ───────────── Настройки ───────────── */
const PETAL_COUNT = 38; // больше = гуще, но тяжелее
const WIND = 1; // 1 = ветер вправо, -1 = влево, 0 = почти вертикально

/* Палитры лепестков: от светлой «сердцевины» к насыщенному краю */
const PALETTES = [
  { base: "#fff5f8", mid: "#ffd6e2", edge: "#ffb0c6", vein: "#f08fae" },
  { base: "#fff0f4", mid: "#ffc8d8", edge: "#ff9fba", vein: "#ee7fa2" },
  { base: "#fffafb", mid: "#ffe0e9", edge: "#ffbfd0", vein: "#f5a0b9" },
  { base: "#fff2f5", mid: "#ffcddb", edge: "#ffa6bf", vein: "#f088a8" },
];

/* Общие градиенты — рисуем один раз, лепестки на них ссылаются */
const GradientDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
    <defs>
      {PALETTES.map((p, i) => (
        <linearGradient key={i} id={`sakura-g${i}`} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor={p.base} />
          <stop offset="45%" stopColor={p.mid} />
          <stop offset="100%" stopColor={p.edge} />
        </linearGradient>
      ))}
    </defs>
  </svg>
);

/* Лепесток сакуры: округлый, с характерной выемкой на кончике */
const Petal = ({
  size,
  palette,
  blur,
  opacity,
}: {
  size: number;
  palette: number;
  blur: number;
  opacity: number;
}) => {
  const p = PALETTES[palette];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        display: "block",
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        overflow: "visible",
      }}
    >
      {/* тело лепестка */}
      <path
        d="M50 98 C28 84 6 52 14 26 C18 12 32 4 42 6 C46 7 49 12 50 18 C51 12 54 7 58 6 C68 4 82 12 86 26 C94 52 72 84 50 98 Z"
        fill={`url(#sakura-g${palette})`}
      />
      {/* тонкие прожилки */}
      <g stroke={p.vein} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.35">
        <path d="M50 94 C50 72 50 46 50 22" />
        <path d="M49 88 C40 72 30 52 25 32" />
        <path d="M51 88 C60 72 70 52 75 32" />
      </g>
      {/* мягкий блик */}
      <ellipse cx="38" cy="58" rx="9" ry="22" fill="#ffffff" opacity="0.28" transform="rotate(14 38 58)" />
      {/* лёгкий контур, чтобы край не терялся на светлом фоне */}
      <path
        d="M50 98 C28 84 6 52 14 26 C18 12 32 4 42 6 C46 7 49 12 50 18 C51 12 54 7 58 6 C68 4 82 12 86 26 C94 52 72 84 50 98 Z"
        fill="none"
        stroke={p.edge}
        strokeWidth="1"
        opacity="0.45"
      />
    </svg>
  );
};

type PetalData = {
  id: number;
  startX: number;
  size: number;
  blur: number;
  opacity: number;
  palette: number;
  fallDuration: number;
  fallDelay: number;
  drift: number;
  swayAmount: number;
  swayDuration: number;
  swayTilt: number;
  flipXDuration: number;
  flipYDuration: number;
  spinDuration: number;
  spinFrom: number;
  spinDir: 1 | -1;
  swayDir: 1 | -1;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function SakuraFall() {
  const [petals, setPetals] = useState<PetalData[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const list: PetalData[] = Array.from({ length: PETAL_COUNT }).map((_, i) => {
      // depth: 0 = далеко, 1 = близко
      const depth = Math.pow(Math.random(), 0.85);
      const size = 12 + depth * 26;

      // далёкие чуть размыты, самые близкие — мягкий боке-эффект
      const blur = depth < 0.25 ? (0.25 - depth) * 8 : depth > 0.9 ? 1.6 : 0;

      return {
        id: i,
        startX: rand(-15, 105),
        size,
        blur,
        opacity: 0.5 + depth * 0.5,
        palette: Math.floor(Math.random() * PALETTES.length),

        // дальние падают медленнее — иллюзия глубины
        fallDuration: 11 + (1 - depth) * 9 + rand(0, 3),
        fallDelay: -rand(0, 24), // уже в воздухе при загрузке
        drift: WIND * rand(8, 22),

        swayAmount: 14 + depth * 38,
        swayDuration: rand(3.2, 6.2),
        swayTilt: rand(12, 28),

        flipXDuration: rand(2.4, 4.6),
        flipYDuration: rand(3.2, 6),
        spinDuration: rand(10, 20),
        spinFrom: rand(0, 360),
        spinDir: Math.random() > 0.5 ? 1 : -1,
        swayDir: Math.random() > 0.5 ? 1 : -1,
      };
    });

    // ближние рисуем поверх дальних
    list.sort((a, b) => a.size - b.size);
    setPetals(list);
  }, []);

  if (reduceMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden>
      <GradientDefs />

      {petals.map((p) => (
        /* Слой 1: падение + снос ветром (линейно, без остановок) */
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.startX}%`,
            top: 0,
            willChange: "transform",
          }}
          initial={{ y: "-12vh", x: "0vw" }}
          animate={{ y: "112vh", x: `${p.drift}vw` }}
          transition={{
            duration: p.fallDuration,
            delay: p.fallDelay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Слой 2: плавное покачивание из стороны в сторону с наклоном по ходу движения */}
          <motion.div
            style={{ willChange: "transform" }}
            initial={{ x: -p.swayAmount * p.swayDir, rotateZ: -p.swayTilt * p.swayDir }}
            animate={{ x: p.swayAmount * p.swayDir, rotateZ: p.swayTilt * p.swayDir }}
            transition={{
              duration: p.swayDuration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            {/* Слой 3: кувыркание в 3D — лепесток переворачивается и «ловит» воздух */}
            <motion.div
              style={{ transformPerspective: 700, willChange: "transform" }}
              initial={{ rotateX: -55, rotateY: -75, rotateZ: p.spinFrom }}
              animate={{
                rotateX: 55,
                rotateY: 75,
                rotateZ: p.spinFrom + 360 * p.spinDir,
              }}
              transition={{
                rotateX: {
                  duration: p.flipXDuration,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                },
                rotateY: {
                  duration: p.flipYDuration,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                },
                rotateZ: {
                  duration: p.spinDuration,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              <Petal size={p.size} palette={p.palette} blur={p.blur} opacity={p.opacity} />
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
