import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { orderAPI } from "../../services/orderService";

const initialState = {
    orders: [],
    loading: false,
    error: null
}

export const fetchOrderThunk = createAsyncThunk('fetch-orders', async(_, {rejectWithValue}) => {
    try {
        const res = await orderAPI.fetchOrder()
        console.log('fetch order res:', res.data);
        
        return res.data
    } catch (error) {
        rejectWithValue(error.message)
    }
})

//CANCEL AN ORDER ID ITS NOT SHIPPED
export const cancelOrderThunk = createAsyncThunk('cancel-order', async(orderId, {rejectWithValue} )=> {
    try {
        const res = await orderAPI.cancelOrder(orderId)
        return res.data
    } catch (error) {
        rejectWithValue(error.message)
    }
})

const orderSlice = createSlice({
    name: 'orderSlice',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
        .addCase(fetchOrderThunk.pending, (state) => {
            state.pending = true
        })
        .addCase(fetchOrderThunk.fulfilled, (state, action) => {
            state.pending = false
            state.orders = action.payload.orders
        })
        .addCase(fetchOrderThunk.rejected, (state, action) => {
            state.pending = false
            state.error = action.payload.error
        })

        //CANCEL ORDER STATE MUTATIONS
        // .addCase(cancelOrderThunk.pending, (state) => {
        //     state.pending = true
        // })
        // .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        //     const cancelledOrder = action.payload?.order
        //     state.pending = false
        //     state.orders = state.orders.map(order => order._id === cancelledOrder._id ? cancelledOrder : order)
        // })
        // .addCase(cancelOrderThunk.rejected, (state, action) => {
        //     state.pending = false
        //     state.error = action.payload.error
        // })
    }
})

export default orderSlice.reducer