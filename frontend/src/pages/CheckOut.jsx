import React, { memo, useEffect, useState } from "react";
import { Button } from "../components/ui";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getUser } from "../utils/apiClient";
import { Icon } from "lucide-react";
import { FaHome } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { useSelector } from "react-redux";
import { API_CONFIG } from "../config/app";

const  CheckOut = memo(() => {
  const [selectedAddress, setSelectedAddress] = useState("addr1");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const { user, getProfile } = useUser()
  const navigate = useNavigate()
  const hasUser = Object.keys(user ?? []).length !== 0
  const userProfile = getUser()
  console.log('prof', userProfile);
  const addresses = user.addresses
  const cart = useSelector(state=>state.cart)
  const {items} = useSelector(state=>state.cart)
  
  console.log('userrrrrr', items);
  
useEffect(() => {
    if (!hasUser) {
       console.log('in hook');
       getProfile(userProfile.id)
    }
}, [])

  const subTotal = 35000;
  const shipping = 40;
  const total = subTotal + shipping;

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
                      selectedAddress === addr._id
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === addr._id}
                      onChange={() => setSelectedAddress(addr._id)}
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
                    onChange={() => setPaymentMethod("razorpay")}
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
                    onChange={() => setPaymentMethod("wallet")}
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
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when product arrives</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
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
                <span>₹{cart.subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>₹{cart.discountTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Grand Total</span>
                <span>₹{cart.grandTotal}</span>
              </div>
            </div>

            <div className="border-t my-4" />

            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total</span>
              <span>₹{cart.grandTotal + shipping}</span>
            </div>

            <button
              disabled={!selectedAddress || !paymentMethod}
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