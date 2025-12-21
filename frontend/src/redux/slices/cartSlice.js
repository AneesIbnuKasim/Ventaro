import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartAPI from "../../services/cartService";

// const persistedCart = JSON.parse(localStorage.getItem("cart"));
// console.log("cart reducer initialized", persistedCart);

const initialState = {
  items: [],
  totalQuantity: 0,
  subTotal: 0,
  discountTotal: 0,
  grandTotal: 0,
  appliedCoupon: null,
  applyingCoupon: false,
  couponError: null,
  loading: false,
  error: null,
};

//ADD PRODUCT TO CART
export const addCartThunk = createAsyncThunk(
  "cart/add",
  async (data, { rejectWithValue }) => {
    console.log("here in thunk", data);

    try {
      const response = await cartAPI.addToCart(data);

      console.log("add to cart response:", response.data.items);

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
      console.log("fetch response", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// //validate And ApplyCouponThunk
const applyCouponThunk = createAsyncThunk('cart/applyCoupon', async(data, {rejectWithValue}) => {
  try {
    const response = await cartAPI.applyCoupon(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message) || 'Invalid Coupon'
  }
})


// REMOVE PRODUCTS FROM CART THUNK
export const removeFromCartThunk = createAsyncThunk(
  "cart/remove",
  async (itemId, { rejectWithValue }) => {
    try {
      console.log("in remove cart thunk");

      const response = await cartAPI.removeFromCart(itemId);

      console.log("delete rs:", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//re-calculate price helper
const recalculateTotals = state => {
  state.subTotal = state.items.reduce((acc, item) => (
    acc + item.price * item. quantity
  ))

  if (state.appliedCoupon) {
    state.appliedCoupon = null
    state.discountTotal = 0
  }

  state.grandTotal = state.subTotal
}

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
        
        //immediate ui update for totals
        state.subTotal = state.items.reduce((sum, item) => (
          sum + item.price * item.quantity
        ), 0)


        //coupon temporarily removed in ui
        state.appliedCoupon = null
        state.discountTotal = 0
        state.grandTotal = state.subTotal

      },
      


      prepare: (payload, meta) => {
        return {
          payload,
          meta,
        };
      },
    },
    cartSynced(state, action) {
  return action.payload; // FULL cart replace
},

cartSyncFailed(state, action) {
  state.error = action.payload;
}
  },

  extraReducers: (builder) => {
    builder
      .addCase(addCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCartThunk.fulfilled, (state, action) => {
        console.log("state.items", action.payload);
        const cart = action.payload;
        state.items = cart.items;
        state.totalQuantity = cart.totalQuantity;
        state.subTotal = cart.subTotal;
        state.discountTotal = cart.discountTotal;
        state.grandTotal = cart.grandTotal;
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
        console.log("action.payload", action.payload);
        const cart = action.payload;
        state.items = cart.items;
        state.totalQuantity = cart.totalQuantity;
        state.subTotal = cart.subTotal;
        state.discountTotal = cart.discountTotal;
        state.grandTotal = cart.grandTotal;
        state.loading = false;
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //REMOVE ITEM FROM CART
      .addCase(removeFromCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);

        const cart = action.payload;
        state.items = cart.items;
        state.totalQuantity = cart.totalQuantity;
        state.subTotal = cart.subTotal;
        state.discountTotal = cart.discountTotal;
        state.grandTotal = cart.grandTotal;
        state.loading = false;
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //APPLY COUPON ON CART ITEMS
      .addCase(applyCouponThunk.pending, (state) => {
        state.applyingCoupon = true
        state.couponError = null
      })
      .addCase(applyCouponThunk.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);

        const cart = action.payload;
        state.applyingCoupon = false;
        state.discountTotal = cart.discount;
        state.grandTotal = cart.finalAmount;
        state.appliedCoupon = cart.coupon
      })
      .addCase(applyCouponThunk.rejected, (state, action) => {
        state.applyingCoupon = false;
        state.couponError = action.payload,
        state.appliedCoupon = null,
        state.discountTotal = 0,
        state.grandTotal = state.subTotal
      })

    //
  },
});

export const { updateQuantity, cartSynced, cartSyncFailed } =
  cartSlice.actions;
export default cartSlice.reducer;
