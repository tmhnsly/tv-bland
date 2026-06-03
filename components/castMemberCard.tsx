import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CastMember } from "@/types/castMember";

interface CastMemberCardProps {
  castMember: CastMember;
}

const CastMemberCard: React.FC<CastMemberCardProps> = ({ castMember }) => {
  const { person, character } = castMember;
  const avatar = person.image?.medium ?? "/tv-test-card-portrait.webp";

  return (
    <Link
      href={`/person/${person.id}`}
      className="group flex items-center gap-3 rounded-xl glass p-2 pr-4 transition hover:ring-1 hover:ring-accent/40"
    >
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
        <Image
          src={avatar}
          alt={person.name}
          fill
          sizes="56px"
          loading="lazy"
          className="object-cover"
        />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium transition group-hover:text-accent">
          {person.name}
        </span>
        <span className="block truncate text-xs text-muted">
          {character?.name ?? "—"}
        </span>
      </span>
    </Link>
  );
};

export default CastMemberCard;
