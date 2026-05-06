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
  const [existingProduct, setExistingProduct] = useState(null);

  const handleChange = (e) => {
    setProduit({ ...produit, [e.target.name]: e.target.value });
    if (message) {
      setMessage('');
      setExistingProduct(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!produit.design.trim()) {
      setMessageType('error');
      setMessage('❌ La désignation du produit est requise');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const response = await addProduit({
        design: produit.design.trim(),
                                        prix: parseFloat(produit.prix),
                                        quantite: parseInt(produit.quantite)
      });

      setMessageType('success');
      setMessage(`✅ ${response.data.message}`);
      setProduit({ design: '', prix: '', quantite: '' });
      setExistingProduct(null);
      onProduitAjoute();
      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      if (err.response && err.response.status === 409) {
        setMessageType('warning');
        setMessage(`⚠️ ${err.response.data.message}`);
        setExistingProduct(err.response.data.produit);
      } else {
        setMessageType('error');
        setMessage('❌ Erreur lors de l\'ajout du produit');
      }
      setTimeout(() => setMessage(''), 5000);
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
    Désignation *
    </label>
    <input
    type="text"
    name="design"
    className="form-input"
    placeholder="Nom du produit (unique)"
    value={produit.design}
    onChange={handleChange}
    required
    autoComplete="off"
    />
    <small className="form-hint">Le nom du produit doit être unique</small>
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
    placeholder="0"
    value={produit.prix}
    onChange={handleChange}
    required
    step="100"
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

    {existingProduct && (
      <div className="existing-product-card">
      <div className="existing-header">
      <span>⚠️</span>
      <strong>Produit déjà existant :</strong>
      </div>
      <div className="existing-details">
      <div className="existing-row">
      <span>📌 Désignation :</span>
      <span>{existingProduct.design}</span>
      </div>
      <div className="existing-row">
      <span>💰 Prix :</span>
      <span>{existingProduct.prix.toLocaleString()} Ar</span>
      </div>
      <div className="existing-row">
      <span>📦 Quantité :</span>
      <span>{existingProduct.quantite}</span>
      </div>
      <div className="existing-row">
      <span>💵 Montant :</span>
      <span>{(existingProduct.prix * existingProduct.quantite).toLocaleString()} Ar</span>
      </div>
      </div>
      <button
      onClick={() => {
        setExistingProduct(null);
        setMessage('');
      }}
      className="close-existing-btn"
      >
      Continuer l'ajout
      </button>
      </div>
    )}
    </div>
    </div>
  );
}

export default AjoutProduit;
