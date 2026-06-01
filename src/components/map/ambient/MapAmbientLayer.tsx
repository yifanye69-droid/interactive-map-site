"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { ambientObjects, easterEggs } from "@/lib/ambientConfig";
import { AmbientSprite } from "./AmbientSprite";

interface MapAmbientLayerProps {
  panX: number;
  panY: number;
}

export function MapAmbientLayer({ panX, panY }: MapAmbientLayerProps) {
  const parallax = useMemo(
    () => ({ x: panX * 0.02, y: panY * 0.02 }),
    [panX, panY]
  );

  return (
    <div className="map-ambient" aria-hidden>
      {ambientObjects.map((obj) => (
        <div
          key={obj.id}
          className="map-ambient__item"
          style={{
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            zIndex: Math.round(obj.depth * 10),
          }}
        >
          <AmbientSprite
            kind={obj.kind}
            duration={obj.duration ?? 12}
            delay={obj.delay ?? 0}
            scale={obj.scale ?? 1}
            parallaxOffset={{
              x: parallax.x * obj.depth,
              y: parallax.y * obj.depth,
            }}
          />
        </div>
      ))}

      {easterEggs.map((egg, i) => (
        <motion.div
          key={egg.id}
          className="easter-egg"
          style={{
            left: `${egg.x}%`,
            top: `${egg.y}%`,
            x: parallax.x * 0.5,
            y: parallax.y * 0.5,
          }}
          animate={{
            y: [0, -8, 0],
            rotate: [-5, 5, -5],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          title={egg.label || undefined}
        >
          <span className="easter-egg__emoji">{egg.emoji}</span>
        </motion.div>
      ))}
    </div>
  );
}
