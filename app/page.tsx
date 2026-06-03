import Image from "next/image";
import { Episode } from "@/types/episode";
import ShowGrid from "@/components/showGrid";
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
    .slice(0, 30)
    .map((episode) => episode.show);

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
          <Image
            src="/tv-test-card-portrait.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-110 object-cover blur-2xl brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/70 to-bg" />
        </div>

        <div className="mx-auto max-w-8xl px-5 pb-16 pt-32 md:px-10 md:pt-44">
          <p className="reveal text-xs font-semibold uppercase tracking-[0.32em] text-accent">
            On air today
          </p>
          <h1 className="reveal mt-4 max-w-3xl font-display text-5xl font-semibold md:text-7xl">
            What&apos;s on tonight
          </h1>
          <p
            className="reveal mt-5 max-w-xl text-lg text-muted"
            style={{ animationDelay: "80ms" }}
          >
            Today&apos;s live TV schedule, full episode guides, and the people
            behind every show.
          </p>
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
