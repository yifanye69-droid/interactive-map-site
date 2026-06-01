"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

interface SplashScreenProps {
  onEnter: () => void;
}

const ASSET_BASE = "/festival_assets_png";
const BLUE_BANNER = `${ASSET_BASE}/banner_blue.png`;
const PINK_BANNER = `${ASSET_BASE}/banner_pink.png`;
const RANDOM_BANNERS = [
  `${ASSET_BASE}/banner_2.png`,
  `${ASSET_BASE}/banner_4.png`,
  `${ASSET_BASE}/banner_5.png`,
];
const HORSE_1 = `${ASSET_BASE}/horse1.png`;
const HORSE_2 = `${ASSET_BASE}/horse2.png`;
const SPECIAL_INDEX = 14;

const BANNERS = [
  { x: -2, y: 46, h: 59, z: 8, special: false },
  { x: 4, y: 44, h: 69, z: 10, special: false },
  { x: 9, y: 49, h: 74, z: 13, special: false },
  { x: 15, y: 47, h: 64, z: 11, special: false },
  { x: 20, y: 44, h: 70, z: 9, special: false },
  { x: 25, y: 47, h: 63, z: 12, special: false },
  { x: 31, y: 44, h: 67, z: 10, special: false },
  { x: 36, y: 41, h: 78, z: 14, special: false },
  { x: 41, y: 47, h: 65, z: 9, special: false },
  { x: 47, y: 47, h: 72, z: 12, special: false },
  { x: 52, y: 45, h: 62, z: 10, special: false },
  { x: 57, y: 48, h: 58, z: 8, special: false },
  { x: 62, y: 47, h: 65, z: 15, special: false },
  { x: 67, y: 49, h: 60, z: 9, special: false },
  { x: 61.2, y: 56, h: 66, z: 22, special: true },
  { x: 69.5, y: 49, h: 67, z: 16, special: false },
  { x: 75, y: 45, h: 66, z: 11, special: false },
  { x: 80, y: 42, h: 76, z: 12, special: false },
  { x: 85, y: 47, h: 64, z: 10, special: false },
  { x: 90, y: 45, h: 70, z: 11, special: false },
  { x: 96, y: 46, h: 68, z: 9, special: false },
  { x: 101, y: 49, h: 61, z: 8, special: false },
] as const;

