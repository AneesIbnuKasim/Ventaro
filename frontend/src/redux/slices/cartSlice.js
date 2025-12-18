import { createAsyncThunk } from "@reduxjs/toolkit";
import cartAPI from '../../services/cartService'

const persistedCart = JSON.parse(localStorage.getItem("cart"));

const initialState = {
    items: persistedCart ?? [],
    loading: false,
    error: null
}

export const addCartThunk = createAsyncThunk('cart/add', async(data, {rejectWithValue}) => {
    try {
        const response = await cartAPI.addToCart(data)

        return response.data.cart
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const removeCartThunk = createAsyncThunk('cart/remove', async(productId, {rejectWithValue})=> {
    try {
        const response = await cartAPI.removeFromCart(productId)
    } catch (error) {
        return rejectWithValue(error)
    }
})