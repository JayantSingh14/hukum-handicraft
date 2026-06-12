import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { Product } from "../../types/productTypes";

const API_URL = "/admin/products";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

export const fetchAdminProducts = createAsyncThunk<Product[], void>(
  "adminProduct/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>(API_URL, { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createAdminProduct = createAsyncThunk<Product, { request: any }>(
  "adminProduct/createAdminProduct",
  async ({ request }, { rejectWithValue }) => {
    try {
      const response = await api.post<Product>(API_URL, request, { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateAdminProduct = createAsyncThunk<Product, { productId: number; product: any }>(
  "adminProduct/updateAdminProduct",
  async ({ productId, product }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/${productId}`, product, { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateAdminProductStock = createAsyncThunk<Product, number>(
  "adminProduct/updateAdminProductStock",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/${productId}/stock`, {}, { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteAdminProduct = createAsyncThunk<void, number>(
  "adminProduct/deleteAdminProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${productId}`, { headers: authHeader() });
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

interface AdminProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  productCreated: boolean;
}

const initialState: AdminProductState = {
  products: [],
  loading: false,
  error: null,
  productCreated: false,
};

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {
    resetProductCreated: (state) => {
      state.productCreated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(createAdminProduct.pending, (state) => {
        state.loading = true;
        state.productCreated = false;
      })
      .addCase(createAdminProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
        state.loading = false;
        state.productCreated = true;
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      })
      .addCase(updateAdminProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateAdminProductStock.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.meta.arg);
      });
  },
});

export const { resetProductCreated } = adminProductSlice.actions;
export default adminProductSlice.reducer;
