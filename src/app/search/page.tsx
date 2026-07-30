"use client";
/* eslint-disable @next/next/no-img-element */

import { FormEvent, useState } from "react";
import { useAppStore } from "@/components/app-store";
import { Anime } from "@/lib/types";

interface SearchResponse { data: Anime[] }

export default function SearchPage() {
  const { profile, startWatching } = useAppStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function search(event: FormEvent) {
    event.preventDefault(); if (!query.trim()) return;
    setLoading(true); setError("");
    try { const response = await fetch(`/api/anime?q=${encodeURIComponent(query.trim())}`); if (!response.ok) throw new Error("検索に失敗しました"); setResults((await response.json() as SearchResponse).data); } catch { setError("検索サービスが混み合っています。少し待って再試行してください。"); } finally { setLoading(false); }
  }
  return <div className="mx-auto max-w-6xl px-5 py-10 sm:px-10"><p className="text-sm font-bold text-[#ff9ab0]">FIND YOUR NEXT FAVORITE</p><h1 className="mt-2 text-3xl font-black sm:text-5xl">作品を探す</h1><p className="mt-3 text-rose-100/70">気になる作品を見つけたら、そのまま「視聴中」に追加できます。</p><form onSubmit={search} className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="作品タイトルを検索" className="h-14 flex-1 rounded-2xl border border-white/20 bg-white/10 px-5 outline-none placeholder:text-rose-100/50 focus:ring-2 focus:ring-rose-200/30" /><button className="h-14 rounded-2xl bg-[#ff5d7e] px-7 font-bold">{loading ? "検索中..." : "検索"}</button></form>{error && <p className="mt-3 text-sm text-rose-200">{error}</p>}
    {results.length > 0 && <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.map((anime) => { const added = profile.watching.some((item) => item.mal_id === anime.mal_id); const image = anime.images.jpg?.large_image_url ?? anime.images.jpg?.image_url; return <article key={anime.mal_id} className="flex gap-4 rounded-3xl bg-[#3a2930] p-4 shadow-xl shadow-black/15"><div className="h-28 w-20 shrink-0 overflow-hidden rounded-2xl bg-black/20">{image && <><span className="sr-only">{anime.title}</span><img src={image} alt="" className="h-full w-full object-cover" /></>}</div><div className="min-w-0 flex-1"><h2 className="line-clamp-2 font-black">{anime.title}</h2><p className="mt-1 text-sm text-rose-100/65">{anime.episodes === null ? "話数不明" : `${anime.episodes}話`}</p><button type="button" disabled={added} onClick={() => startWatching(anime)} className="mt-4 rounded-xl bg-white px-3 py-2 text-xs font-black text-[#442530] disabled:opacity-40">{added ? "視聴中に追加済み" : "▶ 視聴をはじめる"}</button></div></article>; })}</div>}
  </div>;
}
