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
    <main className="mx-auto min-h-screen max-w-8xl px-5 pb-24 pt-28 md:px-10 md:pt-32">
      <div className="reveal mb-12 flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15 shadow-xl shadow-black/40 md:h-28 md:w-28">
          <Image
            src={image}
            alt={person.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold md:text-5xl">
            {person.name}
          </h1>
          {meta && <p className="mt-2 text-muted">{meta}</p>}
        </div>
      </div>

      <h2 className="mb-6 text-2xl font-semibold">Known for</h2>
      {shows.length > 0 ? (
        <ShowGrid shows={shows} />
      ) : (
        <p className="text-muted">No credits available.</p>
      )}
    </main>
  );
}
