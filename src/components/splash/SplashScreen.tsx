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
const SPECIAL_INDEX = 20;
const METEOR_COLORS = ["#fff5d6", "#ffeaa7", "#ffd93d", "#ffec8b", "#fff9e6", "#ff9ec7", "#b8e4ff"];

const BANNERS = [
  { x: 5, y: 5, h: 55, z: 8, special: false },
  { x: 8, y: 5, h: 62, z: 10, special: false },
  { x: 11, y: 5, h: 58, z: 22, special: false },
  { x: 14, y: 5, h: 65, z: 11, special: false },
  { x: 17, y: 5, h: 52, z: 9, special: false },
  { x: 20, y: 5, h: 60, z: 12, special: false },
  { x: 23, y: 5, h: 55, z: 10, special: false },
  { x: 26, y: 5, h: 68, z: 14, special: false },
  { x: 29, y: 5, h: 50, z: 9, special: false },
  { x: 32, y: 5, h: 57, z: 8, special: false },
  { x: 35, y: 5, h: 63, z: 10, special: false },
  { x: 38, y: 5, h: 54, z: 11, special: false },
  { x: 41, y: 5, h: 59, z: 9, special: false },
  { x: 44, y: 5, h: 66, z: 8, special: false },
  { x: 47, y: 5, h: 53, z: 10, special: false },
  { x: 50, y: 5, h: 61, z: 11, special: false },
  { x: 53, y: 5, h: 56, z: 9, special: false },
  { x: 56, y: 5, h: 64, z: 10, special: false },
  { x: 59, y: 5, h: 51, z: 8, special: false },
  { x: 62, y: 5, h: 58, z: 9, special: false },
  { x: 60, y: 5, h: 67, z: 22, special: true },
  { x: 63, y: 5, h: 55, z: 11, special: false },
  { x: 66, y: 5, h: 62, z: 8, special: false },
  { x: 69, y: 5, h: 52, z: 9, special: false },
  { x: 72, y: 5, h: 59, z: 10, special: false },
  { x: 75, y: 5, h: 65, z: 11, special: false },
  { x: 78, y: 5, h: 54, z: 8, special: false },
  { x: 81, y: 5, h: 60, z: 9, special: false },
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
  const bgRef = useRef<HTMLDivElement>(null);
  const horseRef = useRef<HTMLImageElement>(null);
  const [hoveredBanner, setHoveredBanner] = useState<number | null>(null);
  const [burstFireworks, setBurstFireworks] = useState<{ id: number; x: number; y: number; color: string; age: number }[]>([]);
  const [randomBannerSrc, setRandomBannerSrc] = useState<Record<number, string>>({});
  const [isWarpSpeed, setIsWarpSpeed] = useState(false);
  const lastFireworkTime = useRef<number>(0);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  const ambientDots = useMemo(
    () => Array.from({ length: 1000 }, (_, index) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 200;
      const startX = Math.cos(angle) * distance;
      const startY = Math.sin(angle) * distance;
      return {
        id: index,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 12 + Math.random() * 12,
        color: Math.random() > 0.85 ? ["#ff9ec7", "#b8e4ff", "#7ee8b5"][Math.floor(Math.random() * 3)] : ["#fff5d6", "#ffeaa7", "#ffd93d", "#ffec8b", "#fff9e6", "#ffffcc"][Math.floor(Math.random() * 6)],
        speed: 1 + Math.random() * 2,
        delay: Math.random() * 6,
        startX,
        startY,
      };
    }),
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
    const interval = setInterval(() => {
      setBurstFireworks((previous) =>
        previous
          .map((fw) => ({ ...fw, age: fw.age + 1 }))
          .filter((fw) => fw.age < 20)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onMove = (event: MouseEvent | TouchEvent) => {
      const el = containerRef.current;
      if (!el || !bgRef.current) return;
      const rect = el.getBoundingClientRect();
      const point = "touches" in event && event.touches[0] ? event.touches[0] : event as MouseEvent;
      const x = point.clientX - rect.left - rect.width / 2;
      const y = point.clientY - rect.top - rect.height / 2;

      gsap.to(bgRef.current, {
        x: x * 0.018,
        y: y * 0.018,
        rotate: x * 0.015,
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
    if (index !== null && index !== SPECIAL_INDEX && !randomBannerSrc[index]) {
      setRandomBannerSrc((previous) => ({
        ...previous,
        [index]: RANDOM_BANNERS[index % RANDOM_BANNERS.length],
      }));
    }
  }, [randomBannerSrc]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastFireworkTime.current < 80) return;
    lastFireworkTime.current = now;

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const next = Array.from({ length: 8 }, (_, index) => ({
        id: Date.now() + index,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        color: METEOR_COLORS[Math.floor(Math.random() * METEOR_COLORS.length)],
        age: 0,
      }));
      setBurstFireworks((previous) => [...previous.slice(-50), ...next]);
      window.setTimeout(() => {
        setBurstFireworks((previous) => previous.filter((item) => !next.some((created) => created.id === item.id)));
      }, 2000);
    }
  }, []);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const next = Array.from({ length: 5 }, (_, index) => ({
        id: Date.now() + index,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        color: METEOR_COLORS[Math.floor(Math.random() * METEOR_COLORS.length)],
        age: 0,
      }));
      setBurstFireworks((previous) => [...previous.slice(-25), ...next]);
      window.setTimeout(() => {
        setBurstFireworks((previous) => previous.filter((item) => !next.some((created) => created.id === item.id)));
      }, 2000);
    }
    setIsWarpSpeed((prev) => !prev);
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
    <div ref={containerRef} className="splash-reference-screen" onClick={handleClick} onMouseMove={handleMouseMove}>
      <div ref={sceneRef} className="splash-reference-scene">
        <div ref={bgRef} className={`splash-reference-bg ${isWarpSpeed ? 'warp-speed' : ''}`}>
          {ambientDots.map((dot) => (
            <span
              key={dot.id}
              className="splash-confetti-dot"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                backgroundColor: dot.color,
                '--warp-duration': `${dot.speed}s`,
                animationDelay: `-${dot.delay}s`,
                '--start-x': `${dot.startX}px`,
                '--start-y': `${dot.startY}px`,
              } as React.CSSProperties}
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
          <img src="/xiuxiuxiu.png" alt="XIUXIUXIU" className="splash-logo" />
          <div className="splash-hint-text">找到令马转头的水书！</div>
        </div>

        {burstFireworks.map((firework) => (
          <span
            key={firework.id}
            className="splash-click-firework"
            style={{
              left: firework.x,
              top: firework.y,
              color: firework.color,
              '--age': firework.age,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