const AMBIENT_FIREWORKS = [
  { x: 6, y: 17, c: "#74c7ee", s: 0.8 },
  { x: 15, y: 14, c: "#f4bf38", s: 0.9 },
  { x: 26, y: 7, c: "#78d3ef", s: 0.65 },
  { x: 45, y: 10, c: "#79c9ef", s: 0.75 },
  { x: 66, y: 16, c: "#f1b935", s: 0.9 },
  { x: 96, y: 9, c: "#f5bd32", s: 0.95 },
  { x: 3, y: 89, c: "#7dc8ed", s: 0.6 },
  { x: 27, y: 90, c: "#ff7d91", s: 1 },
  { x: 52, y: 93, c: "#7bc9ee", s: 0.65 },
  { x: 69, y: 94, c: "#9b7ce2", s: 0.7 },
  { x: 76, y: 91, c: "#f2bb34", s: 0.9 },
  { x: 97, y: 93, c: "#ff7d91", s: 0.72 },
];

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const horseRef = useRef<HTMLImageElement>(null);
  const [hoveredBanner, setHoveredBanner] = useState<number | null>(null);
  const [burstFireworks, setBurstFireworks] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [randomBannerSrc, setRandomBannerSrc] = useState<Record<number, string>>({});

  const ambientDots = useMemo(
    () => Array.from({ length: 90 }, (_, index) => ({
      id: index,
      x: (index * 37) % 100,
      y: (index * 53) % 100,
      color: ["#4da8ff", "#ff7aa2", "#f5c84c", "#9b7ce2", "#73d2a6"][index % 5],
    })),
    []
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".splash-layout-banner", {
        y: -80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.035,
        ease: "back.out(1.3)",
      });
      gsap.from(".splash-layout-horse", {
        x: -35,
        opacity: 0,
        duration: 0.9,
        delay: 0.45,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onMove = (event: MouseEvent | TouchEvent) => {
      const el = containerRef.current;
      if (!el || !sceneRef.current || !horseRef.current) return;
      const rect = el.getBoundingClientRect();
      const point = "touches" in event && event.touches[0] ? event.touches[0] : event as MouseEvent;
      const x = point.clientX - rect.left - rect.width / 2;
      const y = point.clientY - rect.top - rect.height / 2;

      gsap.to(sceneRef.current, {
        x: x * 0.018,
        y: y * 0.018,
        rotateY: x * 0.008,
        rotateX: -y * 0.006,
        duration: 0.55,
        ease: "power2.out",
      });
      gsap.to(horseRef.current, {
        x: x * 0.008,
        y: y * 0.006,
        duration: 0.55,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  const handleHover = useCallback((index: number | null) => {
    setHoveredBanner(index);
    if (index !== null && index !== SPECIAL_INDEX) {
      setRandomBannerSrc((previous) => ({
        ...previous,
        [index]: RANDOM_BANNERS[Math.floor(Math.random() * RANDOM_BANNERS.length)],
      }));
    }
  }, []);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const colors = ["#ff7d91", "#f4bf38", "#74c7ee", "#9b7ce2", "#73d2a6"];
      const next = Array.from({ length: 5 }, (_, index) => ({
        id: Date.now() + index,
        x: event.clientX - rect.left + (index - 2) * 22,
        y: event.clientY - rect.top + ((index % 2) - 0.5) * 22,
        color: colors[(Date.now() + index) % colors.length],
      }));
      setBurstFireworks((previous) => [...previous.slice(-20), ...next]);
      window.setTimeout(() => {
        setBurstFireworks((previous) => previous.filter((item) => !next.some((created) => created.id === item.id)));
      }, 1100);
    }
  }, []);

  const enterMap = useCallback(() => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.03,
      duration: 0.55,
      ease: "power2.inOut",
      onComplete: onEnter,
    });
  }, [onEnter]);

  return (
    <div ref={containerRef} className="splash-reference-screen" onClick={handleClick}>
      <div ref={sceneRef} className="splash-reference-scene">
        <div className="splash-reference-bg">
          {ambientDots.map((dot) => (
            <span
              key={dot.id}
              className="splash-confetti-dot"
              style={{ left: `${dot.x}%`, top: `${dot.y}%`, backgroundColor: dot.color }}
            />
          ))}
          {AMBIENT_FIREWORKS.map((firework, index) => (
            <span
              key={index}
              className="splash-radial-firework"
              style={{
                left: `${firework.x}%`,
                top: `${firework.y}%`,
                color: firework.c,
                transform: `scale(${firework.s})`,
                animationDelay: `${index * 0.18}s`,
              }}
            />
          ))}
        </div>

        <div className="splash-layout">
          {BANNERS.map((banner, index) => {
            const isHovered = hoveredBanner === index;
            const src = banner.special
              ? isHovered ? PINK_BANNER : BLUE_BANNER
              : isHovered ? randomBannerSrc[index] || RANDOM_BANNERS[index % RANDOM_BANNERS.length] : BLUE_BANNER;

            return (
              <motion.div
                key={index}
                className={`splash-layout-banner ${banner.special ? "is-special" : ""} ${isHovered ? "is-hovered" : ""}`}
                style={{
                  left: `${banner.x}%`,
                  top: `${banner.y}%`,
                  height: `${banner.h}%`,
                  zIndex: banner.z,
                }}
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={() => handleHover(null)}
                onClick={(event) => {
                  event.stopPropagation();
                  if (banner.special && isHovered) enterMap();
                }}
                animate={{ y: isHovered ? [-6, -18, -8] : 0 }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
              >
                <img src={src} alt="" draggable={false} />
              </motion.div>
            );
          })}

          <img
            ref={horseRef}
            className={`splash-layout-horse ${hoveredBanner === SPECIAL_INDEX ? "is-peeking" : ""}`}
            src={hoveredBanner === SPECIAL_INDEX ? HORSE_2 : HORSE_1}
            alt=""
            draggable={false}
          />
        </div>

        {burstFireworks.map((firework) => (
          <span
            key={firework.id}
            className="splash-click-firework"
            style={{ left: firework.x, top: firework.y, color: firework.color }}
          />
        ))}
      </div>
    </div>
  );
}
