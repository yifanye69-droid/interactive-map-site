"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  PUZZLE_PIECES,
  PUZZLE_TARGETS,
  SNAP_DISTANCE_PX,
  type PieceId,
} from "@/lib/puzzleFragments";

interface PieceState {
  id: PieceId;
  x: number;
  y: number;
  z: number;
  locked: boolean;
  snapping: boolean;
  flash: boolean;
}

function distPx(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function initPieces(): PieceState[] {
  return PUZZLE_PIECES.map((p, i) => ({
    id: p.id,
    x: p.startX,
    y: p.startY,
    z: i + 1,
    locked: false,
    snapping: false,
    flash: false,
  }));
}

export function PuzzleDraggableBoard({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [pieces, setPieces] = useState<PieceState[]>(initPieces);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [draggingId, setDraggingId] = useState<PieceId | null>(null);

  const dragRef = useRef<{
    id: PieceId;
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const zCounterRef = useRef(10);

  const updateScale = useCallback(() => {
    const el = boardRef.current;
    if (!el) return;
    setScale({
      x: el.clientWidth / DESIGN_WIDTH,
      y: el.clientHeight / DESIGN_HEIGHT,
    });
  }, []);

  useEffect(() => {
    updateScale();
    const el = boardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScale]);

  const checkComplete = useCallback(
    (next: PieceState[]) => {
      if (next.every((p) => p.locked)) {
        onComplete();
      }
    },
    [onComplete]
  );

  const triggerSnapFlash = useCallback((id: PieceId) => {
    setPieces((prev) =>
      prev.map((p) => (p.id === id ? { ...p, flash: true } : p))
    );
    window.setTimeout(() => {
      setPieces((prev) =>
        prev.map((p) => (p.id === id ? { ...p, flash: false } : p))
      );
    }, 300);
  }, []);

  const clientToDesign = useCallback((clientX: number, clientY: number) => {
    const board = boardRef.current;
    if (!board) return { x: 0, y: 0 };
    const rect = board.getBoundingClientRect();
    const sx = board.clientWidth / DESIGN_WIDTH;
    const sy = board.clientHeight / DESIGN_HEIGHT;
    return {
      x: (clientX - rect.left) / sx,
      y: (clientY - rect.top) / sy,
    };
  }, []);

  const onPointerDown = useCallback(
    (id: PieceId, e: React.PointerEvent<HTMLDivElement>) => {
      const piece = pieces.find((p) => p.id === id);
      if (!piece || piece.locked) return;

      e.preventDefault();
      const design = clientToDesign(e.clientX, e.clientY);
      zCounterRef.current += 1;
      const z = zCounterRef.current;

      dragRef.current = {
        id,
        pointerId: e.pointerId,
        offsetX: design.x - piece.x,
        offsetY: design.y - piece.y,
      };

      setDraggingId(id);
      setPieces((prev) =>
        prev.map((p) => (p.id === id ? { ...p, z } : p))
      );

      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [pieces, clientToDesign]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;

      const design = clientToDesign(e.clientX, e.clientY);
      const x = design.x - drag.offsetX;
      const y = design.y - drag.offsetY;

      setPieces((prev) =>
        prev.map((p) => (p.id === drag.id ? { ...p, x, y } : p))
      );
    },
    [clientToDesign]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      setPieces((prev) => {
        const current = prev.find((p) => p.id === drag.id);
        if (!current || current.locked) return prev;

        const target = PUZZLE_TARGETS[drag.id];
        const d = distPx(current.x, current.y, target.x, target.y);

        if (d < SNAP_DISTANCE_PX) {
          const next = prev.map((p) =>
            p.id === drag.id
              ? {
                  ...p,
                  x: target.x,
                  y: target.y,
                  locked: true,
                  snapping: true,
                }
              : p
          );
          triggerSnapFlash(drag.id);
          window.setTimeout(() => {
            setPieces((inner) =>
              inner.map((p) =>
                p.id === drag.id ? { ...p, snapping: false } : p
              )
            );
          }, 200);
          checkComplete(next);
          return next;
        }

        return prev;
      });

      dragRef.current = null;
      setDraggingId(null);
    },
    [checkComplete, triggerSnapFlash]
  );

  return (
    <div className="puzzle-board" ref={boardRef}>
      {PUZZLE_PIECES.map((config) => {
        const piece = pieces.find((p) => p.id === config.id)!;
        const isDragging = draggingId === config.id;

        return (
          <div
            key={config.id}
            className={[
              "piece",
              piece.locked ? "piece--locked" : "",
              isDragging ? "piece--dragging" : "",
              piece.snapping ? "piece--snapping" : "",
              piece.flash ? "piece--snap-flash" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            data-piece={config.id}
            style={{
              left: piece.x * scale.x,
              top: piece.y * scale.y,
              width: config.width * scale.x,
              height: config.height * scale.y,
              zIndex: isDragging ? 999 : piece.z,
            }}
            onPointerDown={(e) => onPointerDown(config.id, e)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="button"
            tabIndex={piece.locked ? -1 : 0}
            aria-label={config.label}
            aria-disabled={piece.locked}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.src}
              alt=""
              width={config.width}
              height={config.height}
              draggable={false}
              className="piece__img"
              style={{
                width: config.width * scale.x,
                height: config.height * scale.y,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
