import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Product from './pages/Product'
import Auth from './pages/Auth'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

function App() {
  function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
  return (
    <div className='min-h-screen flex flex-col font-sans text-gray-800 bg-white'>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/shop/product/:id' element={<Product />} />
        <Route path='/user/cart' element={<Cart />} />
        <Route path='/user/checkout' element={<Checkout />} />
        <Route path='/user/profile' element={<Profile />} />
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </div>
  )
}

export default App
