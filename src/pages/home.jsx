import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import OnSaleNow from "../components/onSaleNow";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);
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
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
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
                Products
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

      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">
            Welcome to E-Computer Store
          </h2>
          <p className="text-xl mb-8">
            Find the best deals on computers and electronics
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all">
            Shop Now
          </button>
        </div>
      </div>

      {/* On Sale Now Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <OnSaleNow />
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            name="Gaming Laptop"
            image="https://images.unsplash.com/photo-1698512475058-7975102960b6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2FtaW5nJTIwbGFwdG9wc3xlbnwwfHwwfHx8MA%3D%3D"
            price="$1,299"
          />
          <ProductCard
            name="Wireless Mouse"
            image="https://images.unsplash.com/photo-1660491083562-d91a64d6ea9c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2lyZWxlc3MlMjBtb3VzZXxlbnwwfHwwfHx8MA%3D%3D"
            price="$49"
          />
          <ProductCard
            name="Mechanical Keyboard"
            image="https://images.unsplash.com/photo-1626958390898-162d3577f293?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVjaGFuaWNhbCUyMGtleWJvYXJkfGVufDB8fDB8fHww"
            price="$129"
          />
          <ProductCard
            name="Monitor 27 inch"
            image="https://images.unsplash.com/photo-1570485071395-29b575ea3b4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW9uaXRvcnxlbnwwfHwwfHx8MA%3D%3D"
            price="$349"
          />
        </div>
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
