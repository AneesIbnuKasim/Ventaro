import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUser } from "../../utils/apiClient";


const initialState = {
  paymentMethod: "cod",
  deliveryAddress: null,
  items: [] 
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
        },

        setCheckoutItems: (state, action) => {
            state.items = action.payload
        }
    }
})

export const { setPaymentMethod, setDeliveryAddress, setCheckoutItems } = checkoutSlice.actions
export default checkoutSlice.reducer