import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

export default function OnSaleNow() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  const fetchSaleProducts = async () => {
    try {
      const response = await api.get("/products/on-sale");
      setSaleProducts(response.data);
    } catch (error) {
      console.error("Error fetching sale products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (productId) => {
    const product = saleProducts.find(p => p.productId === productId);
    addToCart(product, navigate);
  };

  const handleBuyNow = (product) => {
    const user = localStorage.getItem("user");
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

  if (loading) {
    return (
      <div className="bg-red-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-red-600 mb-6">
          🔥 On Sale Now!
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (saleProducts.length === 0) {
    return null; // Don't show section if no products on sale
  }

  return (
    <div className="bg-red-50 rounded-lg p-8">
      <h2 className="text-3xl font-bold text-red-600 mb-6">
        🔥 On Sale Now!
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {saleProducts.slice(0, 8).map((product) => (
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
    </div>
  );
}