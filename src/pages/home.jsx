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
    <div className="min-h-screen bg-gray-100">
      {/* Top Header Bar */}
      <div className="bg-[#1e1e27] text-gray-300 py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <ion-icon name="call-outline"></ion-icon>
              +94 71 234 5678
            </span>
            <span className="flex items-center gap-2">
              <ion-icon name="mail-outline"></ion-icon>
              info@ecomputer.com
            </span>
            <span className="flex items-center gap-2">
              <ion-icon name="location-outline"></ion-icon>
              Colombo, Sri Lanka
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <span className="text-gray-300">Welcome, {user.firstName}</span>
            ) : (
              <button onClick={() => navigate("/login")} className="hover:text-[#D10024] transition-all">
                <ion-icon name="person-outline"></ion-icon> My Account
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="E Computer Logo" className="h-12 w-12 object-contain rounded-full" />
            <h1 className="text-2xl font-bold text-[#1e1e27]">E-Computer</h1>
          </div>
          <div className="flex items-center gap-8">
            <a
              href="/"
              className="text-[#1e1e27] hover:text-[#D10024] font-medium transition-all"
            >
              Home
            </a>
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                onMouseEnter={() => setShowCategoryDropdown(true)}
                onMouseLeave={() => setShowCategoryDropdown(false)}
                className="text-[#1e1e27] hover:text-[#D10024] font-medium transition-all flex items-center gap-1"
              >
                {categories.find((cat) => cat.value === selectedCategory)
                  ?.name || "Products"}
                <span className="flex items-center gap-1">
                  <ion-icon name="chevron-down-outline"></ion-icon>
                </span>
              </button>
              {showCategoryDropdown && (
                <div
                  className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  onMouseEnter={() => setShowCategoryDropdown(true)}
                  onMouseLeave={() => setShowCategoryDropdown(false)}
                >
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleCategoryChange(category.value)}
                      className={`block w-full text-left px-4 py-2 transition-all first:rounded-t-lg last:rounded-b-lg ${
                        selectedCategory === category.value
                          ? "bg-[#D10024] text-white font-medium"
                          : "text-[#1e1e27] hover:bg-[#D10024] hover:text-white"
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
              className="text-[#1e1e27] hover:text-[#D10024] font-medium transition-all"
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
                className="px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-[#D10024] w-64"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#D10024]"
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
                  className="text-[#1e1e27] hover:text-[#D10024] font-medium transition-all"
                >
                  My Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-[#D10024] text-white px-4 py-2 rounded-full hover:bg-[#a8001d] transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-[#D10024] text-white px-6 py-2 rounded-full hover:bg-[#a8001d] transition-all font-medium"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="bg-[#1e1e27] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">
            Welcome to <span className="text-[#D10024]">E-Computer</span>
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Find the best deals on computers and electronics
          </p>
          <button 
            onClick={() => setSelectedCategory("all")}
            className="bg-[#D10024] text-white px-8 py-3 rounded-full hover:bg-[#a8001d] transition-all font-semibold text-lg"
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* On Sale Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <OnSaleNow />
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#1e1e27] border-b-4 border-[#D10024] pb-2">
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
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-[#D10024] mx-auto mb-4"></div>
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
                  className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-all"
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="bg-[#D10024] text-white px-6 py-2 rounded-full hover:bg-[#a8001d] transition-all"
              >
                View All Products
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
