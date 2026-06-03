import { IoStar } from "react-icons/io5";

interface RatingBadgeProps {
  rating: number | null | undefined;
  className?: string;
}

// Compact rating pill used over posters — reads cleaner than five stars at
// small sizes.
const RatingBadge: React.FC<RatingBadgeProps> = ({ rating, className }) => {
  if (!rating) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm ${
        className ?? ""
      }`}
    >
      <IoStar className="text-accent" size={11} />
      {rating.toFixed(1)}
    </span>
  );
};

export default RatingBadge;
