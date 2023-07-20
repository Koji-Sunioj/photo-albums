import {
  putS3Mapper,
  responseMapper,
  deleteS3Mapper,
  previewMapper,
} from "../../utils/mappers";
import uuid from "react-uuid";
import { getApi } from "../../utils/getApi";
import { TAlbumState, TPhotoFile } from "../../utils/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const albumApi = getApi("AlbumEndpoint");

export const fetchAlbum = createAsyncThunk(
  "fetch-album",
  async (albumId: string) => {
    console.log("hitting");
    const url = `${albumApi}albums/${albumId}`;
    const request = await fetch(url);
    return await request.json();
  }
);

export const deleteAlbum = createAsyncThunk(
  "delete-album",
  async (payload: { albumId: string; AccessToken: string }) => {
    const { albumId, AccessToken } = payload;
    const statusCode = await fetch(`${albumApi}albums/${albumId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${AccessToken}` },
    }).then((response) => response.status);
    return statusCode;
  }
);

export const patchAlbum = createAsyncThunk(
  "patch-album",
  async (payload: {
    tags: string[];
    title: string;
    AccessToken: string;
    previews: TPhotoFile[];
    userName: string;
    albumId: string;
    mutateS3: TPhotoFile[];
  }) => {
    const { previews, AccessToken, title, tags, userName, albumId, mutateS3 } =
      payload;

    let deleteResponses: boolean[] = [];
    let putResponses: {
      success: boolean;
      url: string;
      order: number;
      text: string | null;
    }[] = [];

    //1. delete any files removed from existing album by user
    if (mutateS3.length > 0) {
      const keys = mutateS3.map((item) => item.name);
      deleteResponses = await Promise.all(
        keys.map(deleteS3Mapper({ AccessToken: AccessToken, albumId: albumId }))
      );
    }

    //2. putting new objects to s3
    const toBePut = previews.filter((item) => item.type !== "s3Object");
    const shouldPut =
      deleteResponses.every((response) => response) && toBePut.length > 0;
    if (shouldPut) {
      putResponses = await Promise.all(
        toBePut.map(putS3Mapper({ AccessToken: AccessToken, albumId: albumId }))
      );
    }

    //3. updating dynamodb
    if (putResponses.every((response) => response.success)) {
      const dynamoData = putResponses.map(responseMapper);
      const s3Existing = previews.filter((item) => item.type === "s3Object");
      const readForPatch = s3Existing.map(previewMapper);
      const finalPhotos = readForPatch.concat(dynamoData);
      const sendObject = {
        title: title,
        photos: finalPhotos,
        tags: tags,
        photoLength: finalPhotos.length,
      };
      const url = `${albumApi}albums/${albumId}`;
      const statusCode = await fetch(url, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${AccessToken}` },
        body: JSON.stringify(sendObject),
      }).then((response) => response.status);
      if (statusCode === 200) {
        const newAlbum = await fetch(url);
        return await newAlbum.json();
      }
    }
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
    const { previews, AccessToken, title, tags, userName } = payload;

    //1. put all s3 objects and retrieve the urls
    const putResponses = await Promise.all(
      previews.map(putS3Mapper({ AccessToken: AccessToken, albumId: albumId }))
    );

    if (putResponses.every((response) => response.success)) {
      //2. parse to a format which can be inserted into dynamodb
      const finalPhotos = putResponses.map(responseMapper);
      const sendObject = {
        photos: finalPhotos,
        albumId: albumId,
        title: title,
        userName: userName,
        tags: tags,
        photoLength: finalPhotos.length,
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
      })
      .addCase(deleteAlbum.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.message = "deleting photo album";
      })
      .addCase(deleteAlbum.fulfilled, (state) => {
        state.loading = false;
        state.mutateState = "deleted";
        state.message = "photo album successfully deleted";
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.message = (action.payload as Error).message!;
        state.loading = false;
        state.error = true;
      })
      .addCase(patchAlbum.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.message = "updating photo album";
      })
      .addCase(patchAlbum.fulfilled, (state, action) => {
        const {
          payload: { album },
        } = action;
        state.data = album;
        state.loading = false;
        state.mutateState = "updated";
        state.message = "photo album successfully updated";
      })
      .addCase(patchAlbum.rejected, (state, action) => {
        state.message = (action.payload as Error).message!;
        state.loading = false;
        state.error = true;
      });
  },
});

export const { resetAlbum } = albumSlice.actions;
export default albumSlice.reducer;
