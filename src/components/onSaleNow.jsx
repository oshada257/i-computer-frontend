import ProductCard from "./ProductCard";

export default function OnSaleNow() {
    return (
        <div className="bg-red-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-red-600 mb-6">🔥 On Sale Now!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCard
                    name="Laptop Pro"
                    image="https://picsum.photos/id/1/400/300"
                    price="$999"
                />
                
                <ProductCard
                    name="iPhone 15"
                    image="https://picsum.photos/id/2/400/300"
                    price="$799"
                />

                <ProductCard
                    name="Smart Watch"
                    image="https://picsum.photos/id/6/400/300"
                    price="$299"
                />
            </div>
        </div>
    )
}