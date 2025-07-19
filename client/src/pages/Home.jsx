import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Home = () => {
  const { user } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role) {
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'expert':
          navigate('/dashboard/expert');
          break;
        case 'seller': // Handle seller role
          navigate('/dashboard/admin');
          break;
        case 'user':
        default:
          navigate('/dashboard/user');
          break;
      }
    } else {
      // If not logged in, maybe show a landing page or go to login
      navigate('/login');
    }
  }, [user, navigate]);

  return <div className="text-center mt-10">Redirecting to dashboard...</div>;
};

export default Home;