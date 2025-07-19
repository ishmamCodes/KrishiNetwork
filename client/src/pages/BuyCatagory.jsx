import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Item from '../components/Item';
import { ShopContext } from '../context/ShopContext';
import SearchBar from '../components/SearchBar';

export const BuyCatagory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    let products = all_product.filter(item => props.catagory === item.category);

    if (searchQuery) {
      products = products.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    if (priceFilter.min !== '' && !isNaN(priceFilter.min)) {
      products = products.filter(item => Number(item.new_price) >= Number(priceFilter.min));
    }
    if (priceFilter.max !== '' && !isNaN(priceFilter.max)) {
      products = products.filter(item => Number(item.new_price) <= Number(priceFilter.max));
    }

    setFilteredProducts(products);
  }, [all_product, props.catagory, searchQuery, priceFilter]);

  const handlePriceFilter = (e) => {
    e.preventDefault();
    setPriceFilter({ min: minPrice, max: maxPrice });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Price Filter Section */}
        <form onSubmit={handlePriceFilter} className="flex flex-wrap items-center gap-4 mb-8 bg-gray-100 p-4 rounded-lg shadow-sm">
          <label className="text-gray-700 font-medium">Price Range:</label>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            placeholder="Min"
            className="px-3 py-2 border border-gray-300 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="text-gray-600 font-semibold">-</span>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="px-3 py-2 border border-gray-300 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
          >
            Apply
          </button>
        </form>

        {/* Search Info */}
        {searchQuery && (
          <p className="text-gray-500 text-sm mb-6">
            Showing results for: <span className="font-semibold">"{searchQuery}"</span>
          </p>
        )}

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((item, i) => (
            <div
              key={i}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition-all duration-200 p-4"
            >
              <Item
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            </div>
          ))}
        </div>

        {/* No Products Message */}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-12 text-lg">
            No products found matching your search criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default BuyCatagory;