import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CastMember } from "@/types/castMember";

interface CastMemberCardProps {
  castMember: CastMember;
}

const CastMemberCard: React.FC<CastMemberCardProps> = ({ castMember }) => {
  const { person, character } = castMember;
  const photo = person.image?.medium ?? "/tv-test-card-portrait.webp";

  return (
    <Link href={`/person/${person.id}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-white/10 shadow-lg shadow-black/30 transition duration-300 ease-spring group-hover:-translate-y-1 group-hover:ring-accent/50">
        <Image
          src={photo}
          alt={person.name}
          fill
          sizes="(max-width: 640px) 30vw, (max-width: 1024px) 20vw, 160px"
          loading="lazy"
          className="object-cover object-top transition duration-500 ease-spring group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <p className="truncate text-sm font-semibold text-white">
            {person.name}
          </p>
          <p className="truncate text-xs text-white/65">
            {character?.name ?? "—"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CastMemberCard;
