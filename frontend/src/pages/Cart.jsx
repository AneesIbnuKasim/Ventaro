import React, { memo, useEffect } from "react";
import Slider from "../components/ui/Slider";
import { useProduct } from "../context/ProductContext";
import ProductCard from "../components/ui/ProductCard";
import { useNavigate } from "react-router-dom";

const Cart = memo(() => {

  const { products, fetchProduct } = useProduct()
  const navigate = useNavigate()

  useEffect(()=> {
    const load = async()=>{
      if (products.length === 0) {
        await fetchProduct()
      }
    }
    load()
  }, [])

  
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-xl p-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="flex items-start gap-6 border rounded-xl p-6"
              >
                <img
                  src="https://via.placeholder.com/120x160"
                  alt="product"
                  className="w-28 h-36 object-contain"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    Samsung Tablet
                  </h3>
                  <p className="text-sm text-gray-500">
                    Samsung Tablet 5th Gen
                  </p>
                  <p className="text-sm text-gray-500">Memory Size: 128GB</p>
                  <p className="text-sm text-gray-500">Color Variant: White</p>

                  <p className="font-semibold mt-2">Rs. 20000</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center border rounded-lg">
                  <button className="px-3 py-1">-</button>
                  <span className="px-3">1</span>
                  <button className="px-3 py-1">+</button>
                </div>

                {/* Remove */}
                <button className="text-gray-400 text-xl">×</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <p className="font-medium">APPLY COUPONS</p>
              <button className="text-sm border px-4 py-1 rounded-md text-purple-600">
                APPLY
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">SUBTOTAL</span>
                <span>Rs. 40000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">DISCOUNT</span>
                <span>- Rs. 5000</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>TOTAL</span>
                <span>Rs. 35000</span>
              </div>
            </div>

            <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium">
              PLACE ORDER
            </button>
          </div>
        </div>

        {/* You May Also Like */}
        <Slider 
        title='Related Products'
        items={products}
        renderItem={(item)=><ProductCard 
          product={item}
          handleClick = {() => navigate(`/products/${id}`)}
          />}
        />
          <Slider title="Yoy May Also Like" items={products} renderItem={(item) => <ProductCard product={item} handleClick={()=> navigate(`/products/${id}`)}/>}  />
      </div>
    </div>
  );
})

export default Cart;