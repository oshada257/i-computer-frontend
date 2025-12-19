export default function ProductCard(props) {
    
  return (
    <div>
        <h2>{props.name}</h2>
        <img src={props.image}/>
        <p>{props.price}</p>
        <button>Buy Now</button>
    </div>
  )
}