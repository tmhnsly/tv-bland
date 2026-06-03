import Link from "next/link";
import Image from "next/image";
import { Show } from "@/types/show";
import RatingBadge from "./ratingBadge";

interface ShowCardProps {
  show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
  const poster =
    show.image?.original ?? show.image?.medium ?? "/tv-test-card-portrait.webp";

  return (
    <Link href={`/show/${show.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl ring-1 ring-white/10 shadow-lg shadow-black/40 transition duration-300 ease-spring group-hover:-translate-y-1 group-hover:ring-accent/50">
        <Image
          src={poster}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
          loading="lazy"
          alt={`${show.name} poster`}
          className="object-cover transition duration-500 ease-spring group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
        <RatingBadge
          rating={show.rating?.average}
          className="absolute left-2 top-2"
        />
      </div>
      <h3 className="line-clamp-2 text-sm font-medium leading-snug text-fg/85 transition group-hover:text-fg">
        {show.name}
      </h3>
    </Link>
  );
};

export default ShowCard;
