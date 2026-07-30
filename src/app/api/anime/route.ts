import { NextRequest, NextResponse } from "next/server";

interface AniListMedia {
  id: number;
  episodes: number | null;
  title: { native: string | null; romaji: string | null; english: string | null };
  coverImage: { extraLarge: string | null; large: string | null; medium: string | null };
}

interface AniListResponse {
  data?: { Page?: { media?: AniListMedia[] } };
  errors?: Array<{ message: string }>;
}

const ANILIST_QUERY = `
  query ($search: String, $perPage: Int) {
    Page(page: 1, perPage: $perPage) {
      media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
        id
        episodes
        title { native romaji english }
        coverImage { extraLarge large medium }
      }
    }
  }
`;

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ data: [] });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query: ANILIST_QUERY, variables: { search: query, perPage: 5 } }),
        next: { revalidate: 300 },
      });
      const payload = (await response.json()) as AniListResponse;

      if (response.ok && !payload.errors) {
        const anime = payload.data?.Page?.media ?? [];
        return NextResponse.json({
          data: anime.map((media) => ({
            mal_id: media.id,
            title: media.title.native ?? media.title.romaji ?? media.title.english ?? "タイトル不明",
            episodes: media.episodes,
            images: { jpg: { image_url: media.coverImage.medium, large_image_url: media.coverImage.extraLarge ?? media.coverImage.large } },
          })),
        });
      }

      if (response.status !== 429 && response.status < 500) {
        return NextResponse.json({ message: payload.errors?.[0]?.message ?? "作品情報を取得できませんでした。" }, { status: response.status });
      }
    } catch {
      // 一時的なネットワークエラーは一度だけ再試行します。
    }
    if (attempt === 0) await wait(1_000);
  }

  return NextResponse.json({ message: "検索サービスが混み合っています。少し待ってから再検索してください。" }, { status: 503 });
}
