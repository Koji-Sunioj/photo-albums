import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./reducers/userSlice";
import filterSlice from "./reducers/filterSlice";
import albumsSlices from "./reducers/albumsSlice";
import navBarToggleSlice from "./reducers/navBarToggleSlice";

export const store = configureStore({
  reducer: {
    auth: userSlice,
    albums: albumsSlices,
    filter: filterSlice,
    filterToggle: navBarToggleSlice,
  },
});
