import { Episode } from "@/types/episode";
import { PiTelevisionDuotone } from "react-icons/pi";
import EpisodeCard from "@/components/episodeCard";
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

// The daily schedule lists every airing, so a show with multiple slots would
// otherwise repeat. Keep the first entry per show.
function dedupeByShow(schedule: Episode[]): Episode[] {
  const seen = new Set<number>();
  return schedule.filter((episode) => {
    if (!episode.show || seen.has(episode.show.id)) return false;
    seen.add(episode.show.id);
    return true;
  });
}

export default async function HomePage() {
  const schedule = await getSchedule();
  const shows = dedupeByShow(schedule).slice(0, 24);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-home bg-cover bg-center text-black dark:text-white">
      <header className="bg-gray-200/80 backdrop-blur-2xl dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-32 md:px-10">
          <div className="flex items-center gap-3">
            <PiTelevisionDuotone size={48} />
            <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
              TV Bland
            </h1>
          </div>
          <p className="mt-5 max-w-2xl text-lg text-gray-700 dark:text-gray-300">
            Your TV show and web-series companion — episode guides, cast and
            crew, and what&apos;s on the air right now.
          </p>
        </div>
      </header>

      <section className="bg-white/90 backdrop-blur-2xl dark:bg-black/90">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-medium">On air today</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {today}
            </span>
          </div>
          {shows.length > 0 ? (
            <div className="grid auto-rows-auto grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {shows.map((episode) => (
                <EpisodeCard episode={episode} key={episode.show.id} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No shows scheduled for today.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
