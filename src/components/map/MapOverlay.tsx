"use client";

import { motion } from "framer-motion";

export function MapOverlay() {
  return (
    <>
      {/* 顶部渐变与标题 */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-28 bg-gradient-to-b from-festival-sky/90 to-transparent" />
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="pointer-events-none fixed left-0 top-0 z-30 px-5 pt-[max(1rem,env(safe-area-inset-top))] md:px-10 md:pt-8"
      >
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-festival-mint md:text-sm">
          互动地图
        </p>
        <h1 className="font-display text-2xl font-bold text-slate-800 md:text-4xl">
          节庆岛屿
        </h1>
        <p className="mt-1 max-w-md text-sm text-slate-600/90 md:text-base">
          拖动探索 · 悬停查看 · 点击进入各区域
        </p>
      </motion.header>

      {/* 边角装饰光晕 */}
      <div className="pointer-events-none fixed inset-0 z-10 shadow-[inset_0_0_80px_rgba(255,200,100,0.08)]" />
    </>
  );
}
