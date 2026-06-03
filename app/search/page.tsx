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
    <div className="min-h-screen px-6 pb-16 pt-24 text-black dark:text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2">Search</h1>
        {query ? (
          shows.length > 0 ? (
            <>
              <p className="mb-8 text-gray-500 dark:text-gray-400">
                {shows.length} result{shows.length === 1 ? "" : "s"} for “{query}”
              </p>
              <ShowGrid shows={shows} />
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No shows found for “{query}”.
            </p>
          )
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Search for a show by name using the box above.
          </p>
        )}
      </div>
    </div>
  );
}
