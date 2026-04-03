import React, { useState, useEffect } from 'react';
import { getBilan } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Bilan.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Bilan() {
  const [bilan, setBilan] = useState({ min: 0, max: 0, total: 0, produits: [] });
  const [chartType, setChartType] = useState('pie');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chargerBilan();
  }, []);

  const chargerBilan = async () => {
    setLoading(true);
    try {
      const response = await getBilan();
      setBilan(response.data);
    } catch (err) {
      console.error('Erreur bilan', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: bilan.produits.map((_, index) => `Produit ${index + 1}`),
    datasets: [{
      data: bilan.produits.map(p => p.prix * p.quantite),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB'],
      borderWidth: 0,
      hoverOffset: 15
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 12 } }
      },
      title: {
        display: true,
        text: 'Distribution des montants par produit',
        font: { size: 14 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            label += context.raw.toFixed(2) + '';
            return label;
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

        <div className="stats-grid">
          <div className="stat-card min-card">
            <div className="stat-icon">📉</div>
            <div className="stat-content">
              <p className="stat-label">Montant Minimal</p>
              <p className="stat-value">{bilan.min.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="stat-card max-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <p className="stat-label">Montant Maximal</p>
              <p className="stat-value">{bilan.max.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="stat-card total-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <p className="stat-label">Montant Total</p>
              <p className="stat-value">{bilan.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {bilan.produits.length > 0 ? (
          <div className="chart-section">
            <div className="chart-header">
              <h3 className="chart-title">Visualisation des données</h3>
              <div className="chart-buttons">
                <button 
                  onClick={() => setChartType('pie')} 
                  className={`chart-btn ${chartType === 'pie' ? 'active' : ''}`}
                >
                  <span>🥧</span> Camembert
                </button>
                <button 
                  onClick={() => setChartType('bar')} 
                  className={`chart-btn ${chartType === 'bar' ? 'active' : ''}`}
                >
                  <span>📊</span> Histogramme
                </button>
              </div>
            </div>
            <div className="chart-container">
              {chartType === 'pie' ? (
                <Pie data={chartData} options={barOptions} />
              ) : (
                <Bar data={chartData} options={barOptions} />
              )}
            </div>
          </div>
        ) : (
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