import React from 'react';
import CartItems from '../components/CartItems';

const Cart = () => {
  return (
    <div className="max-w-6xl mx-auto my-5 p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Cart</h1>
      <CartItems />
    </div>
  );
};

export default Cart;
