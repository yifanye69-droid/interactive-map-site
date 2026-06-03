"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface EyeChallengeGameProps {
  isOpen: boolean;
  onClose: () => void;
}

type Stage = 1 | 2 | 3;

const STAGE_IMAGES: Record<Stage, string> = {
  1: "/eye-challenge/眼里1.png",
  2: "/eye-challenge/眼里2.png",
  3: "/eye-challenge/眼里3.png",
};

export function EyeChallengeGame({ isOpen, onClose }: EyeChallengeGameProps) {
  const [stage, setStage] = useState<Stage>(1);
  const [isComplete, setIsComplete] = useState(false);

  // Reset stage when modal opens
  useEffect(() => {
    if (isOpen) {
      setStage(1);
      setIsComplete(false);
    }
  }, [isOpen]);

  const handleClick = () => {
    if (stage < 3) {
      setStage((prev) => (prev + 1) as Stage);
    }
  };

  const handleSubmit = () => {
    setIsComplete(true);
  };

  const handleRestart = () => {
    setStage(1);
    setIsComplete(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="eye-challenge-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="eye-challenge-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button className="eye-challenge-back" onClick={onClose}>
            ← 返回地图
          </button>

          <div className="eye-challenge-stage" onClick={handleClick}>
            <AnimatePresence mode="wait">
              {!isComplete && (
                <motion.img
                  key={stage}
                  src={STAGE_IMAGES[stage]}
                  alt={`眼力挑战 第${stage}关`}
                  className="eye-challenge-image"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </AnimatePresence>
            
            {stage < 3 && (
              <motion.div
                className="eye-challenge-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                点击屏幕继续
              </motion.div>
            )}
            
            {stage === 3 && !isComplete && (
              <motion.button
                className="eye-challenge-submit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit();
                }}
              >
                提交
              </motion.button>
            )}
            
            {isComplete && (
              <motion.div
                className="eye-challenge-complete-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="eye-challenge-complete-text">挑战成功！</div>
                <img src="/eye-challenge/IMG_3595.GIF" alt="庆祝" className="eye-challenge-gif" />
                <motion.button
                  className="eye-challenge-restart"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestart();
                  }}
                >
                  再来一次
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
