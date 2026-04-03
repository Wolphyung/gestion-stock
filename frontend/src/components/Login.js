import React, { useState } from 'react';
import { login } from '../services/api';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(username, password);
      localStorage.setItem('token', response.data.token);
      onLogin();
    } catch (err) {
      setError('Identifiants incorrects');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">📦</div>
          <h1 className="login-title">Gestion de Stock</h1>
          <p className="login-subtitle">Connectez-vous à votre espace</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">
              <span className="label-icon">👤</span>
              Nom d'utilisateur
            </label>
            <input
              type="text"
              className="login-input"
              placeholder="Entrez votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">
              <span className="label-icon">🔒</span>
              Mot de passe
            </label>
            <input
              type="password"
              className="login-input"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Se connecter'
            )}
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </form>
        
        <div className="login-footer">
          <p>Demo: <strong>admin</strong> / <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
}

export default Login;