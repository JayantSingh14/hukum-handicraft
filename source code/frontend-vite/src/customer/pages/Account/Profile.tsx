import { Alert, Snackbar } from '@mui/material'
import { useEffect, useState, useRef } from 'react'
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

    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 160;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        handleScroll();
        const timer = setTimeout(handleScroll, 500);
        window.addEventListener("resize", handleScroll);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

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
        if (!localStorage.getItem("jwt")) {
            navigate("/login", { state: { from: location.pathname } });
        }
    }, [navigate, location.pathname]);

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
                <div className="col-span-1 relative mb-6 lg:mb-0">
                    {/* Left scroll arrow (mobile only) */}
                    {showLeftArrow && (
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-brand-gold/25 flex lg:hidden items-center justify-center text-matte-black shadow-sm active:scale-95 transition-all"
                            aria-label="Scroll left"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#C8A24A" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                    )}

                    <div 
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex flex-row overflow-x-auto lg:flex-col lg:border-r lg:border-brand-gold/10 py-4 lg:py-6 lg:pr-5 gap-2 scrollbar-none"
                    >
                        {menu.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.path === location.pathname;
                            const isLogout = item.name === "Logout";
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleClick(item)}
                                    className={`shrink-0 rounded-sm flex items-center gap-2 lg:gap-3 px-4 py-2 lg:px-4 lg:py-3 text-left font-sans text-xs lg:text-sm tracking-wide transition-all duration-200 w-auto lg:w-full border lg:border-0
                                        ${isActive
                                            ? "bg-matte-black text-brand-gold border-brand-gold"
                                            : isLogout
                                                ? "text-red-500 border-red-500/30 hover:bg-red-50/10 lg:hover:bg-red-50 lg:border-0"
                                                : "text-charcoal/70 border-brand-gold/15 hover:bg-brand-gold/8 hover:text-matte-black lg:border-0"
                                        }`}
                                >
                                    <Icon
                                        fontSize="small"
                                        sx={{
                                            color: isActive ? "#C8A24A" : isLogout ? "#ef4444" : "inherit",
                                            opacity: isActive ? 1 : 0.6,
                                            fontSize: { xs: "16px", lg: "20px" }
                                        }}
                                    />
                                    <span className={isActive ? "font-semibold" : ""}>{item.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right scroll arrow (mobile only) */}
                    {showRightArrow && (
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-brand-gold/25 flex lg:hidden items-center justify-center text-matte-black shadow-sm active:scale-95 transition-all"
                            aria-label="Scroll right"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#C8A24A" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    )}
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