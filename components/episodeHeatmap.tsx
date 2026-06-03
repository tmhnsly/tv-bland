import { SeasonEpisode } from "@/types/show";

// Rating → colour: red (≤4) through amber to green (≥9), so a decline reads
// instantly as a row sliding from green back to red.
function cellColor(rating: number | null | undefined): string {
  if (rating == null) return "rgb(var(--fg) / 0.08)";
  const t = Math.max(0, Math.min(1, (rating - 4) / 5));
  return `hsl(${Math.round(t * 120)} 62% 45%)`;
}

interface EpisodeHeatmapProps {
  episodes: SeasonEpisode[];
}

const EpisodeHeatmap: React.FC<EpisodeHeatmapProps> = ({ episodes }) => {
  const hasRatings = episodes.some((e) => typeof e.rating?.average === "number");
  if (!hasRatings) return null;

  const bySeason = new Map<number, SeasonEpisode[]>();
  for (const e of episodes) {
    const list = bySeason.get(e.season) ?? [];
    list.push(e);
    bySeason.set(e.season, list);
  }
  const seasons = [...bySeason.entries()]
    .map(([season, eps]) => ({
      season,
      eps: eps.sort((a, b) => (a.number ?? 0) - (b.number ?? 0)),
    }))
    .sort((a, b) => a.season - b.season);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Episode ratings</h2>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>Worse</span>
          <span
            className="h-2 w-24 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, hsl(0 62% 45%), hsl(60 62% 45%), hsl(120 62% 45%))",
            }}
          />
          <span>Better</span>
        </div>
      </div>

      <div className="glass overflow-x-auto rounded-2xl p-4">
        <div className="flex w-max min-w-full flex-col gap-1.5">
          {seasons.map(({ season, eps }) => (
            <div key={season} className="flex items-center gap-1.5">
              <span className="w-8 shrink-0 text-xs font-medium tabular-nums text-muted">
                S{season}
              </span>
              <div className="flex gap-1">
                {eps.map((ep) => (
                  <span
                    key={ep.id}
                    title={`S${ep.season}E${ep.number ?? "?"} · ${ep.name}${
                      ep.rating?.average ? ` · ★ ${ep.rating.average}` : " · unrated"
                    }`}
                    className="h-4 w-4 rounded-[3px] transition hover:scale-125 sm:h-5 sm:w-5"
                    style={{ backgroundColor: cellColor(ep.rating?.average) }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EpisodeHeatmap;
