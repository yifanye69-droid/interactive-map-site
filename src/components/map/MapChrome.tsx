"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

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
  const [showQR, setShowQR] = useState(false);

  const handlers = {
    "zoom-in": onZoomIn,
    "zoom-out": onZoomOut,
    reset: onReset,
    home: onHome ?? (() => {
      sessionStorage.removeItem("festival-map-skip-intro");
      window.location.reload();
    }),
  };

  const currentUrl = typeof window !== "undefined"
    ? (window.location.hostname === 'yifanye69-droid.github.io'
      ? 'https://yifanye69-droid.github.io/interactive-map-site/'
      : window.location.href)
    : "";

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
          <img src="/xiuxiuxiu.png" alt="XIUXIUXIU MAP" className="map-chrome__brand-img" />
        </Link>
      </motion.nav>

      <motion.button
        type="button"
        className="map-chrome__qr-btn cartoon-btn"
        aria-label="手机扫码"
        onClick={() => setShowQR(!showQR)}
        whileHover={{ scale: 1.1, rotate: 1 }}
        whileTap={{ scale: 0.88 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 22 }}
      >
        <span>📱</span>
      </motion.button>

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

      <AnimatePresence>
        {showQR && (
          <motion.div
            className="map-chrome__qr-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowQR(false)}
          >
            <div
              className="map-chrome__qr-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>手机扫码访问</h3>
              <div className="map-chrome__qr-code">
                <QRCodeSVG value={currentUrl} size={180} level="M" />
              </div>
              <p>扫描二维码在手机上查看</p>
              <button
                className="cartoon-btn cartoon-btn--sm"
                onClick={() => setShowQR(false)}
              >
                关闭
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
