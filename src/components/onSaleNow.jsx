import ProductCard from "./ProductCard";

export default function OnSaleNow() {
    return (
      <div className="bg-red-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-red-600 mb-6">
          🔥 On Sale Now!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            name="Laptop Pro"
            image="https://picsum.photos/id/1/400/300"
            price="$999"
          />

          <ProductCard
            name="iPhone 15"
            image="https://images.unsplash.com/photo-1688649593308-40dfbb552d00?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGlwaG9uZSUyMDE1fGVufDB8fDB8fHww"
            price="$799"
          />

          <ProductCard
            name="Smart Watch"
            image="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D"
            price="$299"
          />
        </div>
      </div>
    );
}