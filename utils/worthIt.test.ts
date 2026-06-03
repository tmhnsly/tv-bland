import { describe, it, expect } from "vitest";
import { computeWorthIt } from "./worthIt";
import { SeasonEpisode } from "@/types/show";

// Build `count` episodes for a season, all at the same rating.
function season(s: number, count: number, rating: number): SeasonEpisode[] {
  return Array.from({ length: count }, (_, i) => ({
    id: s * 1000 + i,
    name: `S${s}E${i + 1}`,
    season: s,
    number: i + 1,
    rating: { average: rating },
  }));
}

describe("computeWorthIt", () => {
  it("flags insufficient data with fewer than 5 rated episodes", () => {
    const result = computeWorthIt(season(1, 4, 8));
    expect(result.hasData).toBe(false);
  });

  it("rates a consistently great, landing-sticking show as must-watch", () => {
    const eps = [...season(1, 5, 9), ...season(2, 5, 9), ...season(3, 5, 9)];
    const r = computeWorthIt(eps);
    expect(r.hasData).toBe(true);
    expect(r.verdict).toBe("must-watch");
    expect(r.trajectory).toBe("steady");
    expect(r.sticksLanding).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(90);
  });

  it("penalises a great-then-cliff show but keeps it out of 'skip'", () => {
    const eps = [
      ...season(1, 5, 9),
      ...season(2, 5, 9),
      ...season(3, 5, 9),
      ...season(4, 5, 9),
      ...season(5, 5, 5),
    ];
    const r = computeWorthIt(eps);
    expect(r.trajectory).toBe("cliff");
    expect(r.watchThrough).toBe(4);
    expect(r.sticksLanding).toBe(false);
    expect(r.dropFromPeak).toBeCloseTo(4, 1);
    expect(r.score).toBeGreaterThanOrEqual(55);
    expect(r.score).toBeLessThan(70);
    expect(r.advisory.toLowerCase()).toContain("season 4");
  });

  it("detects a show that gets better over time", () => {
    const eps = [...season(1, 5, 6), ...season(2, 5, 7), ...season(3, 5, 9)];
    const r = computeWorthIt(eps);
    expect(r.trajectory).toBe("rising");
    expect(r.peakSeason?.season).toBe(3);
  });

  it("reports best and worst episodes and season stats", () => {
    const eps = [...season(1, 5, 8), ...season(2, 5, 6)];
    const r = computeWorthIt(eps);
    expect(r.best?.rating).toBe(8);
    expect(r.worst?.rating).toBe(6);
    expect(r.seasons.map((s) => s.season)).toEqual([1, 2]);
  });

  it("keeps the score within 0–100", () => {
    const eps = [...season(1, 5, 10), ...season(2, 5, 0)];
    const r = computeWorthIt(eps);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });
});
