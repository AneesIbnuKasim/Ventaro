// import { memo } from "react";
// import RatingStars from "./RatingStars";
// import { useDispatch } from "react-redux";
// import { setCheckoutItems } from "../../redux/slices/checkoutSlice";
// import { addCartThunk } from "../../redux/slices/cartSlice";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import WishlistButton from "./wishlistButton";
// import { toggleWishlistThunk } from "../../redux/slices/wishlistSlice";
// import formatImageUrl from "../../utils/formatImageUrl";

// const ProductCard = memo(({ product, handleClick=()=>console.log('clicked'), buttons=false, buttonText= ['ADD TO CART', 'BUY NOW'], wishlistPage=false }) => {
//   const {
//     _id,
//     name,
//     brandName,
//     description,
//     images,
//     sellingPrice,
//     originalPrice,
//     ratings,
//     avgRating,
//     discount,
//   } = product;

//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   // useEffect(())

//     const addToCart = () => {
//       dispatch(addCartThunk({ productId:_id, quantity: 1 })).unwrap()
//       if (wishlistPage) {
//         dispatch(toggleWishlistThunk({productId: _id}))
//         toast.success('Product moved to cart')
//       }
//       else toast.success('Product added to cart')
//     }
//   const handleBuyNow = async() => {
//     if (wishlistPage) {
//       try {
//         const res = await dispatch(toggleWishlistThunk({productId: _id})).unwrap()
//       toast.success('Product removed from wishlist!')
//       } catch (error) {
//         toast.error(error?.message)
//       }
//     }
//     else {
//       dispatch(setCheckoutItems([
//       {
//         product: {
//           _id,
//           name,
//           images,
//         },
//         quantity: 1,
//         basePrice: originalPrice, 
//         finalUnitPrice: sellingPrice, 
//         itemTotal: sellingPrice,
//       }
//     ]));
//     navigate("/checkout?mode=buynow");
//     }
//   };
  

//   return (
//     <div className=" min-h-100 rounded-xl border border-card-theme p-4 shadow-md hover:shadow-xl transition-all cursor-pointer
//     bg-card card">
      
//       {/* --- TOP BADGE + WISHLIST ICON --- */}
//       <div className="flex items-start justify-between">
//         <WishlistButton productId={_id} />
//         {originalPrice && (
//           <span className="bg-green-500 text-white text-xs font-medium px-3 py-0.5 rounded-md">
//             {(((originalPrice-sellingPrice)/originalPrice)*100).toFixed()}% OFF
//           </span>
//         )}
//       </div>
//       <div onClick={()=>handleClick(_id)}>
//       {/* --- PRODUCT IMAGE --- */}
//       <div className="w-full flex justify-center my-4">
//         <img
//           src={ formatImageUrl(images[0])}
//           alt={name}
//           className="h-40 object-contain"
//         />
//       </div>

//       {/* --- PRODUCT TITLE --- */}
//       <h3 className="font-semibold text-[15px] leading-tight product-title">
//         {name}
//       </h3>
//       <span className="helper leading-tight">
//         {brandName}
//       </span>

//       {/* --- RATING --- */}
//       {avgRating > 0 && (
//             <div className="flex mt-1">
//         <RatingStars avg={avgRating} /> <span className="ml-2 text-sm text-gray-600">
//   {avgRating.toFixed(1)} ({ratings?.length}) </span>
//   </div> ) }

//       {/* --- PRICE SECTION --- */}
//       <div className="flex items-center gap-2 mt-1">
//         <span className="font-semibold text-lg">Rs. {sellingPrice}</span>

//         {originalPrice && (
//           <span className="text-gray-400 line-through text-sm">
//             Rs. {originalPrice}
//           </span>
//         )}
//       </div>
// </div>

//       {/* BUTTONS */}
//              {buttons  && buttonText && (
//                <div className="flex gap-2 mt-6">
//           <button onClick={()=>addToCart()} type="button" className='flex-1 outline-none text-xs px-3 py-2 text-white rounded-lg bg-violet-500 hover:bg-violet-700 whitespace-nowrap'>
//              {buttonText[0]}
//           </button>
//           <button onClick={handleBuyNow} type="button" className='flex-1 text-xs outline-none px-4 py-2 text-white rounded-lg bg-yellow-500 hover:bg-yellow-700 whitespace-nowrap '>
//              {buttonText[1]}
//           </button>
//         </div>
//              )}
//     </div>
//   );
// })

// export default ProductCard

import { memo } from "react";
import { ShoppingBag, Zap } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { setCheckoutItems } from "../../redux/slices/checkoutSlice";
import { addCartThunk } from "../../redux/slices/cartSlice";
import { toggleWishlistThunk } from "../../redux/slices/wishlistSlice";
import { CURRENCY } from "../../constants/ui";
import formatImageUrl from "../../utils/formatImageUrl";
import RatingStars from "./RatingStars";
import WishlistButton from "./wishlistButton";

