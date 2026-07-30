"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAppStore } from "@/components/app-store";

const avatars = ["😊", "😎", "🦊", "🐼", "🌈", "⭐️", "🦁", "🐰"];

function AvatarPicker({ value, onChange }: { value: string; onChange: (avatar: string) => void }) {
  return <div className="mt-3 flex flex-wrap gap-2">{avatars.map((avatar) => <button key={avatar} type="button" onClick={() => onChange(avatar)} aria-label={`${avatar}を選択`} className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl transition ${value === avatar ? "bg-[#ff5d7e] ring-2 ring-rose-100 ring-offset-2 ring-offset-[#34242b]" : "bg-white/10 hover:bg-white/20"}`}>{avatar}</button>)}</div>;
}

export default function ProfilePage() {
  const { profile, profiles, createProfile, updateCurrentProfile, selectProfile } = useAppStore();
  const [editName, setEditName] = useState(profile.name);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState("😊");
  const [saved, setSaved] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the form when a different local profile is selected.
  useEffect(() => { setEditName(profile.name); setEditAvatar(profile.avatar); setSaved(false); }, [profile]);
  function saveProfile(event: FormEvent) { event.preventDefault(); updateCurrentProfile(editName, editAvatar); setSaved(true); }
  function create(event: FormEvent) { event.preventDefault(); createProfile(newName, newAvatar); setNewName(""); }

  return <div>
    <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top,_#754052_0%,_#3b2730_58%,_#211a1e_85%)]"><div className="mx-auto max-w-5xl px-5 py-14 sm:px-10 sm:py-18"><p className="text-xs font-black tracking-[0.2em] text-[#ff9ab0]">ACCOUNT CENTER</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">プロフィール設定</h1><p className="mt-4 max-w-xl text-rose-100/75">家族それぞれの視聴体験を、好きな名前とアイコンで楽しめます。</p></div></section>
    <div className="mx-auto grid max-w-5xl gap-6 px-5 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[2rem] border border-white/10 bg-[#34242b] p-6 shadow-2xl shadow-black/20 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-[#ff9ab0]">現在選択中</p><h2 className="mt-1 text-2xl font-black">プロフィールを編集</h2></div><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#ff7793,_#b75e85)] text-3xl shadow-lg">{editAvatar}</div></div>
        <form onSubmit={saveProfile} className="mt-7"><label className="block text-sm font-bold text-rose-100/80">表示名<input value={editName} onChange={(event) => { setEditName(event.target.value); setSaved(false); }} className="mt-2 block h-13 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-base font-bold text-white outline-none transition placeholder:text-rose-100/40 focus:border-rose-200 focus:ring-2 focus:ring-rose-200/20" /></label><div className="mt-6"><p className="text-sm font-bold text-rose-100/80">アイコンを選ぶ</p><AvatarPicker value={editAvatar} onChange={(avatar) => { setEditAvatar(avatar); setSaved(false); }} /></div><div className="mt-8 flex items-center gap-4"><button className="rounded-2xl bg-[#ff5d7e] px-5 py-3 font-black shadow-lg shadow-rose-950/30 transition hover:bg-[#ff7793]">変更を保存</button>{saved && <span className="text-sm font-bold text-emerald-300">✓ 保存しました</span>}</div></form>
      </section>
      <aside className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,_#49303b,_#302228)] p-6 shadow-2xl shadow-black/20 sm:p-8"><p className="text-xs font-black tracking-[0.16em] text-[#ff9ab0]">YOUR ACTIVITY</p><h2 className="mt-2 text-2xl font-black">{profile.name}の視聴記録</h2><div className="mt-6 grid grid-cols-2 gap-2">{[["視聴中", profile.watching.length], ["Watchリスト", profile.completed.length]].map(([label, count]) => <div key={String(label)} className="rounded-2xl bg-white/10 px-3 py-4 text-center"><strong className="block text-2xl font-black text-white">{count}</strong><span className="mt-1 block text-[11px] font-bold text-rose-100/65">{label}</span></div>)}</div><p className="mt-6 rounded-2xl bg-rose-100/10 p-4 text-sm leading-6 text-rose-100/80">このプロフィールのデータは、この端末のブラウザに保存されています。</p></aside>
      <section className="rounded-[2rem] border border-white/10 bg-[#34242b] p-6 shadow-xl shadow-black/15 sm:p-8"><p className="text-xs font-black tracking-[0.16em] text-[#ff9ab0]">SWITCH PROFILE</p><h2 className="mt-2 text-2xl font-black">プロフィールを切り替える</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{profiles.map((item) => <button key={item.id} type="button" onClick={() => selectProfile(item.id)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${item.id === profile.id ? "border-[#ff7793] bg-rose-100/15" : "border-white/10 bg-white/5 hover:bg-white/10"}`}><span className="text-3xl">{item.avatar}</span><span><strong className="block">{item.name}</strong><span className="text-xs text-rose-100/60">視聴中 {item.watching.length}・完走 {item.completed.length}</span></span></button>)}</div></section>
      <section className="rounded-[2rem] border border-dashed border-rose-200/25 bg-rose-100/5 p-6 sm:p-8"><p className="text-xs font-black tracking-[0.16em] text-[#ff9ab0]">ADD PROFILE</p><h2 className="mt-2 text-2xl font-black">新しいプロフィール</h2><form onSubmit={create} className="mt-5"><input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="例：お母さん" className="h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none placeholder:text-rose-100/40 focus:ring-2 focus:ring-rose-200/20" /><AvatarPicker value={newAvatar} onChange={setNewAvatar} /><button className="mt-6 rounded-2xl bg-white px-5 py-3 font-black text-[#442530] transition hover:bg-rose-50">プロフィールを追加</button></form></section>
    </div>
  </div>;
}
