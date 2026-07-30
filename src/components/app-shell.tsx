"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/components/app-store";

const links = [
  { href: "/", label: "ホーム", icon: "⌂" },
  { href: "/search", label: "探す", icon: "⌕" },
  { href: "/watching", label: "視聴中", icon: "▶" },
  { href: "/watchlist", label: "Watch", icon: "★" },
  { href: "/profile", label: "プロフィール", icon: "☺" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, profiles, selectProfile } = useAppStore();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#211a1e] text-white">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[#211a1e]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-5 sm:px-10">
          <Link href="/" className="text-2xl font-black tracking-[-0.08em] text-[#ff6b8d]">ANIFLIX</Link>
          <nav className="hidden gap-4 overflow-x-auto text-sm font-bold text-rose-100/70 sm:flex">
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
      <div className="pb-24 pt-16 sm:pb-0">{children}</div>
      <nav aria-label="モバイルナビゲーション" className="fixed inset-x-0 bottom-0 z-30 flex border-t border-white/10 bg-[#211a1e]/95 px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur sm:hidden">
        {links.map((link) => <Link key={link.href} href={link.href} className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-bold transition ${pathname === link.href ? "bg-rose-100/12 text-[#ff9ab0]" : "text-rose-100/60"}`}><span className="text-lg leading-5">{link.icon}</span><span className="truncate">{link.label}</span></Link>)}
      </nav>
    </main>
  );
}
