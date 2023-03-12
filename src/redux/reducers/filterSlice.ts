import { createSlice } from "@reduxjs/toolkit";

const initialFilterState = {
  page: "1",
  direction: "descending",
  sort: "created",
  type: "text",
};

export const filterSlice = createSlice({
  name: "metrics",
  initialState: initialFilterState,
  reducers: {
    resetFilter: () => initialFilterState,
  },
});

export const { resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
