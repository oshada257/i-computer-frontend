export default function ProductCard({ 
  productId,
  name, 
  description,
  price, 
  labelledPrice,
  image, 
  category,
  brand,
  onBuyNow,
  onAddToCart,
  onClick
}) {

  const productImage = Array.isArray(image) ? image[0] : image;
  
  const imageUrl = productImage && productImage.startsWith('/images') 
    ? `http://localhost:3000${productImage}` 
    : productImage;

  const priceNum = typeof price === 'number' ? price : parseFloat(price) || 0;
  const labelledPriceNum = typeof labelledPrice === 'number' ? labelledPrice : parseFloat(labelledPrice) || 0;

  const discount = labelledPriceNum ? Math.round(((labelledPriceNum - priceNum) / labelledPriceNum) * 100) : 0;
  
  return (
    <div 
      onClick={() => onClick && onClick(productId)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full cursor-pointer border border-gray-100"
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-[#D10024] text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{discount}%
          </span>
        )}
        {category && (
          <span className="absolute top-2 left-2 bg-[#1e1e27] text-white px-2 py-1 rounded-md text-xs">
            {category}
          </span>
        )}
      </div>
      
      <div className="p-4 flex flex-col grow">
        <h3 className="text-lg font-semibold text-[#1e1e27] mb-1 h-14 line-clamp-2">
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
          <p className="text-2xl font-bold text-[#D10024]">
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
            className="flex-1 bg-[#1e1e27] text-white py-2 rounded-lg hover:bg-[#15161d] transition-all"
          >
            Add to Cart
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow && onBuyNow(productId);
            }}
            className="flex-1 bg-[#D10024] text-white py-2 rounded-lg hover:bg-[#a8001d] transition-all"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}