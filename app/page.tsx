import { Episode } from "@/types/episode";
import { PiTelevisionDuotone } from "react-icons/pi";
import EpisodeCard from "@/components/episodeCard";
import { getFormattedDate } from "@/utils/getCurrentDate";
import Image from "next/image";

const currentDate = getFormattedDate();

async function getSchedule() {
  const res = await fetch(
    `https://api.tvmaze.com/schedule?&date=${currentDate}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const HomePage: React.FC = async ({}) => {
  const schedule = await getSchedule();
  return (
    <div className="bg-home bg-cover text-black dark:text-white">
      <div className="flex flex-col bg-gray-200/90 dark:bg-gray-900/90 px-10 md:px-16 pb-16 pt-32 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2">
            <h1 className="text-4xl">TV Bland</h1>
            <PiTelevisionDuotone size={"36"} />
          </div>
          <span>
            TV Show and web series database. Create personalised schedules.
            Episode guide, cast, crew and character information.
          </span>
        </div>
      </div>
      <div className="px-5 py-10 mx-auto content-center bg-white/90 dark:bg-black/90 backdrop-blur-3xl backdrop-brightness-125 dark:backdrop-brightness-75">
        <div className="max-w-7xl mx-auto">
          <h2 className="mb-5">Last added shows</h2>
          <div className="grid auto-rows-auto gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {schedule.slice(0, 20).map((episode: Episode, key: number) => {
              return <EpisodeCard episode={episode} key={key} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
