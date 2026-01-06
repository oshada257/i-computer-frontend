import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in and is admin
        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== "admin") {
            navigate("/");
            return;
        }

        setUser(parsedUser);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user.firstName} {user.lastName}</span>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">1,234</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">567</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-gray-500 text-sm font-medium">Products</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">89</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">$45,678</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all">
                            Add Product
                        </button>
                        <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all">
                            View Orders
                        </button>
                        <button className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all">
                            Manage Users
                        </button>
                        <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all">
                            Manage Categories
                        </button>
                    </div>
                </div>

                {/* Categories Management */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Product Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {["Laptops", "Desktops", "Peripherals", "Components", "Monitors", "Accessories"].map((category) => (
                            <div key={category} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-all">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">{category}</span>
                                    <button className="text-blue-500 hover:text-blue-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all">
                        + Add New Category
                    </button>
                </div>
            </div>
        </div>
    )
}