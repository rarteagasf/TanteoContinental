import React from 'react';

export function HallOfFameModal({ hallOfFameData, onClose }) {
  const winCounts = hallOfFameData.reduce((acc, g) => {
    acc[g.winner] = (acc[g.winner] || 0) + 1;
    return acc;
  }, {});

  const sortedWinners = Object.entries(winCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="cc-overlay show">
      <div className="cc-modal">
        <div className="cc-modal-header">
          <div className="cc-modal-title">
            <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 4, color: 'var(--c-primary)' }}>
              emoji_events
            </span>
            Salón de la Fama
          </div>
          <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={onClose}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
          </button>
        </div>

        {hallOfFameData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--c-on-surface-variant)' }}>
            Aún no hay partidas registradas. ¡Completa una partida para aparecer aquí!
          </div>
        ) : (
          <>
            <table className="cc-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Jugador</th>
                  <th>Victorias</th>
                </tr>
              </thead>
              <tbody>
                {sortedWinners.map(([name, wins], idx) => (
                  <tr key={name}>
                    <td>{idx + 1}</td>
                    <td>{name} {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : ''}</td>
                    <td>{wins} {wins === 1 ? 'victoria' : 'victorias'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <details style={{ marginTop: 16 }}>
              <summary style={{ cursor: 'pointer', fontSize: 12, color: 'var(--c-on-surface-variant)', padding: '4px 0' }}>
                Historial completo ({hallOfFameData.length} partidas)
              </summary>
              <div style={{ maxHeight: 200, overflowY: 'auto', marginTop: 8 }}>
                {[...hallOfFameData].reverse().map((game, idx) => (
                  <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid rgba(153,144,124,0.15)', fontSize: 12, color: 'var(--c-on-surface-variant)' }}>
                    <strong style={{ color: 'var(--c-on-surface)' }}>{game.winner}</strong> ganó el {new Date(game.date).toLocaleDateString()} —
                    {game.players.map(p => ` ${p.name} (${p.total}pts)`).join(',')}
                  </div>
                ))}
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}
