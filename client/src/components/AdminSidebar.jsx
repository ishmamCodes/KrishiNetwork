import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-[#223142] text-white p-4 space-y-6 lg:w-64 w-full">
      <h2 className="text-2xl font-bold text-white mb-8">Admin Dashboard</h2>

      {/* Add Product Link */}
      <NavLink
        to="/dashboard/admin/add-product"
        className="block hover:underline py-2 px-4 rounded-lg hover:bg-[#1d2c3f]"
        activeClassName="bg-[#1d2c3f]"
      >
        🛒 Add Product
      </NavLink>

      {/* Product List Link */}
      <NavLink
        to="/dashboard/admin/product-list"
        className="block hover:underline py-2 px-4 rounded-lg hover:bg-[#1d2c3f]"
        activeClassName="bg-[#1d2c3f]"
      >
        📁 Product List
      </NavLink>

      {/* Order List Link */}
      <NavLink
        to="/dashboard/admin/order-list"
        className="block hover:underline py-2 px-4 rounded-lg hover:bg-[#1d2c3f]"
        activeClassName="bg-[#1d2c3f]"
      >
        🛒 Order List
      </NavLink>

      {/* Add Expert Link */}
      <NavLink
        to="/dashboard/admin/add-expert"
        className="block hover:underline py-2 px-4 rounded-lg hover:bg-[#1d2c3f]"
        activeClassName="bg-[#1d2c3f]"
      >
        📁 Add Expert
      </NavLink>

      {/* Expert List Link */}
      <NavLink
        to="/dashboard/admin/expert-list"
        className="block hover:underline py-2 px-4 rounded-lg hover:bg-[#1d2c3f]"
        activeClassName="bg-[#1d2c3f]"
      >
        👨‍⚕️ Expert List
      </NavLink>
    </div>
  );
};

export default AdminSidebar;