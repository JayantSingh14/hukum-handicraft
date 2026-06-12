import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import type { Occasion, PersonalizedGift } from "../../types/productTypes";
import type { RootState } from "../Store";

interface GiftCatalogState {
  occasions: Occasion[];
  personalizedGifts: PersonalizedGift[];
  loading: boolean;
  error: string | null;
}

const initialState: GiftCatalogState = {
  occasions: [],
  personalizedGifts: [],
  loading: false,
  error: null,
};

export const fetchOccasions = createAsyncThunk("giftCatalog/fetchOccasions", async () => {
  const response = await api.get<Occasion[]>("/occasions");
  return response.data;
});

export const createPersonalizedGift = createAsyncThunk(
  "giftCatalog/createPersonalizedGift",
  async (
    {
      jwt,
      productId,
      uploadedImage,
      customMessage,
    }: {
      jwt: string | null;
      productId: number;
      uploadedImage: string;
      customMessage: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<PersonalizedGift>(
        "/api/personalized-gifts",
        { productId, uploadedImage, customMessage },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const giftCatalogSlice = createSlice({
  name: "giftCatalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOccasions.fulfilled, (state, action) => {
        state.occasions = action.payload;
      })
      .addCase(createPersonalizedGift.fulfilled, (state, action) => {
        state.personalizedGifts.push(action.payload);
      });
  },
});

export default giftCatalogSlice.reducer;

export const selectOccasions = (state: RootState) => state.giftCatalog.occasions;
