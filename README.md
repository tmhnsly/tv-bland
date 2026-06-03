# TV Bland

A TV listings web app — see what's on today, search shows, and dig into cast,
crew and full episode guides. Built with Next.js and the
[TVMaze API](https://www.tvmaze.com/api).

**Live demo:** https://tv-bland-seven.vercel.app

## Features

- **On air today** — homepage schedule that stays current (computed per request,
  revalidated hourly) instead of being frozen at build time
- **Search** — instant dropdown suggestions plus a full `/search` results page
- **Show pages** — the poster-as-background design, rating, summary, cast & crew,
  and a season-by-season **episode guide**
- **People** — cast members link through to person pages listing their other work
- **Browse by genre** — filterable, rating-sorted grid
- **Light / dark mode** — system-aware, persisted across reloads, no flash of the
  wrong theme
- **Polish** — skeleton loading states, custom 404 and error pages, dynamic Open
  Graph share images, and proper SEO metadata

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- TypeScript 6
- Tailwind CSS 3
- Vitest for unit tests
- Deployed on Vercel

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

### Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server                 |
| `npm run build` | Production build                     |
| `npm start`     | Serve the production build           |
| `npm run lint`  | ESLint (flat config)                 |
| `npm test`      | Run the Vitest unit tests            |

## Notes & trade-offs

- TVMaze has no genre-filter or "newest shows" endpoint, so **Browse** samples the
  shows index and filters in-app — a representative selection, not the full catalogue.
- `notFound()` on the dynamic show/person routes renders the 404 page but returns
  HTTP 200 (the root layout shell streams before the not-found is thrown) — a known
  Next.js limitation on streamed dynamic routes.

## What's next

- Watchlist / personalised schedule (saved to `localStorage`)
- Browse the schedule by date, not just today
- Component and end-to-end tests (Playwright)

## Credits

TV data from the [TVMaze API](https://www.tvmaze.com/api). This project is not
affiliated with TVMaze.
