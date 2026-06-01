"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PanZoomState {
  x: number;
  y: number;
  scale: number;
}

interface UsePanZoomOptions {
  mapWidth: number;
  mapHeight: number;
  minScale: number;
  maxScale: number;
  initialScale?: number;
  /** 惯性衰减系数，越接近 1 滑行越远 */
  friction?: number;
  /** 边界留白比例（相对视口） */
  boundaryPadding?: number;
}

interface PointerSample {
  x: number;
  y: number;
  time: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getFitScale(
  viewportW: number,
  viewportH: number,
  mapW: number,
  mapH: number
) {
  return Math.min(viewportW / mapW, viewportH / mapH);
}

function getBounds(
  viewportW: number,
  viewportH: number,
  mapW: number,
  mapH: number,
  scale: number,
  padding: number
) {
  const scaledW = mapW * scale;
  const scaledH = mapH * scale;
  const padX = viewportW * padding;
  const padY = viewportH * padding;

  let minX: number;
  let maxX: number;
  let minY: number;
  let maxY: number;

  if (scaledW <= viewportW) {
    const center = (viewportW - scaledW) / 2;
    minX = maxX = center;
  } else {
    minX = viewportW - scaledW - padX;
    maxX = padX;
  }

  if (scaledH <= viewportH) {
    const center = (viewportH - scaledH) / 2;
    minY = maxY = center;
  } else {
    minY = viewportH - scaledH - padY;
    maxY = padY;
  }

  return { minX, maxX, minY, maxY };
}

export function usePanZoom({
  mapWidth,
  mapHeight,
  minScale,
  maxScale,
  initialScale,
  friction = 0.92,
  boundaryPadding = 0.08,
}: UsePanZoomOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PanZoomState>({ x: 0, y: 0, scale: 1 });
  const [ready, setReady] = useState(false);

  const stateRef = useRef(state);
  const draggingRef = useRef(false);
  const lastPointerRef = useRef<PointerSample | null>(null);
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const inertiaFrameRef = useRef<number | null>(null);
  const pinchRef = useRef<{
    distance: number;
    scale: number;
    centerX: number;
    centerY: number;
    x: number;
    y: number;
  } | null>(null);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(
    new Map()
  );

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const getViewport = useCallback(() => {
    const el = containerRef.current;
    if (!el) return { w: 0, h: 0 };
    const rect = el.getBoundingClientRect();
    return { w: rect.width, h: rect.height };
  }, []);

  const clampPosition = useCallback(
    (x: number, y: number, scale: number) => {
      const { w, h } = getViewport();
      const bounds = getBounds(
        w,
        h,
        mapWidth,
        mapHeight,
        scale,
        boundaryPadding
      );
      return {
        x: clamp(x, bounds.minX, bounds.maxX),
        y: clamp(y, bounds.minY, bounds.maxY),
        scale,
      };
    },
    [getViewport, mapWidth, mapHeight, boundaryPadding]
  );

  const setClampedState = useCallback(
    (next: PanZoomState) => {
      const clamped = clampPosition(next.x, next.y, next.scale);
      setState(clamped);
      stateRef.current = clamped;
    },
    [clampPosition]
  );

  const getFit = useCallback(() => {
    const { w, h } = getViewport();
    return getFitScale(w, h, mapWidth, mapHeight);
  }, [getViewport, mapWidth, mapHeight]);

  const scaleLimits = useCallback(() => {
    const fit = getFit();
    return {
      min: fit * minScale,
      max: fit * maxScale,
    };
  }, [getFit, minScale, maxScale]);

  const initialize = useCallback(() => {
    const { w, h } = getViewport();
    if (!w || !h) return;

    const fit = getFitScale(w, h, mapWidth, mapHeight);
    const base = initialScale ?? 0.85;
    const limits = { min: fit * minScale, max: fit * maxScale };
    const scale = clamp(fit * base, limits.min, limits.max);
    const scaledW = mapWidth * scale;
    const scaledH = mapHeight * scale;
    const x = (w - scaledW) / 2;
    const y = (h - scaledH) / 2;

    const initial = clampPosition(x, y, scale);
    setState(initial);
    stateRef.current = initial;
    setReady(true);
  }, [
    getViewport,
    mapWidth,
    mapHeight,
    initialScale,
    minScale,
    maxScale,
    clampPosition,
  ]);

  useEffect(() => {
    initialize();
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setClampedState(stateRef.current);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [initialize, setClampedState]);

  const stopInertia = useCallback(() => {
    if (inertiaFrameRef.current !== null) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
  }, []);

  const startInertia = useCallback(() => {
    stopInertia();
    const step = () => {
      const { vx, vy } = velocityRef.current;
      if (Math.abs(vx) < 0.15 && Math.abs(vy) < 0.15) {
        inertiaFrameRef.current = null;
        return;
      }
      const current = stateRef.current;
      const next = clampPosition(
        current.x + vx,
        current.y + vy,
        current.scale
      );
      setState(next);
      stateRef.current = next;
      velocityRef.current = { vx: vx * friction, vy: vy * friction };
      inertiaFrameRef.current = requestAnimationFrame(step);
    };
    inertiaFrameRef.current = requestAnimationFrame(step);
  }, [stopInertia, clampPosition, friction]);

  const zoomAtPoint = useCallback(
    (clientX: number, clientY: number, newScale: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      const current = stateRef.current;
      const { min, max } = scaleLimits();
      const scale = clamp(newScale, min, max);
      const ratio = scale / current.scale;
      const mapX = (px - current.x) / current.scale;
      const mapY = (py - current.y) / current.scale;
      const x = px - mapX * scale;
      const y = py - mapY * scale;
      setClampedState({ x, y, scale });
    },
    [scaleLimits, setClampedState]
  );

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      stopInertia();
      const delta = -e.deltaY * 0.0012;
      const current = stateRef.current;
      zoomAtPoint(e.clientX, e.clientY, current.scale * (1 + delta));
    },
    [zoomAtPoint, stopInertia]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel, ready]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-hotspot]")) return;
      stopInertia();
      draggingRef.current = true;
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      lastPointerRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
      velocityRef.current = { vx: 0, vy: 0 };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [stopInertia]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const pointers = activePointersRef.current;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2) {
        const pts = [...pointers.values()];
        const dx = pts[1].x - pts[0].x;
        const dy = pts[1].y - pts[0].y;
        const distance = Math.hypot(dx, dy);
        const cx = (pts[0].x + pts[1].x) / 2;
        const cy = (pts[0].y + pts[1].y) / 2;

        if (!pinchRef.current) {
          const current = stateRef.current;
          pinchRef.current = {
            distance,
            scale: current.scale,
            centerX: cx,
            centerY: cy,
            x: current.x,
            y: current.y,
          };
          draggingRef.current = false;
        } else {
          const pinch = pinchRef.current;
          const ratio = distance / pinch.distance;
          const { min, max } = scaleLimits();
          const newScale = clamp(pinch.scale * ratio, min, max);
          const el = containerRef.current;
          if (el) {
            const rect = el.getBoundingClientRect();
            const px = cx - rect.left;
            const py = cy - rect.top;
            const scaleRatio = newScale / pinch.scale;
            const mapX = (px - pinch.x) / pinch.scale;
            const mapY = (py - pinch.y) / pinch.scale;
            setClampedState({
              x: px - mapX * newScale,
              y: py - mapY * newScale,
              scale: newScale,
            });
          }
        }
        return;
      }

      if (!draggingRef.current || pointers.size !== 1) return;

      const last = lastPointerRef.current;
      if (!last) return;

      const now = performance.now();
      const dt = Math.max(now - last.time, 1);
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const current = stateRef.current;

      velocityRef.current = {
        vx: (dx / dt) * 16,
        vy: (dy / dt) * 16,
      };

      setClampedState({
        x: current.x + dx,
        y: current.y + dy,
        scale: current.scale,
      });

      lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };
    },
    [scaleLimits, setClampedState]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      activePointersRef.current.delete(e.pointerId);
      if (activePointersRef.current.size < 2) {
        pinchRef.current = null;
      }
      if (activePointersRef.current.size === 0) {
        draggingRef.current = false;
        lastPointerRef.current = null;
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
          /* already released */
        }
        startInertia();
      }
    },
    [startInertia]
  );

  const zoomIn = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    zoomAtPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      stateRef.current.scale * 1.2
    );
  }, [zoomAtPoint]);

  const zoomOut = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    zoomAtPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      stateRef.current.scale / 1.2
    );
  }, [zoomAtPoint]);

  const resetView = useCallback(() => {
    stopInertia();
    initialize();
  }, [stopInertia, initialize]);

  return {
    containerRef,
    state,
    ready,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    zoomIn,
    zoomOut,
    resetView,
  };
}
