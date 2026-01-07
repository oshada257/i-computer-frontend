export default function AdminStats({ products }) {
  const visibleProducts = products.filter(p => p.isVisible).length;
  const hiddenProducts = products.filter(p => !p.isVisible).length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{products.length}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">Visible Products</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{visibleProducts}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">Hidden Products</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{hiddenProducts}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">Categories</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">
          {new Set(products.map(p => p.category)).size}
        </p>
      </div>
    </div>
  );
}