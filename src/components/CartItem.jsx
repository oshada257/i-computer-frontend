import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const getImageUrl = (image) => {
    if (!image) return "/images/default-product.png";
    const firstImage = Array.isArray(image) ? image[0] : image;
    return firstImage && firstImage.startsWith('/images')
      ? `http://localhost:3000${firstImage}`
      : firstImage;
  };

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {}
      <img
        src={getImageUrl(item.image)}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-md"
      />

      {}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
        <p className="text-blue-600 font-bold">Rs.{item.price.toFixed(2)}</p>
      </div>

      {}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition-all flex items-center justify-center font-bold"
        >
          -
        </button>
        <span className="w-10 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition-all flex items-center justify-center font-bold"
        >
          +
        </button>
      </div>

      {}
      <div className="text-right min-w-25">
        <p className="font-bold text-gray-800">
          Rs.{(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => removeFromCart(item.productId)}
          className="text-red-500 hover:text-red-700 text-sm mt-1 flex items-center gap-1 ml-auto"
        >
          <ion-icon name="trash-outline"></ion-icon>
          Remove
        </button>
      </div>
    </div>
  );
}
