import { OpinionListProps } from "@/app/types/propsTypes";
import { StarRating } from "./star-rating";


export const OpinionList = ({ opinions, rating }: OpinionListProps) => {
  
  return (
    <div className="opinion-list">
      <div className="general-rating">
        <h1>{rating}</h1>
        <span className="single-star">★</span>
      </div>
      <div className="opinions">
        <h3>Recent opinions</h3>
        <hr/>
        {opinions.map(opinion => (
        <div key={opinion.timestamp} className="opinion">
          <div className="opinion-head">
            <StarRating rating ={opinion.rate} /> 
            {opinion.name}
          </div>
          <div className="opinion-body">
            <p className="opinion-date">{new Date(opinion.timestamp).toLocaleString()}</p>
            <p className="opinion-desc">{opinion.description}</p>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}