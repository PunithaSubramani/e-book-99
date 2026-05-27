import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        if (rating >= i + 1) return <FaStar key={i} className="text-yellow-400 text-sm" />;
        if (rating >= i + 0.5) return <FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />;
        return <FaRegStar key={i} className="text-yellow-400 text-sm" />;
      })}
    </div>
  );
}
