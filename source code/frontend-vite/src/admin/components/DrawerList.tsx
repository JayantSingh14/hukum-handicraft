import DrawerList from "../../admin seller/components/drawerList/DrawerList";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { Category, Inventory2, ShoppingCart, People, Settings } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

const menu = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <DashboardIcon className="text-primary-color" />,
    activeIcon: <DashboardIcon className="text-white" />,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: <Inventory2 className="text-primary-color" />,
    activeIcon: <Inventory2 className="text-white" />,
  },
  {
    name: "Add Product",
    path: "/admin/add-product",
    icon: <AddIcon className="text-primary-color" />,
    activeIcon: <AddIcon className="text-white" />,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: <ShoppingCart className="text-primary-color" />,
    activeIcon: <ShoppingCart className="text-white" />,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: <People className="text-primary-color" />,
    activeIcon: <People className="text-white" />,
  },
  {
    name: "Coupons",
    path: "/admin/coupon",
    icon: <LocalOfferIcon className="text-primary-color" />,
    activeIcon: <LocalOfferIcon className="text-white" />,
  },
  {
    name: "Add Coupon",
    path: "/admin/add-coupon",
    icon: <CardGiftcardIcon className="text-primary-color" />,
    activeIcon: <CardGiftcardIcon className="text-white" />,
  },
  {
    name: "Home Page Grid",
    path: "/admin/home-grid",
    icon: <HomeIcon className="text-primary-color" />,
    activeIcon: <HomeIcon className="text-white" />,
  },
  {
    name: "Featured Categories",
    path: "/admin/electronics-category",
    icon: <ElectricBoltIcon className="text-primary-color" />,
    activeIcon: <ElectricBoltIcon className="text-white" />,
  },
  {
    name: "Shop By Category",
    path: "/admin/shop-by-category",
    icon: <Category className="text-primary-color" />,
    activeIcon: <Category className="text-white" />,
  },
  {
    name: "Deals",
    path: "/admin/deals",
    icon: <LocalOfferIcon className="text-primary-color" />,
    activeIcon: <LocalOfferIcon className="text-white" />,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: <Settings className="text-primary-color" />,
    activeIcon: <Settings className="text-white" />,
  },
];

const menu2 = [
  {
    name: "Logout",
    path: "/",
    icon: <LogoutIcon className="text-primary-color" />,
    activeIcon: <LogoutIcon className="text-white" />,
  },
];

interface DrawerListProps {
  toggleDrawer?: () => void;
}

const AdminDrawerList = ({ toggleDrawer }: DrawerListProps) => {
  return <DrawerList toggleDrawer={toggleDrawer} menu={menu} menu2={menu2} />;
};

export default AdminDrawerList;
