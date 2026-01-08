import { useCart } from "../context/CartContext";

export default function CartSummary({ onCheckout }) {
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 5000 ? 0 : 500; // Free shipping above Rs. 5000
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({cartItems.length} items):</span>
          <span>Rs.{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (10%):</span>
          <span>Rs.{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping:</span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
            {shipping === 0 ? "Free" : `Rs.${shipping.toFixed(2)}`}
          </span>
        </div>
        {subtotal > 0 && subtotal <= 5000 && (
          <p className="text-xs text-gray-500">
            Add Rs.{(5000 - subtotal).toFixed(2)} more for free shipping!
          </p>
        )}
        <hr className="border-gray-200" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-blue-600">Rs.{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={cartItems.length === 0}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </button>

      <button
        onClick={clearCart}
        disabled={cartItems.length === 0}
        className="w-full mt-3 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Clear Cart
      </button>

      {/* Security badges */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
          <ion-icon name="shield-checkmark-outline"></ion-icon>
          <span>Secure Checkout</span>
        </div>
      </div>
    </div>
  );
}
