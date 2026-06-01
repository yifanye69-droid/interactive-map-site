"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Hotspot } from "@/types/hotspot";

interface HotspotDetailModalProps {
  hotspot: Hotspot;
  onClose: () => void;
}

export function HotspotDetailModal({ hotspot, onClose }: HotspotDetailModalProps) {
  const router = useRouter();
  const ctaLabel = hotspot.ctaLabel ?? "了解更多";

  const handleCta = () => {
    router.push(hotspot.route);
  };

  return (
    <motion.div
      className="map-center-modal-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        className="map-center-modal__backdrop"
        aria-label="关闭"
        onClick={onClose}
      />
      <motion.div
        className="map-center-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hotspot-modal-title"
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 8 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        <button
          type="button"
          className="map-center-modal__close"
          onClick={onClose}
          aria-label="关闭"
        >
          ✕
        </button>
        <div className="map-center-modal__inner">
          {hotspot.icon && (
            <span className="map-center-modal__icon" aria-hidden>
              {hotspot.icon}
            </span>
          )}
          <h2 id="hotspot-modal-title" className="map-center-modal__title">
            {hotspot.title}
          </h2>
          <p className="map-center-modal__desc">{hotspot.description}</p>
          <button type="button" className="map-center-modal__cta" onClick={handleCta}>
            {ctaLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
