import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { dashboardAPI } from "../../services/dashboardService"

const initialState = {
        Daily: [],
        Weekly: [],
        Monthly: [],
        Yearly: [],
    // topProducts: [],
    // totalUsers: 0,
    // totalRefunds: 0,
    // recentOrders: [],
    filters: {
        startDate: '',
        endDate: '',
        status: 'DELIVERED',
        period: 'Daily'
    },

    loading: false,
    error: null
}


export const fetchSalesReport = createAsyncThunk('fetch-report', async(query, {rejectWithValue}) => {
    try {
        console.log('Query in fetch sales report async thunk', query)
        
        const res = await dashboardAPI.fetchSalesReport(query)
        console.log('fetch sales report response:', res.data);
        return res.data
        
    } catch (error) {
        return rejectWithValue(error.message)
    }
    
})

const salesSlice = createSlice({
    name: 'salesSlice',
    initialState: initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = {...state.filters, ...action.payload}
        }
    },
    extraReducers: (builder) => {
        builder
        
        //UPDATE FETCH SALES REPORT TO STATE
        .addCase(fetchSalesReport.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchSalesReport.fulfilled, (state, action) => {
            state.Daily = action.payload.Daily
            state.Weekly = action.payload.Weekly
            state.Monthly = action.payload.Monthly
            state.Yearly = action.payload.Yearly
            // state.topProducts = action.payload.topProducts
            // state.recentOrders = action.payload.recentOrders
            // state.totalUsers = action.payload.totalUsers
        })
        .addCase(fetchSalesReport.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.error
        })
    }
})

export const { setFilters } = salesSlice.actions
export default salesSlice.reducer