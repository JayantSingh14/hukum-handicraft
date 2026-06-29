import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import { Badge } from "@mui/material";

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { cart, wishlist } = useAppSelector(store => store);

    const cartCount = cart.cart?.totalItem ?? 0;
    const wishlistCount = wishlist.wishlist?.products?.length ?? 0;

    const tabs = [
        { label: "Home", icon: <HomeIcon sx={{ fontSize: 22 }} />, path: "/" },
        { label: "Search", icon: <SearchIcon sx={{ fontSize: 22 }} />, path: "/search-products" },
        {
            label: "Wishlist",
            icon: wishlistCount > 0
                ? <FavoriteIcon sx={{ fontSize: 22 }} />
                : <FavoriteBorderIcon sx={{ fontSize: 22 }} />,
            path: "/wishlist",
            badge: wishlistCount,
        },
        {
            label: "Bag",
            icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />,
            path: "/cart",
            badge: cartCount,
        },
        { label: "Account", icon: <PersonOutlineIcon sx={{ fontSize: 22 }} />, path: "/account/orders" },
    ];

    return (
        <nav
            className="md:hidden"
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: "#0F0F0F",
                borderTop: "1px solid rgba(200,162,74,0.2)",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                height: 60,
                paddingBottom: "env(safe-area-inset-bottom)",
            }}
        >
            {tabs.map(tab => {
                const active = pathname === tab.path || (tab.path !== "/" && pathname.startsWith(tab.path));
                return (
                    <button
                        key={tab.path}
                        onClick={() => navigate(tab.path)}
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2,
                            border: "none",
                            background: "transparent",
                            color: active ? "#C8A24A" : "rgba(250,248,242,0.45)",
                            cursor: "pointer",
                            padding: "6px 0",
                            transition: "color 0.2s",
                        }}
                    >
                        <Badge
                            badgeContent={tab.badge && tab.badge > 0 ? tab.badge : undefined}
                            sx={{
                                "& .MuiBadge-badge": {
                                    bgcolor: "#C8A24A",
                                    color: "#0F0F0F",
                                    fontSize: "0.55rem",
                                    minWidth: 14,
                                    height: 14,
                                    fontWeight: 700,
                                }
                            }}
                        >
                            {tab.icon}
                        </Badge>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default MobileBottomNav;
