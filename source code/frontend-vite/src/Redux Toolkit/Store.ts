import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

import ProductSlice from "./Customer/ProductSlice";
import giftCatalogSlice from "./Customer/giftCatalogSlice";
import CartSlice from "./Customer/CartSlice";
import AuthSlice from "./Customer/AuthSlice";
import UserSlice from "./Customer/UserSlice";
import OrderSlice from "./Customer/OrderSlice";
import CouponSlice from "./Customer/CouponSlice";
import AdminCouponSlice from "./Admin/AdminCouponSlice";
import ReviewSlice from "./Customer/ReviewSlice";
import WishlistSlice from "./Customer/WishlistSlice";
import AiChatBotSlice from "./Customer/AiChatBotSlice";
import CustomerSlice from "./Customer/Customer/CustomerSlice";
import DealSlice from "./Admin/DealSlice";
import AdminSlice from "./Admin/AdminSlice";
import adminProductSlice from "./Admin/adminProductSlice";
import adminDashboardSlice from "./Admin/adminDashboardSlice";
import adminOrderSlice from "./Admin/adminOrderSlice";
import adminCustomerSlice from "./Admin/adminCustomerSlice";
import adminSettingsSlice from "./Admin/adminSettingsSlice";
import adminNotificationSlice from "./Admin/adminNotificationSlice";

const rootReducer = combineReducers({
  auth: AuthSlice,
  user: UserSlice,
  products: ProductSlice,
  giftCatalog: giftCatalogSlice,
  cart: CartSlice,
  orders: OrderSlice,
  coupone: CouponSlice,
  review: ReviewSlice,
  wishlist: WishlistSlice,
  aiChatBot: AiChatBotSlice,
  homePage: CustomerSlice,
  adminCoupon: AdminCouponSlice,
  adminDeals: DealSlice,
  admin: AdminSlice,
  adminProduct: adminProductSlice,
  deal: DealSlice,
  adminDashboard: adminDashboardSlice,
  adminOrders: adminOrderSlice,
  adminCustomers: adminCustomerSlice,
  adminSettings: adminSettingsSlice,
  adminNotifications: adminNotificationSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
