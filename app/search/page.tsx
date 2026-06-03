import type { Metadata } from "next";
import { Show } from "@/types/show";
import ShowGrid from "@/components/showGrid";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function searchShows(query: string): Promise<Show[]> {
  const res = await fetch(
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const data: { show: Show }[] = await res.json();
  return data.map((result) => result.show);
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search" };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const shows = query ? await searchShows(query) : [];

  return (
    <main className="mx-auto min-h-screen max-w-8xl px-5 pb-24 pt-28 md:px-10 md:pt-32">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        Search
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
        {query ? `“${query}”` : "Find a show"}
      </h1>

      <div className="mt-10">
        {query ? (
          shows.length > 0 ? (
            <>
              <p className="mb-7 text-sm text-muted">
                {shows.length} result{shows.length === 1 ? "" : "s"}
              </p>
              <ShowGrid shows={shows} />
            </>
          ) : (
            <p className="text-muted">No shows found for “{query}”.</p>
          )
        ) : (
          <p className="text-muted">
            Search for a show by name using the box above.
          </p>
        )}
      </div>
    </main>
  );
}
