import Link from "next/link";
import { notFound } from "next/navigation";
import { SacrificePuzzleCover } from "@/components/places/SacrificePuzzleCover";
import { mapConfig } from "@/lib/mapConfig";
import Image from "next/image";

interface PlacePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return mapConfig.hotspots
    .filter((h): h is typeof h & { route: string } => !!h.route)
    .map((h) => ({
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
    <main className="place-page" style={{ background: "#a8d8f0" }}>
      <div className="place-card" style={{ background: "transparent", border: "none", boxShadow: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Image
          src="/cry.GIF"
          alt="暂未开放"
          width={200}
          height={200}
          style={{ display: "block", margin: "0 auto" }}
        />
        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "1.5rem", fontWeight: "600", color: "#1a1a1a" }}>
          暂未开放
        </p>
        <Link href="/" className="cartoon-btn" style={{ marginTop: "2rem" }}>
          ← 返回地图
        </Link>
      </div>
    </main>
  );
}
