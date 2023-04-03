import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getApi } from "../../utils/getApi";
import { TAlbumState } from "../../utils/types";
import { checkRequest } from "../../utils/checkRequest";

const albumApi = getApi("AlbumEndpoint");

export const fetchAlbum = createAsyncThunk(
  "fetch-album",
  async (albumId: string) => {
    console.log("hitting");
    const url = `${albumApi}albums/${albumId}`;
    const request = await fetch(url);
    await checkRequest(request);
    return await request.json();
  }
);

const initialAlbumsState: TAlbumState = {
  data: null,
  loading: false,
  error: false,
  message: null,
};

export const albumSlice = createSlice({
  name: "albums",
  initialState: initialAlbumsState,
  reducers: {
    resetAlbum: () => initialAlbumsState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAlbum.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchAlbum.fulfilled, (state, action) => {
        const {
          payload: { album },
        } = action;
        state.data = album;
        state.loading = false;
      })
      .addCase(fetchAlbum.rejected, (state, action) => {
        state.message = (action.payload as Error).message!;
        state.loading = false;
        state.error = true;
      });
  },
});

export const { resetAlbum } = albumSlice.actions;
export default albumSlice.reducer;
