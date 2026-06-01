"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { markMapIntroSkipped, queueHotspotReopen } from "@/lib/festivalMapSession";

export function SacrificePuzzleCover() {
  const router = useRouter();

  const returnToMap = () => {
    markMapIntroSkipped();
    queueHotspotReopen("guilan-mountain");
    router.push("/?view=map&hotspot=guilan-mountain");
  };

  const startPuzzle = () => {
    router.push("/places/guilan-mountain/puzzle");
  };

  return (
    <main className="game-cover-page">
      <Image
        src="/places/sacrifice-puzzle-cover.png"
        alt="祭祀大典-拼一拼封面"
        fill
        priority
        className="game-cover-page__image"
        sizes="100vw"
      />
      <button
        type="button"
        className="game-cover-page__name-hit"
        onClick={startPuzzle}
        aria-label="进入祭祀大典拼一拼"
      >
        <Image
          src="/places/sacrifice-puzzle-name.png"
          alt="祭祀大典-拼一拼"
          width={8000}
          height={4500}
          unoptimized
          className="game-cover-page__name-image"
          draggable={false}
        />
      </button>
      <button
        type="button"
        className="game-cover-page__close"
        onClick={returnToMap}
        aria-label="返回地图"
      >
        ✕
      </button>
    </main>
  );
}
