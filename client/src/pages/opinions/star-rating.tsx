import { StarRatingProps } from "@/app/types/propsTypes";


export const StarRating = ({ rating }: StarRatingProps) => {
  let stars = "";
  
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars += "★";
    } else {
      stars += "☆";
    }
  }

  return <div className="stars">{stars}</div>;
};