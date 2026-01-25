import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistAPI } from "../../services/wishlistService";

export const toggleWishlistThunk = createAsyncThunk(
  "wishlist/toggle",
  async (data, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.toggleWishlist(data)

      return response.data
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// FETCH WISHLIST
export const fetchWishlistThunk = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.fetchWishlist();
      
      return response.data
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    ids: [],
    loading: false,
  },
  reducers: {
    resetWishlist: (state) => {state.items = []},
  },
  extraReducers: (builder) => {
    builder
      //TOGGLE WISHLIST
//        .addCase(toggleWishlistThunk.pending, (state) => {
//   state.loading = true;
// })

.addCase(toggleWishlistThunk.fulfilled, (state, action) => {
  state.loading = false;
  const product = action.payload;

  if (!product?._id) return;

  if (state.ids.includes(product._id)) {
    state.ids = state.ids.filter((id) => id !== product._id);
    state.items = state.items.filter((p) => p._id !== product._id);
  } else {
    state.ids.push(product._id);
    state.items.push(product);
  }
})
      .addCase(toggleWishlistThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      //FETCH WISHLIST
      .addCase(fetchWishlistThunk.pending, (state) => {
  state.loading = true;
})
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.ids = action.payload.map((p) => p._id);
        state.loading = false;
      })
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
  },
});

export const { resetWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer;