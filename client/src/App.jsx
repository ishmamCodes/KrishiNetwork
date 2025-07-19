import { Routes, Route, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Support from './pages/Support';
import LoginSignup from './pages/LoginSignup';
import Cart from './pages/Cart';
import Product from './pages/Product';
import BuyCatagory from './pages/BuyCatagory';
import AdminDashboard from './pages/AdminDashboard';
import { ShopContext } from './context/ShopContext';
import DescriptionEditor from './components/DescriptionBox';
import Orders from './components/order';
import UserDashboard from './pages/UserDashboard';
import ExpertDashboard from './components/ExpertDashboard';
import Blog from "./pages/Blog"; 
import Education from './pages/Education'; 
import ChatGPT from './components/ChatGPT';
import Messenger from './components/Messenger';
import Wishlist from './pages/Wishlist';



function App() {
  const { user } = useContext(ShopContext); // To manage user state
  const location = useLocation();

  // Routes where navbar should be hidden
  const hideNavbarRoutes = [
    '/dashboard/admin',
    '/dashboard/expert',
    '/seller'
  ];

  // Check if the current route should hide the navbar
  const shouldHideNavbar = hideNavbarRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Render Navbar conditionally based on route */}
      {!shouldHideNavbar && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<BuyCatagory catagory="buy" />} />
          <Route path="/sell" element={<BuyCatagory catagory="sell" />} />
          <Route path="/rent" element={<BuyCatagory catagory="rent" />} />
          <Route path="/support" element={<Support />} />
          <Route path="/" element={<Home />} />
          <Route path="/education" element={<Education />} />
          <Route path="/blog" element={<Blog />} /> {/* Add the Blog route */}
          <Route path="/ai" element={<ChatGPT />} />
          <Route path="/messenger" element={<Messenger />} />;

          {/* Wishlist Route */}
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Product Routes */}
          <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
          </Route>

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginSignup />} />

          {/* Orders  */}
          <Route path="/orders" element={<Orders />} />


          {/* Dashboard Routes */}
          <Route path="/dashboard/user" element={<UserDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/expert" element={<ExpertDashboard />} />
          
          {/* Admin product description editor */}
          <Route path="/dashboard/admin/products/:id/description" element={<DescriptionEditor />} />
        </Routes>
      </div>

      {/* Footer is hidden on dashboard routes */}
      {!shouldHideNavbar && <Footer />}
    </div>
  );
}

export default App;
