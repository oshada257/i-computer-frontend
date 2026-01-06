import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    { name: "Laptops", path: "/products?category=laptops" },
    { name: "Mice", path: "/products?category=mice" },
    { name: "Keyboards", path: "/products?category=keyboards" },
    { name: "Monitors", path: "/products?category=monitors" },
    { name: "Accessories", path: "/products?category=accessories" },
  ];

  // Sample products database
  const allProducts = [
    {
      id: 1,
      name: "Gaming Laptop",
      image: "https://picsum.photos/id/0/400/300",
      price: "$1,299",
    },
    {
      id: 2,
      name: "Wireless Mouse",
      image: "https://picsum.photos/id/3/400/300",
      price: "$49",
    },
    {
      id: 3,
      name: "Mechanical Keyboard",
      image: "https://picsum.photos/id/4/400/300",
      price: "$129",
    },
    {
      id: 4,
      name: "Monitor 27 inch",
      image: "https://picsum.photos/id/5/400/300",
      price: "$349",
    },
    {
      id: 5,
      name: "Gaming PC",
      image: "https://picsum.photos/id/1/400/300",
      price: "$1,999",
    },
    {
      id: 6,
      name: "USB-C Keyboard",
      image: "https://picsum.photos/id/6/400/300",
      price: "$89",
    },
    {
      id: 7,
      name: "Laptop Stand",
      image: "https://picsum.photos/id/7/400/300",
      price: "$39",
    },
    {
      id: 8,
      name: "Monitor Arm",
      image: "https://picsum.photos/id/8/400/300",
      price: "$79",
    },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);
      const results = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(results);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const query = searchParams.get("query") || "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600"
          >
            E-Computer Store
          </h1>
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
                Products
                <span
                  className={`transform transition-transform ${
                    showCategoryDropdown ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {showCategoryDropdown && (
                <div
                  className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                  onMouseEnter={() => setShowCategoryDropdown(true)}
                  onMouseLeave={() => setShowCategoryDropdown(false)}
                >
                  {categories.map((category, index) => (
                    <a
                      key={index}
                      href={category.path}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-all first:rounded-t-lg last:rounded-b-lg"
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a
              href="/gallery"
              className="text-gray-700 hover:text-blue-600 font-medium transition-all"
            >
              Gallery
            </a>
            <a
              href="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition-all"
            >
              Contact Us
            </a>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Search
            </button>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-600">
                  Welcome, {user.firstName || user.fullName || user.email}
                </span>
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

      {/* Search Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Search Results
        </h2>
        <p className="text-gray-600 mb-8">
          {filteredProducts.length > 0
            ? `Found ${filteredProducts.length} product(s) for "${query}"`
            : `No products found for "${query}"`}
        </p>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                image={product.image}
                price={product.price}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-6">
              Try searching with different keywords
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 E-Computer Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
