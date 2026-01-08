import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import CartIcon from "../components/CartIcon";
import Footer from "../components/Footer";


export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Product not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleAddToCart = () => {
    addToCart(product, navigate);
  };

  const handleBuyNow = () => {
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
        quantity: 1 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const discount = product.labelledPrice
    ? Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)
    : 0;

  const imageUrl = (img) => {
    if (!img) return "/images/default-product.png";
    return img.startsWith("/images") ? `http://localhost:3000${img}` : img;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-gray-800 cursor-pointer"
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
            <a
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-all"
            >
              Products
            </a>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <CartIcon />
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

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="relative mb-4">
                <img
                  src={imageUrl(product.image[selectedImage])}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {discount > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md text-lg font-semibold">
                    -{discount}% OFF
                  </span>
                )}
                {product.category && (
                  <span className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-md text-sm">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Image Thumbnails */}
              {product.image.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.image.map((img, index) => (
                    <img
                      key={index}
                      src={imageUrl(img)}
                      alt={`${product.name} ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                        selectedImage === index
                          ? "border-blue-600"
                          : "border-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              {product.brand && product.brand !== "generic" && (
                <p className="text-lg text-gray-600 mb-2">
                  Brand: <span className="font-semibold">{product.brand}</span>
                </p>
              )}

              {product.model && product.model !== "standard" && (
                <p className="text-lg text-gray-600 mb-4">
                  Model: <span className="font-semibold">{product.model}</span>
                </p>
              )}

              <div className="flex items-center gap-4 mb-6">
                <p className="text-4xl font-bold text-blue-600">
                  Rs.{product.price.toFixed(2)}
                </p>
                {product.labelledPrice && product.labelledPrice > product.price && (
                  <p className="text-2xl text-gray-400 line-through">
                    Rs.{product.labelledPrice.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.altName && product.altName.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Also Known As:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.altName.map((name, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all mb-3"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all"
                >
                  Buy Now
                </button>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Product Information
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <span className="font-medium">Product ID:</span>{" "}
                    {product.productId}
                  </li>
                  <li>
                    <span className="font-medium">Category:</span>{" "}
                    {product.category}
                  </li>
                  <li>
                    <span className="font-medium">Availability:</span>{" "}
                    <span className="text-green-600 font-semibold">In Stock</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
