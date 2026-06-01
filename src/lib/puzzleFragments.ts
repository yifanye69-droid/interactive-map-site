/**
 * 设计稿坐标系（Template 1/2/3 均为 1925×1080）
 * 所有拼图尺寸与目标位为像素值，展示时按舞台等比缩放，禁止改 scale
 */

export const DESIGN_WIDTH = 1925;
export const DESIGN_HEIGHT = 1080;

export const SNAP_DISTANCE_PX = 30;

export interface PuzzlePieceConfig {
  id: "1" | "2" | "3" | "4";
  src: string;
  label: string;
  width: number;
  height: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

/** Template 2 散落 + Template 3 拼合（图像匹配校准，1925×1080） */
export const PUZZLE_PIECES: PuzzlePieceConfig[] = [
  {
    id: "1",
    src: "/places/fragments/small-fragment-1.png",
    label: "拼图碎片 1",
    width: 459,
    height: 273,
    startX: 302,
    startY: 530,
    targetX: 548,
    targetY: 371,
  },
  {
    id: "2",
    src: "/places/fragments/small-fragment-2.png",
    label: "拼图碎片 2",
    width: 414,
    height: 328,
    startX: 1094,
    startY: 626,
    targetX: 962,
    targetY: 371,
  },
  {
    id: "3",
    src: "/places/fragments/small-fragment-3.png",
    label: "拼图碎片 3",
    width: 404,
    height: 318,
    startX: 110,
    startY: 306,
    targetX: 548,
    targetY: 623,
  },
  {
    id: "4",
    src: "/places/fragments/small-fragment-4.png",
    label: "拼图碎片 4",
    width: 466,
    height: 278,
    startX: 1350,
    startY: 562,
    targetX: 908,
    targetY: 665,
  },
];

export type PieceId = (typeof PUZZLE_PIECES)[number]["id"];

export const PUZZLE_TARGETS: Record<PieceId, { x: number; y: number }> =
  Object.fromEntries(
    PUZZLE_PIECES.map((p) => [p.id, { x: p.targetX, y: p.targetY }])
  ) as Record<PieceId, { x: number; y: number }>;

/** Popup Window 1（finish 2 画面中的位置，设计稿百分比） */
export const PUZZLE_POPUP_BOUNDS = {
  left: 35.74,
  top: 35.46,
  width: 28.16,
  height: 43.49,
} as const;
