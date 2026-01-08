import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Get product data from navigation state - support both single product and cart items
  const singleProduct = location.state?.product;
  const singleQuantity = location.state?.quantity || 1;
  const cartItems = location.state?.cartItems;
  
  // Determine if this is a cart checkout or single product checkout
  const isCartCheckout = cartItems && cartItems.length > 0;
  
  // Build items array for display and order
  const orderItems = isCartCheckout 
    ? cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }))
    : singleProduct 
      ? [{
          productId: singleProduct.productId,
          name: singleProduct.name,
          price: singleProduct.price,
          quantity: singleQuantity,
          image: singleProduct.image
        }]
      : [];

  const [orderData, setOrderData] = useState({
    customerInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    },
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Sri Lanka"
    },
    paymentMethod: "cash_on_delivery"
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Pre-fill customer info if available
    setOrderData(prev => ({
      ...prev,
      customerInfo: {
        firstName: parsedUser.firstName || "",
        lastName: parsedUser.lastName || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || ""
      }
    }));

    // Redirect if no product data
    if (!singleProduct && (!cartItems || cartItems.length === 0)) {
      navigate("/");
    }
  }, [navigate, singleProduct, cartItems]);

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const calculateTotals = () => {
    if (orderItems.length === 0) return { subtotal: 0, tax: 0, shipping: 0, total: 0 };
    
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 5000 ? 0 : 500; // Free shipping above Rs. 5000
    const total = subtotal + tax + shipping;
    
    return { subtotal, tax, shipping, total };
  };

  const handlePlaceOrder = async () => {
    // Validate form
    const { customerInfo, shippingAddress } = orderData;
    
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
      alert("Please fill in all customer information");
      return;
    }
    
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      alert("Please fill in all shipping address fields");
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const totals = calculateTotals();
      
      const orderPayload = {
        customerInfo: orderData.customerInfo,
        shippingAddress: orderData.shippingAddress,
        items: orderItems.map(item => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.price * item.quantity,
          image: item.image && item.image[0] ? item.image[0] : "/images/default-product.png"
        })),
        orderSummary: {
          subtotal: totals.subtotal,
          tax: totals.tax,
          shipping: totals.shipping,
          discount: 0,
          total: totals.total
        },
        paymentInfo: {
          method: orderData.paymentMethod
        }
      };

      const response = await api.post("/orders", orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Clear cart if this was a cart checkout
      if (isCartCheckout) {
        clearCart();
      }

      alert("Order placed successfully!");
      navigate("/orders/my-orders");
      
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (orderItems.length === 0 || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  const totals = calculateTotals();

  // Helper function to get image URL
  const getImageUrl = (image) => {
    if (!image || (Array.isArray(image) && image.length === 0)) {
      return '/images/default-product.png';
    }
    const imgPath = Array.isArray(image) ? image[0] : image;
    return imgPath.startsWith('/images') ? `http://localhost:3000${imgPath}` : imgPath;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-gray-800 cursor-pointer"
          >
            E-Computer Store
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, {user.firstName || user.fullName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Checkout Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(isCartCheckout ? "/cart" : "/")}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
        >
          ← {isCartCheckout ? "Back to Cart" : "Back to Shopping"}
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    value={orderData.customerInfo.firstName}
                    onChange={(e) => handleInputChange('customerInfo', 'firstName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={orderData.customerInfo.lastName}
                    onChange={(e) => handleInputChange('customerInfo', 'lastName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={orderData.customerInfo.email}
                    onChange={(e) => handleInputChange('customerInfo', 'email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={orderData.customerInfo.phone}
                    onChange={(e) => handleInputChange('customerInfo', 'phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Street Address *</label>
                  <input
                    type="text"
                    value={orderData.shippingAddress.street}
                    onChange={(e) => handleInputChange('shippingAddress', 'street', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">City *</label>
                    <input
                      type="text"
                      value={orderData.shippingAddress.city}
                      onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">State *</label>
                    <input
                      type="text"
                      value={orderData.shippingAddress.state}
                      onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      value={orderData.shippingAddress.zipCode}
                      onChange={(e) => handleInputChange('shippingAddress', 'zipCode', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Country</label>
                    <input
                      type="text"
                      value={orderData.shippingAddress.country}
                      onChange={(e) => handleInputChange('shippingAddress', 'country', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={orderData.paymentMethod === "cash_on_delivery"}
                    onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="mr-3"
                  />
                  <span className="text-gray-700">Cash on Delivery</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={orderData.paymentMethod === "bank_transfer"}
                    onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="mr-3"
                  />
                  <span className="text-gray-700">Bank Transfer</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            {/* Product Details */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-blue-600 font-semibold">Rs. {item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>Rs. {totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{totals.shipping === 0 ? "FREE" : `Rs. ${totals.shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">Rs. {totals.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:bg-gray-400"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            {totals.subtotal < 5000 && (
              <p className="text-sm text-gray-500 mt-3 text-center">
                Add Rs. {(5000 - totals.subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
          </div>
         
        </div>
      </div>
       <Footer />
    </div>
   
  );
}
