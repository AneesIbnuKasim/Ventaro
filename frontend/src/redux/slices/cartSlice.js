import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartAPI from '../../services/cartService'

const persistedCart = JSON.parse(localStorage.getItem("cart"));
console.log("cart reducer initialized", persistedCart);

const initialState = {
    items: [],
    loading: false,
    error: null
}

//ADD PRODUCT TO CART THUNK
export const addCartThunk = createAsyncThunk('cart/add', async(data, {rejectWithValue}) => {
    console.log('here in thunk', data);
    
    try {
        const response = await cartAPI.addToCart(data)

        return response.data.product
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

//FETCH USER CART THUNK
export const fetchCartThunk = createAsyncThunk('cart/fetch', async(_, {rejectWithValue}) => {
    console.log('here in fetch thunk');
    
    try {
        const response = await cartAPI.fetchCart()
        console.log('response', response.data);
        return response.data
    } catch (error) {
        return rejectWithValue(error.message)
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
        .addCase(addCartThunk.pending, (state) => { state.loading = true })
        .addCase(addCartThunk.fulfilled, (state, action) => {
            state.items.push(action.payload)
            state.loading = false
        })
        .addCase(addCartThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //FETCH USER CART STATE UPDATE
        .addCase(fetchCartThunk.pending, (state) => { state.loading = true })
        .addCase(fetchCartThunk.fulfilled, (state, action) => {
            console.log('action.payload', action.payload);
            
            state.items = action.payload
            state.loading = false
        })
        .addCase(fetchCartThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
    }

})


export default cartSlice.reducer