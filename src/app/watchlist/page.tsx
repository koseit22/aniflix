"use client";
/* eslint-disable @next/next/no-img-element */

import { useAppStore } from "@/components/app-store";
import { formatWatchTime } from "@/lib/types";

export default function WatchlistPage() {
  const { profile } = useAppStore();
  return <div className="mx-auto max-w-6xl px-5 py-10 sm:px-10"><p className="text-sm font-bold text-[#ff9ab0]">YOUR COMPLETED LIBRARY</p><h1 className="mt-2 text-3xl font-black sm:text-5xl">Watchリスト</h1><p className="mt-3 text-rose-100/70">{profile.avatar} {profile.name}が観終わった、思い出の作品たち。</p>
    {profile.completed.length === 0 ? <div className="mt-10 rounded-[2rem] border border-dashed border-rose-200/25 bg-rose-100/5 px-6 py-16 text-center"><p className="text-4xl">🎬</p><h2 className="mt-4 text-xl font-black">まだ完走した作品はありません</h2><p className="mt-2 text-sm text-rose-100/70">「視聴中」で最終話まで進めると、ここに作品が追加されます。</p></div> : <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{profile.completed.map((anime) => { const image = anime.images.jpg?.large_image_url ?? anime.images.jpg?.image_url; return <article key={`${anime.mal_id}-${anime.completedAt}`} className="overflow-hidden rounded-3xl bg-[#3a2930] shadow-xl shadow-black/15"><div className="flex gap-4 p-4"><div className="h-32 w-24 shrink-0 overflow-hidden rounded-2xl bg-black/20">{image && <><img src={image} alt="" className="h-full w-full object-cover" /></>}</div><div className="min-w-0 flex-1"><span className="rounded-full bg-rose-100/15 px-2 py-1 text-[11px] font-black text-[#ff9ab0]">🎉 完走</span><h2 className="mt-3 line-clamp-2 font-black">{anime.title}</h2><p className="mt-2 text-sm text-rose-100/65">{anime.episodes === null ? "話数不明" : `${anime.episodes}話・${formatWatchTime(anime.episodes)}`}</p><p className="mt-4 text-xs text-rose-100/50">完走日 {new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(anime.completedAt))}</p></div></div></article>; })}</div>}
  </div>;
}
