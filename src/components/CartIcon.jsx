import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartIcon({ className = "" }) {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  return (
    <button
      onClick={() => navigate("/cart")}
      className={`relative text-gray-700 hover:text-blue-600 font-medium transition-all flex items-center gap-1 ${className}`}
    >
      <ion-icon name="cart-outline" style={{ fontSize: "22px" }}></ion-icon>
      <span className="hidden sm:inline">Cart</span>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </button>
  );
}
