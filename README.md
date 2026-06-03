# Dropoff TV

**Does it drop off?** Type any TV show and get a **Worth It score**, an
**episode-rating heatmap**, and a plain-English verdict on whether it stays good
— and exactly when to stop watching.

**Live demo:** https://tv-bland-seven.vercel.app

## How it works

Dropoff TV pulls every episode's rating from the [TVMaze API](https://www.tvmaze.com/api)
and distils it into:

- a **Worth It score (0–100)** + verdict — _Must-watch · Worth it · Mixed bag · Skip it_
- a **drop-off trajectory** — _No drop-off · Drops off · Falls off a cliff · Gets better_
- a **"watch through Season X"** tip when a show declines after its peak
- an **episode heatmap** (seasons × episodes) so you can literally see the slide,
  with the best and weakest episodes called out

The score rewards shows that stay good and **stick the landing**, and penalises a
late **drop-off** — but always with an advisory, so a great-then-declining show
(hello, Game of Thrones) is still flagged as worth it for its strong run.

## Features

- **Search** any show + **Browse** by genre
- **Show pages**: the verdict + heatmap, cast grid, and an expandable episode guide
- Cinematic dark-first UI, dynamic Open Graph images, and a channel-flipping logo

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript 6 · Tailwind CSS 3 · Vitest · Vercel

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm start`     | Serve the production build |
| `npm run lint`  | ESLint (flat config)       |
| `npm test`      | Vitest unit tests          |

## Notes & trade-offs

- Scoring needs at least 5 rated episodes; sparse coverage is surfaced in the verdict.
- TVMaze has no genre-filter endpoint, so **Browse** samples the shows index.
- `notFound()` on dynamic routes renders the 404 page but returns HTTP 200 (a known
  Next.js streaming limitation).

## Credits

TV data from the [TVMaze API](https://www.tvmaze.com/api). Not affiliated with TVMaze.
