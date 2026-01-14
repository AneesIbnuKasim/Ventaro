import React, { memo, useEffect, useMemo, useState } from "react";
import Slider from "../components/ui/Slider";
import { useProduct } from "../context/ProductContext";
import ProductCard from "../components/ui/ProductCard";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Loading } from "../components/ui";
import {
  selectAppliedCoupon,
  selectCartItems,
  selectCartTotals,
  selectDiscountTotal,
  selectPayableTotal,
  selectRemainingForFreeDelivery,
  selectShippingFee,
  selectSubTotal,
  selectTotalQuantity,
} from "../redux/selector/cartSelector";
import { fetchCartThunk, removeFromCartThunk, updateQuantity } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import ApplyCouponForm from "../components/ui/ApplyCouponForm";
import { CURRENCY } from "../constants/ui";
import { setCheckoutItems } from "../redux/slices/checkoutSlice";

const Cart = memo(() => {
  const { products, fetchProduct, loadCart } = useProduct();
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate();
  const dispatch = useDispatch();

const {
  items,
  discountTotal,
  totalQuantity,
  subTotal,
  payableTotal,
  shippingFee,
  grandTotal,
  remainingForFreeDelivery
} = useSelector(selectCartTotals);

const { loading } = useSelector(state => state.cart)

useEffect(()=> {
  const load = async() => {
  await dispatch(fetchCartThunk())
  }
  load()
}, [])


  const hasCartItems = items?.length ;

  // const totalQuantity = useSelector(selectTotalQuantity);
  // const totalPrice = useSelector(selectTotalPrice);

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

  const decreaseQuantity = (itemId) => {
    dispatch(
      updateQuantity({ itemId, delta: -1 }, { isAuthenticated })
    );
  };

  const addQuantity = (itemId) => {
    dispatch(updateQuantity({ itemId, delta: +1 }, { isAuthenticated }));
  };

  const handleRemoveButton = async (itemId) => {
    try {
      await dispatch(removeFromCartThunk(itemId)).unwrap();
      toast.success("Product removed from cart");
    } catch (error) {
      toast.error(err);
    }
  };

  const handleCheckoutButton = () => {
    dispatch(setCheckoutItems(items))
    navigate(`/checkout`)
  }


  return (
    <div className="py-10 px-5">
      <div className="max-w-7xl mx-auto rounded-xl p-8">
        {/* Top Section */}
        {loading ? (
          <div>
            <Loading />
          </div>
        ) :
        !hasCartItems && ! loading ? (
          <div className="text-gray-500 min-h-100 flex justify-center items-center h-full text-center flex-col gap-5">
            <p>Your cart is empty</p>
            <Button
              className="p-5"
              size="md"
              onClick={() => navigate(`/`)}
            >
              HOME
            </Button>
          </div>
        ) : (
          <>
            <h1 className="h2 mb-5">Shopping Cart</h1>
            <div className="flex flex-col lg:flex-row gap-5 md:gap-15 lg:gap-20 ">
              <div className="grid flex-1 grid-cols-1 lg:grid-cols-2 gap-8 ">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6 ">
                  {items?.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-start gap-6 shadow-gray-200 bg-inner-card shadow-sm p-6"
                    >
                      <img
                        src={`http://localhost:5001${item?.product?.images[0] ?? ''} `}
                        alt="product"
                        className="w-28 h-36 object-contain"
                        onClick={() => navigate(`/product/${item._id}`)}
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-secondary">
                          {item.product.brandName}
                        </p>
                        <p className="text-sm text-secondary">
                          Memory Size: 128GB
                        </p>
                        <p className="text-sm text-secondary">
                          Color Variant: White
                        </p>

                        <p className="font-semibold mt-2">{CURRENCY}{item.basePrice}</p>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="sm:px-3 sm:py-1"
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          onClick={() => addQuantity(item._id)}
                          className="sm:px-3 sm:py-1"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemoveButton(item._id)}
                        className="text-gray-400 text-xl"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
<div className="bg-inner-card rounded-xl flex flex-col gap-3 shadow-sm p-6 h-fit sticky top-6">
  <h2 className="text-lg font-semibold mb-4">Cart Summary</h2>
  <ApplyCouponForm />

  {/* Free delivery banner */}
  {shippingFee === 0 ? (
    <div className="bg-green-100 text-green-700 text-sm px-4 py-2 rounded-lg font-medium">
      🎉 You have unlocked FREE DELIVERY
    </div>
  ) : (
    <div className="bg-yellow-100 text-yellow-800 text-sm px-4 py-2 rounded-lg font-medium">
      🚚 Add <span className="font-semibold">{CURRENCY}{remainingForFreeDelivery}</span> more for FREE DELIVERY
    </div>
  )}

  {/* Price breakdown */}
  <div className="space-y-3 text-sm">
    <div className="flex justify-between ">
      <span className="text-secondary">Subtotal</span>
      <span>{CURRENCY}{subTotal}</span>
    </div>

    <div className="flex justify-between">
      <span className="text-secondary">Discount</span>
      <span className="text-green-600">
        -{CURRENCY}{discountTotal}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-secondary">Shipping Fee</span>
      <span>
        {shippingFee === 0 ? (
          <span className="text-green-600 font-medium">FREE</span>
        ) : (
          `${CURRENCY}${shippingFee}`
        )}
      </span>
    </div>

    <hr />

    <div className="flex justify-between font-semibold text-base">
      <span>Grand Total</span>
      <span>{CURRENCY}{grandTotal}</span>
    </div>
  </div>

  <button
    onClick={handleCheckoutButton}
    className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-lg font-medium"
  >
    CHECKOUT
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
            handleClick={(id) => navigate(`/product/${id}`)}
            />
          )}
      />
      <Slider
        title="Yoy May Also Like"
        items={products}
        renderItem={(item) => (
          <ProductCard
            product={item}
            />
          )}
          handleClick={(id) => navigate(`/product/${id}`)}
      />
    </div>
  );
});

export default Cart;
