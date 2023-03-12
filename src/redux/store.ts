import { configureStore } from "@reduxjs/toolkit";

import albumsSlices from "./reducers/albumsSlice";
import filterSlice from "./reducers/filterSlice";

export const store = configureStore({
  reducer: { albums: albumsSlices, filter: filterSlice },
});

export type AppDispatch = typeof store.dispatch;
export type StateType = typeof store.getState;
