import { Route, Routes } from "react-router-dom";
import AdminDashboardHome from "../admin/pages/Dashboard/AdminDashboardHome";
import Coupon from "../admin/pages/Coupon/Coupon";
import CouponForm from "../admin/pages/Coupon/CreateCouponForm";
import GridTable from "../admin/pages/Home Page/GridTable";
import ElectronicsTable from "../admin/pages/Home Page/ElectronicsTable";
import ShopByCategoryTable from "../admin/pages/Home Page/ShopByCategoryTable";
import Deal from "../admin/pages/Home Page/Deal";
import AdminProducts from "../admin/pages/Products/Products";
import AddProductForm from "../admin/pages/Products/AddProductForm";
import UpdateProductForm from "../admin/pages/Products/UpdateProductForm";
import Orders from "../admin/pages/Orders/Orders";
import OrderDetails from "../admin/pages/Orders/OrderDetails";
import Customers from "../admin/pages/Customers/Customers";
import CustomerProfile from "../admin/pages/Customers/CustomerProfile";
import Settings from "../admin/pages/Settings/Settings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboardHome />} />
      <Route path="dashboard" element={<AdminDashboardHome />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="add-product" element={<AddProductForm />} />
      <Route path="update-product/:productId" element={<UpdateProductForm />} />
      <Route path="orders" element={<Orders />} />
      <Route path="orders/:orderId" element={<OrderDetails />} />
      <Route path="customers" element={<Customers />} />
      <Route path="customers/:customerId" element={<CustomerProfile />} />
      <Route path="coupon" element={<Coupon />} />
      <Route path="add-coupon" element={<CouponForm />} />
      <Route path="home-grid" element={<GridTable />} />
      <Route path="electronics-category" element={<ElectronicsTable />} />
      <Route path="shop-by-category" element={<ShopByCategoryTable />} />
      <Route path="deals" element={<Deal />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default AdminRoutes;
