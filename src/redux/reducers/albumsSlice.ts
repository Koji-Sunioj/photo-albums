import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import apiUrls from "../../utils/apis.json";
import {
  apisProps,
  FilterStateProps,
  AlbumStateProps,
} from "../../utils/types";

export const fetchAlbums = createAsyncThunk(
  "fetch-albums",
  async (filter: FilterStateProps) => {
    const filterString = Object.entries(filter)
      .map((param) => param.join("="))
      .join("&");
    const apis: apisProps = apiUrls["CdkWorkshopStack"];
    const albumsApi = Object.keys(apis).find((endPoint) =>
      endPoint.includes("AlbumEndpoint")
    )!;
    const url = `${apis[albumsApi]}albums?${filterString}`;
    console.log("hitting: ", url);
    return await fetch(url).then((response) => response.json());
  }
);

const initialAlbumsState: AlbumStateProps = {
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
        state.loading = false;
        state.error = true;
      });
  },
});

export const { resetAlbums } = albumsSlice.actions;
export default albumsSlice.reducer;
