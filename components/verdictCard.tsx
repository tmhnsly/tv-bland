import Link from "next/link";
import Image from "next/image";
import { Show } from "@/types/show";
import { Verdict, WorthIt } from "@/utils/worthIt";

const SCORE_RING: Record<Verdict, string> = {
  "must-watch": "text-emerald-300 ring-emerald-400/50",
  "worth-it": "text-lime-300 ring-lime-400/50",
  mixed: "text-amber-300 ring-amber-400/50",
  skip: "text-rose-300 ring-rose-400/50",
};

interface VerdictCardProps {
  show: Show;
  worthIt: WorthIt;
}

const VerdictCard: React.FC<VerdictCardProps> = ({ show, worthIt }) => {
  const poster =
    show.image?.original ?? show.image?.medium ?? "/tv-test-card-portrait.webp";

  return (
    <Link
      href={`/show/${show.id}`}
      className="group w-36 shrink-0 snap-start sm:w-44"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl ring-1 ring-white/10 shadow-lg shadow-black/40 transition duration-300 ease-spring group-hover:-translate-y-1 group-hover:ring-accent/50">
        <Image
          src={poster}
          fill
          sizes="(max-width: 640px) 40vw, 176px"
          alt={`${show.name} poster`}
          className="object-cover transition duration-500 ease-spring group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        {worthIt.hasData && (
          <span
            className={`absolute left-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/60 font-display text-sm font-semibold ring-2 backdrop-blur-sm ${SCORE_RING[worthIt.verdict]}`}
          >
            {worthIt.score}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <p className="truncate text-sm font-semibold text-white">{show.name}</p>
          {worthIt.hasData && (
            <p className="truncate text-xs text-white/70">
              {worthIt.trajectoryLabel}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default VerdictCard;
