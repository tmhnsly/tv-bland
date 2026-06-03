"use client";

import React from "react";
import { IoStar } from "react-icons/io5";
import { SeasonEpisode } from "@/types/show";

interface EpisodeGuideProps {
  episodes: SeasonEpisode[];
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Deterministic date formatting (no timezone) to avoid hydration mismatches.
function formatAirdate(date?: string) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  const month = MONTHS[Number(m) - 1];
  if (!month) return "";
  return `${Number(d)} ${month} ${y}`;
}

const EpisodeGuide: React.FC<EpisodeGuideProps> = ({ episodes }) => {
  const bySeason = new Map<number, SeasonEpisode[]>();
  for (const episode of episodes) {
    const list = bySeason.get(episode.season) ?? [];
    list.push(episode);
    bySeason.set(episode.season, list);
  }
  const seasons = [...bySeason.keys()].sort((a, b) => a - b);

  const [active, setActive] = React.useState(seasons[0] ?? 1);

  if (episodes.length === 0) return null;

  const current = bySeason.get(active) ?? [];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Episodes</h2>
        <span className="text-sm text-muted">
          {episodes.length} total · {seasons.length} season
          {seasons.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {seasons.map((season) => (
          <button
            key={season}
            type="button"
            onClick={() => setActive(season)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              season === active
                ? "bg-accent text-accent-fg"
                : "glass text-muted hover:text-fg"
            }`}
          >
            Season {season}
          </button>
        ))}
      </div>

      <ul className="glass divide-y hairline overflow-hidden rounded-2xl">
        {current.map((episode) => (
          <li
            key={episode.id}
            className="flex items-center gap-4 px-4 py-3 transition hover:bg-fg/[0.04]"
          >
            <span className="w-12 shrink-0 font-display text-sm font-semibold tabular-nums text-accent">
              {episode.number ? `E${episode.number}` : "—"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{episode.name}</p>
              {episode.airdate && (
                <p className="text-xs text-muted">
                  {formatAirdate(episode.airdate)}
                </p>
              )}
            </div>
            {episode.rating?.average ? (
              <span className="flex shrink-0 items-center gap-1 text-sm text-muted">
                <IoStar className="text-accent" size={12} />
                {episode.rating.average}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EpisodeGuide;
