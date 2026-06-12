import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { Order } from "../../types/orderTypes";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

export const fetchAdminOrders = createAsyncThunk<Order[], { status?: string; search?: string }>(
  "adminOrders/fetch",
  async ({ status, search }, { rejectWithValue }) => {
    try {
      const params: Record<string, string> = {};
      if (status) params.status = status;
      if (search) params.search = search;
      const response = await api.get<Order[]>("/admin/orders", { headers: authHeader(), params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchAdminOrderById = createAsyncThunk<Order, number>(
  "adminOrders/fetchById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get<Order>(`/admin/orders/${orderId}`, { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateOrderStatus = createAsyncThunk<Order, { orderId: number; status: string; note?: string }>(
  "adminOrders/updateStatus",
  async ({ orderId, status, note }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status, note }, { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

interface AdminOrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
}

const initialState: AdminOrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
};

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        const idx = state.orders.findIndex((o) => o.id === action.payload.id);
        if (idx >= 0) state.orders[idx] = action.payload;
      });
  },
});

export default adminOrderSlice.reducer;
