import { createSlice } from "@reduxjs/toolkit";

const initialToggleState = {
  toggleDisplay: false,
  filterDisplay: false,
};

export const navBarToggleSlice = createSlice({
  name: "toggle-navbar",
  initialState: initialToggleState,
  reducers: {
    displayFilter: (state, action) => {
      state.filterDisplay = action.payload;
    },
    displayToggle: (state, action) => {
      state.toggleDisplay = action.payload;
    },
  },
});

export const { displayFilter, displayToggle } = navBarToggleSlice.actions;
export default navBarToggleSlice.reducer;
