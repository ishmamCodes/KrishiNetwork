import React, { useContext } from 'react'; 
import { ShopContext } from '../context/ShopContext';

const ProductDisplay = ({ product }) => {
  // Ensure the product exists before accessing its properties
  if (!product) {
    return <div>Product not available.</div>; // Fallback UI if product is not available
  }

  const { addToCart } = useContext(ShopContext);

  return (
    <div className="flex flex-wrap gap-8 max-w-6xl mx-auto my-10 p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Left section */}
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex gap-3 justify-center">
          {[1, 2, 3, 4].map((_, idx) => (
            <img
              key={idx}
              src={product.image || 'fallback-image-url'} // Ensure a fallback image is used
              alt={`Thumbnail ${idx + 1}`}
              className="w-16 h-16 object-cover rounded-md cursor-pointer hover:scale-110 transition-transform shadow-sm"
            />
          ))}
        </div>
        <div>
          <img
            src={product.image || 'fallback-image-url'} // Ensure a fallback image is used
            alt="Main product"
            className="w-full max-h-[400px] object-cover rounded-lg shadow"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex flex-col gap-6 flex-1">
        <h1 className="text-3xl font-semibold text-gray-800">{product.name || 'Product Name'}</h1>

        <div className="flex items-center gap-4">
          <div className="text-xl text-gray-400 line-through">${product.old_price || 0}</div>
          <div className="text-2xl font-bold text-red-600">${product.new_price || 0}</div>
        </div>

        <p className="text-gray-600 text-base leading-relaxed">
          {product.description || 'Description not available.'}
        </p>

        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">Select Size</h2>
          {/* Add size options here if needed */}
        </div>

        <button
          onClick={() => addToCart(product.id)}
          className="w-fit px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ProductDisplay;
