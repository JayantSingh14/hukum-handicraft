import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { StoreSettings } from "../../types/adminTypes";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

export const fetchStoreSettings = createAsyncThunk<StoreSettings, void>(
  "adminSettings/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<StoreSettings>("/admin/settings", { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateStoreSettings = createAsyncThunk<StoreSettings, StoreSettings>(
  "adminSettings/update",
  async (settings, { rejectWithValue }) => {
    try {
      const response = await api.put<StoreSettings>("/admin/settings", settings, { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

interface SettingsState {
  settings: StoreSettings | null;
  saved: boolean;
}

const initialState: SettingsState = {
  settings: null,
  saved: false,
};

const adminSettingsSlice = createSlice({
  name: "adminSettings",
  initialState,
  reducers: { resetSaved: (state) => { state.saved = false; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(updateStoreSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.saved = true;
      });
  },
});

export const { resetSaved } = adminSettingsSlice.actions;
export default adminSettingsSlice.reducer;
