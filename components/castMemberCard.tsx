import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CastMember } from "@/types/castMember";

interface CastMemberCardProps {
  castMember: CastMember;
}

const CastMemberCard: React.FC<CastMemberCardProps> = ({ castMember }) => {
  return (
    <div className="flex flex-row md:flex-row items-center gap-5 md:gap-10 h-auto md:h-20">
      <Link
        href={`/person/${castMember.person.id}`}
        className="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden relative hover:scale-105 hover:shadow-md"
      >
        <Image
          src={
            castMember.person.image && castMember.person.image.medium
              ? castMember.person.image.medium
              : "/tv-test-card-portrait.webp"
          }
          alt={castMember.person.name}
          fill
          sizes="80px"
          loading="lazy"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-col md:w-3/4 lg:flex-row lg:gap-5 lg:justify-between">
        <Link
          className="text-black dark:text-white hover:underline"
          href={`/person/${castMember.person.id}`}
        >
          {castMember.person.name}
        </Link>
        <a
          className="text-gray-500 dark:text-gray-400 hover:underline"
          href={castMember.character.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {castMember.character
            ? castMember.character.name
            : "No character information available"}
        </a>
      </div>
    </div>
  );
};

export default CastMemberCard;
