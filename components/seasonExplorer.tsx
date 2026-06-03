"use client";

import React from "react";
import Image from "next/image";
import { IoChevronDown } from "react-icons/io5";
import { SeasonEpisode } from "@/types/show";
import { ratingColor } from "@/utils/ratingColor";

interface SeasonExplorerProps {
  episodes: SeasonEpisode[];
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Deterministic (no timezone) to avoid hydration mismatches.
function formatAirdate(date?: string) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  const month = MONTHS[Number(m) - 1];
  return month ? `${Number(d)} ${month} ${y}` : "";
}

function stripHtml(html?: string | null) {
  return html ? html.replace(/<[^>]+>/g, "").trim() : "";
}

const SeasonExplorer: React.FC<SeasonExplorerProps> = ({ episodes }) => {
  const bySeason = new Map<number, SeasonEpisode[]>();
  for (const e of episodes) {
    const list = bySeason.get(e.season) ?? [];
    list.push(e);
    bySeason.set(e.season, list);
  }
  const seasons = [...bySeason.keys()].sort((a, b) => a - b);

  const [active, setActive] = React.useState(seasons[0] ?? 1);
  const [openId, setOpenId] = React.useState<number | null>(null);

  if (episodes.length === 0) return null;

  const current = (bySeason.get(active) ?? []).sort(
    (a, b) => (a.number ?? 0) - (b.number ?? 0)
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold md:text-2xl">Seasons &amp; episodes</h2>
        <span className="text-sm text-muted">
          {episodes.length} episodes · {seasons.length} season
          {seasons.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {seasons.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setActive(s);
              setOpenId(null);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              s === active
                ? "bg-accent text-accent-fg"
                : "glass text-muted hover:text-fg"
            }`}
          >
            S{s}
          </button>
        ))}
      </div>

      {/* At-a-glance: this season's episode ratings as a colour strip */}
      <div className="mb-4 flex gap-1" aria-hidden>
        {current.map((ep) => (
          <span
            key={ep.id}
            title={`E${ep.number ?? "?"} · ${
              ep.rating?.average ? `★ ${ep.rating.average}` : "unrated"
            }`}
            className="h-2 flex-1 rounded-full"
            style={{ backgroundColor: ratingColor(ep.rating?.average) }}
          />
        ))}
      </div>

      <ul className="glass divide-y hairline overflow-hidden rounded-2xl">
        {current.map((ep) => {
          const open = openId === ep.id;
          const rating = ep.rating?.average ?? null;
          const summary = stripHtml(ep.summary);
          const sub = [
            formatAirdate(ep.airdate),
            ep.runtime ? `${ep.runtime} min` : null,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <li key={ep.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : ep.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-fg/[0.04] sm:gap-4 sm:px-4"
              >
                <span className="flex w-11 shrink-0 items-center gap-2">
                  <span
                    className="h-8 w-1.5 rounded-full"
                    style={{ backgroundColor: ratingColor(rating) }}
                  />
                  <span className="text-sm font-semibold tabular-nums">
                    {rating ?? "–"}
                  </span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-accent">
                    S{ep.season} · E{ep.number ?? "?"}
                  </span>
                  <span className="block truncate text-sm font-medium">
                    {ep.name}
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
                <div className="flex flex-col gap-3 px-3 pb-4 sm:flex-row sm:gap-4 sm:px-4 sm:pl-[60px]">
                  {ep.image?.medium && (
                    <span className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-fg/10 sm:w-44">
                      <Image
                        src={ep.image.medium}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 176px"
                        className="object-cover"
                      />
                    </span>
                  )}
                  <p className="text-sm leading-relaxed text-muted">
                    {summary || "No description available for this episode."}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SeasonExplorer;
