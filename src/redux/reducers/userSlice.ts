import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getApi } from "../../utils/getApi";
import { AuthType } from "../../utils/types";

const signUpApi = getApi("SignUpEndpoint");

const checkRequest = async (request: Response) => {
  if (!request.ok) {
    const { message } = await request.json();
    throw new Error(message);
  }
};

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
    await checkRequest(request);
  }
);

export const signIn = createAsyncThunk(
  "sign-in",
  async (userParams: { userName: string; password: string }) => {
    const request = await fetch(`${signUpApi}auth`, {
      method: "POST",
      body: JSON.stringify(userParams),
    });
    await checkRequest(request);
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
    await checkRequest(request);
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
    await checkRequest(request);
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
        state.message = {
          variant: "success",
          value: "successfully updated password",
        };
      })
      .addCase(confirmForgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.message = {
          variant: "danger",
          value: action.error.message!,
        };
      })
      .addCase(confirmForgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.userName = action.payload.email;
        state.loading = false;
        state.patched = "confirmed";
        state.message = {
          variant: "success",
          value: "a confirmation code was sent to your email",
        };
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.message = {
          variant: "danger",
          value: action.error.message!,
        };
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
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.message = {
          variant: "success",
          value: "successfully updated password",
        };
        state.loading = false;
        state.patched = "reset";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.message = {
          variant: "danger",
          value: action.error.message!,
        };
        state.loading = false;
      })
      .addCase(signIn.pending, (state) => {
        state.message = null;
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        const {
          payload: { userName, AccessToken, expires },
        } = action;
        const newState = {
          message: { variant: "success", value: "successfully signed in" },
          userName: userName,
          AccessToken: AccessToken,
          expires: Date.now() + expires * 1000,
          loading: false,
          verified: true,
          counter: expires,
        };
        return { ...state, ...newState };
      })
      .addCase(signIn.rejected, (state, action) => {
        state.message = {
          variant: "danger",
          value: action.error.message!,
        };
        state.loading = false;
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
