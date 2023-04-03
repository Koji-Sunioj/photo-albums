import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { checkRequest } from "../../utils/checkRequest";

import { getApi } from "../../utils/getApi";
import { TFilterState, TAlbumsState } from "../../utils/types";

export const fetchAlbums = createAsyncThunk(
  "fetch-albums",
  async (filter: TFilterState) => {
    const filterString = Object.entries(filter)
      .map((param) => param.join("="))
      .join("&");
    const albumApi = getApi("AlbumEndpoint");
    const url = `${albumApi}albums?${filterString}`;
    const request = await fetch(url);
    await checkRequest(request);
    return await request.json();
  }
);

const initialAlbumsState: TAlbumsState = {
  data: null,
  tags: null,
  pages: null,
  loading: false,
  error: false,
  message: null,
};

export const albumsSlice = createSlice({
  name: "albums",
  initialState: initialAlbumsState,
  reducers: {
    resetAlbums: () => initialAlbumsState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        const {
          payload: { albums, pages, tags },
        } = action;
        state.data = albums;
        state.pages = pages;
        state.tags = tags;
        state.loading = false;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.message = (action.payload as Error).message!;
        state.loading = false;
        state.error = true;
      });
  },
});

export const { resetAlbums } = albumsSlice.actions;
export default albumsSlice.reducer;
