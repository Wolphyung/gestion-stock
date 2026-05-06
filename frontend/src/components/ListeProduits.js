import React, { useState, useEffect } from 'react';
import { getProduits, updateProduit, deleteProduit } from '../services/api';
import './ListeProduits.css';

function ListeProduits() {
  const [produits, setProduits] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerProduits();
  }, []);

  const chargerProduits = async () => {
    setLoading(true);
    try {
      const response = await getProduits();
      setProduits(response.data);
    } catch (err) {
      console.error('Erreur chargement', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (produit) => {
    setEditMode(produit.numProduit);
    setEditData(produit);
  };

  const handleUpdate = async (numProduit) => {
    try {
      await updateProduit(numProduit, editData);
      setMessageType('success');
      setMessage('✅ Modification réussie !');
      chargerProduits();
      setEditMode(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessageType('error');
      setMessage('❌ Modification échouée');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (numProduit) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduit(numProduit);
        setMessageType('success');
        setMessage('✅ Suppression réussie !');
        chargerProduits();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setMessageType('error');
        setMessage('❌ Suppression échouée');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  // Fonction pour formater les nombres en Ariary
  const formatAr = (nombre) => {
    return nombre.toLocaleString('fr-MG') + ' Ar';
  };

  if (loading) {
    return (
      <div className="loading-container">
      <div className="loading-spinner-large"></div>
      <p>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="liste-container fade-in">
    <div className="liste-card">
    <div className="card-header">
    <div className="header-icon">📋</div>
    <div>
    <h2 className="card-title">Liste des produits</h2>
    <p className="card-subtitle">{produits.length} produit(s) trouvé(s)</p>
    </div>
    </div>

    {message && (
      <div className={`message-toast ${messageType}`}>
      {message}
      </div>
    )}

    <div className="table-responsive">
    <table className="produits-table">
    <thead>
    <tr>
    <th>Désignation</th>
    <th>Prix</th>
    <th>Quantité</th>
    <th>Montant</th>
    <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    {produits.map(produit => (
      <tr key={produit.numProduit} className="table-row">
      {editMode === produit.numProduit ? (
        <>
        <td data-label="Désignation">
        <input
        value={editData.design}
        onChange={e => setEditData({...editData, design: e.target.value})}
        className="edit-input"
        />
        </td>
        <td data-label="Prix">
        <input
        type="number"
        value={editData.prix}
        onChange={e => setEditData({...editData, prix: parseFloat(e.target.value)})}
        className="edit-input"
        step="100"
        />
        </td>
        <td data-label="Quantité">
        <input
        type="number"
        value={editData.quantite}
        onChange={e => setEditData({...editData, quantite: parseInt(e.target.value)})}
        className="edit-input"
        />
        </td>
        <td data-label="Montant">{formatAr(editData.prix * editData.quantite)}</td>
        <td data-label="Actions">
        <button onClick={() => handleUpdate(produit.numProduit)} className="action-btn save-btn" title="Sauvegarder">
        💾
        </button>
        <button onClick={() => setEditMode(null)} className="action-btn cancel-btn" title="Annuler">
        ❌
        </button>
        </td>
        </>
      ) : (
        <>
        <td data-label="Désignation">{produit.design}</td>
        <td data-label="Prix">{formatAr(produit.prix)}</td>
        <td data-label="Quantité">{produit.quantite}</td>
        <td data-label="Montant" className="montant-cell">{formatAr(produit.prix * produit.quantite)}</td>
        <td data-label="Actions">
        <button onClick={() => handleEdit(produit)} className="action-btn edit-btn" title="Modifier">
        ✏️
        </button>
        <button onClick={() => handleDelete(produit.numProduit)} className="action-btn delete-btn" title="Supprimer">
        🗑️
        </button>
        </td>
        </>
      )}
      </tr>
    ))}
    </tbody>
    </table>
    </div>

    {produits.length === 0 && (
      <div className="empty-state">
      <div className="empty-icon">📭</div>
      <p>Aucun produit trouvé</p>
      <p className="empty-subtext">Ajoutez votre premier produit dans l'onglet "Ajout"</p>
      </div>
    )}
    </div>
    </div>
  );
}

export default ListeProduits;
