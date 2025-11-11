import './Fav.css';
import { Link } from 'react-router-dom';
import { useProductContext } from '../ProductContext';
import { useProfileContext } from '../Customer/ProfileContext';

function Fav() {
  const { fav, remove_fav, add_cart, globalmessage } = useProductContext();
  const { status } = useProfileContext();

  if (!status) return null;

  return (
    <>
      {globalmessage && <div className="message">{globalmessage}</div>}

      {fav.length > 0 ? fav.map((item) => (
        <div key={item._id || item.name} className="fav_item">
          <div className="fav_container">
            <img src={` https://furniture-management-system-3.onrender.com/${item.filename}`} alt={item.name} />
            <div className="item_des">
              <p className="item_title">{item.name}</p>
              <p className="item_price">{item.price}</p>
            </div>
          </div>
          <div className="btns">
            <Link to="/cart">
              <button onClick={() => add_cart(item)}>Add to Cart</button>
            </Link>
            <button onClick={() => remove_fav(item)}>Remove from Fav</button>
          </div>
        </div>
      )) : (
        <div className="empty-fav">
          <p>Add your Fav</p>
          <Link to="/">
            <button className="home_page">Back To Home</button>
          </Link>
        </div>
      )}
    </>
  );
}

export default Fav;
