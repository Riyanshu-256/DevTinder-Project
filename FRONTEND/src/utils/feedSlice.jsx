import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    addFeed: (state, action) => action.payload,
    removeFeed: () => [],
  },
});

export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
