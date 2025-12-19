import React, { memo, useEffect, useState } from "react";
import Slider from "../components/ui/Slider";
import { useProduct } from "../context/ProductContext";
import ProductCard from "../components/ui/ProductCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../components/ui";

const Cart = memo(() => {
  const { products, fetchProduct, loadCart } = useProduct();
  const navigate = useNavigate();
  const { items } = useSelector((state) => {
    console.log('stat4.car tin cart', state.cart);
    
    
    return state.cart
  });
  
  const hasCartItems = items.length > 0
  

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

  const decreaseQuantity = (productId, quantity) => {
    
  }

  const addQuantity = (productId) => {

  }

  

  return (
    <div className="bg-gray-100 py-10 px-5">
      <div className="max-w-7xl mx-auto bg-white rounded-xl p-8">
        {/* Top Section */}
        { !hasCartItems ? (
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
          <h1 className="h2 mb-5">Shopping Cart</h1>
          <div className="flex flex-col lg:flex-row md:gap-15 lg:gap-20">
          <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start gap-6 border-b p-6"
                >
                  <img
                    src={`http://localhost:5001${item.product.images[0]}`}
                    alt="product"
                    className="w-28 h-36 object-contain"
                    onClick={() => navigate(`/product/${item._id}`)}
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.product.brandName}
                    </p>
                    <p className="text-sm text-gray-500">Memory Size: 128GB</p>
                    <p className="text-sm text-gray-500">
                      Color Variant: White
                    </p>

                    <p className="font-semibold mt-2">{item.price}</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border rounded-lg">
                    <button onClick={()=>decreaseQuantity(item._id, item.quantity)} className="px-3 py-1">-</button>
                    <span className="px-3">{item.quantity}</span>
                    <button onClick={()=>AddQuantity(item._id, item.quantity)} className="px-3 py-1">+</button>
                  </div>

                  {/* Remove */}
                  <button className="text-gray-400 text-xl">×</button>
                </div>
              ))}
            </div>
            
          </div>

          {/* Summary */}
            <div className="border-b flex flex-col items-end justify-end p-6 space-y-6">
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
          
            
          

       
        </>
        )}
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
    </div>
  );
});

export default Cart;
