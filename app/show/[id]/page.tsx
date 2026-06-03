import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import StarringSection from "@/components/starringSection";
import StarRating from "@/components/starRating";
import EpisodeGuide from "@/components/episodeGuide";
import sanitizeHtml from "sanitize-html";

interface ShowPageProps {
  params: Promise<{ id: string }>;
}

async function getShow(id: string) {
  const res = await fetch(
    `https://api.tvmaze.com/shows/${id}?embed[]=cast&embed[]=episodes`,
    { next: { revalidate: 86400 } }
  );

  if (res.status === 404) notFound();
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function generateMetadata({
  params,
}: ShowPageProps): Promise<Metadata> {
  const { id } = await params;
  const show = await getShow(id);
  const description = show.summary
    ? sanitizeHtml(show.summary, { allowedTags: [], allowedAttributes: {} })
    : "Cast, crew, episode guide and character information.";

  return {
    title: show.name ?? "Show",
    description,
    openGraph: { title: show.name ?? "Show", description },
  };
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { id } = await params;
  const show = await getShow(id);

  const poster =
    show.image?.original ??
    show.image?.medium ??
    "/tv-test-card-portrait.webp";
  const rating: number | null = show.rating?.average ?? null;

  const runtime = show.averageRuntime ?? show.runtime;
  const meta = [
    show.premiered ? show.premiered.slice(0, 4) : null,
    show.network?.name ?? show.webChannel?.name ?? null,
    runtime ? `${runtime} min` : null,
    show.status,
  ].filter(Boolean);

  return (
    <main className="relative">
      <div className="fixed inset-0 -z-10">
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover blur-2xl brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/85 to-bg" />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-24 pt-28 md:px-10 md:pt-36">
        <div className="flex flex-col gap-8 md:flex-row md:gap-10">
          <div className="reveal mx-auto w-full max-w-[240px] shrink-0 md:mx-0 md:w-60">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-2xl shadow-black/60">
              <Image
                src={poster}
                alt={`${show.name} poster`}
                fill
                priority
                sizes="240px"
                className="object-cover"
              />
            </div>
          </div>

          <div
            className="reveal min-w-0 flex-1"
            style={{ animationDelay: "70ms" }}
          >
            <h1 className="font-display text-4xl font-semibold md:text-6xl">
              {show.name ?? "Name not available"}
            </h1>

            {meta.length > 0 && (
              <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-muted">
                {meta.map((item: string, i: number) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-fg/25">·</span>}
                    <span>{item}</span>
                  </React.Fragment>
                ))}
              </p>
            )}

            <div className="mt-5 flex items-center gap-3">
              <StarRating rating={rating ?? 0} className="flex text-xl" />
              <span className="text-sm font-semibold">
                {rating ? `${(rating / 2).toFixed(1)} / 5` : "Not yet rated"}
              </span>
            </div>

            {show.genres?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {show.genres.map((genre: string) => (
                  <Link
                    key={genre}
                    href={`/browse?genre=${encodeURIComponent(genre)}`}
                    className="rounded-full glass px-3 py-1 text-xs font-medium text-muted transition hover:text-fg"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            )}

            {show.summary ? (
              <div
                className="prose-summary mt-6 max-w-2xl"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(show.summary) }}
              />
            ) : (
              <p className="mt-6 text-muted">Summary not available.</p>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-14">
          <StarringSection cast={show._embedded?.cast ?? []} />
          <EpisodeGuide episodes={show._embedded?.episodes ?? []} />
        </div>
      </div>
    </main>
  );
}
