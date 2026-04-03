import React, { useState } from 'react';
import { addProduit } from '../services/api';
import './AjoutProduit.css';

function AjoutProduit({ onProduitAjoute }) {
  const [produit, setProduit] = useState({
    design: '',
    prix: '',
    quantite: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    setProduit({ ...produit, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduit({
        design: produit.design,
        prix: parseFloat(produit.prix),
        quantite: parseInt(produit.quantite)
      });
      setMessageType('success');
      setMessage('✅ Produit ajouté avec succès !');
      setProduit({ design: '', prix: '', quantite: '' });
      onProduitAjoute();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessageType('error');
      setMessage('❌ Erreur lors de l\'ajout du produit');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="ajout-container fade-in">
      <div className="ajout-card">
        <div className="card-header">
          <div className="header-icon">➕</div>
          <div>
            <h2 className="card-title">Ajouter un produit</h2>
            <p className="card-subtitle">Remplissez les informations ci-dessous</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="ajout-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🏷️</span>
                Désignation
              </label>
              <input
                type="text"
                name="design"
                className="form-input"
                placeholder="Nom du produit"
                value={produit.design}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">💰</span>
                Prix
              </label>
              <input
                type="number"
                name="prix"
                className="form-input"
                placeholder="0.00"
                value={produit.prix}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📦</span>
                Quantité
              </label>
              <input
                type="number"
                name="quantite"
                className="form-input"
                placeholder="0"
                value={produit.quantite}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>
          
          <button type="submit" className="submit-btn">
            <span>➕</span>
            Ajouter le produit
          </button>
        </form>
        
        {message && (
          <div className={`message-toast ${messageType}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default AjoutProduit;