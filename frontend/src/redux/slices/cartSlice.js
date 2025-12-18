import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartAPI from '../../services/cartService'

const persistedCart = JSON.parse(localStorage.getItem("cart"));

const initialState = {
    items: persistedCart ?? [],
    loading: false,
    error: null
}

//ADD PRODUCT TO CART THUNK
export const addCartThunk = createAsyncThunk('cart/add', async(data, {rejectWithValue}) => {
    try {
        const response = await cartAPI.addToCart(data)

        return response.data.product
    } catch (error) {
        return rejectWithValue(error)
    }
})

// REMOVE PRODUCTS FROM CART THUNK
export const removeCartThunk = createAsyncThunk('cart/remove', async(productId, {rejectWithValue})=> {
    try {
        const response = await cartAPI.removeFromCart(productId)

        return response.data.productId
    } catch (error) {
        return rejectWithValue(error)
    }
})

//CREATE SLICE FOR CART
const cartSlice = createSlice({
    name: 'cartSlice',
    initialState,
    // reducers: {
    //     updateQuantity: (state, action) => {

    //     }
    // },
    extraReducers: (builder) => {
        builder
        .addCase(addCartThunk.pending, (state) => state.loading = true)
        .addCase(addCartThunk.fulfilled, (state, action) => {
            state.cart.push(action.payload.product)
            state.loading = false
        })
        .addCase(addCartThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.message
        })
    }

})


export default cartSlice.reducer