import React from "react";
import { CastMember } from "@/types/castMember";
import CastMemberCard from "./castMemberCard";

interface StarringSectionProps {
  cast: CastMember[];
}

const StarringSection: React.FC<StarringSectionProps> = ({ cast }) => {
  const renderCastMembers = () => {
    if (cast && cast.length > 0) {
      return cast
        .slice(0, 4)
        .map((castMember: CastMember, key: number) => (
          <CastMemberCard castMember={castMember} key={key} />
        ));
    } else {
      return (
        <span className="text-gray-500 dark:text-gray-400">
          No cast information available
        </span>
      );
    }
  };

  return (
    <div className="md:flex md:flex-col">
      <h2 className="mb-5 text-black dark:text-white">Starring</h2>
      <div className="flex flex-col gap-5">{renderCastMembers()}</div>
    </div>
  );
};

export default StarringSection;
