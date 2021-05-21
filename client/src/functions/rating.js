import React from 'react'
import StarRating from "react-star-ratings";

export const showAverage = (p) =>{
    if(p && p.rating){
        let ratingArray = p && p.rating
        let total =[]
        let length = ratingArray.length

        ratingArray.map((r) =>
            total.push(r.star)
        )
        let totalReduced = total.reduce((p, n) => p + n, 0)
        let highest = length*5;
        let result = (totalReduced*5)/highest;
    return (
        <div className="pt-3">
            <span>
                <StarRating 
                    starDimension="20px" 
                    starSpacing="2px" 
                    starRatedColor="red" 
                    rating={result} 
                    editing={false}


                    />{" "}
                    ({p.rating.length})
            </span>
        </div>
    )
    
    }
}
