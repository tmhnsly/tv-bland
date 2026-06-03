"use client";

import React from "react";
import Image from "next/image";
import { IoChevronBack, IoChevronForward, IoChevronDown } from "react-icons/io5";
import { SeasonEpisode } from "@/types/show";
import { ratingColor } from "@/utils/ratingColor";

interface SeasonExplorerProps {
  episodes: SeasonEpisode[];
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

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

  if (episodes.length === 0) return null;

  const idx = Math.max(0, seasons.indexOf(active));
  const current = (bySeason.get(active) ?? []).sort(
    (a, b) => (a.number ?? 0) - (b.number ?? 0)
  );
  const usePills = seasons.length <= 10;
  const step = (d: number) => {
    const next = seasons[idx + d];
    if (next != null) setActive(next);
  };

  const stepBtn =
    "grid h-9 w-9 shrink-0 place-items-center rounded-lg glass text-muted transition hover:text-fg disabled:opacity-40";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold md:text-2xl">Seasons &amp; episodes</h2>
        <span className="text-sm text-muted">
          {episodes.length} episodes · {seasons.length} season
          {seasons.length === 1 ? "" : "s"}
        </span>
      </div>

      {usePills ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {seasons.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActive(s)}
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
      ) : (
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={idx <= 0}
            aria-label="Previous season"
            className={stepBtn}
          >
            <IoChevronBack />
          </button>
          <div className="relative">
            <select
              value={active}
              onChange={(e) => setActive(Number(e.target.value))}
              aria-label="Select season"
              className="glass appearance-none rounded-lg py-2 pl-4 pr-9 text-sm font-medium text-fg outline-none"
            >
              {seasons.map((s) => (
                <option key={s} value={s}>
                  Season {s}
                </option>
              ))}
            </select>
            <IoChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={idx >= seasons.length - 1}
            aria-label="Next season"
            className={stepBtn}
          >
            <IoChevronForward />
          </button>
        </div>
      )}

      {/* This season's ratings at a glance */}
      <div className="mb-4 flex gap-1" aria-hidden>
        {current.map((ep) => (
          <span
            key={ep.id}
            title={`E${ep.number ?? "?"} · ${
              ep.rating?.average ? `★ ${ep.rating.average}` : "unrated"
            }`}
            className="h-1.5 flex-1 rounded-full"
            style={{ backgroundColor: ratingColor(ep.rating?.average) }}
          />
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
        {current.map((ep) => {
          const rating = ep.rating?.average ?? null;
          const summary = stripHtml(ep.summary);
          const meta = [
            formatAirdate(ep.airdate),
            ep.runtime ? `${ep.runtime} min` : null,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <li
              key={ep.id}
              className="flex flex-col overflow-hidden rounded-2xl glass sm:flex-row"
            >
              <div className="relative aspect-video w-full shrink-0 bg-fg/10 sm:w-40 sm:self-stretch">
                {ep.image?.medium ? (
                  <Image
                    src={ep.image.medium}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 160px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center py-6 font-display text-lg text-muted">
                    E{ep.number ?? "?"}
                  </div>
                )}
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: ratingColor(rating) }}
                  />
                  {rating ?? "–"}
                </span>
              </div>

              <div className="min-w-0 flex-1 p-3 sm:p-4">
                <div className="flex flex-wrap items-center gap-x-2 text-xs">
                  <span className="font-semibold text-accent">
                    S{ep.season} · E{ep.number ?? "?"}
                  </span>
                  {meta && <span className="text-muted">{meta}</span>}
                </div>
                <h3 className="mt-1 text-sm font-medium leading-snug">{ep.name}</h3>
                {summary && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted sm:line-clamp-3">
                    {summary}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SeasonExplorer;
