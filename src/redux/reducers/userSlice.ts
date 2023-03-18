import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getApi } from "../../utils/getApi";
import { AuthType } from "../../utils/types";

const signUpApi = getApi("SignUpEndpoint");

export const confirmForgotPassword = createAsyncThunk(
  "confirm-forgot-password",
  async (userParams: {
    email: string;
    password: string;
    confirmation: string;
  }) => {
    const { email, password, confirmation } = userParams;
    const request = await fetch(`${signUpApi}auth/${email}?task=forgot`, {
      method: "PATCH",
      body: JSON.stringify({
        password: password,
        confirmationCode: confirmation,
      }),
    });
    if (!request.ok) {
      throw new Error("authentication failed");
    }
  }
);

export const signIn = createAsyncThunk(
  "sign-in",
  async (userParams: { userName: string; password: string }) => {
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

export const forgotPassword = createAsyncThunk(
  "forgot-password",
  async (userParams: { email: string }) => {
    const { email } = userParams;
    const request = await fetch(`${signUpApi}auth/${email}`, {
      method: "HEAD",
    });
    console.log(request);
    if (!request.ok) {
      throw new Error("no email found");
    }
    return { email: email };
  }
);

export const resetPassword = createAsyncThunk(
  "reset-password",
  async (userParams: { password: string; email: string; token: string }) => {
    const { email, password, token } = userParams;
    const request = await fetch(`${signUpApi}auth/${email}?task=reset`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ password: password }),
    });
    if (!request.ok) {
      throw new Error("authentication failed");
    }
    return await request.json();
  }
);

export const verifyToken = createAsyncThunk(
  "verify-token",
  async (userParams: { userName: string; token: string }) => {
    console.log("hitting api");
    const { userName, token } = userParams;
    const request = await fetch(`${signUpApi}auth/${userName}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const { type } = await request.json();
    if (!request.ok || type === "guest") {
      throw new Error("invalid token failed");
    }
  }
);

const initialAuthState: AuthType = {
  userName: null,
  AccessToken: null,
  expires: null,
  loading: false,
  error: false,
  message: null,
  patched: null,
  verified: false,
  counter: null,
};

export const userSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    resetUser: () => initialAuthState,
    resetMessage: (state) => {
      state.message = null;
    },
    setCounter: (state, action) => {
      state.counter = action.payload;
    },
    resetPatch: (state) => {
      state.patched = null;
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
        payload: { AccessToken, expires, userName, counter },
      } = action;
      return { ...state, AccessToken, expires, userName, counter };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(confirmForgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.patched = "reset";
      })
      .addCase(confirmForgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.userName = action.payload.email;
        state.loading = false;
        state.patched = "confirmed";
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
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
        state.patched = "reset";
      })
      .addCase(resetPassword.rejected, (state, action) => {
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
        state.counter = expires;
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
  setCounter,
} = userSlice.actions;
export default userSlice.reducer;
