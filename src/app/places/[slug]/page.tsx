import Link from "next/link";
import { notFound } from "next/navigation";
import { SacrificePuzzleCover } from "@/components/places/SacrificePuzzleCover";
import { mapConfig } from "@/lib/mapConfig";

interface PlacePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return mapConfig.hotspots.map((h) => ({
    slug: h.route.replace("/places/", ""),
  }));
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  const hotspot = mapConfig.hotspots.find(
    (h) => h.route === `/places/${slug}`
  );

  if (!hotspot) {
    notFound();
  }

  if (slug === "guilan-mountain") {
    return <SacrificePuzzleCover />;
  }

  return (
    <main className="place-page">
      <div className="place-card">
        <p className="place-card__tag">区域探索 · 占位页</p>
        <span className="place-card__icon" aria-hidden>
          {hotspot.icon}
        </span>
        <h1 className="place-card__title">{hotspot.title}</h1>
        <p className="place-card__desc">{hotspot.description}</p>
        <p className="place-card__note">
          此页面为预留二级路由，后续可替换为图文、视频或 3D 场景。
        </p>
        <Link href="/" className="cartoon-btn" style={{ marginTop: "1.5rem" }}>
          ← 返回地图
        </Link>
      </div>
    </main>
  );
}
