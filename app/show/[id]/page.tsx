import React from "react";
import Image from "next/image";
import ShowInfoSection from "@/components/showInfoSection";
import StarringSection from "@/components/starringSection";
import StarRating from "@/components/starRating";
import sanitizeHtml from "sanitize-html";

async function getShow(id: string) {
  const res = await fetch(`https://api.tvmaze.com/shows/${id}?embed=cast`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function ShowPage({ params }: any) {
  const show = await getShow(params.id);

  const backgroundImage =
    show.image && show.image.medium
      ? `url(${show.image.medium})`
      : `url(/tv-test-card-portrait.webp)`;

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage }}
    >
      <div className="backdrop-blur-3xl backdrop-brightness-125 dark:backdrop-brightness-75 pb-8 min-h-screen">
        <section className="px-5 flex flex-col gap-5 items-center">
          <div className="flex flex-col items-center pt-20 pb-5 gap-5 md:flex-row justify-center lg:translate-y-16 lg:pt-5">
            <div className="relative w-full h-auto max-w-sm">
              <Image
                src={
                  show.image && show.image.original
                    ? show.image.original
                    : "/tv-test-card-portrait.webp)"
                }
                alt={`${show.name} poster`}
                height={600}
                width={400}
                priority
              />
            </div>
            <div className="backdrop-blur-sm text-black dark:text-white bg-white/70 dark:bg-black/70 lg:max-w-xl w-full h-fit p-5 flex flex-col gap-5 rounded-lg self-center">
              <div className="flex items-center gap-2">
                <StarRating rating={show.rating.average} />
                {show.rating.average ? (
                  <span className="font-bold text-black dark:text-white">
                    {(show.rating.average / 2).toFixed(1)}/5
                  </span>
                ) : (
                  <span>No ratings</span>
                )}
              </div>

              <h1>{show.name ? show.name : "Name not available"}</h1>
              {show.summary ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(show.summary),
                  }}
                />
              ) : (
                "Summary not available"
              )}
            </div>
          </div>
        </section>
        <section className="bg-white/80 dark:bg-black/80 flex flex-col justify-center gap-10 py-10 lg:py-24">
          <div className="max-w-6xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <ShowInfoSection show={show} />
            <StarringSection cast={show._embedded.cast} />
          </div>
        </section>
      </div>
    </div>
  );
}
