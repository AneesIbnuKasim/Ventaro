import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import couponAPI from '../../services/couponService'

const initialState = {
    coupons:  [],
    loading: false,
    error: null,
    search: ''
}

//append state to url


//ADD COUPON
export const addCouponThunk = createAsyncThunk('coupon/add', async(data, {rejectWithValue}) => {
    try {
        const response = await couponAPI.addCoupon(data)

        return response.data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

//UPDATE COUPON
export const updateCouponThunk = createAsyncThunk('coupon/update', async({ couponId, data } , {rejectWithValue}) => {
    try {
        const response = await couponAPI.updateCoupon(couponId, data)

        return response.data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

//FETCH USER COUPON
export const fetchCouponThunk = createAsyncThunk('coupon/fetch', async(data, {rejectWithValue}) => {
    try {
        const response = await couponAPI.fetchCoupon(data)
        return response.data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

// REMOVE COUPON THUNK
export const removeCouponThunk = createAsyncThunk('coupon/remove', async(couponId, {rejectWithValue})=> {
    try {
        const response = await couponAPI.removeCoupon(couponId)

        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

//CREATE SLICE FOR COUPON
const couponSlice = createSlice({
    name: 'couponSlice',
    initialState,
    reducers: 
    {
        setSearch(state, action) {
            state.search = action.payload
        }
    },
    
    extraReducers: (builder) => {
        builder
        .addCase(addCouponThunk.pending, (state) => { state.loading = true })
        .addCase(addCouponThunk.fulfilled, (state, action) => {

            state.coupons.push(action.payload)
            state.loading = false
        })
        .addCase(addCouponThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //FETCH USER COUPON STATE UPDATE
        .addCase(fetchCouponThunk.pending, (state) => { state.loading = true })
        .addCase(fetchCouponThunk.fulfilled, (state, action) => {
            state.coupons = action.payload.coupons
            state.loading = false
        })
        .addCase(fetchCouponThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //UPDATE COUPON  STATE
        .addCase(updateCouponThunk.pending, (state) => { state.loading = true })
        .addCase(updateCouponThunk.fulfilled, (state, action) => {
            const updated = action.payload.coupon
            state.coupons = state.coupons.map(c => c._id === updated._id ? updated : c )
            state.loading = false
        })
        .addCase(updateCouponThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //REMOVE COUPON
        .addCase(removeCouponThunk.pending, (state) => { state.loading = true })
        .addCase(removeCouponThunk.fulfilled, (state, action) => {
            state.coupons = state.coupons.filter(c => c._id !== action.payload)
            state.loading = false
        })
        .addCase(removeCouponThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        //
    }


})

export const { setSearch } = couponSlice.actions
export default couponSlice.reducer