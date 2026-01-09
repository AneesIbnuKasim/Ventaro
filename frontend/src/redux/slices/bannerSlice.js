import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bannerAPI from "../../services/bannerService";

const initialState = {
 banners: [],
 filters: {
    search: '',
 },
 loading: '',
 error: ''
};

export const createBannerThunk = createAsyncThunk(
  "create/banner",
  async (data, { rejectWithValue }) => {
    try {
      const response = await bannerAPI.createBanner(data);
      console.log("res in create banner thunk", response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bannerSlice = createSlice({
  name: "bannerSlice",
  initialState: initialState,
  reducers: {
    setMessages: (state, action) => {
      
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBannerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBannerThunk.fulfilled, (state, action) => {
        console.log('payload', action.payload);
        
        
        state.loading = false;
        state.banners = action.payload.banner
      })
      .addCase(createBannerThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setMessages } = bannerSlice.actions;
export default bannerSlice.reducer;
