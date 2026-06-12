import { Alert, Divider, Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Order from './Order'
import UserDetails from './UserDetails'
import SavedCards from './SavedCards'
import OrderDetails from './OrderDetails'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store'
import { performLogout } from '../../../Redux Toolkit/Customer/AuthSlice'
import Addresses from './Adresses'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';

const menu = [
    { name: "My Orders", path: "/account/orders", icon: ShoppingBagIcon },
    { name: "Profile", path: "/account/profile", icon: AccountCircleIcon },
    { name: "Saved Cards", path: "/account/saved-card", icon: CreditCardIcon },
    { name: "Addresses", path: "/account/addresses", icon: LocationOnIcon },
    { name: "Logout", path: "/", icon: LogoutIcon },
]

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch()
    const { user, orders } = useAppSelector(store => store)
    const [snackbarOpen, setOpenSnackbar] = useState(false);

    const handleLogout = () => {
        dispatch(performLogout())
        navigate("/")
    }

    const handleClick = (item: any) => {
        if (item.name === "Logout") handleLogout()
        else navigate(item.path)
    }

    const handleCloseSnackbar = () => setOpenSnackbar(false);

    useEffect(() => {
        if (user.profileUpdated || orders.orderCanceled || user.error) {
            setOpenSnackbar(true);
        }
    }, [user.profileUpdated, orders.orderCanceled]);

    return (
        <div className="px-5 lg:px-40 xl:px-52 min-h-screen pt-10 bg-ivory">
            {/* Account Header */}
            <div className="pb-5 border-b border-brand-gold/15">
                <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-brand-gold uppercase block mb-1">
                    My Account
                </span>
                <h1 className="font-serif text-2xl font-semibold text-matte-black tracking-wide">
                    {user.user?.fullName}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 lg:min-h-[78vh] pt-2">
                {/* Sidebar Nav */}
                <div className="col-span-1 lg:border-r lg:border-brand-gold/10 py-6 pr-5 flex flex-row flex-wrap lg:flex-col gap-1">
                    {menu.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = item.path === location.pathname;
                        const isLogout = item.name === "Logout";
                        return (
                            <div key={item.name}>
                                <button
                                    onClick={() => handleClick(item)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left font-sans text-sm tracking-wide transition-all duration-200 group
                                        ${isActive
                                            ? "bg-matte-black text-brand-gold"
                                            : isLogout
                                            ? "text-red-500 hover:bg-red-50"
                                            : "text-charcoal/70 hover:bg-brand-gold/8 hover:text-matte-black"
                                        }`}
                                >
                                    <Icon
                                        fontSize="small"
                                        sx={{
                                            color: isActive ? "#C8A24A" : isLogout ? "#ef4444" : "inherit",
                                            opacity: isActive ? 1 : 0.6
                                        }}
                                    />
                                    <span className={isActive ? "font-semibold" : ""}>{item.name}</span>
                                </button>
                                {index < menu.length - 1 && (
                                    <Divider sx={{ borderColor: "rgba(200,162,74,0.08)" }} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="lg:col-span-3 lg:pl-8 py-6">
                    <Routes>
                        <Route path="/" element={<UserDetails />} />
                        <Route path="/orders" element={<Order />} />
                        <Route path="/orders/:orderId/:orderItemId" element={<OrderDetails />} />
                        <Route path="/profile" element={<UserDetails />} />
                        <Route path="/saved-card" element={<SavedCards />} />
                        <Route path="/addresses" element={<Addresses />} />
                    </Routes>
                </div>
            </div>

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={user.error ? "error" : "success"}
                    variant="filled"
                    sx={{ width: "100%", borderRadius: 0 }}
                >
                    {user.error
                        ? user.error
                        : orders.orderCanceled
                        ? "Order cancelled successfully"
                        : "Changes saved successfully"}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Profile