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

    try {
      const response = await cartAPI.addToCart(data);

      console.log("add to cart response:", response);

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
      console.log("fetch thunk response", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// //validate And ApplyCouponThunk
export const applyCouponThunk = createAsyncThunk('cart/applyCoupon', async(data, {rejectWithValue}) => {
  try {
    const response = await cartAPI.applyCoupon(data)
    console.log('apply coupon res:', response.data);
    
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
      const response = await cartAPI.removeFromCart(itemId);

      console.log("delete rs:", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


// REMOVE PRODUCTS FROM CART THUNK
export const removeCouponThunk= createAsyncThunk(
  "cart/removeCoupon",
  async (_, { rejectWithValue }) => {
    try {
      console.log("in remove coupon thunk");

      const response = await cartAPI.removeCoupon();
      console.log('remove response:', response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//re-calculate price helper
const recalculateTotals = state => {
  console.log('state subtotla before', state.subTotal);
  
  state.subTotal = state.items.reduce((acc, item) => (
    acc + item.basePrice * item. quantity
  ), 0)
  console.log('sub total in recalculate:', state.subTotal);
  

  if (state?.appliedCoupon?.code) {
    if (state.appliedCoupon.discountType === 'PERCENT') {
      state.discountTotal = ((state.subTotal * state.appliedCoupon.discountValue)/100)
    }
    else state.discountTotal = state.appliedCoupon.discountValue
  }

  state.grandTotal = state.subTotal - state.discountTotal
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

        
        
        //immediate ui update for totals while BE operation is debouncing
        state.subTotal = state.items.reduce((sum, item) => (
          sum + item.basePrice * item.quantity
        ), 0)

        //calculate coupon 
        
        console.log('item subtot', state.items);

        // coupon temporarily removed in ui
        // state.appliedCoupon = null
        // state.discountTotal = 0
        // state.grandTotal = state.subTotal

        recalculateTotals(state)

      },
      


      prepare: (payload, meta) => {
        return {
          payload,
          meta,
        };
      },
    },
    cartSynced(state, action) {
  return action.payload.cart; // FULL cart replace
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
        console.log("state.items.cart", action.payload.cart);
        const cart = action.payload.cart;
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
        console.log("fetch action.payload", action.payload);
        const cart = action.payload.cart;
        state.items = cart.items;
        state.totalQuantity = cart.totalQuantity;
        state.subTotal = cart.subTotal;
        state.discountTotal = cart.discountTotal;
        state.grandTotal = cart.grandTotal;
        state.appliedCoupon = cart.appliedCoupon
        state.loading = false;
        console.log('fetch cart final', cart);
        
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
        console.log("action.tremove from cart.payload", action.payload);

        const cart = action.payload.cart;
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

        const cart = action.payload.cart;
        state.applyingCoupon = false;
        state.discountTotal = cart.discountTotal;
        state.grandTotal = cart.grandTotal;
        state.appliedCoupon = cart.appliedCoupon
      })
      .addCase(applyCouponThunk.rejected, (state, action) => {
        state.applyingCoupon = false;
        state.couponError = action.payload,
        state.appliedCoupon = null,
        state.discountTotal = 0,
        state.grandTotal = state.subTotal
      })

    //REMOVE COUPON
     //APPLY COUPON ON CART ITEMS
      .addCase(removeCouponThunk.pending, (state) => {
        state.applyingCoupon = true
        state.couponError = null
      })
      .addCase(removeCouponThunk.fulfilled, (state, action) => {
        const cart = action.payload.cart;
        state.applyingCoupon = false;
        state.discountTotal = cart.discountTotal;
        state.grandTotal = cart.grandTotal;
        state.appliedCoupon = cart.appliedCoupon
      })
      .addCase(removeCouponThunk.rejected, (state, action) => {
        state.applyingCoupon = false;
        state.couponError = action.payload
      })
  },
});

export const { updateQuantity, cartSynced, cartSyncFailed } =
  cartSlice.actions;
export default cartSlice.reducer;
