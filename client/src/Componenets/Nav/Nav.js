import './Nav.css';
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { FaRegHeart, FaCartPlus } from "react-icons/fa";
import { useProfileContext } from '../operations/Customer/ProfileContext';
import { Link } from 'react-router-dom';

function Nav({ handleSearch, val }) {
  const [search, setSearch] = useState("");
  const [showLogin, setShowLogin] = useState(false); 
  const { status } = useProfileContext();

  const find = (search) => {
    handleSearch(search);
    setSearch("");
  };

  useEffect(() => {
    handleSearch(search);
  }, [search, handleSearch]);

  useEffect(() => {
    setShowLogin(status);
  }, [status]);

  return (
    <div className="nav-wrapper">
      <div>
        <h1>Logo</h1>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="search here"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="container">
          <button onClick={() => find(search)} ><CiSearch /></button>
        </div>
      </div>
      <div className="Navbuttons">
        <Link to={showLogin ? '/Customer' : '/Login'}>
          <button> <CgProfile className='hov' />  </button>
        </Link>
        
        {status ? (
          <>
            <Link to={'/fav'}> 
              <button> <FaRegHeart className='hov' /></button>
            </Link>
            <Link to={'/cart'}>
              <button><FaCartPlus /></button>
            </Link>
          </>
        ) : (
          <>
            <Link to={'/login'}> 
              <button> <FaRegHeart className='hov' /></button>
            </Link>
            <Link to={'/login'}>
              <button><FaCartPlus /></button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Nav;
