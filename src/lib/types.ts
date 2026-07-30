export interface Anime {
  mal_id: number;
  title: string;
  episodes: number | null;
  images: { jpg?: { image_url?: string; large_image_url?: string } };
}

export interface WatchingTask extends Anime {
  taskId: number;
  watchedEpisodes: number;
}

export interface CompletedAnime extends Anime {
  completedAt: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  dailyMinutes: number;
  watching: WatchingTask[];
  watchlist: Anime[];
  completed: CompletedAnime[];
}

export const MINUTES_PER_EPISODE = 24;

export function formatWatchTime(episodes: number | null): string {
  if (episodes === null || episodes <= 0) return "話数不明";
  const minutes = episodes * MINUTES_PER_EPISODE;
  return `${Math.floor(minutes / 60)}時間 ${minutes % 60}分`;
}
