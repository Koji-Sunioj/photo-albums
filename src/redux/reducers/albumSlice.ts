import uuid from "react-uuid";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getApi } from "../../utils/getApi";
import { TAlbumState, TPhotoFile } from "../../utils/types";
import { checkRequest } from "../../utils/checkRequest";
import { putS3Mapper, responseMapper } from "../../utils/mappers";

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

export const createAlbum = createAsyncThunk(
  "create-album",
  async (payload: {
    tags: string[];
    title: string;
    AccessToken: string;
    previews: TPhotoFile[];
    userName: string;
  }) => {
    const albumId = uuid();
    console.log(albumId);
    const { previews, AccessToken, title, tags, userName } = payload;

    //1. put all s3 objects and retrieve the urls
    const putResponses = await Promise.all(
      previews.map(putS3Mapper({ AccessToken: AccessToken, albumId: albumId }))
    );

    console.log(putResponses);

    if (putResponses.every((response) => response.success)) {
      //2. parse to a format which can be inserted into dynamodb
      const finalPhotos = putResponses.map(responseMapper);
      const sendObject = {
        /*  token: AccessToken,
        album: { */
        photos: finalPhotos,
        albumId: albumId,
        title: title,
        userName: userName,
        tags: tags,
        photoLength: finalPhotos.length,
        /*  }, */
      };
      //3. deposit into ddb
      const url = `${albumApi}albums/`;
      const statusCode = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${AccessToken}` },
        body: JSON.stringify(sendObject),
      }).then((response) => response.status);
      if (statusCode === 200) {
        const newAlbum = await fetch(url + albumId);
        return await newAlbum.json();
      }
    }
  }
);

const initialAlbumsState: TAlbumState = {
  data: null,
  loading: false,
  error: false,
  message: null,
  mutateState: "idle",
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
      })
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.message = "uploading photo album";
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        const {
          payload: { album },
        } = action;
        state.data = album;
        state.loading = false;
        state.mutateState = "created";
        state.message = "photo album successfully created";
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.message = (action.payload as Error).message!;
        state.loading = false;
        state.error = true;
      });
  },
});

export const { resetAlbum } = albumSlice.actions;
export default albumSlice.reducer;