const ProductCard = memo(({
  product,
  handleClick = () => {},
  buttons = false,
  buttonText = ["Add to Cart", "Buy Now"],
  wishlistPage = false,
}) => {
  const {
    _id,
    name,
    brandName,
    images = [],
    sellingPrice,
    originalPrice,
    ratings = [],
    avgRating,
  } = product;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const discount =
    originalPrice && sellingPrice
      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      : 0;
  const imageSrc = formatImageUrl(images[0]);

  const addToCart = async (event) => {
    event.stopPropagation();
    try {
      await dispatch(addCartThunk({ productId: _id, quantity: 1 })).unwrap();
      if (wishlistPage) {
        await dispatch(toggleWishlistThunk({ productId: _id })).unwrap();
        toast.success("Moved to cart");
      } else {
        toast.success("Added to cart");
      }
    } catch (error) {
      toast.error(error?.message || "Unable to update cart");
    }
  };

  const handleSecondaryAction = async (event) => {
    event.stopPropagation();

    if (wishlistPage) {
      try {
        await dispatch(toggleWishlistThunk({ productId: _id })).unwrap();
        toast.success("Removed from wishlist");
      } catch (error) {
        toast.error(error?.message || "Unable to update wishlist");
      }
      return;
    }

    dispatch(setCheckoutItems([
      {
        product: { _id, name, images },
        quantity: 1,
        basePrice: originalPrice || sellingPrice,
        finalUnitPrice: sellingPrice,
        itemTotal: sellingPrice,
      },
    ]));
    navigate("/checkout?mode=buynow");
  };

  return (
    <article className="card group flex h-full min-h-[306px] flex-col overflow-hidden rounded-lg border border-card-theme bg-card shadow-sm">
      <div className="relative bg-inner-card">
        {discount > 0 && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-black leading-none text-white shadow-sm">
            {discount}% off
          </span>
        )}

        <div className="absolute right-2.5 top-2.5 z-10">
          <WishlistButton
            productId={_id}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-card/95 shadow-sm transition hover:scale-105"
            heartClass="h-[18px] w-[18px]"
          />
        </div>

        <button
          type="button"
          className="flex aspect-[4/3] w-full items-center justify-center"
          onClick={() => handleClick(_id)}
          aria-label={`View ${name}`}
        >
          <img
            src={imageSrc}
            alt={name}
            loading="lazy"
            className="h-full max-h-360 w-full object-fill transition duration-300 group-hover:scale-[1.04]"
          />
        </button>
      </div>

      <button
        type="button"
        className="flex flex-1 flex-col px-3.5 py-3 text-left"
        onClick={() => handleClick(_id)}
        aria-label={`View ${name}`}
      >
        <span className="mb-1 truncate text-[11px] font-bold uppercase tracking-wide text-muted">
          {brandName || "Ventaro"}
        </span>
        <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-primary">
          {name}
        </h3>

        <div className="mt-2 h-5">
          {avgRating > 0 ? (
            <div className="flex items-center gap-2">
              <RatingStars avg={avgRating} size={13} />
              <span className="text-xs text-muted">
                {avgRating.toFixed(1)} ({ratings.length})
              </span>
            </div>
          ) : (
            <span className="rounded-full bg-inner-card px-2 py-1 text-[11px] font-semibold text-muted">
              New arrival
            </span>
          )}
        </div>

        <div className="mt-auto flex min-h-7 items-end gap-2 pt-2">
          <span className="text-base font-black text-primary">
            {CURRENCY}{sellingPrice}
          </span>
          {originalPrice > sellingPrice && (
            <span className="pb-0.5 text-xs font-medium text-muted line-through">
              {CURRENCY}{originalPrice}
            </span>
          )}
        </div>
      </button>

      {buttons && (
        <div className="grid grid-cols-[1fr_1.08fr] gap-2 border-t border-card-theme p-2.5">
          <button
            onClick={addToCart}
            type="button"
            className="inline-flex min-w-0 items-center justify-center gap-1 rounded-md border border-card-theme px-2.5 py-2 text-[11px] font-black uppercase tracking-wide transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <ShoppingBag className="shrink-0" size={13} />
            <span className="truncate">{buttonText[0]}</span>
          </button>
          <button
            onClick={handleSecondaryAction}
            type="button"
            className="inline-flex min-w-0 items-center justify-center gap-1 rounded-md bg-[var(--color-primary)] px-2.5 py-2 text-[11px] font-black uppercase tracking-wide text-white transition hover:bg-[var(--color-primary-dark)]"
          >
            <Zap className="shrink-0" size={13} />
            <span className="truncate">{buttonText[1]}</span>
          </button>
        </div>
      )}
    </article>
  );
});

export default ProductCard;
