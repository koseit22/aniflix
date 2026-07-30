"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/components/app-store";

const links = [
  { href: "/", label: "アプリ概要" },
  { href: "/search", label: "作品を探す" },
  { href: "/watching", label: "視聴中" },
  { href: "/watchlist", label: "Watchリスト" },
  { href: "/profile", label: "プロフィール" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, profiles, selectProfile } = useAppStore();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#211a1e] text-white">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[#211a1e]/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 sm:px-10">
          <Link href="/" className="text-2xl font-black tracking-[-0.08em] text-[#ff6b8d]">ANIFLIX</Link>
          <nav className="order-3 flex w-full gap-4 overflow-x-auto text-sm font-bold text-rose-100/70 sm:order-none sm:w-auto">
            {links.map((link) => <Link key={link.href} href={link.href} className={`whitespace-nowrap transition hover:text-white ${pathname === link.href ? "text-[#ff9ab0]" : ""}`}>{link.label}</Link>)}
          </nav>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-xl">{profile.avatar}</span>
            <select aria-label="表示するプロフィール" value={profile.id} onChange={(event) => selectProfile(event.target.value)} className="max-w-28 bg-transparent font-bold text-white outline-none sm:max-w-none">
              {profiles.map((item) => <option key={item.id} value={item.id} className="bg-[#302228]">{item.name}</option>)}
            </select>
          </label>
        </div>
      </header>
      <div className="pt-28 sm:pt-16">{children}</div>
    </main>
  );
}
