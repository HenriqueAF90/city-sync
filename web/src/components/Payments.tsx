import React, { useState } from 'react';
import './Payments.css';

type Props = {
  onBack: () => void;
};

const Payments = ({ onBack }: Props) => {
  const [message, setMessage] = useState<string | null>(null);

  const handleQR = () => {
    // simular leitura de QR
    setMessage('QR lido: CITYSYNC-QR-0001 — Pagamento de R$ 12,50');
  };

  const handleProximity = () => {
    // simular pagamento por aproximação
    setMessage('Pagamento por aproximação realizado com sucesso: R$ 12,50');
  };

  return (
    <div className="payments-container">
      <header className="payments-header">
        <button className="back" onClick={onBack} aria-label="Voltar">← Voltar</button>
        <h2>Pagamentos</h2>
      </header>

      <main className="payments-body">
        <div className="payments-grid">
          <div className="payments-card" onClick={handleQR} role="button" tabIndex={0}>
            <div className="payments-card-title">Ler QR Code</div>
            <div className="payments-card-desc">Abra a câmera e leia o QR (simulação)</div>
          </div>

          <div className="payments-card" onClick={handleProximity} role="button" tabIndex={0}>
            <div className="payments-card-title">Pagamento por aproximação</div>
            <div className="payments-card-desc">Use NFC / aproximação (simulação)</div>
          </div>
        </div>

        {message && (
          <div className="payments-result">
            <p>{message}</p>
            <button onClick={() => setMessage(null)} className="ok">OK</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Payments;
