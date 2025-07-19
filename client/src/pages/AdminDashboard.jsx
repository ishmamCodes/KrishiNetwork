import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProduct from '../components/AddProduct';
import OrderList from '../components/OrderList';
import AddExpert from '../components/AddExpert';
import DescriptionEditor from '../components/DescriptionBox';
import { Link } from 'react-router-dom';
import ExpertList from '../components/ExpertList';
const AdminDashboard = () => {
  const admin = JSON.parse(localStorage.getItem('loggedInUser'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [editingId, setEditingId]   = useState(null);
  const [draftDesc, setDraftDesc]   = useState('');
  const [savingId, setSavingId]     = useState(null);

  // Load products whenever we hit the productList tab
  useEffect(() => {
    if (activeTab !== 'productList') return;
    setLoading(true);
    fetch('http://localhost:4000/products/all')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setError('');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeTab]);

  // Remove a product
  const handleRemove = async (id) => {
    try {
      const res = await fetch('http://localhost:4000/products/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to remove product');
      setProducts(ps => ps.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Start editing description
  const startEdit = (id, currentDesc) => {
    setEditingId(id);
    setDraftDesc(currentDesc || '');
  };
  const cancelEdit = () => {
    setEditingId(null);
    setDraftDesc('');
  };

  // Save edited description
  const saveDesc = async (id) => {
    setSavingId(id);
    try {
      const res = await fetch(
        `http://localhost:4000/products/${id}/description`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: draftDesc }),
        }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || 'Save failed');

      setProducts(ps =>
        ps.map(p =>
          p.id === id ? { ...p, description: body.product.description } : p
        )
      );
      cancelEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    navigate('/login');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">Krishi Network</h1>
        {['dashboard','addProduct','productList','orderList','addExpert','expertList'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left p-2 mb-2 rounded ${
              activeTab === tab ? 'bg-green-700' : 'hover:bg-green-700'
            }`}
          >
            {{
              dashboard:   'Dashboard',
              addProduct:  'Add Product',
              productList: 'Product List',
              orderList:   'Order List',
              addExpert:   'Add Expert',
              expertList:   'Expert List',
            }[tab]}
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="mt-auto p-2 text-left hover:bg-green-700 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-bold text-green-800 mb-6">
              Admin Dashboard
            </h1>
            {admin ? (
              <div className="bg-white p-6 rounded shadow space-y-4">
                <p>
                  <strong>Name:</strong> {admin.name}
                </p>
                <p>
                  <strong>Phone:</strong> {admin.phone}
                </p>
                <p>
                  <strong>Role:</strong> Admin
                </p>
              </div>
            ) : (
              <p>Loading admin info...</p>
            )}
          </div>
        )}

        {activeTab === 'addProduct' && <AddProduct />}
        {activeTab === 'orderList' && <OrderList />}
        {activeTab === 'addExpert' && <AddExpert />}
        {activeTab === 'descriptionEditor' && <DescriptionEditor/>}
        {activeTab === 'expertList' && <ExpertList />}
        {activeTab === 'productList' && (
          <div>
            <h1 className="text-2xl font-bold text-green-800 mb-6">
              Product List
            </h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <div className="bg-white rounded shadow overflow-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Old Price</th>
                    <th className="py-3 px-4">New Price</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => {
                    const isEditing = editingId === product.id;
                    return (
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
                        <td className="py-3 px-4 w-1/4">
                          {isEditing ? (
                            <textarea
                              value={draftDesc}
                              onChange={e => setDraftDesc(e.target.value)}
                              rows={2}
                              className="w-full p-1 border rounded"
                            />
                          ) : (
                            <div className="truncate">
                              {product.description || '—'}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveDesc(product.id)}
                                disabled={savingId === product.id}
                                className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                {savingId === product.id ? 'Saving…' : 'Save'}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  startEdit(product.id, product.description)
                                }
                                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleRemove(product.id)}
                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Remove
                              </button>
                              {/* <Link to={`/dashboard/admin/products/${product.id}/description`}>
                                <button
                                  className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                  Description
                                </button>
                              </Link> */}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;