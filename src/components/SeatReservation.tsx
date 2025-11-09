import React, { useEffect, useMemo, useState } from 'react';
import './SeatReservation.css';

type Props = {
  onClose: () => void;
  initialLine?: string;
  initialLocation?: string;
};

type Seat = { number: number; available: boolean };

const generateSeats = (count = 40) => {
  // gera exatamente `count` cadeiras numeradas a partir de 1
  const seats: Seat[] = [];
  for (let i = 1; i <= count; i++) {
    // por padrão todos disponíveis — disponibilidade será ajustada onde necessário
    seats.push({ number: i, available: true });
  }
  return seats;
};

const SeatReservation = ({ onClose, initialLine, initialLocation }: Props) => {
  const [line, setLine] = useState(initialLine ?? '');
  // definir localização padrão conforme solicitado
  const [location, setLocation] = useState(initialLocation ?? 'Rua Rio de Janeiro 200, centro');
  const [nextSchedule, setNextSchedule] = useState<string | null>(null);
  const [showSeatPicker, setShowSeatPicker] = useState(false);
  const [seats, setSeats] = useState<Seat[]>(() => generateSeats(10));
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const STORAGE_KEY = 'citysync_favorite_lines_v1';
  const [isFav, setIsFav] = useState(false);
  const [favMsg, setFavMsg] = useState<string | null>(null);

  useEffect(() => {
    // quando a linha mudar, recarrega o estado de favorito localStorage
    if (!line) return setIsFav(false);
    const id = line.split(' - ')[0].trim();
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || '{}';
      const obj = JSON.parse(raw);
      setIsFav(!!obj[id]);
    } catch {
      setIsFav(false);
    }
  }, [line]);

  const toggleFavoriteForCurrentLine = () => {
    if (!line) return;
    const id = line.split(' - ')[0].trim();
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || '{}';
      const obj = JSON.parse(raw);
      const next = { ...obj, [id]: !obj[id] };
      if (!next[id]) delete next[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setIsFav(!!next[id]);
      setFavMsg(next[id] ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
      setTimeout(() => setFavMsg(null), 2500);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!line) return setNextSchedule(null);
    // calcular próximo horário próximo: agora + 15 minutos arredondado
    const now = new Date();
    const minutes = now.getMinutes();
    const add = 15 - (minutes % 15);
    const next = new Date(now.getTime() + add * 60_000);
    setNextSchedule(next.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [line]);

  const availableCount = useMemo(() => seats.filter((s) => s.available).length, [seats]);

  const handleConfirmSchedule = () => {
    // ao confirmar a linha e horário, abre seleção de assentos
    setShowSeatPicker(true);
    // gerar exatamente 10 cadeiras para exibir — o layout ficará simples e limpo
    const limited = generateSeats(10).map((s) => ({ ...s, available: true }));
    setSeats(limited);
    setSelectedSeat(null);
  };

  const toggleSeat = (n: number) => {
    const seat = seats.find((s) => s.number === n);
    if (!seat || !seat.available) return;
    setSelectedSeat((prev) => (prev === n ? null : n));
  };

  const [showConfirmed, setShowConfirmed] = useState(false);

  const handleFinalize = () => {
    if (!selectedSeat) {
      alert('Selecione um assento antes de confirmar.');
      return;
    }
    // marcar seat as unavailable (mock)
    setSeats((prev) => prev.map((s) => (s.number === selectedSeat ? { ...s, available: false } : s)));
    // abrir modal de confirmação simples
    // gerar código simples de confirmação
    const code = `CS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    // salvar reserva no localStorage
    try {
      const raw = localStorage.getItem('citysync_reservations') || '[]';
      const arr = JSON.parse(raw);
      arr.push({ code, line, location, seat: selectedSeat, time: nextSchedule });
      localStorage.setItem('citysync_reservations', JSON.stringify(arr));
    } catch (e) {
      // ignore
    }
    setShowConfirmed(true);
    setConfirmedCode(code);
  };

  const [confirmedCode, setConfirmedCode] = useState<string | null>(null);

  return (
    <div className="seat-overlay" role="dialog" aria-modal="true">
      <div className="seat-card">
        <header className="seat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h3 style={{ margin: 0 }}>Reservar assento</h3>
            {/* botão de favoritar para a linha atual */}
            {line && (
              <button
                aria-label="Favoritar linha"
                title={isFav ? 'Remover favorito' : 'Adicionar favorito'}
                onClick={() => toggleFavoriteForCurrentLine()}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 20 }}
              >
                {isFav ? '★' : '☆'}
              </button>
            )}
          </div>
          <button className="close" onClick={onClose} aria-label="Fechar">×</button>
        </header>

        {!showSeatPicker ? (
          <div className="seat-form">
            <label>
              Linha de ônibus
              <input value={line} onChange={(e) => setLine(e.target.value)} placeholder="Ex: 120 - Centro" />
            </label>


            <label>
              Localização
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex: Ponto X / Bairro Y" />
            </label>

            {/*
              Espaço reservado para o mapa do Google Maps.
              - Aqui você pode integrar o componente do Google Maps (ex: react-google-maps) ou
                simplesmente colocar uma <img src="/caminho/para/imagem.jpg" alt="Mapa" />.
              - Exemplo de iframe (comentarizado):
                <iframe src="https://www.google.com/maps?q=Rua+Rio+de+Janeiro+200,+centro&output=embed" width="100%" height="240" />
              Mantive esse bloco como comentário para que você consiga substituir por uma imagem local sem quebrar JSX.
            */}

            {favMsg && <div className="seat-fav-msg">{favMsg}</div>}

            {nextSchedule && (
              <div className="next-schedule">Próximo horário disponível: <strong>{nextSchedule}</strong></div>
            )}

            <div className="seat-form-actions">
              <button className="btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn-primary" onClick={handleConfirmSchedule} disabled={!line}>Reservar lugar</button>
            </div>
          </div>
        ) : (
          <div className="seat-picker">
            <div className="seat-picker-info">Assentos disponíveis: <strong>{availableCount}</strong></div>
            <div className="seat-map">
              {(() => {
                // organizar 10 cadeiras em 5 fileiras com 2 cadeiras por fileira (2 lados separados por corredor)
                const rows = Math.ceil(seats.length / 2);
                return Array.from({ length: rows }).map((_, rowIndex) => {
                  const left = seats[rowIndex * 2];
                  const right = seats[rowIndex * 2 + 1];
                  return (
                    <div className="seat-row" key={rowIndex}>
                      <div className="seat-side">
                        {left ? (
                          <button
                            key={left.number}
                            className={`seat ${!left.available ? 'unavailable' : ''} ${selectedSeat === left.number ? 'selected' : ''}`}
                            onClick={() => toggleSeat(left.number)}
                            aria-disabled={!left.available}
                          >
                            {left.number}
                          </button>
                        ) : <div className="seat-placeholder" />}
                      </div>

                      <div className="aisle" />

                      <div className="seat-side">
                        {right ? (
                          <button
                            key={right.number}
                            className={`seat ${!right.available ? 'unavailable' : ''} ${selectedSeat === right.number ? 'selected' : ''}`}
                            onClick={() => toggleSeat(right.number)}
                            aria-disabled={!right.available}
                          >
                            {right.number}
                          </button>
                        ) : <div className="seat-placeholder" />}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="seat-actions">
              <button className="btn-secondary" onClick={() => setShowSeatPicker(false)}>Voltar</button>
              <button className="btn-primary" onClick={handleFinalize} disabled={!selectedSeat}>Confirmar reserva</button>
            </div>
          </div>
        )}
      </div>
      {showConfirmed && (
        <div className="seat-confirm-overlay">
          <div className="seat-confirm-card">
            <h3>Reserva confirmada</h3>
            <p>Sua reserva foi registrada com sucesso.</p>
            {confirmedCode && <p className="confirmation-code">Código: <strong>{confirmedCode}</strong></p>}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
              <button className="btn-primary" onClick={() => { setShowConfirmed(false); onClose(); }}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatReservation;
