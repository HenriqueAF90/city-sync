import React, { useState } from 'react';
import './Login.css';

type Props = {
  onLogin: () => void;
};

const Login = ({ onLogin }: Props) => {
  // pré-preencher com admin conforme solicitado
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      setError('');
      // chama callback para informar que o usuário autenticou
      onLogin();
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <div className="bus-icon" aria-hidden />
        <h1>City Sync</h1>
      </div>
      <div className="form">
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-label="Usuário"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Senha"
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
