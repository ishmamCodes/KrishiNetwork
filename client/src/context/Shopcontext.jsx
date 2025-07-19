import React, { createContext, useState, useEffect } from "react";

// Create the ShopContext and export it
export const ShopContext = createContext(null);

// Helper function to initialize the default cart
const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index <= 300; index++) {
    cart[index] = 0;
  }
  return cart;
};

// The ShopContextProvider component provides the context for the entire app
export const ShopContextProvider = ({ children }) => {
  const [all_product, setAllProducts] = useState([]); // List of all products
  const [cartItems, setCartItems] = useState(getDefaultCart()); // Cart items state
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("loggedInUser")) || null); // Current logged-in user
  const [isSeller, setIsSeller] = useState(JSON.parse(localStorage.getItem("isSeller")) || false); // Seller status
  const [isExpert, setIsExpert] = useState(JSON.parse(localStorage.getItem("isExpert")) || false); // Expert status

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  // Fetch all products from the backend when the component mounts
  useEffect(() => {
    fetch("http://localhost:4000/products/all")
      .then((response) => response.json())
      .then((data) => setAllProducts(data))
      .catch((error) => console.error("Failed to fetch products:", error));
  }, []);

  // Store user and roles in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      const role = user.role;
      localStorage.setItem("isSeller", JSON.stringify(role === "seller"));
      localStorage.setItem("isExpert", JSON.stringify(role === "expert"));
    } else {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("isSeller");
      localStorage.removeItem("isExpert");
    }
  }, [user]);

  // Persist wishlist in localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Add an item to the cart
  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] + 1,
    }));
  };

  // Remove an item from the cart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] > 0 ? prev[itemId] - 1 : 0,
    }));
  };

  // Update the quantity of an item in the cart
  const updateCartItemQuantity = (itemId, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Number(quantity),
    }));
  };

  // Get the total amount of the cart based on item prices and quantities
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // Get the total number of items in the cart
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((total, qty) => total + qty, 0);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isSeller");
    localStorage.removeItem("isExpert");
    setUser(null);
    setIsSeller(false);
    setIsExpert(false);
  };

  // Add to wishlist
  const addToWishlist = (itemId) => {
    setWishlist((prev) => prev.includes(itemId) ? prev : [...prev, itemId]);
  };

  // Remove from wishlist
  const removeFromWishlist = (itemId) => {
    setWishlist((prev) => prev.filter((id) => id !== itemId));
  };

  // Check if item is wishlisted
  const isWishlisted = (itemId) => wishlist.includes(itemId);

  // Get total wishlist items
  const getTotalWishlistItems = () => wishlist.length;

  // Provide the context to child components
  return (
    <ShopContext.Provider
      value={{
        all_product,
        cartItems,
        setCartItems,
        getTotalCartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        getTotalCartAmount,
        isSeller,
        setIsSeller,
        isExpert,
        setIsExpert,
        user,
        setUser,
        handleLogout,
        // Wishlist
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        getTotalWishlistItems,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
