import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({ ...prev, [name]: value }));
  };

  const fetchWithTimeout = (url, options, timeout = 10000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      )
    ]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('email and password are required');
    }

    try {
      setLoading(true);
      const url = `http://localhost:8080/auth/login`;
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      }, 10000); // 10 second timeout

      const result = await response.json();
      const { success, message,jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token' ,jwtToken);
        localStorage.setItem('loggedInUser' , name);
        setLoginInfo({ email: '', password: '' });
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message || ' Login failed';
        handleError(details);
      } else {
        handleError(message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.message === 'Request timed out') {
        handleError('Server timeout. Please try again later.');
      } else {
        handleError('An error occurred during Login. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            onChange={handleChange}
            type='email'
            name='email'
            placeholder='Enter your email...'
            value={loginInfo.email}
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            onChange={handleChange}
            type='password'
            name='password'
            placeholder='Enter your password...'
            value={loginInfo.password}
          />
        </div>
        <button 
          type='submit' 
          disabled={loading ||!loginInfo.email || !loginInfo.password}
        >
          {loading ? 'loging up...' : 'Login'}
        </button>
        <span>
          Don't have an account? <Link to="/Sign">Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
