import React from "react";
import Image from "next/image";
import { CastMember } from "@/types/castMember";

interface CastMemberCardProps {
  castMember: CastMember;
}

const CastMemberCard: React.FC<CastMemberCardProps> = ({ castMember }) => {
  return (
    <div className="flex flex-row md:flex-row items-start md:items-center gap-5 md:gap-10 h-auto md:h-20">
      <div className="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden">
        <Image
          src={
            castMember.person.image && castMember.person.image.medium
              ? castMember.person.image.medium
              : "/tv-test-card-portrait.png"
          }
          alt={castMember.person.name}
          width={80}
          height={80}
          loading="lazy"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-2 md:gap-5 md:w-3/4 md:justify-between">
        <a
          className="text-black dark:text-white hover:underline"
          href={castMember.person.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {castMember.person.name}
        </a>
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
