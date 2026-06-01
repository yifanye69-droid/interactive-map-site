export const MAP_SKIP_INTRO_KEY = "festival-map-skip-intro";
export const MAP_REOPEN_HOTSPOT_KEY = "festival-map-reopen-hotspot";

export function markMapIntroSkipped() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(MAP_SKIP_INTRO_KEY, "1");
  }
}

export function queueHotspotReopen(hotspotId: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(MAP_REOPEN_HOTSPOT_KEY, hotspotId);
  }
}

export function consumeHotspotReopen(): string | null {
  if (typeof window === "undefined") return null;
  const id = sessionStorage.getItem(MAP_REOPEN_HOTSPOT_KEY);
  if (id) sessionStorage.removeItem(MAP_REOPEN_HOTSPOT_KEY);
  return id;
}

export function shouldStartOnMap(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(MAP_SKIP_INTRO_KEY) === "1";
}
