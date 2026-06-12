import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { AdminNotification } from "../../types/adminTypes";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

export const fetchNotifications = createAsyncThunk<AdminNotification[], void>(
  "adminNotifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<AdminNotification[]>("/admin/notifications", { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk<number, void>(
  "adminNotifications/unreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{ count: number }>("/admin/notifications/unread/count", { headers: authHeader() });
      return response.data.count;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

interface NotificationState {
  notifications: AdminNotification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const adminNotificationSlice = createSlice({
  name: "adminNotifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export default adminNotificationSlice.reducer;
