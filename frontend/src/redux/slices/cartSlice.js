import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartAPI from "../../services/cartService";
import { selectPayableTotal, selectSubTotal } from "../selector/cartSelector";
import { useSelector } from "react-redux";

const initialState = {
  items: [],
  appliedCoupon: null,
  discountTotal:0,
  applyingCoupon: false,
  couponError: null,
  loading: false,
  error: null,
};

//ADD PRODUCT TO CART
export const addCartThunk = createAsyncThunk(
  "cart/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//FETCH USER CART
export const fetchCartThunk = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.fetchCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//validate And ApplyCouponThunk
export const applyCouponThunk = createAsyncThunk(
  "cart/applyCoupon",
  async (data, { rejectWithValue }) => {
    try {
      const response = await cartAPI.applyCoupon(data);
      return response.data;
    } catch (error) {
      return (
        rejectWithValue(error?.response?.data?.message) || "Invalid Coupon"
      );
    }
  }
);

// REMOVE PRODUCTS FROM CART THUNK
export const removeFromCartThunk = createAsyncThunk(
  "cart/remove",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeFromCart(itemId);

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// REMOVE COUPON FROM CART
export const removeCouponThunk = createAsyncThunk(
  "cart/removeCoupon",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeCoupon();

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//CREATE SLICE FOR CART
const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    updateQuantity: {
      reducer: (state, action) => {
        const { itemId, delta } = action.payload;
        const item = state.items.find((i) => i._id === itemId);

        if (!item) return;

        item.quantity += delta;

        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i._id !== itemId);
        }

      },

      prepare: (payload, meta) => {
        return {
          payload,
          meta,
        };
      },
    },
    cartSynced(state, action) {
      return action.payload.cart; // full cart replace
    },

    cartSyncFailed(state, action) {
      state.error = action.payload;
    },

        resetCart: (state) => {
      state.items = [];
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(addCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCartThunk.fulfilled, (state, action) => {
        const cart = action.payload.cart;
        state.items = cart.items;
        state.loading = false;
      })
      .addCase(addCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //FETCH USER CART STATE UPDATE
      .addCase(fetchCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        const cart = action.payload.cart;
        state.items = cart.items;
        state.appliedCoupon = cart.appliedCoupon;
        state.loading = false;
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //REMOVE ITEM FROM CART
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        const cart = action.payload.cart;
        state.items = cart.items;
        state.loading = false;
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //APPLY COUPON ON CART ITEMS
      .addCase(applyCouponThunk.pending, (state) => {
        state.applyingCoupon = true;
        state.couponError = null;
      })
      .addCase(applyCouponThunk.fulfilled, (state, action) => {
        const cart = action.payload.cart;
        state.applyingCoupon = false;
        state.appliedCoupon = cart.appliedCoupon;
        state.discountTotal = cart.discountTotal
        state.payableTotal = cart.payableTotal
      })
      .addCase(applyCouponThunk.rejected, (state, action) => {
        state.applyingCoupon = false;
        state.couponError = action.payload,
          state.appliedCoupon = null
          state.discountTotal = 0
      })

      //REMOVE COUPON
      .addCase(removeCouponThunk.pending, (state) => {
        state.applyingCoupon = true;
        state.couponError = null;
      })
      .addCase(removeCouponThunk.fulfilled, (state, action) => {
        const cart = action.payload.cart;
        state.applyingCoupon = false;
        state.appliedCoupon = cart.appliedCoupon;
      })
      .addCase(removeCouponThunk.rejected, (state, action) => {
        state.applyingCoupon = false;
        state.couponError = action.payload;
      });
  },
});

export const { updateQuantity, cartSynced, cartSyncFailed, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
