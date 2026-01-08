import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import OnSaleNow from "../components/onSaleNow";
import CartIcon from "../components/CartIcon";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const categories = [
    { name: "All Products", value: "all" },
    { name: "Laptops", value: "laptops" },
    { name: "Mouse", value: "mouse" },
    { name: "Keyboards", value: "keyboards" },
    { name: "Monitors", value: "monitors" },
    { name: "Accessories", value: "accessories" },
    { name: "Desktops", value: "desktops" },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.model.toLowerCase().includes(query)
      );
    }

    setDisplayedProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryValue) => {
    setSelectedCategory(categoryValue);
    setShowCategoryDropdown(false);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // Optional: could still navigate to dedicated search page if needed
      // navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleAddToCart = (productId) => {
    const product = products.find(p => p.productId === productId);
    addToCart(product, navigate);
  };

  const handleBuyNow = (product) => {
    if (!user) {
      toast.error("Please login to purchase products", {
        icon: "🔒",
        duration: 2000
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    navigate("/checkout", {
      state: {
        product: product,
        quantity: 1,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">E-Computer Store</h1>
          <div className="flex items-center gap-8">
            <a
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-all"
            >
              Home
            </a>
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                onMouseEnter={() => setShowCategoryDropdown(true)}
                onMouseLeave={() => setShowCategoryDropdown(false)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-all flex items-center gap-1"
              >
                {categories.find((cat) => cat.value === selectedCategory)
                  ?.name || "Products"}
                <span className="text-gray-700 hover:text-blue-600 font-medium transition-all flex items-center gap-1 ">
                  <ion-icon name="chevron-down-outline"></ion-icon>
                </span>
              </button>
              {showCategoryDropdown && (
                <div
                  className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                  onMouseEnter={() => setShowCategoryDropdown(true)}
                  onMouseLeave={() => setShowCategoryDropdown(false)}
                >
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleCategoryChange(category.value)}
                      className={`block w-full text-left px-4 py-2 transition-all first:rounded-t-lg last:rounded-b-lg ${
                        selectedCategory === category.value
                          ? "bg-blue-100 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("footer")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-700 hover:text-blue-600 font-medium transition-all"
            >
              Contact Us
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 w-64"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <ion-icon name="close-outline"></ion-icon>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <CartIcon />
                <button
                  onClick={() => navigate("/orders/my-orders")}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all"
                >
                  My Orders
                </button>
                <span className="text-gray-600">Welcome, {user.firstName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">
            Welcome to E-Computer Store
          </h2>
          <p className="text-xl mb-8">
            Find the best deals on computers and electronics
          </p>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <OnSaleNow />
      </div>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                {searchQuery.trim()
                  ? `Search Results for "${searchQuery}"`
                  : selectedCategory === "all"
                  ? "Featured Products"
                  : `${
                      categories.find((cat) => cat.value === selectedCategory)
                        ?.name || "Products"
                    }`}
              </h2>
              <div className="text-sm text-gray-600">
                Showing {displayedProducts.length} product
                {displayedProducts.length !== 1 ? "s" : ""}
                {searchQuery.trim() && selectedCategory !== "all" && (
                  <span className="block text-xs text-gray-500 mt-1">
                    in{" "}
                    {
                      categories.find((cat) => cat.value === selectedCategory)
                        ?.name
                    }
                  </span>
                )}
              </div>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedProducts.slice(0, 12).map((product) => (
                  <ProductCard
                    key={product._id}
                    productId={product.productId}
                    name={product.name}
                    description={product.description}
                    image={product.image}
                    price={product.price}
                    labelledPrice={product.labelledPrice}
                    category={product.category}
                    brand={product.brand}
                    model={product.model}
                    onClick={(id) => navigate(`/product/${id}`)}
                    onAddToCart={handleAddToCart}
                    onBuyNow={() => handleBuyNow(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-16 w-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg mb-2">
                  {searchQuery.trim()
                    ? `No products found for "${searchQuery}"`
                    : `No products found in ${
                        categories
                          .find((cat) => cat.value === selectedCategory)
                          ?.name.toLowerCase() || "this category"
                      }`}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {searchQuery.trim()
                    ? "Try different keywords or check your spelling"
                    : "Try selecting a different category or check back later!"}
                </p>
                <div className="flex gap-3 justify-center">
                  {searchQuery.trim() && (
                    <button
                      onClick={clearSearch}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    View All Products
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
