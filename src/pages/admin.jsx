import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import AdminStats from "../components/AdminStats";
import QuickActions from "../components/QuickActions";
import ProductList from "../components/ProductList";
import AddProductModal from "../components/AddProductModal";

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

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
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.productId.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchProducts();
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product!");
    }
  };

  // Edit product (simplified - just navigate to edit page or show modal)
  const handleEditProduct = (product) => {
    // For now, just show an alert. You can implement edit modal later
    alert(`Edit functionality for ${product.name} will be implemented soon.`);
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
        <AdminStats products={products} />

        {/* Quick Actions */}
        <QuickActions onAddProduct={() => setShowAddProductModal(true)} />

        {/* Product List */}
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
