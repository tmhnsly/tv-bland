import React from "react";
import Image from "next/image";

type CastMember = {
  person: {
    name: string;
    image: {
      original: string;
      medium: string;
    };
  };
  character: {
    name: string;
  };
};

async function getShow(id: string) {
  const res = await fetch(`https://api.tvmaze.com/shows/${id}?embed=cast`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function ShowPage({ params }: any) {
  const show = await getShow(params.id);

  return (
    <>
      <div
        className="bg-contain"
        style={{ backgroundImage: `url(${show.image.medium})` }}
      >
        <div className="backdrop-blur-3xl backdrop-brightness-125 dark:backdrop-brightness-75 pb-8">
          <section className={`-mt-16 pt-16 flex flex-col gap-5`}>
            <div className={`flex flex-col p-5 gap-5 md:flex-row`}>
              <div className="relative aspect-square w-full h-auto">
                <Image
                  src={show.image.original}
                  alt={`${show.name} poster`}
                  height={900}
                  width={1200}
                />
              </div>
              <div className="backdrop-blur-sm text-black dark:text-white bg-white/70 dark:bg-black/70 p-5 flex flex-col gap-5 rounded-lg">
                <div>
                  {show.rating.average ? (
                    show.rating.average
                  ) : (
                    <span>No ratings</span>
                  )}
                </div>
                <h1>{show.name ? show.name : "Name not available"}</h1>
                {show.summary ? (
                  <p dangerouslySetInnerHTML={{ __html: show.summary }} />
                ) : (
                  "Summary not avilable"
                )}
              </div>
            </div>
          </section>
          <section className="bg-white/80 dark:bg-black/80 px-10 md:grid md:grid-cols-2">
            {/* SHOW INFO */}
            <div className={"py-10 pb-5"}>
              <h2 className="mb-2 text-black dark:text-white">Show info</h2>
              <div className="grid grid-cols-2 gap-5 md:flex md:flex-col">
                <div className="md:flex md:justify">
                  <h3 className="text-black dark:text-white">Streamed on</h3>
                  <span className="text-gray-400">
                    {show.network
                      ? show.network.name
                      : "No network information"}
                  </span>
                </div>
                <div>
                  <h3 className="text-black dark:text-white">Schedule</h3>
                  <div className="flex flex-col text-gray-400">
                    {show.schedule.days.map((day: string) => {
                      return <span key={day}>{day}</span>;
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-black dark:text-white">Status</h3>
                  <span className="text-gray-400">
                    {show.status ? show.status : "Status unavilable"}
                  </span>
                </div>
                <div>
                  <h3 className="text-black dark:text-white">Genres</h3>
                  <div className="text-gray-400">
                    {show.genres
                      ? show.genres.map((genre: string) => {
                          return <span key={genre}>{genre}</span>;
                        })
                      : "No genre information"}
                  </div>
                </div>
              </div>
            </div>
            {/* STARRING */}
            <div className="pt-5 pb-10 md:flex md:flex-col md:pt-10">
              <h2 className="mb-3 text-black dark:text-white">Starring</h2>
              <div className="flex flex-col gap-5">
                {show._embedded.cast ? (
                  show._embedded.cast
                    .slice(0, 4)
                    .map((castMember: CastMember, index: number) => (
                      <div key={index} className="flex gap-5 md:items-center">
                        <div className="h-20 w-20 rounded-full overflow-hidden">
                          <Image
                            src={castMember.person.image.original}
                            alt={castMember.person.name}
                            width={100}
                            height={100}
                            loading="lazy"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <a className="text-black dark:text-white">
                            {castMember.person.name}
                          </a>
                          <a className="text-gray-400">
                            {castMember.character
                              ? castMember.character.name
                              : "No character information available"}
                          </a>
                        </div>
                      </div>
                    ))
                ) : (
                  <span>No cast information available</span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
