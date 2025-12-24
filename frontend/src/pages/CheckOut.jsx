import React, { memo, useEffect, useState } from "react";
import { Button } from "../components/ui";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getUser } from "../utils/apiClient";
import { MdDeliveryDining } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { API_CONFIG, RAZORPAY } from "../config/app";
import { selectCartTotals } from "../redux/selector/cartSelector";
import { CURRENCY } from "../constants/ui";
import { setDeliveryAddress, setPaymentMethod } from "../redux/slices/checkoutSlice";
import { checkoutTotal } from "../redux/selector/checkoutSelector";
import paymentAPI from "../services/paymentService";
import { toast } from "react-toastify";

const  CheckOut = memo(() => {
  const { user, getProfile } = useUser()
  const navigate = useNavigate()
  const hasUser = Object.keys(user ?? []).length !== 0  //check user object is empty or not from keys length
  const userProfile = getUser()  //get user details from local storage
  const addresses = user.addresses 
  const dispatch = useDispatch()
const {
  items,
  totalQuantity,
  subTotal,
  discountTotal,
  payableTotal,
  shippingFee,
  grandTotal,

} = useSelector(selectCartTotals);
const { codFee, finalPayable } = useSelector(checkoutTotal)

const { paymentMethod, deliveryAddress } = useSelector(state => state.checkout)
  
useEffect(() => {
    if (!hasUser) {
       getProfile(userProfile.id)
    }
}, [])
useEffect(() => {
    console.log('payment', paymentMethod, deliveryAddress);
    
}, [paymentMethod, deliveryAddress])

const openRazorpay = (response) => {
    const options = {
      key: RAZORPAY.API || 'rzp_test_RvNYsDtZ30gj1z',
      amount: response.amount,
      currency: response.currency,
      order_id: response.razorpayOrderId,
      name: "Ventaro",
      description: "Order Payment",

      handler: async function (paymentResponse) {
        console.log('paymnt res:', paymentResponse);
        
        const res = await paymentAPI.verifyRazorpayOrder({
          ...paymentResponse,
          deliveryAddress
        });
        console.log('be result;', res.data);
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
    if (paymentMethod === 'razorpay') {
       const { data } = await paymentAPI.createRazorpayOrder({paymentMethod})
console.log('order data:', data);

       openRazorpay(data)
    }
}

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-[1240px] mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            {/* ADDRESS SECTION */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Select Delivery Address</h2>
                <Button onClick={() => navigate(`/profile/address`)} variant='outline-custom' className="text-sm">+ Add New Address</Button>
              </div>

              <div className="space-y-4">
                {(addresses ?? []).map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex gap-4 p-4 rounded-lg border cursor-pointer transition ${
                      deliveryAddress?._id === addr._id
                        ? "border-purple-600 bg-purple-50"
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
                      <p className="text-sm text-gray-600">{addr.addressLine}</p>
                      <p className="text-sm text-gray-600">{addr.city}</p>
                      <p className="text-sm text-gray-600">{addr.pinCode}</p>
                      <p className="text-sm text-gray-600">{addr.phone}</p>
                      <p className="text-sm text-gray-600 flex gap-2 items-center"><MdDeliveryDining></MdDeliveryDining><b>{addr.label}</b></p>
                      <p className="text-sm text-gray-600 mt-2">{addr.isDefault ? 'Default Address' : ''}</p>
                    
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* PAYMENT SECTION */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Select Payment Option</h2>

              <div className="space-y-4">
                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => dispatch(setPaymentMethod('razorpay'))}
                  />
                  <div>
                    <p className="font-medium">Razorpay</p>
                    <p className="text-sm text-gray-600">UPI, Cards, Net Banking</p>
                  </div>
                </label>

                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "wallet"}
                    onChange={() => dispatch(setPaymentMethod('wallet'))}
                  />
                  <div>
                    <p className="font-medium">Wallet</p>
                    <p className="text-sm text-gray-600">Use wallet balance</p>
                  </div>
                </label>

                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => dispatch(setPaymentMethod('cod'))}
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when product arrives</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION SUMMARY */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <img src={`${API_CONFIG.imageURL2}${item.product.images[0]}`} alt="product" className="w-16 h-16 rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-sm text-gray-600">₹{item.finalUnitPrice} × {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{item.itemTotal}</p>
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
              { paymentMethod === 'cod' && (
                <div className="flex justify-between">
                <span>Cod fee</span>
                <span>₹{codFee}</span>
              </div>
              )}
              <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-green-600">
                      -{CURRENCY}{discountTotal}
                    </span>
                  </div>
              <div className="flex justify-between">
                <span>Grand Total</span>
                <span>₹{payableTotal}</span>
              </div>
            </div>

            <div className="border-t my-4" />

            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total</span>
              <span>₹{finalPayable}</span>
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