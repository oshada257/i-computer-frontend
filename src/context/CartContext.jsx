import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Update cart count whenever cartItems change
  useEffect(() => {
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalCount);
  }, [cartItems]);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  };

  const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);
  };

  const addToCart = (product, navigate) => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("Please login to add items to cart", {
        icon: "🔒",
        duration: 2000
      });
      if (navigate) {
        setTimeout(() => navigate("/login"), 1500);
      }
      return false;
    }

    if (!product) {
      toast.error("Product not found");
      return false;
    }

    const existingCart = [...cartItems];
    const existingItemIndex = existingCart.findIndex(
      item => item.productId === product.productId
    );

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    saveCart(existingCart);

    // Show success toast with View Cart button
    toast.success(
      (t) => (
        <div className="flex items-center gap-3">
          <span>Added to cart!</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              if (navigate) navigate("/cart");
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            View Cart
          </button>
        </div>
      ),
      {
        duration: 3000,
        icon: "🛒",
        style: {
          padding: '16px',
          borderRadius: '10px',
        }
      }
    );

    return true;
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cartItems.find(item => item.productId === productId);
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    saveCart(updatedCart);
    
    toast.success(`${itemToRemove?.name || 'Item'} removed from cart`, {
      icon: "🗑️",
      duration: 2000
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
    toast.success("Cart cleared", {
      icon: "🧹",
      duration: 2000
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalWithTax = () => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 5000 ? 0 : 500; // Free shipping above Rs. 5000
    return subtotal + tax + shipping;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalWithTax,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
