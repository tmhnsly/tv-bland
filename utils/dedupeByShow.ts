import { Episode } from "@/types/episode";

// The daily schedule lists every airing, so a show with multiple slots would
// otherwise repeat. Keep the first entry per show.
export function dedupeByShow(schedule: Episode[]): Episode[] {
  const seen = new Set<number>();
  return schedule.filter((episode) => {
    if (!episode.show || seen.has(episode.show.id)) return false;
    seen.add(episode.show.id);
    return true;
  });
}
