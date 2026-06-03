import React from "react";
import Link from "next/link";
import ShowInfoItem from "./showInfoItem";

interface ShowInfoSectionProps {
  show: {
    network: {
      name: string;
    };
    schedule: {
      days: string[];
    };
    status: string;
    genres: string[];
  };
}

const ShowInfoSection: React.FC<ShowInfoSectionProps> = ({ show }) => {
  const renderScheduleContent = () => {
    if (show.schedule.days.length > 0) {
      const scheduleList = show.schedule.days.join(", ");
      return <>{scheduleList}</>;
    } else {
      return "No schedule information";
    }
  };

  const renderGenresContent = () => {
    if (show.genres.length > 0) {
      return (
        <span className="flex flex-wrap gap-2">
          {show.genres.map((genre) => (
            <Link
              key={genre}
              href={`/browse?genre=${encodeURIComponent(genre)}`}
              className="rounded-full bg-black/10 px-2 py-0.5 text-sm transition hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
            >
              {genre}
            </Link>
          ))}
        </span>
      );
    } else {
      return "No genre information";
    }
  };

  return (
    <div className="md:min-w-[21rem]">
      <h2 className="mb-5 text-black dark:text-white">Show info</h2>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-5">
        <ShowInfoItem
          title="Streamed on"
          content={show.network ? show.network.name : "No network information"}
        />
        <ShowInfoItem
          title="Schedule"
          content={show.schedule && renderScheduleContent()}
        />
        <ShowInfoItem
          title="Status"
          content={show.status ? show.status : "Status unavailable"}
        />
        <ShowInfoItem
          title="Genres"
          content={show.genres && renderGenresContent()}
        />
      </div>
    </div>
  );
};

export default ShowInfoSection;
