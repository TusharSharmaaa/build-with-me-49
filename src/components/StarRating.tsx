import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        const isHalfFilled = starValue - 0.5 === rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={`${
              interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"
            }`}
          >
            <Star
              size={size}
              className={
                isFilled || isHalfFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          </button>
        );
      })}
    </div>
  );
}