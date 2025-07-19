import React, { useState, useContext, useEffect } from 'react';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const {
    getTotalCartItems,
    getTotalWishlistItems,
    user,
    setUser,
    setIsSeller,
    setIsExpert,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState('Home');

  const menuItems = [
    'Home',
    'Buy',
    'Sell',
    'Rent',
    'Support',
    'Blog',
    'Education',
    'AI',
    'Messenger',
  ];

  useEffect(() => {
    const currentPath = location.pathname === '/' ? 'Home' : location.pathname.split('/')[1];
    const capitalized = currentPath.charAt(0).toUpperCase() + currentPath.slice(1).toLowerCase();
    if (menuItems.includes(capitalized) || capitalized === 'Orders') {
      setMenu(capitalized);
    } else {
      setMenu('Home');
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('isSeller');
    localStorage.removeItem('isExpert');
    setUser(null);
    setIsSeller(false);
    setIsExpert(false);
    navigate('/');
    setMenu('Home');
    window.location.reload();
  };

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white shadow-md flex-wrap">
      {/* Logo */}
      <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
        <img src={logo} alt="Krishi Network Logo" className="h-12 w-auto" />
        <p>Krishi Network</p>
      </div>

      {/* Menu Items */}
      <ul className="flex gap-5 text-sm font-bold text-green-600 md:text-base flex-wrap">
        {menuItems.map((item) => {
          const path = item.toLowerCase();
          const linkPath = path === 'home' ? '/' : `/${path}`;
          return (
            <li key={item}>
              <Link
                to={linkPath}
                onClick={() => setMenu(item)}
                className={`hover:text-green-600 ${
                  menu === item ? 'border-b-2 border-green-600' : ''
                }`}
              >
                {item}
              </Link>
            </li>
          );
        })}
        {user && (
          <li>
            <Link
              to="/orders"
              onClick={() => setMenu('Orders')}
              className={`hover:text-green-600 ${
                menu === 'Orders' ? 'border-b-2 border-green-600' : ''
              }`}
            >
              My Orders
            </Link>
          </li>
        )}
      </ul>

      {/* Icons and Auth Buttons */}
      <div className="flex items-center gap-4 mt-3 sm:mt-0">
        {/* Wishlist */}
        <Link to="/wishlist" className="relative text-2xl">
          ❤️
          {getTotalWishlistItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {getTotalWishlistItems()}
            </span>
          )}
        </Link>

        {/* Cart */}
        <div className="relative">
          <Link to="/cart">
            <img src={cart_icon} alt="Cart Icon" className="h-7 w-auto" />
          </Link>
          {getTotalCartItems() > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full flex items-center justify-center shadow-md">
              {getTotalCartItems()}
            </div>
          )}
        </div>

        {/* Auth Buttons */}
        {user ? (
          <button
            className="px-4 py-1 text-sm font-bold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="px-4 py-1 text-sm font-bold text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;