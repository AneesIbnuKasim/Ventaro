import React, { memo, useEffect, useState } from "react";
import { Button } from "../components/ui";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getUser } from "../utils/apiClient";
import { MdDeliveryDining } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { API_CONFIG, RAZORPAY } from "../config/app";
import { selectCartTotals } from "../redux/selector/cartSelector";
import { CURRENCY } from "../constants/ui";
import { setDeliveryAddress, setPaymentMethod } from "../redux/slices/checkoutSlice";
import { selectCheckoutTotals } from "../redux/selector/checkoutSelector";
import {paymentAPI} from "../services/paymentService";
import { toast } from "react-toastify";
import NotFound from "./NotFound";

const  CheckOut = memo(() => {
  const { user, getProfile } = useUser()
  const navigate = useNavigate()
  const hasUser = Object.keys(user ?? []).length !== 0  //check user object is empty or not from keys length
  const userProfile = getUser()  //get user details from local storage
  const addresses = user.addresses 
  const dispatch = useDispatch()

  const location = useLocation();
const mode =
  new URLSearchParams(location.search).get("mode") ?? 'cart'
  
// const {
//   items,
//   totalQuantity,
//   subTotal,
//   discountTotal,
//   payableTotal,
//   shippingFee,
//   grandTotal,

// } = useSelector(selectCartTotals);

const {
  items,
  subTotal,
  shippingFee,
  codFee,
  grandTotal,
  discountTotal
} = useSelector(selectCheckoutTotals);

// const { finalPayable } = useSelector(selectCheckoutTotals)

const { paymentMethod, deliveryAddress } = useSelector(state => state.checkout)
  
useEffect(() => {
    if (!hasUser) {
       getProfile(userProfile.id)
    }
}, [])

const openRazorpay = (response) => {
    const options = {
      key: RAZORPAY.API || 'rzp_test_RvNYsDtZ30gj1z',
      amount: response.amount,
      currency: response.currency,
      order_id: response.razorpayOrderId,
      name: "Ventaro",
      description: "Order Payment",

      handler: async function (paymentResponse) {

        const res = await paymentAPI.verifyRazorpayOrder({
          ...paymentResponse,
          deliveryAddress,
          grandTotal: response.amount,
          mode,
          buyNowItems: items
        });
        
        navigate(`/order-success/${res.data.orderId}`)
      },

      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled");
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
}

const handlePlaceOrder = async() => {
    try {
      if (paymentMethod === 'Razorpay') {
       const { data } = await paymentAPI.createRazorpayOrder({paymentMethod, mode, buyNowItems:items})
       openRazorpay(data)
    }
    else if (paymentMethod === 'COD' || paymentMethod === 'Wallet') {
      const res = await paymentAPI.createOrder({paymentMethod, deliveryAddress, mode, buyNowItems:items})
      navigate(`/order-success/${res.data.orderId}`)
    }
    } catch (error) {
      throw error
    }
}

// if (!items.length) {
//   return <NotFound />
// }

  return (
    <div className=" min-h-screen py-10">
      <div className="max-w-310 mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            {/* ADDRESS SECTION */}
            <div className="bg-card rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Select Delivery Address</h2>
                <Button onClick={() => navigate(`/profile/address`)} variant='custom' className="text-sm">+ Add New Address</Button>
              </div>

              <div className="space-y-4">
                {(addresses ?? []).map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex gap-4 p-4 rounded-lg border cursor-pointer transition ${
                      deliveryAddress?._id === addr._id
                        ? "border-purple-400 "
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={deliveryAddress?._id === addr._id}
                      onChange={() => dispatch(setDeliveryAddress(addr))}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{addr.fullName}</p>
                      <p className="text-sm text-secondary">{addr.addressLine}</p>
                      <p className="text-sm text-secondary">{addr.city}</p>
                      <p className="text-sm text-secondary">{addr.pinCode}</p>
                      <p className="text-sm text-secondary">{addr.phone}</p>
                      <p className="text-sm text-secondary flex gap-2 items-center"><MdDeliveryDining></MdDeliveryDining><b>{addr.label}</b></p>
                      <p className="text-sm text-secondary mt-2">{addr.isDefault ? 'Default Address' : ''}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* PAYMENT SECTION */}
            <div className="bg-card rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Select Payment Option</h2>

              <div className="space-y-4">
                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Razorpay"}
                    onChange={() => dispatch(setPaymentMethod('Razorpay'))}
                  />
                  <div>
                    <p className="font-medium">Razorpay</p>
                    <p className="text-sm text-secondary">UPI, Cards, Net Banking</p>
                  </div>
                </label>

                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Wallet"}
                    onChange={() => dispatch(setPaymentMethod('Wallet'))}
                  />
                  <div>
                    <p className="font-medium">Wallet</p>
                    <p className="text-sm text-secondary">Use wallet balance</p>
                  </div>
                </label>

                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => dispatch(setPaymentMethod('COD'))}
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-secondary">Pay when product arrives</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-card rounded-xl shadow-sm p-6 h-fit sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <img src={`${API_CONFIG.imageURL2}${item?.product?.images[0]?.url ?? item?.images[0]?.url}`} alt="product" className="w-16 h-16 rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{item?.product?.name ?? item.name}</p>
                    <p className="text-sm text-secondary">₹{item.finalUnitPrice ?? item.sellingPrice} × {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{item.itemTotal ?? item.sellingPrice }</p>
                </div>
              ))}
            </div>

            <div className="border-t my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shippingFee}</span>
              </div>
              { paymentMethod === 'COD' && (
                <div className="flex justify-between">
                <span>Cod fee</span>
                <span>₹{codFee}</span>
              </div>
              )}
              <div className="flex justify-between">
                    <span className="text-secondary">Discount</span>
                    <span className="text-green-600">
                      -{CURRENCY}{discountTotal}
                    </span>
                  </div>
              {/* <div className="flex justify-between">
                <span>Grand Total</span>
                <span>₹{payableTotal}</span>
              </div> */}
            </div>

            <div className="border-t my-4" />

            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>

            <button
              disabled={!deliveryAddress || !paymentMethod}
              onClick={handlePlaceOrder}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} ) 

export default CheckOut











//   if (isBuyNow) {
    
//   }

// const selectCheckoutItems = useMemo(
//   () => makeSelectCheckoutItems(isBuyNow),
//   [isBuyNow]
// );

// const items = useSelector(selectCheckoutItems);