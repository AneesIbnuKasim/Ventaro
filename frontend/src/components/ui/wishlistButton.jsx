import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistThunk } from "../../redux/slices/wishlistSlice";

const WishlistButton = ({productId}) => {
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlist.items);
console.log('wishlist:',wishlist)

  const isWishlisted = wishlist?.includes(productId);

  const handleClick = (e, productId) => {
    e.stopPropagation()
    dispatch(toggleWishlistThunk(productId))
  }

  return (
    <button
      onClick={(e)=>handleClick(e, productId)}
      className=""
    >
      <Heart
        className={`w-5 h-5 transition ${
          isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
        }`}
      />
    </button>
  );
};

export default WishlistButton;