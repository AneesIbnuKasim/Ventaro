// import React, { useEffect, useState } from "react";
// import { ShoppingCart } from "lucide-react";
// import { useProduct } from "../../context/ProductContext";
// import { useDispatch } from "react-redux";
// import { addCartThunk } from "../../redux/slices/cartSlice";
// import { toast } from "react-toastify";
// import RatingStars from "./RatingStars";
// import Button from "./Button";
// import { BsLightningChargeFill } from "react-icons/bs";
// import { useNavigate } from "react-router-dom";
// import { setCheckoutItems } from "../../redux/slices/checkoutSlice";
// import WishlistButton from "./wishlistButton";
// import { API_CONFIG } from "../../config/app";

// export default function SingleProduct({ product = {}, avgRating = '' }) {

//   //PRODUCT IMAGE LINK
//   const images = Array.isArray(product.images) && product.images.length > 0
//   ? product.images
//   : product.image
//   ? [product.image]
//   : ["https://via.placeholder.com/400"];
  
//   const [mainImage, setMainImage] = useState(images[0])
//   const {handleAddToCart} = useProduct()
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
  

//   const changeMainImage = (e , i) => {
//     const img = resolveImageUrl(e.target.src)
//     setMainImage(img)
//   }

//     useEffect(() => {
//     setMainImage(images[0]);
//   }, [product, images]);


//   const addToCart = () => {
    
//     dispatch(addCartThunk({ productId: product._id, quantity: 1 })).unwrap()
//     toast.success('Product added to cart')
//   }

// const handleBuyNow = () => {
//   dispatch(setCheckoutItems([
//     {
//       product: {
//         _id: product._id,
//         name: product.name,
//         images: product.images,
//       },
//       quantity: 1,
//       basePrice: product.originalPrice,      // authoritative price
//       finalUnitPrice: product.sellingPrice,  // UI only
//       itemTotal: product.sellingPrice,
//     }
//   ]));

//   navigate("/checkout?mode=buynow");
// };


// const resolveImageUrl = (image, baseUrl = API_CONFIG.imageURL2) => {
//     if (!image) return "";

//     // Case 1: S3 or Cloudinary object
//     if (typeof image === "object" && image.url) {
//       // If already absolute (S3), return as-is
//       return image.url.startsWith("http")
//         ? image.url
//         : `${baseUrl}${image.url}`
//     }

//     // Case 2: Old string path
//     if (typeof image === "string") {
//       return image.startsWith("http") ? image : `${baseUrl}${image}` ?? `${baseUrl}${image.url}`;
//     }

//     return "";
//   };


//   return (
//     <div className="w-full max-w-360 mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
//       <div className="flex flex-col items-center relative">
//         <div >
//           <WishlistButton productId={product._id} heartClass="w-7 h-7" className="absolute top-10 right-10" />
//         </div>
//         <img
          
//           src={ resolveImageUrl(mainImage)}
//           alt={product.name || "product"}
//           className="w-[380px] h-[420px] object-contain rounded-lg mb-6"
//         />

//         <div className="flex gap-4 mt-4">
//           {images.map((img, i) => (
//             <img
//               key={i}
//               onClick={(e, i)=> changeMainImage(e , i)}
//               src={ resolveImageUrl(img)}
//               alt={`${product.name || "thumb"}-${i}`}
//               className="w-16 h-16 object-contain cursor-pointer border rounded-md p-1"
//             />
//           ))}
//         </div>
//       </div>

//       <div className="space-y-4">
//         <h2 className="text-2xl font-semibold leading-snug">{product.name}</h2>

//         <p className="text-3xl font-bold price">Rs. {product.sellingPrice ?? "-"} 
//           {product.originalPrice && (
//              <span className=" ml-3 line-through old-price">
//             Rs. {product.originalPrice}
//           </span>
//         )}
//         </p>

//         <p className="text-sm text-gray-600 leading-relaxed max-w-lg">{product.shortDescription}</p>

//         <div className="mt-4 flex flex-col gap-3 text-sm helper space-y-1">
//           <p><span className="font-semibold">CATEGORY:</span> {product.categoryId?.name ?? "-"}</p>
//           <p><span className="font-semibold">BRAND:</span> <span className="text-green-600">{product.brandName ?? "-"}</span></p>
//           {avgRating > 0 && (
//             <div className="flex">
//         <RatingStars avg={avgRating} /> <span className="ml-2 text-sm helper">
//   {avgRating.toFixed(1)} ({product.ratings?.length})
// </span>
//       </div>
//           )}
          
//         </div>

//         <div className="flex gap-4 mt-6">
//           <Button onClick={()=>addToCart()} icon={<ShoppingCart />} type="button" variant={'custom'} className='flex-1'>
//              ADD TO CART
//           </Button>

