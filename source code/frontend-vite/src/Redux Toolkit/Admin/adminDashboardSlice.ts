import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { DashboardData } from "../../types/adminTypes";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

export const fetchDashboard = createAsyncThunk<DashboardData, void>(
  "adminDashboard/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<DashboardData>("/admin/dashboard", { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load dashboard";
      });
  },
});

export default adminDashboardSlice.reducer;
