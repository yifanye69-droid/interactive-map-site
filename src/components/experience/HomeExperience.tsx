"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { LoaderScreen } from "@/components/splash/LoaderScreen";
import { SplashScreen } from "@/components/splash/SplashScreen";
import {
  MAP_SKIP_INTRO_KEY,
  markMapIntroSkipped,
  queueHotspotReopen,
  shouldStartOnMap,
} from "@/lib/festivalMapSession";

type Phase = "load" | "splash" | "map";

export function HomeExperience() {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("load");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (shouldStartOnMap()) {
      setPhase("map");
    }
  }, []);

  useEffect(() => {
    const view = searchParams.get("view");
    const hotspot = searchParams.get("hotspot");

    if (view === "map") {
      markMapIntroSkipped();
      setPhase("map");
    }

    if (hotspot) {
      queueHotspotReopen(hotspot);
    }
  }, [searchParams]);

  useEffect(() => {
    if (mounted && sessionStorage.getItem(MAP_SKIP_INTRO_KEY) === "1") {
      setPhase("map");
    }
  }, [mounted]);

  const enterMap = useCallback(() => {
    markMapIntroSkipped();
    setPhase("map");
  }, []);

  return (
    <div className="experience-root">
      <AnimatePresence mode="wait">
        {phase === "load" && (
          <LoaderScreen key="load" onComplete={() => setPhase("splash")} />
        )}
        {phase === "splash" && (
          <SplashScreen key="splash" onEnter={enterMap} />
        )}
      </AnimatePresence>

      {phase === "map" && (
        <motion.div
          className="experience-map"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <InteractiveMap />
        </motion.div>
      )}
    </div>
  );
}
