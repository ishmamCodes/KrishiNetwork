import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Item = (props) => {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useContext(ShopContext);
  const wishlisted = isWishlisted(props.id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (wishlisted) {
      removeFromWishlist(props.id);
    } else {
      addToWishlist(props.id);
    }
  };

  return (
    <div className="w-full transform transition-transform duration-300 hover:scale-105 relative bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Wishlist Heart Icon */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 z-10 text-2xl focus:outline-none"
        title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {wishlisted ? '❤️' : '🤍'}
      </button>

      <Link to={`/product/${props.id}`} onClick={() => window.scrollTo(0, 0)}>
        <img
          src={props.image}
          alt={props.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <p className="text-gray-800 font-semibold text-base mb-1">{props.name}</p>
          <div className="flex gap-4 items-center">
            <div className="text-green-600 font-bold text-lg">${props.new_price}</div>
            <div className="text-gray-400 line-through text-sm">${props.old_price}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Item;