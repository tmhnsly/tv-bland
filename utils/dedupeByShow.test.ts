import { describe, it, expect } from "vitest";
import { dedupeByShow } from "./dedupeByShow";
import { Episode } from "@/types/episode";

const episode = (id: number): Episode => ({
  show: { id, name: `Show ${id}`, rating: { average: null } },
});

describe("dedupeByShow", () => {
  it("keeps the first entry per show id", () => {
    const out = dedupeByShow([
      episode(1),
      episode(2),
      episode(1),
      episode(3),
      episode(2),
    ]);
    expect(out.map((e) => e.show.id)).toEqual([1, 2, 3]);
  });

  it("returns an empty array for empty input", () => {
    expect(dedupeByShow([])).toEqual([]);
  });

  it("skips entries without a show", () => {
    const out = dedupeByShow([
      { show: undefined } as unknown as Episode,
      episode(5),
    ]);
    expect(out.map((e) => e.show.id)).toEqual([5]);
  });
});
