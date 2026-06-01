"use client";

import { motion } from "framer-motion";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function MapControls({ onZoomIn, onZoomOut, onReset }: MapControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="pointer-events-auto fixed bottom-6 right-4 z-40 flex flex-col gap-2 md:bottom-8 md:right-8"
    >
      <ControlButton label="放大" onClick={onZoomIn}>
        +
      </ControlButton>
      <ControlButton label="缩小" onClick={onZoomOut}>
        −
      </ControlButton>
      <ControlButton label="重置视图" onClick={onReset}>
        ⌂
      </ControlButton>
    </motion.div>
  );
}

function ControlButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-lg font-semibold text-slate-700 shadow-card backdrop-blur-md transition-colors hover:bg-white md:h-12 md:w-12"
    >
      {children}
    </motion.button>
  );
}
