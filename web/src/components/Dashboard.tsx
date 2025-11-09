import React from 'react';
import './Dashboard.css';

type Props = {
  onLogout: () => void;
  onNavigate: (page: string) => void;
};

const Dashboard = ({ onLogout, onNavigate }: Props) => {
  const handleClick = (name: string) => {
    // por enquanto apenas mockar ação
    alert(`${name} selecionado`);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-small" aria-hidden />
        <h2>City Sync</h2>
        <button className="logout" onClick={onLogout} aria-label="Sair">
          Sair
        </button>
      </header>

      <main className="card-grid">
        <button className="card" onClick={() => onNavigate('lines')}>
          <div className="card-content">Linhas de ônibus</div>
        </button>

        <button className="card" onClick={() => onNavigate('payments')}>
          <div className="card-content">Pagamentos</div>
        </button>

        <button className="card" onClick={() => onNavigate('reservations')}>
          <div className="card-content">Reservas</div>
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
