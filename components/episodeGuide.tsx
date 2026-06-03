import React from "react";
import { SeasonEpisode } from "@/types/show";

interface EpisodeGuideProps {
  episodes: SeasonEpisode[];
}

const EpisodeGuide: React.FC<EpisodeGuideProps> = ({ episodes }) => {
  if (!episodes || episodes.length === 0) {
    return null;
  }

  // Group episodes by season, preserving air order within each.
  const bySeason = new Map<number, SeasonEpisode[]>();
  for (const episode of episodes) {
    const list = bySeason.get(episode.season) ?? [];
    list.push(episode);
    bySeason.set(episode.season, list);
  }
  const seasons = [...bySeason.keys()].sort((a, b) => a - b);

  return (
    <div>
      <h2 className="mb-5 text-black dark:text-white">Episode guide</h2>
      <div className="flex flex-col gap-3">
        {seasons.map((season, index) => {
          const seasonEpisodes = bySeason.get(season)!;
          return (
            <details
              key={season}
              open={index === 0}
              className="overflow-hidden rounded-lg border border-black/10 dark:border-white/10"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3 font-medium hover:bg-black/5 dark:hover:bg-white/5">
                <span>Season {season}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {seasonEpisodes.length} episode
                  {seasonEpisodes.length === 1 ? "" : "s"}
                </span>
              </summary>
              <ul className="divide-y divide-black/5 dark:divide-white/5">
                {seasonEpisodes.map((episode) => (
                  <li
                    key={episode.id}
                    className="flex items-baseline justify-between gap-4 px-4 py-2"
                  >
                    <span className="min-w-0">
                      <span className="mr-2 tabular-nums text-gray-500 dark:text-gray-400">
                        {episode.number ? `E${episode.number}` : "Special"}
                      </span>
                      {episode.name}
                    </span>
                    <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
                      {episode.airdate}
                      {episode.rating?.average
                        ? ` · ★ ${episode.rating.average}`
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </div>
  );
};

export default EpisodeGuide;
