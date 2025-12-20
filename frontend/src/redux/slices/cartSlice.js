import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartAPI from '../../services/cartService'

const persistedCart = JSON.parse(localStorage.getItem("cart"));
console.log("cart reducer initialized", persistedCart);

const initialState = {
    items:  [],
    loading: false,
    error: null
}

//ADD PRODUCT TO CART
export const addCartThunk = createAsyncThunk('cart/add', async(data, {rejectWithValue}) => {
    console.log('here in thunk', data);
    
    try {
        const response = await cartAPI.addToCart(data)

        console.log('add to cart response:', response.data.items);
        
        return response.data.items
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

//FETCH USER CART
export const fetchCartThunk = createAsyncThunk('cart/fetch', async(_, {rejectWithValue}) => {
    try {
        const response = await cartAPI.fetchCart()
        console.log('fetch response', response.data);
        return response.data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

// //FETCH USER CART
// export const syncCartThunk = createAsyncThunk('cart/sync', async(_, {rejectWithValue}) => {
//     try {
//         const response = await cartAPI.syncCart()
//         console.log('sync response', response.data);
//         return response.data
//     } catch (error) {
//         return rejectWithValue(error.message)
//     }
// })

// REMOVE PRODUCTS FROM CART THUNK
export const removeFromCartThunk = createAsyncThunk('cart/remove', async(itemId, {rejectWithValue})=> {
    try {
        console.log('in remove cart thunk');
        
        const response = await cartAPI.removeFromCart(itemId)

        console.log('delete rs:', response)
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

//CREATE SLICE FOR CART
const cartSlice = createSlice({
    name: 'cartSlice',
    initialState,
    reducers: {
    updateQuantity: {
      reducer: (state, action) => {
        const { itemId, delta } = action.payload;
        const item = state.items.find(i => i._id === itemId);

        if (!item) return;

        item.quantity += delta;

        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i._id !== itemId);
        }
      },

      prepare: (payload, meta) => {
        return {
          payload,
          meta,
        };
      },
    },
  },

    
    extraReducers: (builder) => {
        builder
        .addCase(addCartThunk.pending, (state) => { state.loading = true })
        .addCase(addCartThunk.fulfilled, (state, action) => {

            console.log('state.items', action.payload);
            
            state.items = action.payload
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
            
            state.items = action.payload.items
            state.loading = false
        })
        .addCase(fetchCartThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //REMOVE ITEM FROM CART
        .addCase(removeFromCartThunk.pending, (state) => { state.loading = true })
        .addCase(removeFromCartThunk.fulfilled, (state, action) => {
            console.log('action.payload', action.payload);
            
            state.items = action.payload.items
            state.loading = false
        })
        .addCase(removeFromCartThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //
    }


})

export const { updateQuantity } = cartSlice.actions
export default cartSlice.reducer