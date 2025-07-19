import React, { useState, useEffect } from 'react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/orders/all');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        console.log("Orders Data: ", data.orders); // helpful for debugging
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleMarkAsDelivered = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:4000/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'delivered' }),
      });

      if (!res.ok) throw new Error('Failed to update order status');

      const data = await res.json();

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: data.order.status } : order
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg font-semibold text-gray-600">Loading orders...</div>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Order List</h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-6 text-left font-semibold">Order ID</th>
              <th className="py-4 px-6 text-left font-semibold">User ID</th>
              <th className="py-4 px-6 text-left font-semibold">Items</th>
              <th className="py-4 px-6 text-left font-semibold">Amount</th>
              <th className="py-4 px-6 text-left font-semibold">Status</th>
              <th className="py-4 px-6 text-left font-semibold">Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className={`border-t hover:bg-gray-50 transition duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="py-4 px-6 font-mono text-sm text-gray-900">{order._id.slice(-6)}</td>
                
                {/* FIXED: Handle userId being an object */}
                <td className="py-4 px-6">
                  {typeof order.userId === 'object'
                    ? order.userId._id || '[Unknown]'
                    : order.userId}
                </td>

                {/* FIXED: Defensive rendering for items */}
                <td className="py-4 px-6 space-y-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="text-gray-800">
                      {item.product?.name || item.product || '[Unknown Product]'}{' '}
                      <span className="text-gray-500">(Qty: {item.quantity})</span>
                    </div>
                  ))}
                </td>

                <td className="py-4 px-6 font-semibold text-green-700">${order.amount}</td>

                <td className="py-4 px-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'delivered' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>

                  {['Order Placed', 'shipped'].includes(order.status) && (
                    <button
                      onClick={() => handleMarkAsDelivered(order._id)}
                      className="ml-3 px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </td>

                {/* FIXED: Handle address as object or string */}
                <td className="py-4 px-6 whitespace-pre-wrap text-gray-700">
                  {typeof order.address === 'object'
                    ? JSON.stringify(order.address)
                    : order.address || '[No Address]'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;