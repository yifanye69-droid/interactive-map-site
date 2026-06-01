"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface PuzzleCompleteModalProps {
  open: boolean;
  onNext: () => void;
}

/** Popup Window 1 with image background and clickable next level button */
export function PuzzleCompleteModal({ open, onNext }: PuzzleCompleteModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="puzzle-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="拼图完成"
        >
          <motion.div
            className="puzzle-popup-window"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <Image
              src="/places/Popup Window 1.png"
              alt="拼图完成"
              className="puzzle-popup-window__img"
              width={2563}
              height={2303}
              sizes="(max-width: 768px) 78vw, 520px"
              priority
            />
            <button
              type="button"
              className="puzzle-popup-window__next"
              onClick={onNext}
              aria-label="下一关"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
