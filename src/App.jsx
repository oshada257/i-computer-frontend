import { Route, Router, Routes } from "react-router-dom"
import Home from "./pages/home.jsx"
import Login from "./pages/login.jsx"
import Admin from "./pages/admin.jsx"
import AdminOrders from "./pages/adminOrders.jsx"
import Register from "./pages/register.jsx"
import ProductDetails from "./pages/productDetails.jsx"
import Checkout from "./pages/checkout.jsx"
import MyOrders from "./pages/myOrders.jsx"
import Cart from "./pages/cart.jsx"
import { Toaster } from "react-hot-toast"
import { CartProvider } from "./context/CartContext.jsx"


export default function App() {
  return (
    <>
    <CartProvider>
    <div>
      <Toaster  position="top-center" />
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders/my-orders" element={<MyOrders />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
    </CartProvider>
    </>
  )
}
