import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { dashboardAPI } from "../../services/dashboardService"

const initialState = {
    salesByDate: [],
    topProducts: [],
    totalSales: '',
    totalOrders: '',
    totalUsers: '',
    returnedOrders: {},
    recentOrders: [],
    filters: {
        startDate: '',
        endDate: '',
        status: 'DELIVERED',
        period: ''
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
            const report = action.payload?.salesReport
            const usersList = action.payload?.users

            state.salesByDate = report?.salesByDate
            state.topProducts = report?.topProducts
            state.recentOrders =report?.recentOrders
            state.returnedOrders =report?.returnedOrders
            state.totalOrders = report?.totalOrders[0]?.value
            state.totalSales = report?.totalSales[0]?.value

            state.totalUsers = usersList
        })
        .addCase(fetchSalesReport.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.error
        })
    }
})

export const { setFilters } = salesSlice.actions
export default salesSlice.reducer