"use client";

import React from "react";
import Image from "next/image";
import { IoStar, IoChevronDown } from "react-icons/io5";
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
  return month ? `${Number(d)} ${month} ${y}` : "";
}

function stripHtml(html?: string | null) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").trim();
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
  const [openId, setOpenId] = React.useState<number | null>(null);

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
        {current.map((episode) => {
          const open = openId === episode.id;
          const summary = stripHtml(episode.summary);
          const sub = [
            formatAirdate(episode.airdate),
            episode.runtime ? `${episode.runtime} min` : null,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <li key={episode.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : episode.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-4 px-3 py-3 text-left transition hover:bg-fg/[0.04]"
              >
                <span className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md bg-fg/10">
                  {episode.image?.medium ? (
                    <Image
                      src={episode.image.medium}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="grid h-full place-items-center font-display text-xs font-semibold text-accent">
                      {episode.number ? `E${episode.number}` : "—"}
                    </span>
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-xs">
                    <span className="font-semibold tabular-nums text-accent">
                      S{episode.season}E{episode.number ?? "–"}
                    </span>
                    {episode.rating?.average ? (
                      <span className="flex items-center gap-0.5 text-muted">
                        <IoStar size={10} className="text-accent" />
                        {episode.rating.average}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-medium">
                    {episode.name}
                  </span>
                  {sub && <span className="block text-xs text-muted">{sub}</span>}
                </span>

                <IoChevronDown
                  className={`shrink-0 text-muted transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div className="pb-4 pl-[124px] pr-4 text-sm leading-relaxed text-muted">
                  {summary || "No description available for this episode."}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default EpisodeGuide;
