import "./App.css";
import { ThemeProvider } from "@emotion/react";
import customeTheme from "./Theme/customeTheme";
import { Route, Routes } from "react-router-dom";
import CustomerRoutes from "./routes/CustomerRoutes";
import AdminDashboard from "./admin/pages/Dashboard/Dashboard";
import AdminAuth from "./admin/pages/Auth/AdminAuth";
import { useAppDispatch, useAppSelector } from "./Redux Toolkit/Store";
import { useEffect } from "react";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { fetchUserProfile } from "./Redux Toolkit/Customer/UserSlice";
import { createHomeCategories } from "./Redux Toolkit/Customer/Customer/AsyncThunk";
import { homeCategories } from "./data/homeCategories";
import { useNavigate } from "react-router-dom";

function App() {
  useSmoothScroll();
  const dispatch = useAppDispatch();
  const { auth, user } = useAppSelector((store) => store);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      dispatch(
        fetchUserProfile({
          jwt: localStorage.getItem("jwt") || auth.jwt || "",
          navigate,
        })
      );
    }
  }, [auth.jwt, dispatch, navigate]);

  useEffect(() => {
    dispatch(createHomeCategories(homeCategories));
  }, [dispatch]);

  return (
    <ThemeProvider theme={customeTheme}>
      <div className="App">
        <Routes>
          {user.user?.role === "ROLE_ADMIN" && (
            <Route path="/admin/*" element={<AdminDashboard />} />
          )}
          <Route path="/admin-login" element={<AdminAuth />} />
          <Route path="*" element={<CustomerRoutes />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
