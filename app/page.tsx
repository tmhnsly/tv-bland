import Link from "next/link";
import Image from "next/image";

type ShowEpisode = {
  show: {
    id: number;
    image: {
      original: string;
      medium: string;
    };
    rating: string;
    name: string;
  };
};

async function getSchedule() {
  const res = await fetch(`https://api.tvmaze.com/schedule?date=2023-06-21`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function HomePage() {
  const schedule = await getSchedule();

  return (
    <div
      className="bg-contain"
      style={{ backgroundImage: 'url("/tv-test-card.png")' }}
    >
      <div className="backdrop-blur-xl backdrop-brightness-125 dark:backdrop-brightness-75 pb-8">
        <div className="text-white dark:text-black px-4 py-20">
          <span>
            TV Show and web series database. Create personalised schedules.
            Episode guide, cast, crew and character information.
          </span>
        </div>
        <div className="px-4 py-10 bg-white/80 dark:bg-black/80 text-black dark:text-white">
          <h2>Last added shows</h2>
          <div className="grid grid-cols-2 gap-4">
            {schedule.slice(0, 20).map((episode: ShowEpisode) => {
              return (
                <Link
                  key={episode.show.id}
                  href={`/show/${episode.show.id}`}
                  className={
                    "p-2 rounded-lg transition hover:bg-gray-200/50 hover:shadow-xl hover:-translate-y-2"
                  }
                >
                  <Image
                    src={episode.show.image.medium}
                    alt={`${episode.show.name} poster`}
                    width={500}
                    height={500}
                    className="rounded-lg"
                  />
                  <span>{episode.show.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
