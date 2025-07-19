import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Item from '../components/Item';

const Wishlist = () => {
  const { all_product, wishlist } = useContext(ShopContext);
  const wishlistedProducts = all_product.filter(product => wishlist.includes(product.id));

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-pink-700 mb-6">My Wishlist</h1>
        {wishlistedProducts.length === 0 ? (
          <p className="text-gray-600">You have no products in your wishlist.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlistedProducts.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 