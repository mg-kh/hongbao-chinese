import { StarHalfIcon, StarIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import React from "react";

const MAX_RATING = 5;

interface Props {
  rating: number;
  size?: number;
}

/**
 * Row of 5 stars for a rating, rounded to the nearest half star: full stars,
 * then an optional half star, then outlined empty ones.
 */
const StarRow: React.FC<Props> = ({ rating, size = 13 }) => {
  const t = useTranslations("Home.StudentReview");
  const halves = Math.round(rating * 2);
  return (
    <div
      className="flex! gap-0.5!"
      role="img"
      aria-label={t("rating_aria", {
        rating: Number(rating.toFixed(1)),
        max: MAX_RATING,
      })}
    >
      {Array.from({ length: MAX_RATING }).map((_, i) => {
        const fill = halves - i * 2; // >= 2 full, 1 half, <= 0 empty
        if (fill === 1) {
          return (
            <span key={i} className="relative! inline-flex!">
              <StarIcon size={size} className="text-gray-300!" />
              <StarHalfIcon
                size={size}
                weight="fill"
                className="absolute! inset-0! text-hongbao-gold-500!"
              />
            </span>
          );
        }
        return (
          <StarIcon
            key={i}
            size={size}
            weight={fill >= 2 ? "fill" : "regular"}
            className={fill >= 2 ? "text-hongbao-gold-500!" : "text-gray-300!"}
          />
        );
      })}
    </div>
  );
};

export default StarRow;
