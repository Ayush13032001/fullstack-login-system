import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo(prev => ({ ...prev, [name]: value }));
  };

  const fetchWithTimeout = (url, options, timeout = 10000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      )
    ]);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      return handleError('Name, email and password are required');
    }

    try {
      setLoading(true);
      const url = `https://fullstack-login-system-backend.onrender.com/auth/signup`;
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupInfo)
      }, 10000); // 10 second timeout

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setSignupInfo({ name: '', email: '', password: '' });
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message || 'Signup failed';
        handleError(details);
      } else {
        handleError(message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (err.message === 'Request timed out') {
        handleError('Server timeout. Please try again later.');
      } else {
        handleError('An error occurred during signup. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor='name'>Name</label>
          <input
            onChange={handleChange}
            type='text'
            name='name'
            autoFocus
            placeholder='Enter your name...'
            value={signupInfo.name}
          />
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            onChange={handleChange}
            type='email'
            name='email'
            placeholder='Enter your email...'
            value={signupInfo.email}
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            onChange={handleChange}
            type='password'
            name='password'
            placeholder='Enter your password...'
            value={signupInfo.password}
          />
        </div>
        <button 
          type='submit' 
          disabled={loading || !signupInfo.name || !signupInfo.email || !signupInfo.password}
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>
        <span>
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Signup;
