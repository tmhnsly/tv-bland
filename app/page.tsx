import Image from "next/image";
import { Episode } from "@/types/episode";
import ShowGrid from "@/components/showGrid";
import SearchBox from "@/components/searchBox";
import { dedupeByShow } from "@/utils/dedupeByShow";
import { getFormattedDate } from "@/utils/getCurrentDate";

async function getSchedule(): Promise<Episode[]> {
  // Compute the date per request so the schedule rolls over with the calendar,
  // and revalidate hourly so Next doesn't freeze the response at build time.
  const currentDate = getFormattedDate();
  const res = await fetch(
    `https://api.tvmaze.com/schedule?country=US&date=${currentDate}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function HomePage() {
  const schedule = await getSchedule();
  const shows = dedupeByShow(schedule)
    .slice(0, 24)
    .map((episode) => episode.show);

  const featured = shows.find((s) => s.image?.original)?.image?.original ?? null;

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {featured && (
            <Image
              src={featured}
              alt=""
              fill
              priority
              sizes="100vw"
              className="scale-110 object-cover opacity-25 blur-3xl"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-bg/80 to-bg" />
          <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_-10%,rgb(var(--accent)/0.2),transparent_60%)]" />
        </div>

        <div className="mx-auto max-w-3xl px-5 pb-16 pt-36 text-center md:pt-44">
          <p className="reveal text-xs font-semibold uppercase tracking-[0.32em] text-accent">
            Dropoff
          </p>
          <h1 className="reveal mt-4 font-display text-5xl font-semibold md:text-7xl">
            Does it drop off?
          </h1>
          <p
            className="reveal mx-auto mt-5 max-w-xl text-lg text-muted"
            style={{ animationDelay: "70ms" }}
          >
            Type any show for its Worth It score, where it drops off, and
            exactly when to stop watching.
          </p>
          <div
            className="reveal mt-8 flex justify-center"
            style={{ animationDelay: "140ms" }}
          >
            <SearchBox />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 pb-24 md:px-10">
        <div className="mb-7 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold md:text-3xl">On air today</h2>
          <span className="shrink-0 text-sm text-muted">{today}</span>
        </div>
        {shows.length > 0 ? (
          <ShowGrid shows={shows} />
        ) : (
          <p className="text-muted">No shows scheduled for today.</p>
        )}
      </section>
    </main>
  );
}
