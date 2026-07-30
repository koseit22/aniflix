import Link from "next/link";

const features = [
  ["🔎", "作品をさがす", "AniList API で、観たいアニメをすぐに見つけます。"],
  ["🕰️", "ペースを決める", "1日の視聴時間から、完走の目安を自動で計算します。"],
  ["👨‍👩‍👧", "みんなで楽しむ", "プロフィールごとに、好きな作品と進み具合を分けて管理できます。"],
];

export default function Home() {
  return (
    <div>
      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top,_#864258_0%,_#3c2630_48%,_#211a1e_78%)]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-10 sm:py-28">
          <p className="mb-4 text-xs font-bold tracking-[0.24em] text-[#ff9ab0]">FAMILY WATCH PLANNER</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">アニメの時間を、<br />もっと楽しい予定に。</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-rose-100/80">ANIFLIX は、作品探しから視聴ペースの計画、進捗の記録までをひとつにした家族向けの視聴プランナーです。</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/search" className="rounded-2xl bg-[#ff5d7e] px-6 py-3 font-bold shadow-lg shadow-rose-950/30 transition hover:bg-[#ff7793]">作品をさがす</Link>
            <Link href="/watching" className="rounded-2xl bg-white/12 px-6 py-3 font-bold transition hover:bg-white/20">視聴中をみる</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-10">
        <p className="text-sm font-bold text-[#ff9ab0]">できること</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {features.map(([emoji, title, description]) => <article key={title} className="rounded-3xl border border-white/10 bg-[#3a2930] p-6 shadow-xl shadow-black/10"><span className="text-3xl">{emoji}</span><h2 className="mt-4 text-xl font-black">{title}</h2><p className="mt-2 text-sm leading-6 text-rose-100/70">{description}</p></article>)}
        </div>
      </section>
    </div>
  );
}
