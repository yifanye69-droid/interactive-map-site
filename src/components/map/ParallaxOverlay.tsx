"use client";

import { motion } from "framer-motion";

interface ParallaxOverlayProps {
  panX: number;
  panY: number;
  scale: number;
}

/** 前景云 + 背景粒子层（不随地图缩放，固定在视口） */
export function ParallaxOverlay({ panX, panY, scale }: ParallaxOverlayProps) {
  const fx = panX * 0.04;
  const fy = panY * 0.04;

  return (
    <div className="parallax-overlay" aria-hidden>
      <motion.div
        className="parallax-overlay__fg-cloud parallax-overlay__fg-cloud--1"
        style={{ x: fx * 1.2, y: fy * 0.8 }}
        animate={{ x: [fx, fx + 30, fx], y: [fy, fy - 15, fy] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="parallax-overlay__fg-cloud parallax-overlay__fg-cloud--2"
        style={{ x: fx * 0.8, y: fy }}
        animate={{ x: [fx + 20, fx - 20, fx + 20], y: [fy, fy + 10, fy] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          className="parallax-overlay__particle"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            y: [0, -20 - i * 3, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
          }}
          transition={{
            duration: 5 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}

      <div
        className="parallax-overlay__vignette"
        style={{ opacity: Math.min(0.35, 0.15 + (scale - 0.5) * 0.1) }}
      />
    </div>
  );
}
