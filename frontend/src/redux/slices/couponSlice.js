import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import couponAPI from '../../services/couponService'

const persistedCoupon = JSON.parse(localStorage.getItem("coupon"));
console.log("coupon reducer initialized", persistedCoupon);

const initialState = {
    coupons:  [],
    loading: false,
    error: null,
    search: ''
}

//ADD COUPON
export const addCouponThunk = createAsyncThunk('coupon/add', async(data, {rejectWithValue}) => {
    console.log('here in thunk', data);
    
    try {
        const response = await couponAPI.addCoupon(data)

        console.log('add to coupon response:', response.data.coupon);
        
        return response.data.coupon
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

//FETCH USER COUPON
export const fetchCouponThunk = createAsyncThunk('coupon/fetch', async(_, {rejectWithValue}) => {
    try {
        const response = await couponAPI.fetchCoupon()
        console.log('fetch response', response.data);
        return response.data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

// REMOVE COUPON THUNK
export const removeCouponThunk = createAsyncThunk('coupon/remove', async(couponId, {rejectWithValue})=> {
    try {
        console.log('in remove coupon thunk');
        
        const response = await couponAPI.removeCoupon(couponId)

        console.log('delete rs:', response)
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

//CREATE SLICE FOR COUPON
const couponSlice = createSlice({
    name: 'couponSlice',
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
        .addCase(addCouponThunk.pending, (state) => { state.loading = true })
        .addCase(addCouponThunk.fulfilled, (state, action) => {

            console.log('state.items', action.payload);
            
            state.items = action.payload
            state.loading = false
        })
        .addCase(addCouponThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //FETCH USER COUPON STATE UPDATE
        .addCase(fetchCouponThunk.pending, (state) => { state.loading = true })
        .addCase(fetchCouponThunk.fulfilled, (state, action) => {
            console.log('action.payload', action.payload);
            
            state.items = action.payload.items
            state.loading = false
        })
        .addCase(fetchCouponThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //REMOVE COUPON
        .addCase(removeCouponThunk.pending, (state) => { state.loading = true })
        .addCase(removeCouponThunk.fulfilled, (state, action) => {
            console.log('action.payload', action.payload);
            
            state.items = action.payload.items
            state.loading = false
        })
        .addCase(removeCouponThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //
    }


})

// export const { updateQuantity } = couponSlice.actions
export default couponSlice.reducer