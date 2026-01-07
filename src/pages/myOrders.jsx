import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function MyOrders() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "failed":
        return "text-red-600 bg-red-100";
      case "refunded":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            ← Back to Home
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-semibold text-gray-800">{order.orderId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-semibold text-gray-800">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.paymentInfo.status)}`}>
                          {order.paymentInfo.status.charAt(0).toUpperCase() + order.paymentInfo.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-blue-600">Rs. {order.orderSummary.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Items ({order.items.length})</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => {
                      const imageUrl = item.image && item.image.startsWith('/images') 
                        ? `http://localhost:3000${item.image}` 
                        : (item.image || '/images/default-product.png');
                      
                      return (
                        <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                          <img
                            src={imageUrl}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-blue-600 font-semibold">Rs. {item.price.toFixed(2)} each</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">Rs. {item.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 px-6 py-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex gap-6">
                      <span>Subtotal: Rs. {order.orderSummary.subtotal.toFixed(2)}</span>
                      <span>Tax: Rs. {order.orderSummary.tax.toFixed(2)}</span>
                      <span>Shipping: {order.orderSummary.shipping === 0 ? "FREE" : `Rs. ${order.orderSummary.shipping.toFixed(2)}`}</span>
                      <span>Payment: {order.paymentInfo.method.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 font-medium mb-1">Shipping Address:</p>
                    <p className="text-sm text-gray-800">
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}