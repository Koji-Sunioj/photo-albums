import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getApi } from "../../utils/getApi";
import { AuthType } from "../../utils/types";

const signUpApi = getApi("SignUpEndpoint");

export const signIn = createAsyncThunk(
  "sign-in",
  async (userParams: { userName: string; password: string }) => {
    const signUpApi = getApi("SignUpEndpoint");
    const request = await fetch(`${signUpApi}auth`, {
      method: "POST",
      body: JSON.stringify(userParams),
    });
    if (!request.ok) {
      throw new Error("authentication failed");
    }
    return await request.json();
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

export const verifyToken = createAsyncThunk(
  "verify-token",
  async (userParams: { userName: string; token: string }) => {
    const { userName, token } = userParams;
    return await fetch(`${signUpApi}auth/${userName}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
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
  verified: false,
};

export const userSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    resetUser: () => initialAuthState,
    resetMessage: (state) => {
      state.message = null;
    },
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
    setFromVerify: (state, action) => {
      const {
        payload: { AccessToken, expires, userName },
      } = action;
      return { ...state, AccessToken, expires, userName };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(verifyToken.fulfilled, (state) => {
        state.verified = true;
      })
      .addCase(resetPassword.pending, (state) => {
        state.message = null;
        state.loading = true;
        state.error = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
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
        state.message = { variant: "success", value: "successfully signed in" };
        state.userName = userName;
        state.AccessToken = AccessToken;
        state.expires = Date.now() + expires * 1000;
        state.loading = false;
        state.verified = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.message = {
          variant: "danger",
          value: "invalid username or password",
        };
        state.loading = false;
        state.error = true;
      });
  },
});

export const {
  resetUser,
  resetPatch,
  setMessage,
  resetMessage,
  setFromVerify,
} = userSlice.actions;
export default userSlice.reducer;
