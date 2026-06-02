"use client";

import { useCallback, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Puzzle piece configuration for Level 3
// 目标吸附位置与第一关/第二关保持一致（同一套 2×2 拼图布局）
const PUZZLE_PIECES = [
  {
    id: 1,
    src: "/places/puzzle-piece-9.png",
    width: 480,
    height: 360,
    startX: 125,
    startY: 21,
    targetX: -45,
    targetY: -31,
  },
  {
    id: 2,
    src: "/places/puzzle-piece-10.png",
    width: 480,
    height: 360,
    startX: 192,
    startY: 85,
    targetX: 330,
    targetY: -9,
  },
  {
    id: 3,
    src: "/places/puzzle-piece-11.png",
    width: 480,
    height: 360,
    startX: 124,
    startY: 1,
    targetX: -44,
    targetY: 198,
  },
  {
    id: 4,
    src: "/places/puzzle-piece-12.png",
    width: 480,
    height: 350,
    startX: 8,
    startY: 26,
    targetX: 302,
    targetY: 209,
  },
];

interface PieceState {
  id: number;
  x: number;
  y: number;
  locked: boolean;
  z: number;
}

const SNAP_DISTANCE = 30;

export function SacrificePuzzleLevel3() {
  const router = useRouter();
  const [pieces, setPieces] = useState<PieceState[]>(
    PUZZLE_PIECES.map((p) => ({
      id: p.id,
      x: p.startX,
      y: p.startY,
      locked: false,
      z: 10,
    }))
  );
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [finishShake, setFinishShake] = useState(false);

  const dragRef = useRef<{
    id: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const zCounterRef = useRef(10);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleNextLevel = useCallback(() => {
  router.push("/?view=map&hotspot=guilan-mountain");
}, [router]);

  const isComplete = pieces.every((p) => p.locked);

  const triggerFinishShake = useCallback(() => {
    setFinishShake(false);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => setFinishShake(true));
    } else {
      setFinishShake(true);
    }
  }, []);

  const handleFinish = useCallback(() => {
    if (!isComplete) {
      triggerFinishShake();
      return;
    }
    setShowPopup(true);
  }, [isComplete, triggerFinishShake]);

  const handlePointerDown = useCallback(
    (id: number, e: React.PointerEvent<HTMLDivElement>) => {
      const piece = pieces.find((p) => p.id === id);
      if (!piece || piece.locked) return;

      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      zCounterRef.current += 1;
      const z = zCounterRef.current;

      dragRef.current = { id, offsetX, offsetY };
      setDraggingId(id);
      setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, z } : p)));

      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [pieces]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const board = boardRef.current;
    if (!board) return;

    const boardRect = board.getBoundingClientRect();
    const x = e.clientX - boardRect.left - drag.offsetX;
    const y = e.clientY - boardRect.top - drag.offsetY;

    setPieces((prev) => prev.map((p) => (p.id === drag.id ? { ...p, x, y } : p)));
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    setPieces((prev) => {
      const current = prev.find((p) => p.id === drag.id);
      if (!current || current.locked) return prev;

      const target = PUZZLE_PIECES.find((p) => p.id === drag.id);
      if (!target) return prev;

      const distance = Math.sqrt(
        Math.pow(current.x - target.targetX, 2) + Math.pow(current.y - target.targetY, 2)
      );

      if (distance < SNAP_DISTANCE) {
        return prev.map((p) =>
          p.id === drag.id ? { ...p, x: target.targetX, y: target.targetY, locked: true } : p
        );
      }

      return prev;
    });

    dragRef.current = null;
    setDraggingId(null);
  }, []);

  return (
    <main className="puzzle-play-page">
      <div className="puzzle-play-stage">
        {/* Water script background decoration */}
        <div className="puzzle-water-script">
          <Image
            src="/places/Water Script 1.png"
            alt="水书背景"
            fill
            className="puzzle-water-script__img"
            sizes="100vw"
            priority
          />
        </div>

        {/* Title and description */}
        <div className="puzzle-header">
          <h1 className="puzzle-title">祭祀大典拼一拼（3/3）</h1>
          <p className="puzzle-description">继续探索水族文化，完成第三关拼图挑战。</p>
        </div>

        {/* Puzzle board area */}
        <div className="puzzle-board-container" ref={boardRef}>
          <div className="puzzle-board-border">
            <div className="puzzle-board-inner">
              {/* Puzzle pieces */}
              {PUZZLE_PIECES.map((config) => {
                const piece = pieces.find((p) => p.id === config.id)!;
                const isDragging = draggingId === config.id;

                return (
                  <div
                    key={config.id}
                    className={[
                      "puzzle-piece",
                      piece.locked ? "puzzle-piece--locked" : "",
                      isDragging ? "puzzle-piece--dragging" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={{
                      left: piece.x,
                      top: piece.y,
                      width: config.width,
                      height: config.height,
                      zIndex: isDragging ? 999 : piece.z,
                    }}
                    onPointerDown={(e) => handlePointerDown(config.id, e)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    role="button"
                    tabIndex={piece.locked ? -1 : 0}
                    aria-label={`拼图碎片 ${config.id}`}
                    aria-disabled={piece.locked}
                  >
                    <img
                      src={config.src}
                      alt={`拼图碎片 ${config.id}`}
                      width={config.width}
                      height={config.height}
                      draggable={false}
                      className="puzzle-piece__img"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Finish button */}
        <button
          type="button"
          className={["puzzle-finish-button", finishShake ? "puzzle-finish-button--shake" : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={handleFinish}
          aria-disabled={!isComplete}
          onAnimationEnd={() => setFinishShake(false)}
        >
          完成
        </button>

        {/* Popup Window */}
        {showPopup && (
          <div className="puzzle-popup-overlay">
            <div className="puzzle-popup-window">
             <Image
  src="/places/Popup Window 3.png"
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
  onClick={handleNextLevel}
  aria-label="回到地图"
/>
            </div>
          </div>
        )}
      </div>

      <Link href="/places/guilan-mountain" className="puzzle-play-page__back" aria-label="返回封面">
        ←
      </Link>
    </main>
  );
}
