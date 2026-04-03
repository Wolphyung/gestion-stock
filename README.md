# Développement d'une application Web SPA - Application Full Stack

Une application web moderne de gestion de produits avec authentification, CRUD complet, et visualisation de données.

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** (JWT)
- ➕ **Ajout de produits** avec validation
- 📋 **Liste interactive** avec modification/suppression
- 📊 **Bilan financier** (min, max, total)
- 📈 **Graphiques dynamiques** (Camembert/Histogramme)
- 💬 **Messages de confirmation** en temps réel
- 📱 **Interface responsive** (mobile/tablette/desktop)

## 🛠️ Technologies Utilisées

### Backend
- Node.js + Express.js
- SQLite3 (base de données)
- JWT pour l'authentification
- bcryptjs pour le hash des mots de passe

### Frontend
- React
- Chart.js pour les graphiques
- Axios pour les requêtes API
- CSS3 moderne (Flexbox, Grid, Animations)

## 🚀 Installation et Lancement

### Prérequis
- Node.js
- npm ou yarn

### 1. Cloner le projet
bash
git clone https://https://github.com/Wolphyung/gestion-stock.git
cd gestion-stock


### 2. Installer et lancer le Backend
bash
cd backend
npm install
npm run dev

Le backend tourne sur `http://localhost:5000`

### 3. Installer et lancer le Frontend
bash
cd frontend
npm install
npm start

Le frontend tourne sur `http://localhost:3000`

### 4. Connexion
- **Utilisateur** : `admin`
- **Mot de passe** : `admin123`

## 📁 Structure du Projet


gestion-stock/
├── backend/
│   ├── server.js          # Serveur Express
│   ├── database.sqlite    # Base de données
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── services/      # API services
│   │   └── App.js
│   └── package.json
└── README.md


## 🎯 Utilisation

1. **Ajout de produits** : Remplissez le formulaire dans l'onglet "Ajout"
2. **Gestion des produits** : Modifiez ou supprimez dans l'onglet "Liste"
3. **Visualisation** : Consultez le bilan et les graphiques dans "Bilan"