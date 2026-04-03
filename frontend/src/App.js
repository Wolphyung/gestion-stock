import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AjoutProduit from './components/AjoutProduit';
import ListeProduits from './components/ListeProduits';
import Bilan from './components/Bilan';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeMenu, setActiveMenu] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const handleProduitChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">📦</span>
            <span className="brand-text">Gestion Stock</span>
          </div>
          <div className="nav-menu">
            <button 
              onClick={() => setActiveMenu(1)} 
              className={`nav-item ${activeMenu === 1 ? 'active' : ''}`}
            >
              <span className="nav-icon">➕</span>
              <span>Ajout</span>
            </button>
            <button 
              onClick={() => setActiveMenu(2)} 
              className={`nav-item ${activeMenu === 2 ? 'active' : ''}`}
            >
              <span className="nav-icon">📋</span>
              <span>Liste</span>
            </button>
            <button 
              onClick={() => setActiveMenu(3)} 
              className={`nav-item ${activeMenu === 3 ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              <span>Bilan</span>
            </button>
            <button onClick={handleLogout} className="logout-btn">
              <span className="nav-icon">🚪</span>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-wrapper">
          {activeMenu === 1 && <AjoutProduit onProduitAjoute={handleProduitChange} />}
          {activeMenu === 2 && <ListeProduits key={refreshKey} />}
          {activeMenu === 3 && <Bilan />}
        </div>
      </main>
    </div>
  );
}

export default App;