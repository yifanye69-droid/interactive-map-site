"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface MapChromeProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onHome?: () => void;
}

const ICONS = [
  { id: "zoom-in", label: "放大", icon: "+", action: "zoom-in" as const },
  { id: "zoom-out", label: "缩小", icon: "−", action: "zoom-out" as const },
  { id: "reset", label: "重置镜头", icon: "◎", action: "reset" as const },
  { id: "home", label: "开屏首页", icon: "⌂", action: "home" as const },
];

export function MapChrome({ onZoomIn, onZoomOut, onReset, onHome }: MapChromeProps) {
  const handlers = {
    "zoom-in": onZoomIn,
    "zoom-out": onZoomOut,
    reset: onReset,
    home: onHome ?? (() => {
      sessionStorage.removeItem("festival-map-skip-intro");
      window.location.reload();
    }),
  };

  return (
    <>
      <motion.nav
        className="map-chrome map-chrome--left"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 22 }}
        aria-label="地图工具"
      >
        <Link href="/" className="map-chrome__brand cartoon-btn cartoon-btn--sm">
          节庆岛
        </Link>
      </motion.nav>

      <motion.nav
        className="map-chrome map-chrome--right"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 22 }}
      >
        {ICONS.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            className="map-chrome__icon cartoon-btn"
            aria-label={item.label}
            onClick={handlers[item.action]}
            whileHover={{ scale: 1.1, rotate: 1 }}
            whileTap={{ scale: 0.88 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
          >
            <span>{item.icon}</span>
          </motion.button>
        ))}
      </motion.nav>

      <motion.div
        className="map-chrome__compass"
        animate={{ rotate: [0, 4, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        🧭
      </motion.div>
    </>
  );
}
