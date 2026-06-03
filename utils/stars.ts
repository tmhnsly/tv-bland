export type StarCounts = {
  full: number;
  half: number;
  empty: number;
};

// TVMaze ratings are 0–10 and we render 5 stars, so each star is worth 2
// points. Always returns counts that add up to 5.
export function getStarCounts(rating: number): StarCounts {
  const clamped = Math.max(0, Math.min(10, rating || 0));
  const full = Math.floor(clamped / 2);
  const half = (clamped / 2) % 1 !== 0 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
}
