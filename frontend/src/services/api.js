import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (username, password) => 
  api.post('/login', { username, password });

export const getProduits = () => 
  api.get('/produits');

export const addProduit = (produit) => 
  api.post('/produits', produit);

export const updateProduit = (numProduit, produit) => 
  api.put(`/produits/${numProduit}`, produit);

export const deleteProduit = (numProduit) => 
  api.delete(`/produits/${numProduit}`);

export const getBilan = () => 
  api.get('/bilan');

export default api;