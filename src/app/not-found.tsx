import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-festival-sky px-6">
      <h1 className="font-display text-2xl font-bold text-slate-800">
        页面未找到
      </h1>
      <Link
        href="/"
        className="mt-6 rounded-2xl bg-festival-coral px-6 py-3 text-sm font-semibold text-white"
      >
        返回地图
      </Link>
    </main>
  );
}
