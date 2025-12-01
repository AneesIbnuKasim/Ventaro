// ReviewsList.jsx
import React from "react";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";

export function ReviewsList({ reviews = [] }) {
  return (
    <div className="flex flex-col gap-6 mb-10">
      {reviews.map((r, i) => (
        <div
          key={i}
          className="border rounded-xl p-6 shadow-sm bg-white flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div>
              <h4 className="font-semibold text-base">{r.name}</h4>
              <p className="text-sm text-gray-500">{r.location}</p>
            </div>
          </div>

          <p className="text-gray-600 text-[15px] leading-relaxed">{r.review}</p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className={s <= r.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
                />
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1"><ThumbsUp size={16}/> {r.likes}</div>
              <div className="flex items-center gap-1"><MessageCircle size={16}/> {r.comments}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}





// Usage Example
// import { ReviewsList } from "./ReviewsList";
// import { ReviewForm } from "./ReviewForm";
//
// <ReviewsList reviews={reviews} />
// <ReviewForm onSubmitReview={handleReviewSubmit} />