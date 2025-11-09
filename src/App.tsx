import React, { useState } from 'react';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Payments from './components/Payments';
import Reservations from './components/Reservations';
import Lines from './components/Lines';

type Page = 'login' | 'dashboard' | 'payments' | 'reservations' | 'lines';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [page, setPage] = useState<Page>('login');

  const handleLogin = () => {
    setAuthenticated(true);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPage('login');
  };

  const handleNavigate = (p: Page) => setPage(p);

  return (
    <div>
      {!authenticated ? (
        <Login onLogin={handleLogin} />
      ) : page === 'dashboard' ? (
        <Dashboard onLogout={handleLogout} onNavigate={(p) => handleNavigate(p as Page)} />
      ) : page === 'payments' ? (
        <Payments onBack={() => handleNavigate('dashboard')} />
      ) : page === 'reservations' ? (
        <Reservations onBack={() => handleNavigate('dashboard')} />
      ) : page === 'lines' ? (
        <Lines onBack={() => handleNavigate('dashboard')} />
      ) : (
        <Dashboard onLogout={handleLogout} onNavigate={(p) => handleNavigate(p as Page)} />
      )}
    </div>
  );
};

export default App;
