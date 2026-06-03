import type { Metadata } from "next";
import Link from "next/link";
import { Show } from "@/types/show";
import ShowGrid from "@/components/showGrid";
import { PageShell } from "@/components/layout";

interface BrowsePageProps {
  searchParams: Promise<{ genre?: string }>;
}

// TVMaze has no "shows by genre" endpoint, so we pull the first couple of
// index pages and filter in-app — a representative sample, not the full
// catalogue (documented limitation).
async function getShows(): Promise<Show[]> {
  const pages = await Promise.all(
    [0, 1].map((page) =>
      fetch(`https://api.tvmaze.com/shows?page=${page}`, {
        next: { revalidate: 86400 },
      }).then((res) => (res.ok ? res.json() : []))
    )
  );
  return pages.flat();
}

export async function generateMetadata({
  searchParams,
}: BrowsePageProps): Promise<Metadata> {
  const { genre } = await searchParams;
  return { title: genre ? `Browse: ${genre}` : "Browse" };
}

const chip = (active: boolean) =>
  `rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
    active ? "bg-accent text-accent-fg" : "glass text-muted hover:text-fg"
  }`;

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { genre } = await searchParams;
  const all = await getShows();
  const genres = [...new Set(all.flatMap((show) => show.genres ?? []))].sort();

  const shows = (genre ? all.filter((s) => s.genres?.includes(genre)) : all)
    .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
    .slice(0, 48);

  return (
    <PageShell>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        Browse
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
        {genre ?? "Top rated"}
      </h1>

      <div className="my-8 flex flex-wrap gap-2">
        <Link href="/browse" className={chip(!genre)}>
          All
        </Link>
        {genres.map((g) => (
          <Link
            key={g}
            href={`/browse?genre=${encodeURIComponent(g)}`}
            className={chip(g === genre)}
          >
            {g}
          </Link>
        ))}
      </div>

      {shows.length > 0 ? (
        <ShowGrid shows={shows} />
      ) : (
        <p className="text-muted">No shows found for “{genre}”.</p>
      )}
    </PageShell>
  );
}
