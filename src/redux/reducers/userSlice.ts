import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getApi } from "../../utils/getApi";
import { AuthType } from "../../utils/types";

export const signIn = createAsyncThunk(
  "sign-in",
  async (userParams: { userName: string; password: string }) => {
    const signUpApi = getApi("SignUpEndpoint");
    return await fetch(`${signUpApi}auth`, {
      method: "POST",
      body: JSON.stringify(userParams),
    }).then((response) => response.json());
  }
);

const initialAuthState: AuthType = {
  userName: null,
  AccessToken: null,
  expires: null,
  loading: false,
  error: false,
  message: null,
};

export const userSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    resetUser: () => initialAuthState,
  },
  extraReducers(builder) {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        const {
          payload: { userName, AccessToken, expires },
        } = action;
        state.userName = userName;
        state.AccessToken = AccessToken;
        state.expires = Date.now() + expires * 1000;
        state.loading = false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.message = "server error in fetch";
        state.loading = false;
        state.error = true;
      });
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
