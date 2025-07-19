import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const CartItems = () => {
  const {
    all_product,
    cartItems,
    updateCartItemQuantity,
    removeFromCart,
    getTotalCartAmount,
    user,
    setCartItems,
  } = useContext(ShopContext);

  const [address, setAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  // Function to reset the cart after an order
  const getDefaultCart = () => {
    return Object.fromEntries(Object.keys(cartItems).map(id => [id, 0]));
  };

  const handlePlaceOrder = async () => {
    if (!user || !user._id) {
      alert("Please login to place an order");
      return;
    }

    if (!address.trim() || address.length < 5) {
      alert("Please enter a valid delivery address.");
      return;
    }

    if (Object.values(cartItems).every(quantity => quantity === 0)) {
      alert("Your cart is empty. Please add items before placing an order.");
      return;
    }

    const items = Object.keys(cartItems)
      .filter((id) => cartItems[id] > 0)
      .map((id) => ({
        product: id,
        quantity: cartItems[id],
      }));

    if (items.length === 0) {
      alert("No valid items in the cart.");
      return;
    }

    const orderData = {
      userId: user._id,
      address,
      items,
      amount: getTotalCartAmount(),
      paymentType: "COD",
      isPaid: false,
    };

    try {
      setIsPlacingOrder(true);

      const res = await fetch("http://localhost:4000/orders/cod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        console.error("Order failed:", res.status, res.statusText);
        alert("Failed to place order");
        return;
      }

      const data = await res.json();
      console.log("Order response:", data);

      if (data.success) {
        alert("Order placed successfully!");
        setCartItems(getDefaultCart());
        navigate("/orders");
      } else {
        console.error("Error placing order:", data.message);
        alert("Failed to place order");
      }
    } catch (err) {
      console.error("Order error:", err);
      alert(`Something went wrong: ${err.message || "Please try again later."}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-5 p-8 bg-gray-100 rounded-lg shadow-md font-['Roboto']">
      <div className="grid grid-cols-6 gap-2 pb-2 text-center font-bold text-gray-800 border-b-2 border-gray-200">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>

      {all_product.map((product) => {
        if (cartItems[product.id] > 0) {
          return (
            <div key={product.id} className="grid grid-cols-6 gap-2 items-center my-4 p-4 bg-white rounded-md shadow-sm hover:shadow-md transition">
              <img src={product.image} alt="Product" className="w-14 h-14 rounded-md object-cover" />
              <p>{product.name}</p>
              <p>${product.new_price}</p>
              <input
                type="number"
                min="1"
                value={cartItems[product.id]}
                onChange={(e) => updateCartItemQuantity(product.id, parseInt(e.target.value) || 1)}
                className="w-14 p-1 text-center border border-gray-300 rounded-md"
              />
              <p>${product.new_price * cartItems[product.id]}</p>
              <button onClick={() => removeFromCart(product.id)} className="text-red-600 font-bold hover:text-red-700 transition">
                Remove
              </button>
            </div>
          );
        }
        return null;
      })}

      <div className="mt-10">
        <h1 className="text-xl font-bold mb-4">Cart Totals</h1>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="flex justify-between">
            <p>Shipping Fee</p>
            <p>Free</p>
          </div>
          <hr />
          <div className="flex justify-between font-semibold text-lg">
            <h3>Total</h3>
            <h3>${getTotalCartAmount()}</h3>
          </div>

          <div className="mt-6">
            <textarea
              placeholder="Enter delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={3}
            />
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className={`mt-4 w-full py-2 text-white font-semibold rounded transition ${isPlacingOrder ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
            >
              {isPlacingOrder ? "Placing Order..." : "Place order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
