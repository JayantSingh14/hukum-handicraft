import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from '../customer/pages/Home/Home';
import Products from '../customer/pages/Products/Products';
import ProductDetails from '../customer/pages/Products/ProductDetails/ProductDetails';
import Cart from '../customer/pages/Cart/Cart';
import Address from '../customer/pages/Checkout/AddressPage';
import Profile from '../customer/pages/Account/Profile';
import Footer from '../customer/components/Footer/Footer';
import Navbar from '../customer/components/Navbar/Navbar';
import NotFound from '../customer/pages/NotFound/NotFound';
import Auth from '../customer/pages/Auth/Auth';
import { useAppDispatch, useAppSelector } from '../Redux Toolkit/Store';
import { fetchUserCart } from '../Redux Toolkit/Customer/CartSlice';
import PaymentSuccessHandler from '../customer/pages/Pyement/PaymentSuccessHandler';
import Reviews from '../customer/pages/Review/Reviews';
import WriteReviews from '../customer/pages/Review/WriteReview';
import Wishlist from '../customer/pages/Wishlist/Wishlist';
import { getWishlistByUserId } from '../Redux Toolkit/Customer/WishlistSlice';
import SearchProducts from '../customer/pages/Search/SearchProducts';

// Ultra-lightweight: opacity-only = 100% GPU, zero layout work
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18, ease: 'easeOut' as const } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: 'easeIn' as const } },
};

const CustomerRoutes = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector(store => store);
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchUserCart(localStorage.getItem('jwt') || ''));
    dispatch(getWishlistByUserId());
  }, [auth.jwt, dispatch]);

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          // will-change hint so the browser promotes this layer ahead of time
          style={{ willChange: 'opacity' }}
        >
          <Routes location={location}>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<Products />} />
            <Route path='/products/:categoryId' element={<Products />} />
            <Route path='/search-products' element={<SearchProducts />} />
            <Route path='/reviews/:productId' element={<Reviews />} />
            <Route path='/reviews/:productId/create' element={<WriteReviews />} />
            <Route path='/product-details/:categoryId/:name/:productId' element={<ProductDetails />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path='/checkout/address' element={<Address />} />
            <Route path='/account/*' element={<Profile />} />
            <Route path='/login' element={<Auth />} />
            <Route path='/payment-success/:orderId' element={<PaymentSuccessHandler />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default CustomerRoutes;