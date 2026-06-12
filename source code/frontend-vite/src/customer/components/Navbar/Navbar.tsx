import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import "./Navbar.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { mainCategory } from "../../../data/category/mainCategory";
import CategorySheet from "./CategorySheet";
import DrawerList from "./DrawerList";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import { FavoriteBorder } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("wall_art");
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const { user, cart } = useAppSelector((store) => store);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Box
      sx={{ zIndex: 1000 }}
      className="sticky top-0 left-0 right-0 glass-premium border-b border-[#C8A24A]/20 shadow-sm transition-all duration-300"
    >
      <div className="flex items-center justify-between px-5 lg:px-20 h-[80px]">
        {/* Left Section: Mobile Menu & Logo */}
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            {!isLarge && (
              <IconButton onClick={toggleDrawer(true)} className="hover:text-brand-gold">
                <MenuIcon className="text-matte-black" sx={{ fontSize: 26 }} />
              </IconButton>
            )}
            <div 
              onClick={() => navigate("/")}
              className="group cursor-pointer flex flex-col items-center justify-center"
            >
              <h1 className="font-serif tracking-[0.25em] text-2xl lg:text-3xl font-bold text-matte-black group-hover:text-brand-gold transition-colors duration-300">
                HUKUM
              </h1>
              <span className="text-[7px] tracking-[0.6em] font-sans font-bold text-brand-gold -mt-1 uppercase">
                Artisanal Luxury
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          {isLarge && (
            <nav>
              <ul className="flex items-center gap-1 font-sans text-xs uppercase tracking-widest font-semibold text-charcoal">
                {mainCategory.map((item) => (
                  <li
                    key={item.categoryId}
                    onMouseLeave={() => setShowSheet(false)}
                    onMouseEnter={() => {
                      setSelectedCategory(item.categoryId);
                      setShowSheet(true);
                    }}
                    className="relative cursor-pointer h-[80px] px-4 flex items-center text-charcoal hover:text-brand-gold transition-colors duration-300"
                  >
                    <span>{item.name}</span>
                    {selectedCategory === item.categoryId && showSheet && (
                      <motion.div
                        layoutId="activeTabBorder"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-gold"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* Right Section: Actions */}
        <div className="flex gap-2 lg:gap-5 items-center">
          <IconButton 
            onClick={() => navigate("/search-products")}
            className="text-matte-black hover:text-brand-gold transition-colors duration-200"
          >
            <SearchIcon sx={{ fontSize: 24 }} />
          </IconButton>

          {user.user ? (
            <Button
              onClick={() => navigate("/account/orders")}
              className="flex items-center gap-2 text-matte-black hover:text-brand-gold normal-case"
              sx={{ color: '#1A1A1A', textTransform: 'none', letterSpacing: 'normal' }}
            >
              <Avatar
                sx={{ 
                  width: 28, 
                  height: 28, 
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
              variant="contained"
              startIcon={<AccountCircleIcon sx={{ fontSize: "14px" }} />}
              onClick={() => navigate("/login")}
              sx={{ 
                bgcolor: "#0F0F0F", 
                color: "#FAF8F2",
                fontWeight: 600,
                fontSize: "11px",
                letterSpacing: "0.1em",
                border: "1px solid transparent",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#C8A24A",
                  borderColor: "#C8A24A",
                }
              }}
            >
              Login
            </Button>
          )}

          <IconButton 
            onClick={() => navigate("/wishlist")}
            className="text-matte-black hover:text-brand-gold transition-colors duration-200"
          >
            <FavoriteBorder sx={{ fontSize: 24 }} />
          </IconButton>

          <IconButton 
            onClick={() => navigate("/cart")}
            className="text-matte-black hover:text-brand-gold transition-colors duration-200"
          >
            <Badge 
              badgeContent={cart.cart?.cartItems.length} 
              sx={{ 
                "& .MuiBadge-badge": { 
                  backgroundColor: "#C8A24A", 
                  color: "#0F0F0F",
                  fontWeight: "bold",
                  fontFamily: "Inter"
                } 
              }}
            >
              <AddShoppingCartIcon sx={{ fontSize: 24 }} />
            </Badge>
          </IconButton>
        </div>
      </div>

      {/* Mega Menu Drawer (Mobile) */}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>

      {/* Mega Menu Mega-Dropdown (Desktop) */}
      <AnimatePresence>
        {showSheet && selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25 }}
            onMouseLeave={() => setShowSheet(false)}
            onMouseEnter={() => setShowSheet(true)}
            className="absolute top-[80px] left-0 right-0 z-50 shadow-luxury"
          >
            <CategorySheet
              setShowSheet={setShowSheet}
              selectedCategory={selectedCategory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Navbar;
