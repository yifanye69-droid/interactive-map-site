export interface Hotspot {
  id: string;
  title: string;
  description: string;
  /** 相对地图宽度的百分比 0–100 */
  x: number;
  /** 相对地图高度的百分比 0–100 */
  y: number;
  /** 热点可点击区域半径（相对地图宽度的百分比） */
  radius?: number;
  route: string;
  icon?: string;
  /** 弹窗主按钮文案，默认「了解更多」 */
  ctaLabel?: string;
}

export interface MapConfig {
  mapWidth: number;
  mapHeight: number;
  imageSrc: string;
  previewSrc?: string;
  minScale: number;
  maxScale: number;
  initialScale?: number;
  hotspots: Hotspot[];
}
