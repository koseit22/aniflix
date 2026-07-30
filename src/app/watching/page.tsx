"use client";

import { useAppStore } from "@/components/app-store";
import { MINUTES_PER_EPISODE, formatWatchTime } from "@/lib/types";

function Poster({ src }: { src?: string }) {
  return src ? <>
    {/* AniList の外部ポスター画像を表示します。 */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt="" className="h-full w-full object-cover" />
  </> : <div className="flex h-full items-center justify-center text-xs text-rose-100/60">画像なし</div>;
}

export default function WatchingPage() {
  const { profile, setDailyMinutes, updateProgress, removeWatching } = useAppStore();
  const remainingMinutes = profile.watching.reduce((sum, task) => sum + Math.max(0, (task.episodes ?? 0) - task.watchedEpisodes) * MINUTES_PER_EPISODE, 0);
  const days = remainingMinutes ? Math.ceil(remainingMinutes / profile.dailyMinutes) : 0;

  const viewingDurations = Array.from({ length: 20 }, (_, index) => (index + 1) * 30);
  return <div className="mx-auto max-w-6xl px-5 py-10 sm:px-10">
    <p className="text-sm font-bold text-[#ff9ab0]">{profile.avatar} {profile.name}のページ</p>
    <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-black sm:text-5xl">視聴中</h1><p className="mt-2 text-rose-100/70">いま楽しんでいる作品の進み具合。</p></div><label className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-rose-100/80">1日の視聴時間 <select value={profile.dailyMinutes} onChange={(event) => setDailyMinutes(Number(event.target.value))} className="bg-transparent pl-2 font-black text-white outline-none">{viewingDurations.map((minute) => <option key={minute} value={minute} className="bg-[#302228]">{minute < 60 ? `${minute}分` : `${Math.floor(minute / 60)}時間${minute % 60 ? "30分" : ""}`}</option>)}</select></label></div>
    <div className="mt-7 rounded-3xl border border-rose-200/15 bg-[linear-gradient(120deg,_#593242,_#3a2930)] p-5"><p className="text-sm text-rose-100/75">このペースなら</p><p className="mt-1 text-2xl font-black">{profile.watching.length ? `残り ${formatWatchTime(Math.ceil(remainingMinutes / MINUTES_PER_EPISODE))} ・ 約${days}日で完走` : "作品を追加して、視聴プランを作ろう"}</p></div>
    {profile.watching.length === 0 ? <Empty text="Watchリストから作品を追加すると、ここで進捗を記録できます。" /> : <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{profile.watching.map((task) => { const total = task.episodes ?? 0; const percent = total ? Math.round(task.watchedEpisodes / total * 100) : 0; return <article key={task.taskId} className="overflow-hidden rounded-3xl bg-[#3a2930] shadow-xl shadow-black/20"><div className="flex gap-4 p-4"><div className="h-32 w-24 shrink-0 overflow-hidden rounded-2xl bg-black/20"><Poster src={task.images.jpg?.large_image_url ?? task.images.jpg?.image_url} /></div><div className="min-w-0 flex-1"><h2 className="line-clamp-2 font-black">{task.title}</h2><p className="mt-1 text-xs text-rose-100/65">{total ? `残り ${total - task.watchedEpisodes}話・${formatWatchTime(total - task.watchedEpisodes)}` : "話数不明"}</p><div className="mt-4 rounded-2xl bg-white/10 p-2.5"><p className="text-xs text-rose-100/70">見終わった話</p><div className="mt-1 flex items-center justify-between"><button type="button" disabled={task.watchedEpisodes === 0} onClick={() => updateProgress(task.taskId, task.watchedEpisodes - 1)} className="h-9 w-9 rounded-full bg-white/15 text-xl font-bold disabled:opacity-30">−</button><strong><span className="text-[#ff9ab0]">{task.watchedEpisodes}</span> / {total}話</strong><button type="button" disabled={!total || task.watchedEpisodes === total} onClick={() => updateProgress(task.taskId, task.watchedEpisodes + 1)} className="h-9 w-9 rounded-full bg-[#ff5d7e] text-xl font-bold disabled:opacity-30">＋</button></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/25"><div className="h-full bg-[#ff7793]" style={{ width: `${percent}%` }} /></div></div><button type="button" onClick={() => removeWatching(task.taskId)} className="mt-3 text-xs font-bold text-rose-100/60 hover:text-white">視聴中から外す</button></div></div></article>})}</div>}
    <section className="mt-14"><h2 className="text-2xl font-black">見終わった作品</h2>{profile.completed.length === 0 ? <p className="mt-3 text-sm text-rose-100/60">作品を完走すると、ここに記録されます。</p> : <div className="mt-4 flex gap-3 overflow-x-auto pb-3">{profile.completed.map((anime) => <article key={`${anime.mal_id}-${anime.completedAt}`} className="w-28 shrink-0"><div className="aspect-[2/3] overflow-hidden rounded-2xl bg-white/10"><Poster src={anime.images.jpg?.large_image_url ?? anime.images.jpg?.image_url} /></div><p className="mt-2 line-clamp-2 text-xs font-bold">{anime.title}</p><p className="mt-1 text-[11px] text-rose-100/60">🎉 完走</p></article>)}</div>}</section>
  </div>;
}

function Empty({ text }: { text: string }) { return <div className="mt-8 rounded-3xl border border-dashed border-rose-200/25 bg-white/5 px-6 py-14 text-center text-rose-100/70">{text}</div>; }
