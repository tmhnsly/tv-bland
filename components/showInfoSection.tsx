import React from "react";
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
      const genresList = show.genres.join(", ");
      return <>{genresList}</>;
    } else {
      return "No genre information";
    }
  };

  return (
    <div>
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
