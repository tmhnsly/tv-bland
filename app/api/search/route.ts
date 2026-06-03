import { NextResponse } from "next/server";

type TvmazeSearchResult = {
  show: {
    id: number;
    name: string;
    premiered: string | null;
    image: { medium?: string } | null;
  };
};

// Lightweight endpoint backing the nav search dropdown. Returns just the
// fields the dropdown needs; the full /search page queries TVMaze directly.
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q) return NextResponse.json([]);

  const res = await fetch(
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return NextResponse.json([], { status: 502 });

  const data: TvmazeSearchResult[] = await res.json();
  const results = data.slice(0, 8).map(({ show }) => ({
    id: show.id,
    name: show.name,
    year: show.premiered ? show.premiered.slice(0, 4) : null,
    image: show.image?.medium ?? null,
  }));

  return NextResponse.json(results);
}
