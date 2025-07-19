import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("farmer");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    specialization: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:4000";
  const { setUser, setIsSeller } = useContext(ShopContext);

  // when changing role, force login mode for seller/expert
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setFieldErrors({}); // Clear any field errors when role changes
    if (newRole !== "farmer") {
      setIsSignup(false);
      setFormData((f) => ({ ...f, name: "", specialization: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.phone) errors.phone = "Phone number is required";
    if (isSignup && role === "farmer" && !formData.name) errors.name = "Name is required";
    if (!formData.password) errors.password = "Password is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);

    try {
      let endpoint, body, userType;

      if (role === "farmer") {
        endpoint = isSignup ? "/users/signup" : "/users/login";
        body = {
          phone: formData.phone,
          password: formData.password,
          ...(isSignup ? { name: formData.name } : {}),
        };
        userType = "user";
      } else if (role === "seller") {
        endpoint = "/sellers/login";
        body = { phone: formData.phone, password: formData.password };
        userType = "seller";
      } else {
        endpoint = "/expert/login";
        body = { phone: formData.phone, password: formData.password };
        userType = "expert";
      }

      const res = await fetch(API_BASE_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "An error occurred, please try again later");
      }

      // Normalize ID
      const userData = data.user || data.seller || data.expert;
      const normalized = {
        ...userData,
        id: userData._id,
        role: userType,
      };

      // Persist
      localStorage.setItem("loggedInUser", JSON.stringify(normalized));
      if (data.token) localStorage.setItem("token", data.token);

      // Update context
      setUser(normalized);
      setIsSeller(userType === "seller");

      const paths = {
        user: "/dashboard/user",
        seller: "/dashboard/admin",
        expert: "/dashboard/expert",
      };
      navigate(paths[userType]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6 text-green-800">
          {isSignup ? "Sign Up" : "Login"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <select
            value={role}
            onChange={handleRoleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="farmer">Farmer</option>
            <option value="seller">Admin (Seller)</option>
            <option value="expert">Expert</option>
          </select>

          {isSignup && role === "farmer" && (
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          )}
          {fieldErrors.name && <p className="text-red-600 text-sm">{fieldErrors.name}</p>}

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {fieldErrors.phone && <p className="text-red-600 text-sm">{fieldErrors.phone}</p>}

          {(!isSignup || role === "farmer") && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          )}
          {fieldErrors.password && <p className="text-red-600 text-sm">{fieldErrors.password}</p>}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-green-700 text-white py-3 rounded hover:bg-green-800 transition"
          >
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {role === "farmer" && (
          <p className="mt-4 text-sm">
            {isSignup ? "Already have an account?" : "New here?"}{" "}
            <span
              onClick={() => setIsSignup(f => !f)}
              className="text-green-700 font-bold cursor-pointer hover:underline"
            >
              {isSignup ? "Login Here" : "Sign Up Here"}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
