import * as React from "react";
import { IoStar, IoStarOutline, IoStarHalf } from "react-icons/io5";
import { getStarCounts } from "@/utils/stars";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  className,
}) => {
  const { full, half, empty } = getStarCounts(rating);
  const filled = "text-yellow-400 dark:text-yellow-500";
  const outline = "text-black/30 dark:text-white/30";

  return (
    <div className={className ?? "flex text-2xl"}>
      {Array.from({ length: full }, (_, i) => (
        <IoStar key={`full-${i}`} className={filled} />
      ))}
      {half === 1 && <IoStarHalf className={filled} />}
      {Array.from({ length: empty }, (_, i) => (
        <IoStarOutline key={`empty-${i}`} className={outline} />
      ))}
    </div>
  );
};

export default StarRating;
