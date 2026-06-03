export type AmbientKind =
  | "cloud"
  | "boat"
  | "bird"
  | "flag"
  | "particle"
  | "ufo"
  | "balloon"
  | "helicopter"
  | "sparkle"
  | "bubble";

export interface AmbientObject {
  id: string;
  kind: AmbientKind;
  /** 相对地图 % */
  x: number;
  y: number;
  /** 视差深度 0=远 1=近 */
  depth: number;
  scale?: number;
  duration?: number;
  delay?: number;
}

export const ambientObjects: AmbientObject[] = [
  { id: "c1", kind: "cloud", x: 8, y: 6, depth: 0.9, scale: 1.2, duration: 28 },
  { id: "c2", kind: "cloud", x: 72, y: 4, depth: 0.85, scale: 0.9, duration: 32 },
  { id: "c3", kind: "cloud", x: 45, y: 10, depth: 0.95, scale: 1.4, duration: 24 },
  { id: "b1", kind: "boat", x: 55, y: 42, depth: 0.5, duration: 18 },
  { id: "b2", kind: "boat", x: 12, y: 88, depth: 0.45, duration: 22 },
  { id: "bird1", kind: "bird", x: 30, y: 15, depth: 0.7, duration: 14 },
  { id: "bird2", kind: "bird", x: 80, y: 22, depth: 0.75, duration: 16 },
  { id: "f1", kind: "flag", x: 20, y: 75, depth: 0.55, duration: 3 },
  { id: "f2", kind: "flag", x: 48, y: 28, depth: 0.6, duration: 2.8 },
  { id: "bal1", kind: "balloon", x: 65, y: 12, depth: 0.8, duration: 20 },
  { id: "bal2", kind: "balloon", x: 25, y: 35, depth: 0.78, duration: 24 },
  { id: "heli1", kind: "helicopter", x: 38, y: 8, depth: 0.72, duration: 25 },
  { id: "ufo1", kind: "ufo", x: 88, y: 18, depth: 0.82, duration: 30 },
  { id: "p1", kind: "particle", x: 15, y: 50, depth: 0.3, duration: 6 },
  { id: "p2", kind: "particle", x: 60, y: 65, depth: 0.25, duration: 7 },
  { id: "p3", kind: "particle", x: 90, y: 55, depth: 0.28, duration: 5.5 },
  { id: "p4", kind: "particle", x: 40, y: 80, depth: 0.32, duration: 6.5 },
  { id: "bb1", kind: "bubble", x: 62, y: 48, depth: 0.65, duration: 8 },
  { id: "bb2", kind: "bubble", x: 35, y: 58, depth: 0.62, duration: 9 },
  { id: "sp1", kind: "sparkle", x: 42, y: 32, depth: 0.88, duration: 4 },
  { id: "sp2", kind: "sparkle", x: 78, y: 38, depth: 0.86, duration: 3.5 },
];

export const easterEggs = [];
