import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this line
import './Auth.css';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Determine which backend route to hit based on the toggle state
    const endpoint = isLogin ? '/api/login' : '/api/register';
    const url = `http://localhost:5000${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(isLogin ? 'Login successful!' : 'Registration successful! You can now log in.');
        
        // If login is successful, save the JWT to the browser's local storage
        if (isLogin && data.token) {
          localStorage.setItem('token', data.token);
          // You would typically redirect the user to a dashboard here
          navigate('/dashboard'); // Redirect to dashboard after successful login
        }
      } else {
        // Display errors from the backend (like "Invalid credentials")
        setMessage(data.message || 'An error occurred.');
      }
    } catch (error) {
      setMessage('Network error. Make sure your Node server is running!');
    }
  };

  return (
    <>
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="email" 
              className="neon-input" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              className="neon-input" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="neon-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {message && <p className="status-message">{message}</p>}

        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
    </>
  );
}