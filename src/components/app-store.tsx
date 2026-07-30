"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Anime, CompletedAnime, Profile, WatchingTask } from "@/lib/types";

const STORAGE_KEY = "aniflix-profiles-v2";
const ACTIVE_PROFILE_KEY = "aniflix-active-profile-v2";

const defaultProfile: Profile = {
  id: "default-profile",
  name: "わたし",
  avatar: "😊",
  dailyMinutes: 30,
  watching: [],
  watchlist: [],
  completed: [],
};

interface AppStoreValue {
  profile: Profile;
  profiles: Profile[];
  hydrated: boolean;
  selectProfile: (id: string) => void;
  createProfile: (name: string, avatar: string) => void;
  updateCurrentProfile: (name: string, avatar: string) => void;
  setDailyMinutes: (minutes: number) => void;
  addToWatchlist: (anime: Anime) => void;
  removeFromWatchlist: (animeId: number) => void;
  startWatching: (anime: Anime) => void;
  updateProgress: (taskId: number, watchedEpisodes: number) => void;
  removeWatching: (taskId: number) => void;
}

const AppStore = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([defaultProfile]);
  const [activeId, setActiveId] = useState(defaultProfile.id);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedProfiles = window.localStorage.getItem(STORAGE_KEY);
      const storedActiveId = window.localStorage.getItem(ACTIVE_PROFILE_KEY);
      if (storedProfiles) {
        const parsed = JSON.parse(storedProfiles) as Profile[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate once from browser storage.
          setProfiles(parsed);
          if (storedActiveId && parsed.some((profile) => profile.id === storedActiveId)) setActiveId(storedActiveId);
        }
      }
    } catch {
      // Use the friendly default profile when persisted data is malformed.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    window.localStorage.setItem(ACTIVE_PROFILE_KEY, activeId);
  }, [activeId, hydrated, profiles]);

  const profile = profiles.find((item) => item.id === activeId) ?? profiles[0];
  const updateProfile = (updater: (current: Profile) => Profile) => {
    setProfiles((current) => current.map((item) => item.id === activeId ? updater(item) : item));
  };

  const value: AppStoreValue = {
    profile,
    profiles,
    hydrated,
    selectProfile: setActiveId,
    createProfile: (name, avatar) => {
      const id = typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now());
      const next: Profile = { ...defaultProfile, id, name: name.trim() || "新しいプロフィール", avatar, watching: [], watchlist: [], completed: [] };
      setProfiles((current) => [...current, next]);
      setActiveId(id);
    },
    updateCurrentProfile: (name, avatar) => updateProfile((current) => ({ ...current, name: name.trim() || current.name, avatar })),
    setDailyMinutes: (dailyMinutes) => updateProfile((current) => ({ ...current, dailyMinutes })),
    addToWatchlist: (anime) => updateProfile((current) => current.watchlist.some((item) => item.mal_id === anime.mal_id) ? current : { ...current, watchlist: [...current.watchlist, anime] }),
    removeFromWatchlist: (animeId) => updateProfile((current) => ({ ...current, watchlist: current.watchlist.filter((item) => item.mal_id !== animeId) })),
    startWatching: (anime) => updateProfile((current) => {
      if (current.watching.some((item) => item.mal_id === anime.mal_id)) return current;
      const task: WatchingTask = { ...anime, taskId: Date.now(), watchedEpisodes: 0 };
      return { ...current, watching: [...current.watching, task], watchlist: current.watchlist.filter((item) => item.mal_id !== anime.mal_id) };
    }),
    updateProgress: (taskId, watchedEpisodes) => updateProfile((current) => {
      const task = current.watching.find((item) => item.taskId === taskId);
      if (!task) return current;
      const clamped = Math.max(0, Math.min(watchedEpisodes, task.episodes ?? watchedEpisodes));
      if (task.episodes !== null && clamped === task.episodes) {
        const completed: CompletedAnime = { ...task, completedAt: new Date().toISOString() };
        return { ...current, watching: current.watching.filter((item) => item.taskId !== taskId), completed: [completed, ...current.completed] };
      }
      return { ...current, watching: current.watching.map((item) => item.taskId === taskId ? { ...item, watchedEpisodes: clamped } : item) };
    }),
    removeWatching: (taskId) => updateProfile((current) => ({ ...current, watching: current.watching.filter((item) => item.taskId !== taskId) })),
  };

  return <AppStore.Provider value={value}>{children}</AppStore.Provider>;
}

export function useAppStore() {
  const value = useContext(AppStore);
  if (!value) throw new Error("useAppStore must be used within AppStoreProvider");
  return value;
}
