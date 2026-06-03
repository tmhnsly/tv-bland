import { SeasonEpisode } from "@/types/show";

export type Trajectory = "rising" | "steady" | "dips" | "tapers" | "cliff";
export type Verdict = "must-watch" | "worth-it" | "mixed" | "skip";

export interface SeasonStat {
  season: number;
  average: number;
  count: number;
}

export interface EpisodeRef {
  season: number;
  number: number | null;
  name: string;
  rating: number;
}

export interface WorthIt {
  hasData: boolean;
  score: number; // 0–100
  verdict: Verdict;
  verdictLabel: string;
  trajectory: Trajectory;
  trajectoryLabel: string;
  mean: number; // 0–10
  consistency: number; // 0–1
  ratedCount: number;
  totalCount: number;
  coverage: number; // 0–1
  seasons: SeasonStat[];
  peakSeason: SeasonStat | null;
  finaleSeason: SeasonStat | null;
  dropFromPeak: number; // rating points
  sticksLanding: boolean;
  watchThrough: number | null; // season to watch through, null = watch it all
  best: EpisodeRef | null;
  worst: EpisodeRef | null;
  advisory: string;
}

const VERDICT_LABELS: Record<Verdict, string> = {
  "must-watch": "Must-watch",
  "worth-it": "Worth it",
  mixed: "Mixed bag",
  skip: "Skip it",
};

const TRAJECTORY_LABELS: Record<Trajectory, string> = {
  rising: "Gets better",
  steady: "No drop-off",
  dips: "Dips late",
  tapers: "Drops off",
  cliff: "Falls off a cliff",
};

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

// Least-squares slope of values against their index (rating points per season).
// More robust to a single weak season than comparing first vs last.
function regressionSlope(ys: number[]): number {
  const n = ys.length;
  if (n < 2) return 0;
  const mx = (n - 1) / 2;
  const my = mean(ys);
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - mx) * (ys[i] - my);
    den += (i - mx) ** 2;
  }
  return den === 0 ? 0 : num / den;
}

function emptyResult(total: number, rated: number): WorthIt {
  return {
    hasData: false,
    score: 0,
    verdict: "mixed",
    verdictLabel: "Not enough ratings",
    trajectory: "steady",
    trajectoryLabel: "—",
    mean: 0,
    consistency: 0,
    ratedCount: rated,
    totalCount: total,
    coverage: total ? rated / total : 0,
    seasons: [],
    peakSeason: null,
    finaleSeason: null,
    dropFromPeak: 0,
    sticksLanding: false,
    watchThrough: null,
    best: null,
    worst: null,
    advisory: "Not enough episode ratings to score this one yet.",
  };
}

/**
 * Distils a show's per-episode ratings into a "Worth It" verdict.
 *
 * Score = quality (mean rating) − a penalty for how far it falls from its
 * peak by the finale, + bonuses for consistency and sticking the landing.
 * So shows that stay good all the way and end well score highest; great-but-
 * declining shows are marked down and flagged with an advisory.
 */
