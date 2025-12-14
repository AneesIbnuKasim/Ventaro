import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useProduct } from "../../context/ProductContext";

export default function SingleProduct({ product = {} }) {
  const images = Array.isArray(product.images) && product.images.length > 0
  ? product.images
  : product.image
  ? [product.image]
  : ["https://via.placeholder.com/400"];
  
  const [mainImage, setMainImage] = useState(images[0])
  const {handleAddToCart} = useProduct()

  const changeMainImage = (e , i) => {
    const image = e.target.src.split('http://localhost:5001')
    setMainImage(image[1])
  }

    useEffect(() => {
    setMainImage(images[0]);
  }, [product, images]);

  const addToCart = (id) => {
    handleAddToCart(id)
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="flex flex-col items-center">
        <img
          
          src={`http://localhost:5001${mainImage}`}
          alt={product.name || "product"}
          className="w-[380px] h-[420px] object-contain rounded-lg mb-6"
        />

        <div className="flex gap-4 mt-4">
          {images.map((src, i) => (
            <img
              key={i}
              onClick={(e, i)=> changeMainImage(e , i)}
              src={`http://localhost:5001${src}`}
              alt={`${product.name || "thumb"}-${i}`}
              className="w-16 h-16 object-contain cursor-pointer border rounded-md p-1"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold leading-snug">{product.name}</h2>

        <p className="text-3xl font-bold text-gray-900">Rs. {product.price ?? "-"}</p>

        <p className="text-sm text-gray-600 leading-relaxed max-w-lg">{product.shortDescription}</p>

        <div className="mt-4 text-sm text-gray-700 space-y-1">
          <p><span className="font-semibold">SKU:</span> {product.sku ?? "-"}</p>
          <p><span className="font-semibold">CATEGORY:</span> {product.categoryId?.name ?? "-"}</p>
          <p><span className="font-semibold">BRAND:</span> <span className="text-green-600">{product.brandName ?? "-"}</span></p>
        </div>

        <div className="flex gap-4 mt-6">
          <button onClick={()=>addToCart(product)} type="button" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium shadow-sm">
            <ShoppingCart /> ADD TO CART
          </button>

          <button type="button" className="flex items-center gap-2 border border-gray-400 px-6 py-3 rounded-md text-sm font-medium text-gray-700">
            <Heart /> ADD TO WISHLIST
          </button>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2">DESCRIPTION</h3>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{product.description}</p>
        </div>
      </div>
    </div>
  );
}