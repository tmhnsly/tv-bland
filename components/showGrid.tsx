import { Show } from "@/types/show";
import ShowCard from "./showCard";

interface ShowGridProps {
  shows: Show[];
}

const ShowGrid: React.FC<ShowGridProps> = ({ shows }) => {
  return (
    <div className="grid auto-rows-auto grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {shows.map((show) => (
        <ShowCard show={show} key={show.id} />
      ))}
    </div>
  );
};

export default ShowGrid;
