"use client";

import { motion } from "framer-motion";
import type { AmbientKind } from "@/lib/ambientConfig";

const SPRITES: Record<AmbientKind, string> = {
  cloud: "☁️",
  boat: "⛵",
  bird: "🐦",
  flag: "🚩",
  particle: "✨",
  ufo: "🛸",
  balloon: "🎈",
  helicopter: "🚁",
  sparkle: "💫",
  bubble: "🫧",
};

interface AmbientSpriteProps {
  kind: AmbientKind;
  duration: number;
  delay: number;
  scale?: number;
  parallaxOffset: { x: number; y: number };
}

export function AmbientSprite({
  kind,
  duration,
  delay,
  scale = 1,
  parallaxOffset,
}: AmbientSpriteProps) {
  const emoji = SPRITES[kind];
  const isCloud = kind === "cloud";
  const isBoat = kind === "boat" || kind === "helicopter";
  const isBird = kind === "bird";
  const isFlag = kind === "flag";
  const isBubble = kind === "bubble" || kind === "particle";

  const baseX = parallaxOffset.x;
  const baseY = parallaxOffset.y;

  return (
    <motion.span
      className={`ambient-sprite ambient-sprite--${kind}`}
      style={{ scale }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.5, 1, 0.5],
        y: isCloud
          ? [baseY, baseY - 12, baseY, baseY + 8, baseY]
          : isBoat
            ? [baseY, baseY - 4, baseY]
            : isBird
              ? [baseY, baseY - 20, baseY]
              : isBubble
                ? [baseY, baseY - 30, baseY - 60]
                : [baseY, baseY - 6, baseY],
        x: isBoat
          ? [baseX, baseX + 40, baseX + 80, baseX + 40, baseX]
          : isBird
            ? [baseX, baseX + 50, baseX + 100, baseX + 50, baseX]
            : isFlag
              ? [baseX, baseX + 3, baseX - 3, baseX]
              : baseX,
        rotate: isFlag ? [-8, 8, -8] : isUfo(kind) ? [0, 5, -5, 0] : 0,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden
    >
      {emoji}
    </motion.span>
  );
}

function isUfo(kind: AmbientKind) {
  return kind === "ufo";
}
