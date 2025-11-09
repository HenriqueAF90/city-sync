import React, { useEffect, useMemo, useState } from 'react';
import './Lines.css';
import SeatReservation from './SeatReservation';

type Line = { id: string; name: string; route: string };

const MOCK_LINES: Line[] = [
  { id: '120', name: '120 - Centro', route: 'Centro ↔ Terminal' },
  { id: '45A', name: '45A - Praia', route: 'Praia ↔ Bairro Novo' },
  { id: '78B', name: '78B - Universitária', route: 'Universidade ↔ Centro' },
  { id: '10', name: '10 - Industrial', route: 'Indústria ↔ Terminal' },
  { id: '203', name: '203 - Jardim', route: 'Jardim ↔ Centro' },
];

type Props = { onBack: () => void };

const STORAGE_KEY = 'citysync_favorite_lines_v1';

const Lines = ({ onBack }: Props) => {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [onlyFav, setOnlyFav] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [modalLine, setModalLine] = useState<Line | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setFavorites(JSON.parse(raw));
      } catch {
        setFavorites({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = MOCK_LINES.slice();
    if (q) list = list.filter((l) => l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q));
    if (onlyFav) list = list.filter((l) => !!favorites[l.id]);
    return list;
  }, [query, onlyFav, favorites]);

  const toggleFav = (id: string) => {
    setFavorites((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      showToast(next[id] ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
      return next;
    });
  };

  const openReserveForLine = (lineItem: Line) => {
    setModalLine(lineItem);
    setShowSeatModal(true);
  };

  return (
    <div className="lines-container">
      <header className="lines-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back" onClick={onBack}>← Voltar</button>
          <h2>Linhas de ônibus</h2>
        </div>
        <div>
          <button className={`only-fav ${onlyFav ? 'active' : ''}`} onClick={() => setOnlyFav((v) => !v)} aria-pressed={onlyFav} title="Mostrar apenas favoritos">
            {onlyFav ? 'Favoritos (ativo)' : 'Favoritos'}
          </button>
        </div>
      </header>

      <div className="lines-controls">
        <input
          className="lines-search"
          placeholder="Buscar linha (número ou nome)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar linha"
        />
        <button className={`only-fav ${onlyFav ? 'active' : ''}`} onClick={() => setOnlyFav((v) => !v)} aria-pressed={onlyFav}>
          {onlyFav ? 'Mostrando favoritos' : 'Mostrar favoritos'}
        </button>
      </div>

      <ul className="lines-list">
        {filtered.map((line) => (
          <li key={line.id} className="lines-item">
            <div className="lines-info" onClick={() => openReserveForLine(line)} style={{ cursor: 'pointer' }}>
              <div className="lines-id">{line.id}</div>
              <div className="lines-meta">
                <div className="lines-name">{line.name}</div>
                <div className="lines-route">{line.route}</div>
              </div>
            </div>
            <button
              className={`fav ${favorites[line.id] ? 'active' : ''}`}
              onClick={() => toggleFav(line.id)}
              aria-pressed={!!favorites[line.id]}
              aria-label={`Favoritar linha ${line.name}`}
              title={favorites[line.id] ? 'Remover favorito' : 'Adicionar favorito'}
            >
              {/* SVG star */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites[line.id] ? '#f5b400' : 'none'} stroke={favorites[line.id] ? '#f5b400' : '#1a4f63'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      {toast && <div className="toast">{toast}</div>}

      {showSeatModal && modalLine && (
        <SeatReservation onClose={() => setShowSeatModal(false)} initialLine={`${modalLine.id} - ${modalLine.name}`} initialLocation={"Rua Rio de Janeiro 200, centro"} />
      )}
    </div>
  );
};

export default Lines;
