// Rating → colour: red (≤4) through amber to green (≥9). Shared by the season
// strip, episode rows and trend chart so the colour language is consistent.
export function ratingColor(rating: number | null | undefined): string {
  if (rating == null) return "rgb(var(--fg) / 0.08)";
  const t = Math.max(0, Math.min(1, (rating - 4) / 5));
  return `hsl(${Math.round(t * 120)} 62% 45%)`;
}
