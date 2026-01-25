import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bannerAPI from "../../services/bannerService";

const initialState = {
  banners: [],
  filters: {
    search: "",
  },
  loading: "",
  error: "",
};

//CREATE-BANNER
export const createBannerThunk = createAsyncThunk(
  "create/banner",
  async (data, { rejectWithValue }) => {
    try {
      const response = await bannerAPI.createBanner(data);

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

//UPDATE BANNERS
export const updateBannerThunk = createAsyncThunk(
  "update/banner",
  async ({ bannerId, values }, { rejectWithValue }) => {
    try {
      const response = await bannerAPI.updateBanner({ bannerId, values });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//DELETE BANNERS
export const deleteBannerThunk = createAsyncThunk(
  "delete/banner",
  async (bannerId, { rejectWithValue }) => {
    try {
      const response = await bannerAPI.deleteBanner(bannerId);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//TOGGLE BANNER STATUS
export const toggleStatusThunk = createAsyncThunk(
  "toggle/banner",
  async (bannerId, { rejectWithValue }) => {
    try {
      const response = await bannerAPI.toggleStatus(bannerId);

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
    // toggleStatus: (state, action) => {
    //   console.log('here', action);
      
    //   state.banners.map(banner => banner._id === action.payload._id ? banner.status === 'active' ? 'inactive' : 'active' : '' )
    // },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder
      //CREATE-BANNER
      .addCase(createBannerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBannerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = [...state.banners, action.payload];
      })
      .addCase(createBannerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //FETCH BANNERS
      .addCase(fetchBannerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBannerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBannerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //UPDATE BANNER
      .addCase(updateBannerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBannerThunk.fulfilled, (state, action) => {
        const updatedBanner = action.payload;
        state.banners = state.banners.map((banner) =>
          banner._id === updatedBanner._id ? updatedBanner : banner
        );
        state.loading = false;
      })
      .addCase(updateBannerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //DELETE BANNER
      .addCase(deleteBannerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBannerThunk.fulfilled, (state, action) => {
        const deletedBanner = action.payload;
        state.banners = state.banners.filter((banner) =>
          banner._id !== deletedBanner._id
        );
        state.loading = false;
      })
      .addCase(deleteBannerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //UPDATE BANNER STATUS
      .addCase(toggleStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleStatusThunk.fulfilled, (state, action) => {
        const updatedBanner = action.payload;
        state.banners = state.banners.map((banner) =>
          banner._id === updatedBanner._id ? updatedBanner : banner
        );
        state.loading = false;
      })
      .addCase(toggleStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters } = bannerSlice.actions;
export default bannerSlice.reducer;
