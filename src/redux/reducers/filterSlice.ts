import { createSlice } from "@reduxjs/toolkit";

import { FilterStateProps } from "../../utils/types";

export const initialFilterState: FilterStateProps = {
  page: "1",
  direction: "descending",
  sort: "created",
  type: "text",
};

export const filterSlice = createSlice({
  name: "filter",
  initialState: initialFilterState,
  reducers: {
    resetFilter: () => initialFilterState,
    setFilter: (state, action) => {
      const newState = { ...state, ...action.payload };
      if (!action.payload.hasOwnProperty("query")) {
        delete newState.query;
      }
      return newState;
    },
  },
});

export const { resetFilter, setFilter } = filterSlice.actions;
export default filterSlice.reducer;
