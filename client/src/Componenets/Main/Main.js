import { FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import './Main.css';
import { useProductContext } from '../operations/ProductContext';
import { useState } from "react";
import { Link } from "react-router-dom";

function Main({ product }) {
  const { add_fav, remove_fav, isFav, add_cart, globalmessage } = useProductContext();
  const [message, setShowMessage] = useState(false);


  if (!product || !product.title) {
    return null;
  }

  const favourite = isFav(product);

const handleCart =  async (product) => {
  try {
    await add_cart(product);  
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  } catch (err) {
    console.error("Error adding to cart", err);
  }
};


  const handleFav = () => {
    if (favourite) remove_fav(product);
    else add_fav(product);
  };

  return (
    <div className="products">
      <div className="cart-successfully-added">
        {message ? globalmessage : ""}
      </div>

      <img src={`${product.image}`} alt={product.title} />

      <button className="cart" onClick={()=>handleCart(product)}>
        <MdOutlineShoppingCartCheckout />
      </button>

      <button className={favourite ? 'toggle' : 'like-btn'} onClick={handleFav}>
        <FaRegHeart />
      </button>

      <div className="product-info">
        <p className="Title">{product.title}</p>
        <h1 className="price">{product.price}</h1>
      </div>
    </div>
  );
}

export default Main;
