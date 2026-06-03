import { describe, it, expect } from "vitest";
import { getStarCounts } from "./stars";

describe("getStarCounts", () => {
  it("maps a 0–10 rating onto five stars", () => {
    expect(getStarCounts(10)).toEqual({ full: 5, half: 0, empty: 0 });
    expect(getStarCounts(9)).toEqual({ full: 4, half: 1, empty: 0 });
    expect(getStarCounts(7)).toEqual({ full: 3, half: 1, empty: 1 });
    expect(getStarCounts(6)).toEqual({ full: 3, half: 0, empty: 2 });
    expect(getStarCounts(0)).toEqual({ full: 0, half: 0, empty: 5 });
  });

  it("clamps out-of-range and missing ratings", () => {
    expect(getStarCounts(12)).toEqual({ full: 5, half: 0, empty: 0 });
    expect(getStarCounts(-3)).toEqual({ full: 0, half: 0, empty: 5 });
    expect(getStarCounts(NaN)).toEqual({ full: 0, half: 0, empty: 5 });
  });

  it("always totals five stars", () => {
    for (let r = 0; r <= 10; r += 0.5) {
      const { full, half, empty } = getStarCounts(r);
      expect(full + half + empty).toBe(5);
    }
  });
});
