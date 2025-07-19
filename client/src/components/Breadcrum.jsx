import React from 'react';
import arrow_icon from '../Assets/breadcrum_arrow.png';

const Breadcrum = ({ product }) => {
  // Safely handle missing product or category
  if (!product) {
    return (
      <div className="text-sm flex items-center gap-1 px-4 py-2 text-gray-700">
        <span>HOME</span>
      </div>
    );
  }

  return (
    <div className="text-sm flex items-center gap-1 px-4 py-2 text-gray-700">
      <span>HOME</span>
      <img src={arrow_icon} alt="arrow" className="w-5 h-auto mx-1" />
      <span>{product.category || 'Category'}</span>
      <img src={arrow_icon} alt="arrow" className="w-5 h-auto mx-1" />
      <span>{product.name || 'Product'}</span>
    </div>
  );
};

export default Breadcrum;