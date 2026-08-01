import React, { useState } from 'react';

export function HallOfFameModal({ hallOfFameData = [], onDeleteGame, onClearHallOfFame, onClose }) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Compute aggregated player stats across all games in Hall of Fame
  const playerStatsMap = {};

  hallOfFameData.forEach((game) => {
    const playersList = game.players || [];
    if (playersList.length === 0 && game.winner) {
      playersList.push({ name: game.winner, total: 0 });
    }

    // Determine winners of this game
    let gameWinners = game.winners || [];
    if (gameWinners.length === 0) {
      if (playersList.length > 0) {
        const minScore = Math.min(...playersList.map(p => p.total));
        gameWinners = playersList.filter(p => p.total === minScore).map(p => p.name);
      } else if (game.winner) {
        gameWinners = [game.winner];
      }
    }

    playersList.forEach((p) => {
      const name = p.name;
      if (!playerStatsMap[name]) {
        playerStatsMap[name] = {
          name,
          gamesPlayed: 0,
          wins: 0,
          totalScore: 0
        };
      }
      playerStatsMap[name].gamesPlayed += 1;
      playerStatsMap[name].totalScore += (p.total || 0);
      if (gameWinners.includes(name)) {
        playerStatsMap[name].wins += 1;
      }
    });
  });

  const sortedPlayers = Object.values(playerStatsMap).map(p => ({
    ...p,
    winRate: p.gamesPlayed > 0 ? (p.wins / p.gamesPlayed) * 100 : 0,
    avgScore: p.gamesPlayed > 0 ? p.totalScore / p.gamesPlayed : 0
  })).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.winRate !== a.winRate) return b.winRate - a.winRate;
    return a.avgScore - b.avgScore; // Lower score is better in Continental
  });

  return (
    <div className="cc-overlay show">
      <div className="cc-modal" style={{ maxWidth: 520 }}>
        <div className="cc-modal-header">
          <div className="cc-modal-title">
            <span className="material-symbols-outlined" style={{ fontSize: 22, verticalAlign: 'middle', marginRight: 6, color: 'var(--c-primary)' }}>
              emoji_events
            </span>
            Salón de la Fama
          </div>
          <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={onClose}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
          </button>
        </div>

        {hallOfFameData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--c-on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 8, opacity: 0.5 }}>
              emoji_events
            </span>
            <div>Aún no hay partidas completadas registradas.</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>¡Completa las 7 rondas de una partida para aparecer aquí!</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="cc-table" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Jugador</th>
                    <th style={{ textAlign: 'center' }}>Partidas</th>
                    <th style={{ textAlign: 'center' }}>Victorias</th>
                    <th style={{ textAlign: 'center' }}>% Vict.</th>
                    <th style={{ textAlign: 'right' }}>Prom. Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlayers.map((p, idx) => (
                    <tr key={p.name}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: idx < 3 ? 600 : 400 }}>
                        {p.name} {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : ''}
                      </td>
                      <td style={{ textAlign: 'center' }}>{p.gamesPlayed}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: p.wins > 0 ? 'var(--c-primary)' : 'inherit' }}>
                        {p.wins}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {p.winRate.toFixed(0)}%
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {p.avgScore.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <details style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
              <summary style={{ cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--c-primary)', padding: '4px 0', userSelect: 'none' }}>
                Historial completo ({hallOfFameData.length} {hallOfFameData.length === 1 ? 'partida' : 'partidas'})
              </summary>
              <div style={{ maxHeight: 220, overflowY: 'auto', marginTop: 8, paddingRight: 4 }}>
                {[...hallOfFameData].reverse().map((game, revIdx) => {
                  const actualIdx = hallOfFameData.length - 1 - revIdx;
                  const winnersStr = game.winners ? game.winners.join(' & ') : game.winner;
                  const dateStr = game.date ? new Date(game.date).toLocaleDateString() : '';
                  return (
                    <div key={actualIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 12, color: 'var(--c-on-surface-variant)' }}>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                        <div>
                          <strong style={{ color: 'var(--c-on-surface)' }}>{winnersStr}</strong>
                          {dateStr && <span style={{ opacity: 0.7, marginLeft: 6 }}>({dateStr})</span>}
                        </div>
                        {game.players && (
                          <div style={{ fontSize: 11, opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {game.players.map(p => `${p.name}: ${p.total}pts`).join(' · ')}
                          </div>
                        )}
                      </div>
                      {onDeleteGame && (
                        <button
                          className="cc-icon-btn"
                          onClick={() => onDeleteGame(actualIdx)}
                          title="Eliminar registro"
                          style={{ color: '#ff6b6b', flexShrink: 0, padding: 4 }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                        </button>
                      )}
                    </div>
                  );
                })}

                {onClearHallOfFame && (
                  <div style={{ marginTop: 12, textAlign: 'center' }}>
                    {!showConfirmClear ? (
                      <button
                        className="cc-btn cc-btn-secondary cc-btn-sm"
                        onClick={() => setShowConfirmClear(true)}
                        style={{ fontSize: 11, color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14, marginRight: 4 }}>delete_sweep</span>
                        Vaciar Salón de la Fama
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#ff6b6b' }}>¿Vaciar todo el historial?</span>
                        <button
                          className="cc-btn cc-btn-sm"
                          onClick={() => { onClearHallOfFame(); setShowConfirmClear(false); }}
                          style={{ background: '#ff6b6b', color: '#fff', fontSize: 11, padding: '4px 10px' }}
                        >
                          Sí, vaciar
                        </button>
                        <button
                          className="cc-btn cc-btn-secondary cc-btn-sm"
                          onClick={() => setShowConfirmClear(false)}
                          style={{ fontSize: 11, padding: '4px 10px' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}
