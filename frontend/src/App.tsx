import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';

// Layout & Routing
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBanner from './pages/admin/AdminBanner';

function App() {
  const { user } = useAuth();
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Home />} />
          <Route path="products" element={user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Products />} />
          <Route path="products/:id" element={user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <ProductDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cart" element={user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Cart />} />

          {/* Customer Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="checkout" element={user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Checkout />} />
            <Route path="profile" element={user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Profile />} />
            <Route path="orders" element={user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Orders />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route path="admin" element={<PrivateRoute adminOnly={true} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="banner" element={<AdminBanner />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
