import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { CustomerProfile } from "../../types/adminTypes";
import type { User } from "../../types/userTypes";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

export const fetchAdminCustomers = createAsyncThunk<User[], string | undefined>(
  "adminCustomers/fetch",
  async (search, { rejectWithValue }) => {
    try {
      const params = search ? { search } : {};
      const response = await api.get<User[]>("/admin/customers", { headers: authHeader(), params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchCustomerProfile = createAsyncThunk<CustomerProfile, number>(
  "adminCustomers/fetchProfile",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await api.get<CustomerProfile>(`/admin/customers/${customerId}`, { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const blockCustomer = createAsyncThunk<User, number>(
  "adminCustomers/block",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/customers/${customerId}/block`, {}, { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const unblockCustomer = createAsyncThunk<User, number>(
  "adminCustomers/unblock",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/customers/${customerId}/unblock`, {}, { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

interface AdminCustomerState {
  customers: User[];
  profile: CustomerProfile | null;
  loading: boolean;
}

const initialState: AdminCustomerState = {
  customers: [],
  profile: null,
  loading: false,
};

const adminCustomerSlice = createSlice({
  name: "adminCustomers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCustomers.fulfilled, (state, action) => {
        state.customers = action.payload;
      })
      .addCase(fetchCustomerProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export default adminCustomerSlice.reducer;
