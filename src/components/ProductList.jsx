export default function ProductList({ 
  products, 
  filteredProducts, 
  searchQuery, 
  onSearch, 
  onEdit, 
  onDelete 
}) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Products ({filteredProducts.length})
        </h2>
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 w-64"
          />
          {searchQuery && (
            <button
              onClick={() => onSearch("")}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Image
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Product ID
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Price
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Category
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Brand
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Visible
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id || product.productId} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <img
                    src={product.image && product.image[0] ? 
                      (product.image[0].startsWith('/images') ? `http://localhost:3000${product.image[0]}` : product.image[0]) 
                      : '/images/default-product.png'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-4 text-sm">{product.productId}</td>
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">
                  Rs.{product.price}
                  {product.labelledPrice && (
                    <span className="text-gray-400 line-through ml-2 text-sm">
                      Rs.{product.labelledPrice}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">{product.category}</td>
                <td className="py-3 px-4">{product.brand}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    product.isVisible ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.productId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && searchQuery && (
          <div className="text-center py-8 text-gray-500">
            No products found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}