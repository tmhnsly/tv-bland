import Link from "next/link";
import Image from "next/image";
import { Show } from "@/types/show";
import StarRating from "./starRating";

interface ShowCardProps {
  show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
  const poster =
    show.image?.original ?? show.image?.medium ?? "/tv-test-card-portrait.webp";

  return (
    <Link
      href={`/show/${show.id}`}
      className="group flex flex-col gap-3 rounded-xl p-2 transition duration-200 hover:bg-black/5 hover:shadow-xl dark:hover:bg-white/5"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg ring-1 ring-black/5 dark:ring-white/10">
        <Image
          src={poster}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          loading="lazy"
          alt={`${show.name} poster`}
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-1">
        <StarRating
          rating={show.rating?.average ?? 0}
          className="hidden text-lg md:flex"
        />
        <span className="text-sm font-medium leading-snug line-clamp-2">
          {show.name}
        </span>
      </div>
    </Link>
  );
};

export default ShowCard;
