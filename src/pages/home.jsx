import React, { useState, useEffect } from "react"
import ProductCard from "../components/ProductCard"
import OnSaleNow from "../components/onSaleNow"
import { useNavigate } from "react-router-dom"

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    
    const categories = ["All", "Laptops", "Desktops", "Peripherals", "Components", "Monitors", "Accessories"];

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header/Navbar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">E-Computer Store</h1>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-gray-600">Welcome, {user.firstName || user.fullName || user.email}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => navigate("/login")}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-5xl font-bold mb-4">Welcome to E-Computer Store</h2>
                    <p className="text-xl mb-8">Find the best deals on computers and electronics</p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all">
                        Shop Now
                    </button>
                </div>
            </div>

            {/* On Sale Now Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <OnSaleNow />
            </div>

            {/* Category Filter */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-wrap gap-3 justify-center">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${
                                selectedCategory === category
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Products */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                    {selectedCategory === "All" ? "Featured Products" : selectedCategory}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ProductCard
                        name="Gaming Laptop"
                        image="https://picsum.photos/id/0/400/300"
                        price="$1,299"
                        category="Laptops"
                        selectedCategory={selectedCategory}
                    />
                    <ProductCard
                        name="Wireless Mouse"
                        image="https://picsum.photos/id/3/400/300"
                        price="$49"
                        category="Peripherals"
                        selectedCategory={selectedCategory}
                    />
                    <ProductCard
                        name="Mechanical Keyboard"
                        image="https://picsum.photos/id/4/400/300"
                        price="$129"
                        category="Peripherals"
                        selectedCategory={selectedCategory}
                    />
                    <ProductCard
                        name="Monitor 27 inch"
                        image="https://picsum.photos/id/5/400/300"
                        price="$349"
                        category="Monitors"
                        selectedCategory={selectedCategory}
                    />
                    
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p>&copy; 2026 E-Computer Store. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}