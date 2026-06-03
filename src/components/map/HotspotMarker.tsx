"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Hotspot } from "@/types/hotspot";

interface HotspotMarkerProps {
  hotspot: Hotspot;
  isActive: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick?: (hotspot: Hotspot) => void;
  nearbyActive?: boolean;
}

export function HotspotMarker({
  hotspot,
  isActive,
  isHovered,
  onHover,
  onClick,
  nearbyActive,
}: HotspotMarkerProps) {
  const active = isHovered || isActive;

  return (
    <div
      data-hotspot
      className={`hotspot-marker ${active ? "is-active" : ""} ${nearbyActive ? "is-nearby" : ""} ${hotspot.isVideo || hotspot.isSpecial ? "is-video" : ""}`}
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      onMouseEnter={() => onHover(hotspot.id)}
      onMouseLeave={() => onHover(null)}
      onTouchStart={() => onHover(hotspot.id)}
      onFocus={() => onHover(hotspot.id)}
      onBlur={() => onHover(null)}
    >
      <button 
        className="hotspot-marker__btn" 
        aria-label={hotspot.title}
        onClick={() => onClick?.(hotspot)}
      >
        <motion.span
          className="hotspot-marker__ring"
          animate={
            active
              ? { scale: [1, 1.15, 1.08], opacity: [0.6, 1, 0.8] }
              : { scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="hotspot-marker__core"
          whileHover={{ scale: 1.2, y: -4 }}
          whileTap={{ scale: 0.88 }}
          animate={active ? { y: [0, -6, 0] } : { y: 0 }}
          transition={
            active
              ? { y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } }
              : { type: "spring", stiffness: 400, damping: 18 }
          }
        >
          <span className="hotspot-marker__i">i</span>
        </motion.span>
      </button>

      <AnimatePresence>
        {active && <HotspotSticker hotspot={hotspot} />}
      </AnimatePresence>
    </div>
  );
}

function HotspotSticker({ hotspot }: { hotspot: Hotspot }) {
  return (
    <motion.div
      className="hotspot-sticker"
      initial={{ opacity: 0, y: 16, scale: 0.75, rotate: -4 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: 10, scale: 0.85, rotate: 2 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      <div className="hotspot-sticker__inner">
        {hotspot.icon && <span className="hotspot-sticker__icon">{hotspot.icon}</span>}
        <div>
          <p className="hotspot-sticker__title">{hotspot.title}</p>
          <p className="hotspot-sticker__desc">{hotspot.description}</p>
          <p className="hotspot-sticker__cta">点击进入探索 →</p>
        </div>
      </div>
      <span className="hotspot-sticker__tail" />
    </motion.div>
  );
}
