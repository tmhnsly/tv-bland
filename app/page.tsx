import Image from "next/image";
import { Show } from "@/types/show";
import SearchBox from "@/components/searchBox";
import VerdictCard from "@/components/verdictCard";
import { computeWorthIt, WorthIt } from "@/utils/worthIt";

// A hand-picked mix of shows people argue about — the data decides which row
// each lands in.
const SHOWCASE = [
  "Breaking Bad",
  "The Wire",
  "Chernobyl",
  "Better Call Saul",
  "Fleabag",
  "The Sopranos",
  "Game of Thrones",
  "Dexter",
  "Lost",
  "How I Met Your Mother",
  "The Walking Dead",
  "Heroes",
];

type ShowcaseItem = { show: Show; worthIt: WorthIt };

async function getShowcase(): Promise<ShowcaseItem[]> {
  const items = await Promise.all(
    SHOWCASE.map(async (q) => {
      try {
        const res = await fetch(
          `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(q)}&embed=episodes`,
          { next: { revalidate: 86400 } }
        );
        if (!res.ok) return null;
        const show = (await res.json()) as Show & {
          _embedded?: { episodes?: [] };
        };
        return { show, worthIt: computeWorthIt(show._embedded?.episodes ?? []) };
      } catch {
        return null;
      }
    })
  );
  return items.filter((x): x is ShowcaseItem => x !== null && x.worthIt.hasData);
}

function Row({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: ShowcaseItem[];
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-4 md:-mx-10 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <VerdictCard key={item.show.id} show={item.show} worthIt={item.worthIt} />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const showcase = await getShowcase();
  const stuck = showcase
    .filter((x) => x.worthIt.trajectory === "steady" || x.worthIt.trajectory === "rising")
    .sort((a, b) => b.worthIt.score - a.worthIt.score);
  const dropoffs = showcase
    .filter((x) => x.worthIt.trajectory === "tapers" || x.worthIt.trajectory === "cliff")
    .sort((a, b) => b.worthIt.dropFromPeak - a.worthIt.dropFromPeak);

  const heroPoster =
    (stuck[0] ?? dropoffs[0])?.show.image?.original ?? null;

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {heroPoster && (
            <Image
              src={heroPoster}
              alt=""
              fill
              priority
              sizes="100vw"
              className="scale-110 object-cover opacity-20 blur-3xl"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-bg/80 to-bg" />
          <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_-10%,rgb(var(--accent)/0.2),transparent_60%)]" />
        </div>

        <div className="mx-auto max-w-3xl px-5 pb-14 pt-32 text-center sm:pt-40 md:pt-44">
          <p className="reveal text-xs font-semibold uppercase tracking-[0.32em] text-accent">
            Dropoff TV
          </p>
          <h1 className="reveal mt-4 font-display text-4xl font-semibold sm:text-5xl md:text-7xl">
            Does it drop off?
          </h1>
          <p
            className="reveal mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg"
            style={{ animationDelay: "70ms" }}
          >
            Type any show for its Worth It score, where it drops off, and exactly
            when to stop watching.
          </p>
          <div
            className="reveal mt-8 flex justify-center"
            style={{ animationDelay: "140ms" }}
          >
            <SearchBox className="w-full max-w-xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-8xl flex-col gap-12 px-5 pb-24 md:px-10">
        <Row
          title="Stuck the landing"
          subtitle="Great the whole way through — no real drop-off."
          items={stuck}
        />
        <Row
          title="Famous drop-offs"
          subtitle="Started strong, then slid. Worth it — if you know where to stop."
          items={dropoffs}
        />
      </section>
    </main>
  );
}
