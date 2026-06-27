import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import "./Navbar.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import DrawerList from "./DrawerList";
import { useNavigate, useLocation } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import { FavoriteBorder } from "@mui/icons-material";
import LuxurySearchModal from "../LuxurySearch/LuxurySearchModal";

const Navbar = () => {
  const { user, cart } = useAppSelector((store) => store);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Box
      sx={{ zIndex: 1000 }}
      className="sticky top-0 left-0 right-0 glass-premium border-b border-[#C8A24A]/20 shadow-sm transition-all duration-300"
    >
      <div className="relative flex items-center justify-between px-3 sm:px-5 lg:px-20 h-[90px]">
        {/* Left Section: Drawer Menu Toggle & Search */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 z-10">
          <IconButton 
            onClick={toggleDrawer(true)} 
            className="text-matte-black hover:text-brand-gold transition-colors duration-200"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <MenuIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />
          </IconButton>
          <IconButton 
            onClick={() => setIsSearchOpen(true)}
            className="text-matte-black hover:text-brand-gold transition-colors duration-200"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <SearchIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
        </div>

        {/* Center Section: Logo (Absolutely Centered) */}
        <div 
          onClick={() => navigate("/")}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer flex flex-col items-center justify-center text-center z-0 w-max"
        >
          <h1 className="font-serif tracking-[0.12em] sm:tracking-[0.25em] lg:tracking-[0.35em] text-lg sm:text-2xl lg:text-[44px] font-bold text-matte-black group-hover:text-brand-gold transition-all duration-300 uppercase leading-none">
            HUKUM
          </h1>
          <span className="text-[6px] lg:text-[9px] tracking-[0.25em] lg:tracking-[0.6em] font-sans font-bold text-brand-gold mt-1 lg:mt-2.5 uppercase leading-none">
            Artisanal Luxury
          </span>
        </div>

        {/* Right Section: Actions */}
        <div className="flex gap-1 sm:gap-2 lg:gap-5 items-center z-10">
          {user.user ? (
            <Button
              onClick={() => navigate("/account/orders")}
              className="flex items-center gap-2 text-matte-black hover:text-brand-gold normal-case"
              sx={{ 
                color: '#1A1A1A', 
                textTransform: 'none', 
                letterSpacing: 'normal',
                minWidth: 0,
                p: { xs: 0.5, sm: 1 }
              }}
            >
              <Avatar
                sx={{ 
                  width: { xs: 24, sm: 28 }, 
                  height: { xs: 24, sm: 28 }, 
                  border: "1px solid #C8A24A",
                  boxShadow: "0 2px 8px rgba(200, 162, 74, 0.15)"
                }}
                src={user.user?.profileImage || "https://cdn.pixabay.com/photo/2015/04/15/09/28/head-723540_640.jpg"}
              />
              <span className="font-sans text-xs font-semibold hidden lg:block">
                {user.user?.fullName?.split(" ")[0]}
              </span>
            </Button>
          ) : (
            <Button
              variant="text"
              startIcon={<AccountCircleIcon sx={{ fontSize: { xs: "16px", sm: "18px" } }} />}
              onClick={() => navigate("/login", { state: { from: location.pathname } })}
              sx={{ 
                bgcolor: "transparent", 
                color: "#C8A24A",
                fontWeight: 600,
                fontSize: "11px",
                letterSpacing: "0.1em",
                border: "none",
                borderRadius: "2px",
                textTransform: "none",
                px: { xs: 0.5, sm: 1.5 },
                py: 0.5,
                minWidth: "auto",
                "& .MuiButton-startIcon": {
                  marginRight: { xs: 0, sm: "8px" }
                },
                "&:hover": {
                  bgcolor: "rgba(200,162,74,0.08)",
                  color: "#C8A24A",
                }
              }}
            >
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}

          <IconButton 
            onClick={() => navigate("/wishlist")}
            className="text-matte-black hover:text-brand-gold transition-colors duration-200"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <FavoriteBorder sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>

          <IconButton 
            onClick={() => navigate("/cart")}
            className="text-matte-black hover:text-brand-gold transition-colors duration-200"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <Badge 
              badgeContent={cart.cart?.cartItems.length} 
              sx={{ 
                "& .MuiBadge-badge": { 
                  backgroundColor: "#C8A24A", 
                  color: "#0F0F0F",
                  fontWeight: "bold",
                  fontFamily: "Inter",
                  fontSize: { xs: "9px", sm: "11px" },
                  height: { xs: 16, sm: 20 },
                  minWidth: { xs: 16, sm: 20 },
                  padding: "0 4px"
                } 
              }}
            >
              <AddShoppingCartIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </Badge>
          </IconButton>
        </div>
      </div>

      {/* Mega Menu Drawer (Mobile) */}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>

      {/* Luxury Search Modal */}
      <LuxurySearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </Box>
  );
};

export default Navbar;
