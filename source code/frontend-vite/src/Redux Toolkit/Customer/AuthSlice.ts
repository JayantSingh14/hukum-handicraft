// src/slices/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../Config/Api';
import type {
    AuthResponse,
    LoginRequest,
    SignupRequest,
    ResetPasswordRequest,
    ApiResponse,
    AuthState,
} from '../../types/authTypes';
import type { RootState } from '../Store';
import { resetUserState } from './UserSlice';
import { resetCartState } from './CartSlice';


const initialState: AuthState = {
    jwt: null,
    role: null,
    loading: false,
    error: null,
    otpSent: false
};

// Define the base URL for the API
const API_URL = '/auth';

export const sendLoginSignupOtp = createAsyncThunk<ApiResponse, { email: string }>(
    'auth/sendLoginSignupOtp',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}/sent/login-signup-otp`, { email });
            console.log("otp sent successfully", response.data);
            return response.data;
        } catch (error: any) {
            console.log("otp send error", error.response);
            const msg =
                error.response?.data?.error ||
                error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : null) ||
                'Failed to send OTP. Please try again.';
            return rejectWithValue(msg);
        }
    }
);

export const signup = createAsyncThunk<AuthResponse, SignupRequest>(
    'auth/signup',
    async (signupRequest, { rejectWithValue }) => {
        console.log("signup ", signupRequest)
        try {
            const response = await api.post<AuthResponse>(`${API_URL}/signup`, signupRequest);
            signupRequest.navigate(signupRequest.from || "/")
            localStorage.setItem("jwt", response.data.jwt)
            return response.data;
        } catch (error: any) {
            const msg =
                error.response?.data?.error ||
                error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : null) ||
                'Signup failed. Please verify your OTP and try again.';
            return rejectWithValue(msg);
        }
    }
);

export const signin = createAsyncThunk<AuthResponse, LoginRequest>(
    'auth/signin',
    async (loginRequest, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>(`${API_URL}/signin`, loginRequest);
            console.log("login successful", response.data);
            localStorage.setItem("jwt", response.data.jwt);
            loginRequest.navigate(loginRequest.from || "/");
            return response.data;
        } catch (error: any) {
            console.log("signin error", error.response);
            const msg =
                error.response?.data?.error ||
                error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : null) ||
                'Login failed. Please check your OTP and try again.';
            return rejectWithValue(msg);
        }
    }
);

export const loginWithGoogle = createAsyncThunk<AuthResponse, { idToken: string; navigate: any; from?: string }>(
    'auth/loginWithGoogle',
    async ({ idToken, navigate, from }, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>(`${API_URL}/google`, { idToken });
            console.log("google login successful", response.data);
            localStorage.setItem("jwt", response.data.jwt);
            navigate(from || "/");
            return response.data;
        } catch (error: any) {
            console.error("google login error", error.response);
            // Backend ErrorDetails DTO returns 'message' field (not 'error')
            const msg = error.response?.data?.message
                || error.response?.data?.error
                || error.response?.data
                || 'Google Sign-In failed. Please try again.';
            return rejectWithValue(msg);
        }
    }
);

export const resetPassword = createAsyncThunk<ApiResponse, ResetPasswordRequest>(
    'auth/resetPassword',
    async (resetPasswordRequest, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse>(`${API_URL}/reset-password`, resetPasswordRequest);
            return response.data;
        } catch (error: any) {
            return rejectWithValue('Reset password failed');
        }
    }
);

export const resetPasswordRequest = createAsyncThunk<ApiResponse, { email: string }>(
    'auth/resetPasswordRequest',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse>(`${API_URL}/reset-password-request`, { email });
            return response.data;
        } catch (error: any) {
            return rejectWithValue('Reset password request failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.jwt = null;
            state.role = null;
            localStorage.clear();
        },
        resetOtpState: (state) => {
            state.otpSent = false;
            state.error = null;
            state.loading = false;
        },
        setAuthError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendLoginSignupOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendLoginSignupOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(sendLoginSignupOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.jwt = action.payload.jwt;
                state.role = action.payload.role;
                state.loading = false;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signin.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.jwt = action.payload.jwt;
                state.role = action.payload.role;
                state.loading = false;
            })
            .addCase(signin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(loginWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.jwt = action.payload.jwt;
                state.role = action.payload.role;
                state.loading = false;
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(resetPasswordRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPasswordRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPasswordRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, resetOtpState, setAuthError } = authSlice.actions;

export default authSlice.reducer;



export const performLogout = () => async (dispatch: any) => {
    dispatch(logout());
    dispatch(resetUserState());
    dispatch(resetCartState());
};

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
