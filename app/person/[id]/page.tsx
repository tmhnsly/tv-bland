import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Show } from "@/types/show";
import ShowGrid from "@/components/showGrid";

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

type Person = {
  id: number;
  name: string;
  country: { name: string } | null;
  birthday: string | null;
  image: { medium?: string; original?: string } | null;
};

async function getPerson(id: string): Promise<Person> {
  const res = await fetch(`https://api.tvmaze.com/people/${id}`, {
    next: { revalidate: 86400 },
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

async function getCredits(id: string): Promise<Show[]> {
  const res = await fetch(
    `https://api.tvmaze.com/people/${id}/castcredits?embed=show`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) return [];
  const credits: { _embedded?: { show: Show } }[] = await res.json();

  const seen = new Set<number>();
  const shows: Show[] = [];
  for (const credit of credits) {
    const show = credit._embedded?.show;
    if (show && !seen.has(show.id)) {
      seen.add(show.id);
      shows.push(show);
    }
  }
  return shows;
}

export async function generateMetadata({
  params,
}: PersonPageProps): Promise<Metadata> {
  const { id } = await params;
  const person = await getPerson(id);
  return { title: person.name };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const [person, shows] = await Promise.all([getPerson(id), getCredits(id)]);
  const image =
    person.image?.medium ??
    person.image?.original ??
    "/tv-test-card-portrait.webp";
  const meta = [person.country?.name, person.birthday]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen px-6 pb-16 pt-24 text-black dark:text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center gap-6">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/10">
            <Image
              src={image}
              alt={person.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
          <div>
            <h1>{person.name}</h1>
            {meta && (
              <p className="text-gray-500 dark:text-gray-400">{meta}</p>
            )}
          </div>
        </div>

        <h2 className="mb-5">Known for</h2>
        {shows.length > 0 ? (
          <ShowGrid shows={shows} />
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No credits available.
          </p>
        )}
      </div>
    </div>
  );
}
