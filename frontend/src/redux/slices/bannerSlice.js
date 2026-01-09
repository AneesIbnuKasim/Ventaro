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

//CREATE-BANNER
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

//FETCH BANNERS
export const fetchBannerThunk = createAsyncThunk(
  "fetch/banner",
  async (data, { rejectWithValue }) => {
    try {
      const response = await bannerAPI.fetchBanner(data);
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
      //CREATE-BANNER
      .addCase(createBannerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBannerThunk.fulfilled, (state, action) => {
        console.log('payload', action.payload)

        state.loading = false;
        state.banners = [...state.banners, action.payload ]
      })
      .addCase(createBannerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })

      //FETCH BANNERS
      .addCase(fetchBannerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBannerThunk.fulfilled, (state, action) => {
        console.log('payload', action.payload);
        state.loading = false;
        state.banners = action.payload
      })
      .addCase(fetchBannerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setMessages } = bannerSlice.actions;
export default bannerSlice.reducer;
