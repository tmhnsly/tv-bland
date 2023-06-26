import * as React from "react";
import { IoStar, IoStarOutline, IoStarHalf } from "react-icons/io5";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  // Calculate the number of full stars to display
  const fullStarsCount = Math.floor(rating / 2);

  // Determine if there is a half star in the rating
  const isHalfStar = (rating / 2) % 1 !== 0;

  // Create an array of full star elements
  const fullStars = Array.from({ length: fullStarsCount }, (_, i) => (
    <IoStar key={i} className="text-yellow-400 dark:text-yellow-500" />
  ));

  // Create a half star element if required
  const halfStars = isHalfStar
    ? [
        <IoStarHalf
          key="half"
          className="text-yellow-400 dark:text-yellow-500"
        />,
      ]
    : [];

  // Combine the full stars and half star into a filled star array
  const filledStars = [...fullStars, ...halfStars];

  // Always display 5 empty stars in the background
  const emptyStars = Array.from({ length: 5 }, (_, i) => (
    <IoStarOutline key={i} className="text-black/30 dark:text-white/30" />
  ));

  // Return the component with filled stars overlaying the empty stars
  return (
    <div className="relative flex text-2xl">
      <div className="absolute flex">{filledStars}</div>
      <div className="flex">{emptyStars}</div>
    </div>
  );
};

export default StarRating;
