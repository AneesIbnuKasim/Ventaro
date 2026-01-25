import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { orderAPI } from "../../services/orderService";
import { adminAPI } from "../../services";

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
  },
  pagination: {
    limit: 5,
    page: 1,
    totalPages: null,
    totalOrders: null
  }
};

export const fetchOrderThunk = createAsyncThunk(
  "fetch-orders",
  async ({role='', ...params}, { rejectWithValue }) => {
    try {
      const res = role === 'admin' ? await adminAPI.fetchOrder(params) : await orderAPI.fetchOrder(params)

      return res.data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

//FETCH ORDER BY ID
export const fetchSingleOrderThunk = createAsyncThunk(
  "fetch-order",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await orderAPI.fetchSingleOrderThunk(orderId);

      return res.data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

//CANCEL AN ORDER IF ITS NOT SHIPPED
export const cancelOrderThunk = createAsyncThunk(
  "cancel-order",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await orderAPI.cancelOrder(orderId);

      return res.data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

//RETURN ORDER WHEN ITS DELIVERED
export const returnOrderRequestThunk = createAsyncThunk(
  "return-order",
  async (returnData, { rejectWithValue }) => {
    try {
      const res = await orderAPI.returnOrderRequest(returnData);

      return res.data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

//ADMIN ACTIONS
//CHANGE ORDER STATUS FROM ADMIN PANEL
export const updateStatusThunk = createAsyncThunk(
  "update-status",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await adminAPI.updateStatus(orderData);

      return res.data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);


const orderSlice = createSlice({
  name: "orderSlice",
  initialState: initialState,
  reducers: {
    setPagination: (state, action) => {
        state.pagination = {...state.pagination, ...action.payload}
    },
    setFilters: (state, action) => {
        state.filters = {...state.filters, ...action.payload}
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination
        
      })
      .addCase(fetchOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      //FETCH SINGLE ORDER DETAILS STATE MUTATIONS
      .addCase(fetchSingleOrderThunk.pending, (state) => {
        state.loading = true;
        state.selectedOrder = null; 
      })
      .addCase(fetchSingleOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload.order;
      })
      .addCase(fetchSingleOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // CANCEL ORDER STATE MUTATIONS
      .addCase(cancelOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        const cancelledOrder = action.payload?.order;
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order._id === cancelledOrder?._id ? cancelledOrder : order
        );
      })
      .addCase(cancelOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
     

      // RETURN ORDER REQUEST STATE MUTATIONS
      .addCase(returnOrderRequestThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(returnOrderRequestThunk.fulfilled, (state, action) => {
        const returnOrder = action.payload?.order;
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order._id === returnOrder._id ? returnOrder : order
        );
      })
      .addCase(returnOrderRequestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      // ADMIN UPDATE ORDER STATUS STATE MUTATIONS
      .addCase(updateStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStatusThunk.fulfilled, (state, action) => {
        const updatedOrder = action.payload?.order;
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder?._id ? updatedOrder : order
        );
      })
      .addCase(updateStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      }) 
  },
});

export const { setPagination, setFilters } = orderSlice.actions
export default orderSlice.reducer;
