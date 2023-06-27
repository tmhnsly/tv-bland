import Link from "next/link";
import Image from "next/image";
import { Episode } from "@/types/episode";
import StarRating from "./starRating";

interface EpisodeCardProps {
  episode: Episode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  return (
    <Link
      href={`/show/${episode.show.id}`}
      className="rounded-lg transition duration-200 p-3 gap-3 flex flex-col hover:scale-110 hover:bg-gray-200/50 hover:shadow-xl"
    >
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
        <Image
          src={
            episode.show.image && episode.show.image.original
              ? episode.show.image.original
              : "/tv-test-card-portrait.png"
          }
          fill
          sizes="(max-width: 300px)"
          loading="lazy"
          alt={`${episode.show.name} poster`}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col flex-grow gap-2">
        <StarRating
          rating={episode.show.rating.average ? episode.show.rating.average : 0}
          className="hidden md:visible"
        />
        <span>{episode.show.name}</span>
      </div>
    </Link>
  );
};

export default EpisodeCard;
