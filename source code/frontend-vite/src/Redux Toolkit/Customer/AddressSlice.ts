import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { Address } from "../../types/userTypes";
import { fetchUserProfile } from "./UserSlice";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

export const fetchAddresses = createAsyncThunk<Address[], void>(
  "address/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Address[]>("/api/addresses", { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addAddress = createAsyncThunk<Address, Address>(
  "address/add",
  async (address, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post<Address>("/api/addresses", address, { headers: authHeader() });
      dispatch(fetchUserProfile({ jwt: localStorage.getItem("jwt") || "", navigate: () => {} }));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateAddress = createAsyncThunk<Address, { addressId: number; address: Address }>(
  "address/update",
  async ({ addressId, address }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put<Address>(`/api/addresses/${addressId}`, address, { headers: authHeader() });
      dispatch(fetchUserProfile({ jwt: localStorage.getItem("jwt") || "", navigate: () => {} }));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteAddress = createAsyncThunk<void, number>(
  "address/delete",
  async (addressId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/api/addresses/${addressId}`, { headers: authHeader() });
      dispatch(fetchUserProfile({ jwt: localStorage.getItem("jwt") || "", navigate: () => {} }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const setDefaultAddress = createAsyncThunk<Address, number>(
  "address/setDefault",
  async (addressId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.patch<Address>(`/api/addresses/${addressId}/default`, {}, { headers: authHeader() });
      dispatch(fetchUserProfile({ jwt: localStorage.getItem("jwt") || "", navigate: () => {} }));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

interface AddressState {
  addresses: Address[];
  loading: boolean;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAddresses.fulfilled, (state, action) => {
      state.addresses = action.payload;
    });
  },
});

export default addressSlice.reducer;
