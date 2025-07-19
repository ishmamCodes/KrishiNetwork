import React, { useState, useEffect } from 'react';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    old_price: '',
    new_price: '',
    category: 'buy',
    available: true
  });
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [listError, setListError] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/products/all')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => setListError(err.message));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Store Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
  
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("old_price", product.old_price);
    formData.append("new_price", product.new_price);
    formData.append("category", product.category);
    formData.append("available", product.available);
    formData.append("file", document.getElementById("fileInput").files[0]); // send file
  
    try {
      const response = await fetch('http://localhost:4000/products/add', {
        method: 'POST',
        body: formData, // Don't set Content-Type manually
      });
  
      if (!response.ok) throw new Error('Failed to add product');
      const data = await response.json();
      setMessage('✅ Product added successfully!');
  
      // Reset
      setProduct({
        name: '',
        old_price: '',
        new_price: '',
        category: 'buy',
        available: true
      });
      document.getElementById('fileInput').value = '';
  
      // Refresh products
      const refreshResponse = await fetch('http://localhost:4000/products/all');
      const refreshedProducts = await refreshResponse.json();
      setProducts(refreshedProducts);
  
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <input 
          type="text" 
          name="name" 
          value={product.name} 
          onChange={handleChange} 
          placeholder="Product Name" 
          required 
          className="w-full p-2 border rounded" 
        />
        <input 
          type="number" 
          name="old_price" 
          value={product.old_price} 
          onChange={handleChange} 
          placeholder="Old Price" 
          required 
          className="w-full p-2 border rounded" 
        />
        <input 
          type="number" 
          name="new_price" 
          value={product.new_price} 
          onChange={handleChange} 
          placeholder="New Price" 
          required 
          className="w-full p-2 border rounded" 
        />
        <select 
          name="category" 
          value={product.category} 
          onChange={handleChange} 
          required 
          className="w-full p-2 border rounded"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
          <option value="rent">Rent</option>
        </select>
        <input 
          id="fileInput"
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          required 
          className="w-full p-2 border rounded" 
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="bg-green-600 text-white py-2 px-4 rounded"
        >
          {loading ? 'Adding…' : 'Add Product'}
        </button>
        {message && <p className="text-green-700 font-medium">{message}</p>}
      </form>

      <h2 className="text-xl font-semibold mt-10">All Products</h2>
      {listError && <p className="text-red-500">{listError}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(prod => (
          <div key={prod._id} className="border p-4 rounded shadow bg-white">
            <img
              src={prod.image}
              alt={prod.name}
              className="h-40 object-cover w-full rounded mb-2"
            />
            <h3 className="font-semibold">{prod.name}</h3>
            <p className="line-through text-gray-500">${prod.old_price}</p>
            <p className="text-red-600 font-bold">${prod.new_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddProduct;