"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoaderScreenProps {
  onComplete: () => void;
}

export function LoaderScreen({ onComplete }: LoaderScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(onComplete, 400);
      }
    };
    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <motion.div
      className="loader-screen"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="loader-screen__bg" />
      <motion.div
        className="loader-screen__logo"
        animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="loader-screen__emoji" aria-hidden>
          🎪
        </span>
      </motion.div>
      <h2 className="loader-screen__title">节庆岛屿</h2>
      <p className="loader-screen__sub">正在唤醒互动世界…</p>
      <div className="loader-screen__bar">
        <motion.div
          className="loader-screen__bar-fill"
          style={{ width: `${progress}%` }}
          layout
        />
      </div>
      <p className="loader-screen__pct">{progress}%</p>
      <div className="loader-screen__dots">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="loader-screen__dot"
            animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
