import { Show } from "@/types/show";
import ShowCard from "./showCard";

interface ShowGridProps {
  shows: Show[];
}

const ShowGrid: React.FC<ShowGridProps> = ({ shows }) => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {shows.map((show, i) => (
        <div
          key={show.id}
          className="reveal"
          style={{ animationDelay: `${Math.min(i, 14) * 40}ms` }}
        >
          <ShowCard show={show} />
        </div>
      ))}
    </div>
  );
};

export default ShowGrid;
