export default function ProductCard({ 
  productId,
  name, 
  description,
  price, 
  labelledPrice,
  image, 
  category,
  brand,
  model,
  onBuyNow,
  onAddToCart,
  onClick
}) {
  // Get the first image from the array or use default
  const productImage = Array.isArray(image) ? image[0] : image;
  
  // Construct full image URL if it's a relative path
  const imageUrl = productImage && productImage.startsWith('/images') 
    ? `http://localhost:3000${productImage}` 
    : productImage;
  
  // Ensure price is a number
  const priceNum = typeof price === 'number' ? price : parseFloat(price) || 0;
  const labelledPriceNum = typeof labelledPrice === 'number' ? labelledPrice : parseFloat(labelledPrice) || 0;
  
  // Calculate discount percentage if labelledPrice exists
  const discount = labelledPriceNum ? Math.round(((labelledPriceNum - priceNum) / labelledPriceNum) * 100) : 0;
  
  return (
    <div 
      onClick={() => onClick && onClick(productId)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full cursor-pointer"
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{discount}%
          </span>
        )}
        {category && (
          <span className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded-md text-xs">
            {category}
          </span>
        )}
      </div>
      
      <div className="p-4 flex flex-col grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 h-14 line-clamp-2">
          {name}
        </h3>
        
        <div className="h-6 mb-2">
          {brand && brand !== "generic" && (
            <p className="text-sm text-gray-500">{brand}</p>
          )}
        </div>
        
        <div className="h-10 mb-3">
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-4 mt-auto">
          <p className="text-2xl font-bold text-blue-600">
            Rs.{priceNum.toFixed(2)}
          </p>
          {labelledPriceNum && labelledPriceNum > priceNum && (
            <p className="text-sm text-gray-400 line-through">
              Rs.{labelledPriceNum.toFixed(2)}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart && onAddToCart(productId);
            }}
            className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-all border border-gray-300"
          >
            Add to Cart
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow && onBuyNow(productId);
            }}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}