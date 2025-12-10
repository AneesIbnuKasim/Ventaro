import { Heart } from "lucide-react";
import { memo } from "react";

const ProductCard = memo(({ product, handleClick}) => {
  const {
    _id,
    name,
    brandName,
    description,
    images,
    price,
    oldPrice,
    rating,
    discount,
  } = product;
  

  return (
    <div onClick={() => handleClick(_id)} className="w-full max-w-[260px] bg-white rounded-xl border border-gray-200  p-4 shadow-md hover:shadow-xl transition cursor-pointer">
      
      {/* --- Top badge + wishlist icon --- */}
      <div className="flex items-start justify-between">
        <button className="text-gray-500 hover:text-red-500">
          <Heart size={20} />
        </button>
        {discount && (
          <span className="bg-green-500 text-white text-xs font-medium px-3 py-[2px] rounded-md">
            {discount}% OFF
          </span>
        )}

      </div>

      {/* --- Product Image --- */}
      <div className="w-full flex justify-center my-4">
        <img
          src={`http://localhost:5001${images[0]}`}
          alt={name}
          className="h-40 object-contain"
        />
      </div>

      {/* --- Product Title --- */}
      <h3 className="font-semibold text-[15px] leading-tight">
        {name}
      </h3>
      <span className="helper leading-tight">
        {brandName}
      </span>

      {/* --- Rating --- */}
      {rating && 
      <div className="flex items-center gap-1 py-1">
        <div className="flex text-yellow-400 text-sm">
          {"★".repeat(Math.floor(rating))}
          {"☆".repeat(5 - Math.floor(rating))}
        </div>

        <span className="text-gray-500 text-sm">({rating})</span>
      </div>
      }

      {/* --- Price Section --- */}
      <div className="flex items-center gap-2 mt-1">
        <span className="font-semibold text-lg">Rs. {price}</span>

        {oldPrice && (
          <span className="text-gray-400 line-through text-sm">
            Rs. {oldPrice}
          </span>
        )}
      </div>
    </div>
  );
})

export default ProductCard