export function computeWorthIt(episodes: SeasonEpisode[]): WorthIt {
  const total = episodes.length;
  const rated = episodes.filter(
    (e): e is SeasonEpisode & { rating: { average: number } } =>
      typeof e.rating?.average === "number"
  );

  if (rated.length < 5) return emptyResult(total, rated.length);

  const ratings = rated.map((e) => e.rating.average);
  const avg = mean(ratings);
  const variance = mean(ratings.map((r) => (r - avg) ** 2));
  const std = Math.sqrt(variance);
  const consistency = clamp(1 - std / 1.5, 0, 1);

  // Season averages, in season order.
  const seasonMap = new Map<number, number[]>();
  for (const e of rated) {
    const list = seasonMap.get(e.season) ?? [];
    list.push(e.rating.average);
    seasonMap.set(e.season, list);
  }
  const seasons: SeasonStat[] = [...seasonMap.entries()]
    .map(([season, rs]) => ({ season, average: round1(mean(rs)), count: rs.length }))
    .sort((a, b) => a.season - b.season);

  const peakSeason = seasons.reduce((a, b) => (b.average > a.average ? b : a));
  const finaleSeason = seasons[seasons.length - 1];
  const multiSeason = seasons.length > 1;

  const dropFromPeak = round1(Math.max(0, peakSeason.average - finaleSeason.average));
  const finaleAvg = finaleSeason.average;
  const sticksLanding = multiSeason && finaleAvg >= peakSeason.average - 0.3;
  const slope = multiSeason ? regressionSlope(seasons.map((s) => s.average)) : 0;

  // Quality-gated: a decline only counts as a drop-off if the show actually
  // gets worse, not just dips a little while staying good.
  let trajectory: Trajectory;
  if (!multiSeason) trajectory = "steady";
  else if (slope >= 0.12) trajectory = "rising";
  else if (dropFromPeak >= 2 && finaleAvg < 7) trajectory = "cliff";
  else if ((dropFromPeak >= 1.5 || slope <= -0.25) && finaleAvg < 7.5)
    trajectory = "tapers";
  else if (dropFromPeak >= 0.8 || slope <= -0.12) trajectory = "dips";
  else trajectory = "steady";

  const quality = (avg / 10) * 100;
  const penalty = Math.min(25, dropFromPeak * 7);
  const consistencyBonus = consistency * 5;
  const landingBonus = sticksLanding ? 4 : 0;
  const score = Math.round(clamp(quality - penalty + consistencyBonus + landingBonus, 0, 100));

  const verdict: Verdict =
    score >= 85 ? "must-watch" : score >= 70 ? "worth-it" : score >= 55 ? "mixed" : "skip";

  // Where to stop, when there's a real decline after the peak.
  let watchThrough: number | null = null;
  if ((trajectory === "tapers" || trajectory === "cliff") && seasons.length > 2) {
    const strong = seasons.filter((s) => s.average >= peakSeason.average - 0.75);
    const last = strong[strong.length - 1];
    if (last && last.season < finaleSeason.season) watchThrough = last.season;
  }

  const toRef = (e: (typeof rated)[number]): EpisodeRef => ({
    season: e.season,
    number: e.number,
    name: e.name,
    rating: e.rating.average,
  });
  const best = toRef(rated.reduce((a, b) => (b.rating.average > a.rating.average ? b : a)));
  const worst = toRef(rated.reduce((a, b) => (b.rating.average < a.rating.average ? b : a)));

  return {
    hasData: true,
    score,
    verdict,
    verdictLabel: VERDICT_LABELS[verdict],
    trajectory,
    trajectoryLabel: TRAJECTORY_LABELS[trajectory],
    mean: round1(avg),
    consistency,
    ratedCount: rated.length,
    totalCount: total,
    coverage: total ? rated.length / total : 0,
    seasons,
    peakSeason,
    finaleSeason,
    dropFromPeak,
    sticksLanding,
    watchThrough,
    best,
    worst,
    advisory: buildAdvisory({
      trajectory,
      sticksLanding,
      peakSeason,
      finaleSeason,
      watchThrough,
      multiSeason,
    }),
  };
}

function buildAdvisory(d: {
  trajectory: Trajectory;
  sticksLanding: boolean;
  peakSeason: SeasonStat;
  finaleSeason: SeasonStat;
  watchThrough: number | null;
  multiSeason: boolean;
}): string {
  const { trajectory, sticksLanding, peakSeason, finaleSeason, watchThrough } = d;

  if (!d.multiSeason) {
    return "A single season — what you see is what you get.";
  }
  if (trajectory === "cliff" || trajectory === "tapers") {
    const stop = watchThrough
      ? ` Best watched through Season ${watchThrough}.`
      : "";
    return `Excellent around Season ${peakSeason.season} (avg ${peakSeason.average}), but drops off to ${finaleSeason.average} by the finale. Worth it for the strong run — just don't expect it to keep that up.${stop}`;
  }
  if (trajectory === "rising") {
    return `A grower — it gets better as it goes, peaking at Season ${peakSeason.season} (avg ${peakSeason.average}). Stick with it.`;
  }
  if (trajectory === "dips") {
    return `Dips a little later on (down to ${finaleSeason.average} by the end) but stays good throughout — worth it the whole way.`;
  }
  if (sticksLanding) {
    return `Stays strong the whole way and sticks the landing (finale avg ${finaleSeason.average}). The good kind of binge.`;
  }
  return "No real drop-off — holds a steady level the whole way through.";
}
