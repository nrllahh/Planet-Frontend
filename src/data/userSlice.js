import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    statistics: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setStatistics(state, action) {
      state.statistics = action.payload;
    }
  },
});

export const {
  setStatistics,
} = userSlice.actions;
export default userSlice.reducer;
