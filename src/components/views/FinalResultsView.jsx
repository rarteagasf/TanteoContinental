import React from 'react';
import { PlayerAvatar } from '../common/PlayerAvatar';

export function FinalResultsView({ players, shareResults, onNewGame }) {
  const sorted = [...players].sort((a, b) => a.total - b.total);
  const winner = sorted[0];

  return (
    <div className="cc-game-view animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '32px 16px',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--c-surface-container-low)',
        border: '1px solid rgba(212,175,55,0.15)',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <span className="material-symbols-outlined" style={{
          fontSize: 64,
          color: '#d4af37',
          marginBottom: 12,
          display: 'inline-block',
          textShadow: '0 0 20px rgba(212,175,55,0.4)'
        }}>
          emoji_events
        </span>
        <h1 className="cc-page-title" style={{ fontSize: 28, color: 'var(--c-primary)', marginBottom: 4 }}>¡Juego Terminado!</h1>
        <p className="cc-page-subtitle" style={{ fontSize: 16, color: 'var(--c-on-surface)' }}>
          Ganador: <strong style={{ color: '#d4af37' }}>{winner?.name}</strong> con <strong>{winner?.total}</strong> puntos 🏆
        </p>
      </div>

      {/* Results Table */}
      <div className="leather-blotter rounded-xl p-1 wood-texture brass-edge relative overflow-hidden" style={{ borderRadius: 'var(--radius)', marginBottom: 24 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <div className="cc-table-container" style={{ background: 'transparent', border: 'none', boxShadow: 'none', marginBottom: 0 }}>
          <div className="custom-scrollbar">
            <table className="cc-score-table">
              <thead>
                <tr className="etched-border">
                  <th className="cc-th-rounds" style={{ position: 'sticky', left: 0, zIndex: 10 }}>Puesto</th>
                  <th className="cc-th-player" style={{ minWidth: 120 }}>Jugador</th>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <th key={i} className="cc-th-player" style={{ minWidth: 60 }}>R{i + 1}</th>
                  ))}
                  <th className="cc-th-player" style={{ minWidth: 80 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((player, idx) => {
                  const isLeader = idx === 0;
                  const origIdx = players.findIndex(p => p.name === player.name);
                  const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
                  return (
                    <tr key={player.name} className={`cc-tr ${isLeader ? 'cc-tr-current' : 'cc-tr-past'} relative`}>
                      {isLeader && <div className="active-row-rail"></div>}
                      <td className="cc-td-round-info" style={{ position: 'sticky', left: 0, zIndex: 5, background: isLeader ? 'var(--c-surface-container)' : 'var(--c-surface)', fontWeight: 'bold' }}>
                        <span style={{ fontSize: 15 }}>{idx + 1}º {medal}</span>
                      </td>
                      <td className="cc-td-round-info" style={{ background: isLeader ? 'var(--c-surface-container)' : 'var(--c-surface)' }}>
                        <div className="flex items-center gap-2">
                          <PlayerAvatar name={player.name} index={origIdx} size={28} />
                          <span style={{ fontWeight: isLeader ? 'bold' : 'normal', color: isLeader ? '#d4af37' : 'inherit' }}>{player.name}</span>
                        </div>
                      </td>
                      {player.scores.map((score, rIdx) => (
                        <td key={rIdx} className="cc-td-score cc-td-past">
                          <div className="recessed-panel rounded-sm py-1 font-bold text-lg">
                            <span style={{ color: score < 0 ? 'var(--c-primary)' : 'inherit' }}>{score || 0}</span>
                          </div>
                        </td>
                      ))}
                      <td className={`cc-td-total${isLeader ? ' cc-total-leader gold-glow' : ''}`}>
                        <div className="font-score-display" style={{ fontSize: 20, fontWeight: 700 }}>{player.total}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 20 }}>
        <button className="brass-button" onClick={shareResults} style={{ padding: '16px 24px', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, marginRight: 8 }}>share</span>
          <span style={{ fontSize: 16 }}>Compartir</span>
        </button>
        <button className="brass-button" onClick={onNewGame} style={{ padding: '16px 24px', justifyContent: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, marginRight: 8 }}>replay</span>
          <span style={{ fontSize: 16 }}>Nueva Partida</span>
        </button>
      </div>
    </div>
  );
}
