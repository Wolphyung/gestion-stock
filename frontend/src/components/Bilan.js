import React, { useState, useEffect } from 'react';
import { getBilan } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Bilan.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Bilan() {
  const [bilan, setBilan] = useState({ min: 0, max: 0, total: 0, produits: [] });
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerBilan();
  }, []);

  const chargerBilan = async () => {
    setLoading(true);
    try {
      const response = await getBilan();
      // S'assurer que produits est toujours un tableau
      setBilan({
        min: response.data.min || 0,
        max: response.data.max || 0,
        total: response.data.total || 0,
        produits: response.data.produits || []
      });
    } catch (err) {
      console.error('Erreur bilan', err);
      // En cas d'erreur, initialiser avec des valeurs par défaut
      setBilan({ min: 0, max: 0, total: 0, produits: [] });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater en Ariary
  const formatAr = (nombre) => {
    if (nombre === undefined || nombre === null) return '0 Ar';
    return nombre.toLocaleString('fr-MG') + ' Ar';
  };

  // Données pour le graphique (Min, Max, Total uniquement)
  const chartData = {
    labels: ['📉 Minimum', '📈 Maximum', '💰 Total'],
    datasets: [{
      label: 'Montant (Ariary)',
      data: [bilan.min || 0, bilan.max || 0, bilan.total || 0],
      backgroundColor: ['#e53e3e', '#38a169', '#667eea'],
      borderColor: ['#c53030', '#2f855a', '#5a67d8'],
      borderWidth: 2,
      borderRadius: 10,
      barPercentage: 0.6,
      categoryPercentage: 0.8
    }]
  };

  // Options pour l'histogramme
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12, weight: 'bold' },
          usePointStyle: true,
          boxWidth: 10
        }
      },
      title: {
        display: true,
        text: 'Comparaison des indicateurs financiers (Min, Max, Total)',
        font: { size: 14, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            label += (context.raw || 0).toLocaleString('fr-MG') + ' Ar';
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Montant (Ariary)',
          font: { weight: 'bold' }
        },
        ticks: {
          callback: function(value) {
            return (value || 0).toLocaleString('fr-MG') + ' Ar';
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Indicateurs',
          font: { weight: 'bold' }
        }
      }
    }
  };

  // Options pour le camembert
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: 'Proportion des indicateurs (Min, Max, Total)',
        font: { size: 14, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = (bilan.min || 0) + (bilan.max || 0) + (bilan.total || 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value.toLocaleString('fr-MG')} Ar (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
      <div className="loading-spinner-large"></div>
      <p>Chargement du bilan...</p>
      </div>
    );
  }

  return (
    <div className="bilan-container fade-in">
    <div className="bilan-card">
    <div className="card-header">
    <div className="header-icon">📊</div>
    <div>
    <h2 className="card-title">Bilan financier</h2>
    <p className="card-subtitle">Analyse des montants des produits</p>
    </div>
    </div>

    {/* Cartes des 3 indicateurs */}
    <div className="stats-grid">
    <div className="stat-card min-card">
    <div className="stat-icon">📉</div>
    <div className="stat-content">
    <p className="stat-label">Montant Minimal</p>
    <p className="stat-value">{formatAr(bilan.min)}</p>
    {bilan.min > 0 && (
      <div className="stat-detail">
      <span className="detail-badge">Plus bas</span>
      </div>
    )}
    </div>
    </div>

    <div className="stat-card max-card">
    <div className="stat-icon">📈</div>
    <div className="stat-content">
    <p className="stat-label">Montant Maximal</p>
    <p className="stat-value">{formatAr(bilan.max)}</p>
    {bilan.max > 0 && (
      <div className="stat-detail">
      <span className="detail-badge">Plus élevé</span>
      </div>
    )}
    </div>
    </div>

    <div className="stat-card total-card">
    <div className="stat-icon">💰</div>
    <div className="stat-content">
    <p className="stat-label">Montant Total</p>
    <p className="stat-value">{formatAr(bilan.total)}</p>
    <div className="stat-detail">
    <span className="detail-badge">Somme totale</span>
    </div>
    </div>
    </div>
    </div>

    {/* Graphique : Histogramme ou Camembert pour Min, Max, Total */}
    {(bilan.total > 0 || bilan.min > 0 || bilan.max > 0) && (
      <div className="chart-section">
      <div className="chart-header">
      <h3 className="chart-title">📊 Visualisation des indicateurs</h3>
      <div className="chart-buttons">
      <button
      onClick={() => setChartType('bar')}
      className={`chart-btn ${chartType === 'bar' ? 'active' : ''}`}
      >
      <span>📊</span> Histogramme
      </button>
      <button
      onClick={() => setChartType('pie')}
      className={`chart-btn ${chartType === 'pie' ? 'active' : ''}`}
      >
      <span>🥧</span> Camembert
      </button>
      </div>
      </div>
      <div className="chart-container">
      {chartType === 'bar' ? (
        <Bar data={chartData} options={barOptions} />
      ) : (
        <Pie data={chartData} options={pieOptions} />
      )}
      </div>
      </div>
    )}

    {bilan.total === 0 && bilan.min === 0 && bilan.max === 0 && (
      <div className="empty-state">
      <div className="empty-icon">📭</div>
      <p>Aucune donnée à afficher</p>
      <p className="empty-subtext">Ajoutez des produits pour voir le bilan</p>
      </div>
    )}
    </div>
    </div>
  );
}

export default Bilan;
