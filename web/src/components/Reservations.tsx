import React, { useState } from 'react';
import './Reservations.css';
import SeatReservation from './SeatReservation';

type Props = {
  onBack: () => void;
};

const Reservations = ({ onBack }: Props) => {
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleFilaVirtual = () => {
    // abre modal que mostra posição 7 (mock)
    setShowQueueModal(true);
  };

  const handleConfirmJoin = () => {
    // simula entrada na fila
    setJoined(true);
    setShowQueueModal(false);
  };

  const [showSeatModal, setShowSeatModal] = useState(false);

  const handleReservaPrioritaria = () => {
    // abrir modal de reserva de assento
    setShowSeatModal(true);
  };

  return (
    <div className="reservations-container">
      <header className="reservations-header">
        <button className="back" onClick={onBack} aria-label="Voltar">← Voltar</button>
        <h2>Reservas</h2>
      </header>

      <main className="reservations-body">
        <div className="reservations-grid">
          <div className="reservations-card" role="button" tabIndex={0} onClick={handleFilaVirtual}>
            <div className="reservations-title">Fila virtual</div>
            <div className="reservations-desc">Entre na fila de embarque virtual (simulação)</div>
            {joined && <div className="reservations-tag">Você está na fila (posição: 7)</div>}
          </div>

          <div className="reservations-card" role="button" tabIndex={0} onClick={handleReservaPrioritaria}>
            <div className="reservations-title">Reserva de assento prioritário</div>
            <div className="reservations-desc">Reserve um assento prioritário (simulação)</div>
          </div>
        </div>
      </main>

      {showQueueModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Fila virtual</h3>
            <p>Você entrou na fila. Posição atual:</p>
            <div className="position">7</div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowQueueModal(false)}>Fechar</button>
              <button className="btn-primary" onClick={handleConfirmJoin}>Atualizar</button>
            </div>
          </div>
        </div>
      )}

      {showSeatModal && (
        <SeatReservation onClose={() => setShowSeatModal(false)} />
      )}
    </div>
  );
};

export default Reservations;
