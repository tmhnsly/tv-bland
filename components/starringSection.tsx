import React from "react";
import { CastMember } from "@/types/castMember";
import CastMemberCard from "./castMemberCard";

interface StarringSectionProps {
  cast: CastMember[];
}

const StarringSection: React.FC<StarringSectionProps> = ({ cast }) => {
  if (!cast || cast.length === 0) {
    return (
      <div>
        <h2 className="mb-5 text-2xl font-semibold">Cast</h2>
        <p className="text-muted">No cast information available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-5 text-2xl font-semibold">Cast</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cast.slice(0, 8).map((castMember, key) => (
          <CastMemberCard castMember={castMember} key={key} />
        ))}
      </div>
    </div>
  );
};

export default StarringSection;
