import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatAPI from "../../services/chatService";

const initialState = {
  messages: [{ id: 1, from: "system", text: "👋 Welcome! Ask anything." }],
  loading: false,
  error: null,
};

export const sendChatMessage = createAsyncThunk(
  "message/send",
  async (message, { rejectWithValue }) => {
    try {
      const response = await chatAPI.sendChatMessage(message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chatSlice",
  initialState: initialState,
  reducers: {
    setMessages: (state, action) => {
      
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setMessages } = chatSlice.actions;
export default chatSlice.reducer;
