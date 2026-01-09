import { useNavigate } from "react-router-dom";

export default function QuickActions({ onAddProduct }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={onAddProduct}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all"
        >
          Add Product
        </button>
        <button 
          onClick={() => navigate('/admin/orders')}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all"
        >
          View Orders
        </button>
      </div>
    </div>
  );
}