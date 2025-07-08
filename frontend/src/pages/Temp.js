import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Temp() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (!user) navigate('/login');
    setLoggedInUser(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleError('Unauthorized: Please login');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('https://fullstack-login-system.vercel.app/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        handleError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        navigate('/login');
        return;
      }

      const result = await response.json();
      setProducts(result);
    } catch (err) {
      handleError('Failed to fetch products');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Welcome, {loggedInUser}</h1>
      <button onClick={handleLogout}>Logout</button>
      <div>
        {products.length > 0 ? (
          products.map((item, index) => (
            <ul key={index}>
              <span>{item.name} : {item.price}</span>
            </ul>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Temp;
