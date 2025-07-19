import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const API_BASE_URL = "http://localhost:4000";

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${API_BASE_URL}/orders/user/${encodeURIComponent(user.id)}`
        );

        if (res.status === 404) {
          if (isActive) {
            setOrders([]);
            setError("");
            setLoading(false);
          }
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        const arr = Array.isArray(data.orders) ? data.orders : [];
        if (isActive) {
          setOrders(arr);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => {
      isActive = false;
    };
  }, [user, navigate]);

  if (loading) {
    return <p className="mt-4 text-gray-600 text-center">Loading orders…</p>;
  }
  if (error) {
    return <p className="mt-4 text-red-600 text-center">Error: {error}</p>;
  }
  if (orders.length === 0) {
    return <p className="mt-4 text-gray-600 text-center">No orders found.</p>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-green-800">My Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="p-6 bg-white shadow rounded-md space-y-3">
          <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
          <p><strong>Address:</strong> {order.address ? order.address : "—"}</p>
          <p><strong>Payment:</strong> {order.paymentType}</p>
          <p><strong>Total Amount:</strong> ${order.amount.toFixed(2)}</p>
          <h3 className="font-semibold mt-4">Items:</h3>
          <ul className="list-disc ml-6">
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.product} (Qty: {item.quantity})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Orders;
