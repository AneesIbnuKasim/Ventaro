import { createSlice } from "@reduxjs/toolkit";
import { getUser } from "../../utils/apiClient";


const initialState = {
  paymentMethod: "cod",
  deliveryAddress: null, 
};


const checkoutSlice = createSlice({
    name: 'checkoutSlice',
    initialState: initialState,
    reducers: {
        setPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
        },

        setDeliveryAddress: (state, action) => {
            state.deliveryAddress = action.payload
        }
    }
})

export const { setPaymentMethod, setDeliveryAddress } = checkoutSlice.actions
export default checkoutSlice.reducer