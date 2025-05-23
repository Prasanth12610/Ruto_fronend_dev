import React, { useState, useEffect } from 'react';
import './LoginSignupPage.css';
import ThreeDModel from './ThreeDModel';
import InfiniteMovingCards from "./InfiniteMovingCards";
import { Sun, Moon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/BG-5.png';
import axios from 'axios';

export default function LoginSignupPage({ setIsAuthenticated }) {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);
  const [activeTab, setActiveTab] = useState('home');


  const backgroundStyle = {
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  width: '100vw',
};


  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Clear previous errors
  setError('');

  if (isLogin) {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
        username,
        password,
      });
      // Save token in localStorage (optional)
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);

      setIsAuthenticated(true);
      navigate('/'); // Redirect to home page or dashboard
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error(err);
    }
  } else {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/auth/register/', {
        username,
        password,
      });

      setIsLogin(true);
      setError('');
      alert('Account created! Please log in.');
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        const errorMessages = Object.values(errors).flat().join(', ');
        setError(errorMessages || 'Registration failed.');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error(err);
    }
  }
};

  return (
    <div className={`fullscreen-wrapper ${theme}`}>
      <div
  className="animated-blue-bg"
  style={{
    background: `url(${bgImage}) no-repeat center center fixed`,
    backgroundSize: '100% 100%',
  }}
></div>


      {/* Navbar */}
      <nav className="top-navbar">
        <div className="nav-actions">
          <button className={activeTab === 'home' ? 'active' : ''} onClick={() => { setShowFeatures(false) ; setActiveTab('home')}} > Home </button>
          <button className={activeTab === 'login' ? 'active' : ''} onClick={() => { setIsLogin(true); setShowFeatures(false); setShowModal(true); setActiveTab('login'); }}> Login </button>
          <button className={activeTab === 'signup' ? 'active' : ''} onClick={() => { setIsLogin(false); setShowFeatures(false); setShowModal(true); setActiveTab('signup'); }}> Signup </button>
          <button className={activeTab === 'features' ? 'active' : ''} onClick={() => { setShowFeatures(true); setShowModal(false); setActiveTab('features');}}> Features </button>
        
        </div>
      </nav>

      {/* Centered 3D Model */}
      <div className="model-container">
        <ThreeDModel url="/models/Rutomatrix.glb" />
      </div>

        {showFeatures && (
      <div className="cards-container">
        <InfiniteMovingCards />
      </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="auth-modal-overlay" onClick={() => setShowModal(false)}>
          <div className={`auth-modal ${theme}`} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                className={theme}
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                className={theme}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {!isLogin && (
                <input
                  className={theme}
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}
              {error && <div className="error">{error}</div>}
              <button type="submit" className={`submit-btn ${theme}`}>
                {isLogin ? 'Log In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

