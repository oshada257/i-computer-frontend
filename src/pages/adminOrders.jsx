import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is logged in and is admin
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "admin") {
      navigate("/");
      setLoading(false);
      return;
    }

    setUser(parsedUser);
    fetchOrders();
    setLoading(false);
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data.orders);
      setFilteredOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Search orders
  const handleOrderSearch = (query) => {
    setOrderSearchQuery(query);
    if (query.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(query.toLowerCase()) ||
          order.customerInfo.email.toLowerCase().includes(query.toLowerCase()) ||
          order.customerInfo.firstName.toLowerCase().includes(query.toLowerCase()) ||
          order.customerInfo.lastName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/orders/${orderId}/payment`, {
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchOrders();
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, {user?.firstName || user?.name || user?.email || "Admin"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{orders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {orders.filter(o => o.paymentInfo.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Completed Orders</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {orders.filter(o => o.paymentInfo.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              Rs. {orders.filter(o => o.paymentInfo.status === 'completed')
                .reduce((sum, order) => sum + order.orderSummary.total, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Orders Management ({filteredOrders.length})
            </h2>
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search orders..."
                value={orderSearchQuery}
                onChange={(e) => handleOrderSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 w-64"
              />
              {orderSearchQuery && (
                <button
                  onClick={() => handleOrderSearch("")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Payment Method
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">
                      {order.orderId}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.customerInfo.firstName} {order.customerInfo.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerInfo.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      Rs. {order.orderSummary.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {order.paymentInfo.method.replace('_', ' ').toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.paymentInfo.status}
                        onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${
                          order.paymentInfo.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.paymentInfo.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.paymentInfo.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          const orderDetails = `
Order ID: ${order.orderId}
Customer: ${order.customerInfo.firstName} ${order.customerInfo.lastName}
Email: ${order.customerInfo.email}
Phone: ${order.customerInfo.phone}
Total: Rs. ${order.orderSummary.total.toFixed(2)}
Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
Items: ${order.items.map(item => `${item.productName} (Qty: ${item.quantity})`).join(', ')}
Payment Method: ${order.paymentInfo.method.replace('_', ' ')}
Status: ${order.paymentInfo.status}
                          `;
                          alert(orderDetails);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && orderSearchQuery && (
              <div className="text-center py-8 text-gray-500">
                No orders found matching "{orderSearchQuery}"
              </div>
            )}
            
            {filteredOrders.length === 0 && !orderSearchQuery && (
              <div className="text-center py-8 text-gray-500">
                No orders found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}