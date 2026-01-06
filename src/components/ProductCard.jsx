export default function ProductCard(props) {
    // Hide if category filter is active and doesn't match
    if (props.selectedCategory && props.selectedCategory !== "All" && props.category !== props.selectedCategory) {
        return null;
    }
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <img src={props.image} alt={props.name} className="w-full h-48 object-cover"/>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{props.name}</h3>
                    {props.category && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {props.category}
                        </span>
                    )}
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-4">{props.price}</p>
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all">
                    Buy Now
                </button>
            </div>
        </div>
    )
}