//           <Button type="button" onClick={handleBuyNow} icon={<BsLightningChargeFill/>} variant={'warning'} className='flex-1'>
//              BUY NOW
//           </Button>
//         </div>

//         <div className="mt-10">
//           <h3 className="text-lg font-semibold mb-2">DESCRIPTION</h3>
//           <p className="text-sm helper leading-relaxed max-w-2xl">{product.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { ShieldCheck, ShoppingCart, Truck, Zap } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { addCartThunk } from "../../redux/slices/cartSlice";
import { setCheckoutItems } from "../../redux/slices/checkoutSlice";
import { CURRENCY } from "../../constants/ui";
import formatImageUrl from "../../utils/formatImageUrl";
import Button from "./Button";
import RatingStars from "./RatingStars";
import WishlistButton from "./wishlistButton";

export default function SingleProduct({ product = {}, avgRating = 0 }) {
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const [mainImage, setMainImage] = useState(images[0]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setMainImage(images[0]);
  }, [product._id]);

  const addToCart = async () => {
    try {
      await dispatch(addCartThunk({ productId: product._id, quantity: 1 })).unwrap();
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error?.message || "Unable to update cart");
    }
  };

  const handleBuyNow = () => {
    dispatch(setCheckoutItems([
      {
        product: {
          _id: product._id,
          name: product.name,
          images: product.images,
        },
        quantity: 1,
        basePrice: product.originalPrice || product.sellingPrice,
        finalUnitPrice: product.sellingPrice,
        itemTotal: product.sellingPrice,
      },
    ]));

    navigate("/checkout?mode=buynow");
  };

  const discount =
    product.originalPrice && product.sellingPrice
      ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
      : 0;

  return (
    <section className="container-shell grid grid-cols-1 gap-8 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
      <div className="surface-panel p-4 md:p-6">
        <div className="relative flex min-h-[420px] items-center justify-center rounded-lg bg-inner-card p-6">
          <WishlistButton
            productId={product._id}
            heartClass="w-6 h-6"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-sm"
          />
          <img
            src={formatImageUrl(mainImage)}
            alt={product.name || "product"}
            className="max-h-[430px] w-full object-contain"
          />
        </div>

        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-6">
            {images.map((img, i) => {
              const selected = formatImageUrl(mainImage) === formatImageUrl(img);

              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-md border bg-inner-card p-2 transition ${
                    selected
                      ? "border-[var(--color-primary)] ring-2 ring-blue-100"
                      : "border-card-theme hover:border-[var(--color-primary)]"
                  }`}
                >
                  <img
                    src={formatImageUrl(img)}
                    alt={`${product.name || "thumb"} ${i + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-24 lg:h-fit">
        <div className="surface-panel p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="section-kicker">{product.brandName || "Ventaro"}</span>
              <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight">
                {product.name}
              </h1>
            </div>
            {discount > 0 && (
              <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                {discount}% off
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {avgRating > 0 ? (
              <>
                <RatingStars avg={avgRating} />
                <span className="text-sm text-muted">
                  {avgRating.toFixed(1)} ({product.ratings?.length || 0} reviews)
                </span>
              </>
            ) : (
              <span className="rounded-full bg-inner-card px-3 py-1 text-sm font-semibold text-muted">
                New arrival
              </span>
            )}
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-black text-primary">
              {CURRENCY}{product.sellingPrice ?? "-"}
            </span>
            {product.originalPrice > product.sellingPrice && (
              <span className="pb-1 text-lg text-muted line-through">
                {CURRENCY}{product.originalPrice}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-sm leading-6 text-secondary">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              [Truck, "Fast delivery"],
              [ShieldCheck, "Secure payment"],
              [Zap, "Easy checkout"],
            ].map(([Icon, label]) => (
              <div key={label} className="rounded-lg bg-inner-card p-3 text-sm font-bold">
                <Icon className="mb-2 h-5 w-5 text-[var(--color-primary)]" />
                {label}
              </div>
            ))}
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              onClick={addToCart}
              icon={<ShoppingCart size={18} />}
              type="button"
              variant="outline-primary"
              className="border-[var(--color-primary)]"
              block
            >
              Add to Cart
            </Button>

            <Button
              type="button"
              onClick={handleBuyNow}
              icon={<Zap size={18} />}
              variant="primary"
              block
            >
              Buy Now
            </Button>
          </div>
        </div>

        <div className="surface-panel mt-4 p-5 md:p-7">
          <h2 className="text-lg font-black">Product Details</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <p><span className="font-bold text-secondary">Category:</span> {product.categoryId?.name ?? "-"}</p>
            <p><span className="font-bold text-secondary">Brand:</span> {product.brandName ?? "-"}</p>
          </div>
          {product.description && (
            <p className="mt-4 text-sm leading-7 text-secondary">{product.description}</p>
          )}
        </div>
      </div>
    </section>
  );
}
