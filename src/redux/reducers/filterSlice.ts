import { createSlice } from "@reduxjs/toolkit";

import { FilterStateProps } from "../../utils/types";

export const initialFilterState: FilterStateProps = {
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
    setFilter: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { resetFilter, setFilter } = filterSlice.actions;
export default filterSlice.reducer;
