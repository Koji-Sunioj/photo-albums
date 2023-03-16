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

export const resetPassword = createAsyncThunk(
  "reset-password",
  async (userParams: { password: string; email: string; token: string }) => {
    const signUpApi = getApi("SignUpEndpoint");
    const { email, password, token } = userParams;
    return await fetch(`${signUpApi}auth/${email}?task=reset`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ password: password }),
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
  patched: false,
};

export const userSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    resetUser: () => initialAuthState,
    resetPatch: (state) => {
      state.patched = false;
      state.message = null;
    },
    setMessage: (state, action) => {
      const {
        payload: { variant, value },
      } = action;
      state.message = { variant: variant, value: value };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.message = null;
        state.loading = true;
        state.error = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.message = { variant: "success", value: "successfully updated" };
        state.loading = false;
        state.patched = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.error = true;
      })
      .addCase(signIn.pending, (state) => {
        state.message = null;
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
        state.loading = false;
        state.error = true;
      });
  },
});

export const { resetUser, resetPatch, setMessage } = userSlice.actions;
export default userSlice.reducer;
