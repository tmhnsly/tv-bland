import type { Metadata } from "next";
import Link from "next/link";
import { Show } from "@/types/show";
import ShowGrid from "@/components/showGrid";

interface BrowsePageProps {
  searchParams: Promise<{ genre?: string }>;
}

// TVMaze has no "shows by genre" endpoint, so we pull the first couple of
// index pages and filter in-app. This is a representative sample, not the
// full catalogue (documented limitation).
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
  `rounded-full px-3 py-1 text-sm transition ${
    active
      ? "bg-black text-white dark:bg-white dark:text-black"
      : "bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
  }`;

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { genre } = await searchParams;
  const all = await getShows();
  const genres = [...new Set(all.flatMap((show) => show.genres ?? []))].sort();

  const shows = (genre ? all.filter((s) => s.genres?.includes(genre)) : all)
    .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
    .slice(0, 48);

  return (
    <div className="min-h-screen px-6 pb-16 pt-24 text-black dark:text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6">Browse</h1>
        <div className="mb-8 flex flex-wrap gap-2">
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
          <p className="text-gray-500 dark:text-gray-400">
            No shows found for “{genre}”.
          </p>
        )}
      </div>
    </div>
  );
}
