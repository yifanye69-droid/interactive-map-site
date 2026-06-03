"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mapConfig } from "@/lib/mapConfig";
import { usePanZoom } from "@/hooks/usePanZoom";
import { HotspotMarker } from "./HotspotMarker";
import { HotspotDetailModal } from "./HotspotDetailModal";
import { VideoPlayerModal } from "./VideoPlayerModal";
import { EyeChallengeGame } from "./EyeChallengeGame";
import { AIChatWindow } from "./AIChatWindow";
import { MapChrome } from "./MapChrome";
import { ParallaxOverlay } from "./ParallaxOverlay";
import { MapAmbientLayer } from "./ambient/MapAmbientLayer";
import { consumeHotspotReopen } from "@/lib/festivalMapSession";
import type { Hotspot } from "@/types/hotspot";

export function InteractiveMap() {
  const { mapWidth, mapHeight, imageSrc, previewSrc, minScale, maxScale, initialScale, hotspots } =
    mapConfig;

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [eyeChallengeOpen, setEyeChallengeOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cameraDrift, setCameraDrift] = useState({ x: 0, y: 0 });
  const [dodgingCloud, setDodgingCloud] = useState<string | null>(null);

  const {
    containerRef,
    state,
    ready,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    zoomIn,
    zoomOut,
    resetView,
  } = usePanZoom({
    mapWidth,
    mapHeight,
    minScale,
    maxScale,
    initialScale,
  });

  const handleHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  const handleHotspotClick = useCallback((hotspot: Hotspot) => {
    if (hotspot.isVideo) {
      setVideoModalOpen(true);
    } else if (hotspot.isSpecial && !hotspot.route) {
      setEyeChallengeOpen(true);
    } else {
      setSelectedHotspot(hotspot);
    }
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedHotspot(null);
  }, []);

  const handleCloudClick = (cloudId: string) => {
    setDodgingCloud(cloudId);
    setTimeout(() => setDodgingCloud(null), 500);
  };

  useEffect(() => {
    const reopenId = consumeHotspotReopen();
    if (!reopenId) return;
    const hotspot = hotspots.find((h) => h.id === reopenId);
    if (hotspot) setSelectedHotspot(hotspot);
  }, [hotspots]);

  /* 镜头呼吸漂移 — 静止时地图仍有生命感 */
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      setCameraDrift({
        x: Math.sin(t * 0.15) * 4,
        y: Math.cos(t * 0.12) * 3,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const transformX = state.x + cameraDrift.x;
  const transformY = state.y + cameraDrift.y;

  return (
    <>
      <div className="interactive-map">
        <div className="map-dot-grid" />
        <ParallaxOverlay panX={state.x} panY={state.y} scale={state.scale} />

        <header className="map-header">
          <p className="map-header__tag">探索模式</p>
          <h1 className="map-header__title">节庆岛屿</h1>
        </header>

        {!imageLoaded && previewSrc && (
          <div
            className="map-preview-bg"
            style={{ backgroundImage: `url(${previewSrc})` }}
          />
        )}

        <div
          ref={containerRef}
          className="map-viewport"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          style={{ opacity: ready ? 1 : 0 }}
        >
          <motion.div
            className="map-stage"
            style={{
              width: mapWidth,
              height: mapHeight,
              transform: `translate3d(${transformX}px, ${transformY}px, 0) scale(${state.scale})`,
            }}
          >
            <Image
              src={imageSrc}
              alt="节庆互动岛屿地图"
              width={mapWidth}
              height={mapHeight}
              priority
              unoptimized
              draggable={false}
              className="map-stage__image"
              onLoad={() => setImageLoaded(true)}
            />

            <MapAmbientLayer panX={state.x} panY={state.y} />

            {hotspots.map((hotspot) => (
              <HotspotMarker
                key={hotspot.id}
                hotspot={hotspot}
                isActive={hoveredId === hotspot.id}
                isHovered={hoveredId === hotspot.id}
                nearbyActive={hoveredId !== null && hoveredId !== hotspot.id}
                onHover={handleHover}
                onClick={handleHotspotClick}
              />
            ))}
          </motion.div>
        </div>

        <div className="map-floating-clouds">
          <div
            className={`map-floating-cloud map-floating-cloud--1 ${dodgingCloud === '1' ? 'dodging' : ''}`}
            onClick={() => handleCloudClick('1')}
          />
          <div
            className={`map-floating-cloud map-floating-cloud--2 ${dodgingCloud === '2' ? 'dodging' : ''}`}
            onClick={() => handleCloudClick('2')}
          />
          <div
            className={`map-floating-cloud map-floating-cloud--3 ${dodgingCloud === '3' ? 'dodging' : ''}`}
            onClick={() => handleCloudClick('3')}
          />
          <div
            className={`map-floating-cloud map-floating-cloud--4 ${dodgingCloud === '4' ? 'dodging' : ''}`}
            onClick={() => handleCloudClick('4')}
          />
          <div
            className={`map-floating-cloud map-floating-cloud--5 ${dodgingCloud === '5' ? 'dodging' : ''}`}
            onClick={() => handleCloudClick('5')}
          />
          <div
            className={`map-floating-cloud map-floating-cloud--6 ${dodgingCloud === '6' ? 'dodging' : ''}`}
            onClick={() => handleCloudClick('6')}
          />
        </div>

        <MapChrome onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetView} />

        <AnimatePresence>
          {selectedHotspot && (
            <HotspotDetailModal
              key={selectedHotspot.id}
              hotspot={selectedHotspot}
              onClose={handleCloseCard}
            />
          )}
        </AnimatePresence>

        <VideoPlayerModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} />

        <EyeChallengeGame isOpen={eyeChallengeOpen} onClose={() => setEyeChallengeOpen(false)} />
      </div>

      <AIChatWindow />
    </>
  );
}
