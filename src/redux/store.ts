import { configureStore } from "@reduxjs/toolkit";

import albumsSlices from "./reducers/albumsSlice";
import filterSlice from "./reducers/filterSlice";
import navBarToggleSlice from "./reducers/navBarToggleSlice";

export const store = configureStore({
  reducer: {
    albums: albumsSlices,
    filter: filterSlice,
    filterToggle: navBarToggleSlice,
  },
});
