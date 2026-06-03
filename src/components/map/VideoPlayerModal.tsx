"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimeOfDay = "morning" | "noon" | "evening";

const VIDEOS: Record<TimeOfDay, string> = {
  morning: "/videos/1.mp4",
  noon: "/videos/2.mp4",
  evening: "/videos/3.mp4",
};

const BUTTON_LABELS: Record<TimeOfDay, string> = {
  morning: "晨间",
  noon: "正午",
  evening: "傍晚",
};

export function VideoPlayerModal({ isOpen, onClose }: VideoPlayerModalProps) {
  const [currentTime, setCurrentTime] = useState<TimeOfDay>("morning");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="video-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="video-modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button className="video-modal-back" onClick={onClose}>
            ← 返回
          </button>

          <div className="video-modal-player">
            <video
              key={currentTime}
              className="video-modal-video"
              autoPlay
              loop
              playsInline
            >
              <source src={VIDEOS[currentTime]} type="video/mp4" />
            </video>
          </div>

          <div className="video-modal-controls">
            {(Object.keys(VIDEOS) as TimeOfDay[]).map((time) => (
              <button
                key={time}
                className={`video-modal-button ${currentTime === time ? "is-active" : ""}`}
                onClick={() => setCurrentTime(time)}
              >
                {BUTTON_LABELS[time]}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
