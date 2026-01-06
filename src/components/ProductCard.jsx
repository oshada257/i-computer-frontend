export default function ProductCard(props) {
    
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <img src={props.image} alt={props.name} className="w-full h-48 object-cover"/>
        <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{props.name}</h3>
            <p className="text-2xl font-bold text-blue-600 mb-4">{props.price}</p>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all">
                Buy Now
            </button>
        </div>
    </div>
  )
}