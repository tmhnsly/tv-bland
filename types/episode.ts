import { Show } from "./show";

// A schedule entry from `/schedule` — we only use the embedded show.
export type Episode = {
  show: Show;
};
