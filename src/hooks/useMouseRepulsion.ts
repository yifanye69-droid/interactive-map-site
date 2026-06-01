"use client";

import { useEffect, useRef } from "react";

export interface RepulsionConfig {
  radius?: number;
  strength?: number;
  springStrength?: number;
  damping?: number;
}

export interface RepulsionTarget {
  id: string;
  baseX: number;
  baseY: number;
  element: HTMLElement;
}

/**
 * Ponpon 风格鼠标排斥 + 弹簧回弹（rAF）
 */
export function useMouseRepulsion(
  containerRef: React.RefObject<HTMLElement | null>,
  targets: RepulsionTarget[],
  enabled: boolean,
  config: RepulsionConfig = {}
) {
  const mouse = useRef({ x: 0, y: 0 });
  const positions = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(
    new Map()
  );
  const raf = useRef<number>(0);

  const radius = config.radius ?? 2.2;
  const strength = config.strength ?? 1.5;
  const springStrength = config.springStrength ?? 0.12;
  const damping = config.damping ?? 0.82;

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    targets.forEach((t) => {
      if (!positions.current.has(t.id)) {
        positions.current.set(t.id, { x: t.baseX, y: t.baseY, vx: 0, vy: 0 });
      }
    });

    const container = containerRef.current;

    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      let cx = 0;
      let cy = 0;
      if ("touches" in e && e.touches[0]) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if ("clientX" in e) {
        cx = e.clientX;
        cy = e.clientY;
      }
      mouse.current = {
        x: ((cx - rect.left) / rect.width) * 2 - 1,
        y: ((cy - rect.top) / rect.height) * 2 - 1,
      };
    };

    const tick = () => {
      const deltaTime = 1;
      targets.forEach((target) => {
        const state = positions.current.get(target.id);
        if (!state) return;

        const dx = target.baseX - mouse.current.x;
        const dy = target.baseY - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulsion = Math.max(0, 1 - dist / radius) * strength;

        const targetX = target.baseX + dx * repulsion;
        const targetY = target.baseY - (Math.abs(dy * repulsion) / 2) * Math.sign(dy || 1);

        state.vx += (targetX - state.x) * springStrength * deltaTime;
        state.vy += (targetY - state.y) * springStrength * deltaTime;
        state.vx *= damping;
        state.vy *= damping;
        state.x += state.vx;
        state.y += state.vy;

        target.element.style.transform = `translate3d(${state.x * 48}px, ${state.y * 32}px, 0)`;
      });
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, [enabled, targets, containerRef, radius, strength, springStrength, damping]);
}
