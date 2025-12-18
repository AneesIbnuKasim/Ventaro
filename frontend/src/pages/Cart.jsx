import React, { memo, useEffect, useState } from "react";
import Slider from "../components/ui/Slider";
import { useProduct } from "../context/ProductContext";
import ProductCard from "../components/ui/ProductCard";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../config/app";
import { useSelector } from "react-redux";
import { Button } from "../components/ui";

const Cart = memo(() => {
  const { products, fetchProduct, loadCart } = useProduct();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  console.log("items.length", items);

  // useEffect(() => {
  //   const items = loadCart()
  //   setCartItems(items)
  // }, [])

  useEffect(() => {
    const load = async () => {
      if (products.length === 0) {
        await fetchProduct();
      }
    };
    load();
  }, []);

  return (
    <div className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-xl p-8">
        {/* Top Section */}
        {items.length === 0 ? (
          <div className=" text-gray-500 min-h-[400px] flex justify-center items-center h-full text-center flex-col gap-5">
            <p>Your cart is empty</p>
            <Button
            className='p-5'
            size='md'
            onClick= {()=>navigate(`/products/mobiles`)}
            >HOME</Button>
            </div>
        ) : (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start gap-6 border rounded-xl p-6"
                >
                  <img
                    src={`http://localhost:5001${item.image}`}
                    alt="product"
                    className="w-28 h-36 object-contain"
                    onClick={() => navigate(`/product/${item._id}`)}
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Samsung Tablet 5th Gen
                    </p>
                    <p className="text-sm text-gray-500">Memory Size: 128GB</p>
                    <p className="text-sm text-gray-500">
                      Color Variant: White
                    </p>

                    <p className="font-semibold mt-2">{item.price}</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border rounded-lg">
                    <button className="px-3 py-1">-</button>
                    <span className="px-3">{item.quantity}</span>
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
          title="Related Products"
          items={products}
          renderItem={(item) => (
            <ProductCard
              product={item}
              handleClick={() => navigate(`/products/${id}`)}
            />
          )}
        />
        <Slider
          title="Yoy May Also Like"
          items={products}
          renderItem={(item) => (
            <ProductCard
              product={item}
              handleClick={() => navigate(`/products/${id}`)}
            />
          )}
        />
        </>
        )}

        
      </div>
    </div>
  );
});

export default Cart;
