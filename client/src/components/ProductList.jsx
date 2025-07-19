import React, { useState, useEffect } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res  = await fetch('http://localhost:4000/products/all');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleRemove = async (id) => {
    try {
      const res = await fetch('http://localhost:4000/products/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to remove product');
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        All Products List
      </h1>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Product Title</th>
              <th className="py-3 px-4 text-left">Old Price</th>
              <th className="py-3 px-4 text-left">New Price</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t">
                <td className="py-3 px-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">${product.old_price}</td>
                <td className="py-3 px-4">${product.new_price}</td>
                <td className="py-3 px-4 capitalize">
                  {product.category}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
