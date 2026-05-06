// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 5000;
const SECRET_KEY = 'votre_secret_key_2024';

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion SQLite
const db = new sqlite3.Database('./database.sqlite');

// Création des tables
db.serialize(() => {
  // Table produits
  db.run(`
    CREATE TABLE IF NOT EXISTS produits (
      numProduit INTEGER PRIMARY KEY AUTOINCREMENT,
      design TEXT NOT NULL,
      prix REAL NOT NULL CHECK(prix >= 0),
      quantite INTEGER NOT NULL CHECK(quantite >= 0)
    )
  `);

  // Table utilisateurs (pour l'auth)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Insertion d'un utilisateur par défaut
  const defaultUser = 'admin';
  const defaultPass = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, [defaultUser, defaultPass]);
});

// ============ MIDDLEWARE AUTH ============
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user;
    next();
  });
};

// ============ ROUTES AUTH ============
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Échec de connexion' });
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
      res.json({ message: 'Connexion réussie', token });
    } else {
      res.status(401).json({ message: 'Échec de connexion' });
    }
  });
});

// ============ ROUTES PRODUITS ============
// GET - Récupérer tous les produits
app.get('/api/produits', authenticateToken, (req, res) => {
  db.all('SELECT * FROM produits ORDER BY numProduit', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de récupération' });
    }
    res.json(rows);
  });
});

// POST - Ajouter un produit (avec vérification d'existence)
app.post('/api/produits', authenticateToken, (req, res) => {
  const { design, prix, quantite } = req.body;

  // Validation des champs
  if (!design || prix === undefined || quantite === undefined) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  if (prix < 0 || quantite < 0) {
    return res.status(400).json({ message: 'Prix et quantité doivent être >= 0' });
  }

  // Vérifier si le produit existe déjà (par la désignation)
  db.get('SELECT * FROM produits WHERE design = ?', [design], (err, existingProduct) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la vérification' });
    }

    if (existingProduct) {
      return res.status(409).json({
        message: `Le produit "${design}" existe déjà !`,
        exists: true,
        produit: existingProduct
      });
    }

    // Si le produit n'existe pas, l'insérer
    db.run(
      'INSERT INTO produits (design, prix, quantite) VALUES (?, ?, ?)',
           [design, prix, quantite],
           function(err) {
             if (err) {
               return res.status(500).json({ message: 'Insertion échouée' });
             }
             res.json({
               message: 'Insertion réussie',
               produit: { numProduit: this.lastID, design, prix, quantite }
             });
           }
    );
  });
});

// PUT - Modifier un produit
app.put('/api/produits/:numProduit', authenticateToken, (req, res) => {
  const { numProduit } = req.params;
  const { design, prix, quantite } = req.body;

  db.run(
    'UPDATE produits SET design = ?, prix = ?, quantite = ? WHERE numProduit = ?',
    [design, prix, quantite, numProduit],
    function(err) {
      if (err || this.changes === 0) {
        return res.status(500).json({ message: 'Modification échouée' });
      }
      res.json({ message: 'Modification réussie' });
    }
  );
});

// DELETE - Supprimer un produit
app.delete('/api/produits/:numProduit', authenticateToken, (req, res) => {
  const { numProduit } = req.params;

  db.run('DELETE FROM produits WHERE numProduit = ?', [numProduit], function(err) {
    if (err || this.changes === 0) {
      return res.status(500).json({ message: 'Suppression échouée' });
    }
    res.json({ message: 'Suppression réussie' });
  });
});

// GET - Bilan (min, max, total)
app.get('/api/bilan', authenticateToken, (req, res) => {
  db.all('SELECT prix, quantite FROM produits', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de calcul' });
    }

    if (rows.length === 0) {
      return res.json({ min: 0, max: 0, total: 0 });
    }

    const montants = rows.map(p => p.prix * p.quantite);
    const min = Math.min(...montants);
    const max = Math.max(...montants);
    const total = montants.reduce((a, b) => a + b, 0);

    res.json({ min, max, total, produits: rows });
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Backend démarré sur http://localhost:${PORT}`);
});
