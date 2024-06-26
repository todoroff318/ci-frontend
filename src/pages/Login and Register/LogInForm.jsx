import React, { useState } from 'react';
import '../../styling/LogInForm.css'; // Import custom CSS file for styling

const LogInForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/users/${username}`);
      if (response.ok) {
        const user = await response.json();

        if (user.username === username && user.password === password) {
          onLogin(username);
        } else {
          console.error('Login failed: Incorrect username or password.');
        }
      } else {
        console.error('Login failed: User not found.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Login</button>
        </form>
      </div>
  );
};

export default LogInForm;
