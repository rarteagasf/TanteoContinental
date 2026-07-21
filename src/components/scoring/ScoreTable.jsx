import React from 'react';
import { roundsData } from '../../constants/game';
import { FrameAvatar } from '../common/PlayerAvatar';

export function ScoreTable({ players, currentRound, roundCloser, currentRoundScores, updateScore, stats, onCellClick }) {
  return (
    <div className="leather-blotter rounded-xl p-1 wood-texture brass-edge relative overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      <div className="cc-table-container" style={{ background: 'transparent', border: 'none', boxShadow: 'none', marginBottom: 0 }}>
        <div className="custom-scrollbar">
          <table className="cc-score-table">
            <thead>
              <tr className="etched-border">
                <th className="cc-th-rounds" style={{ position: 'sticky', left: 0, zIndex: 10 }}>Rondas</th>
                {players.map((player, idx) => {
                  const isLeader = stats && stats.winner.name === player.name;
                  return (
                    <th key={player.name} className={`cc-th-player${isLeader ? ' cc-th-leader' : ''}`}>
                      {isLeader && (
                        <div>
                          <span className="material-symbols-outlined gold-glow" style={{ fontSize: 18, fontVariationSettings: `'FILL' 1` }}>
                            emoji_events
                          </span>
                        </div>
                      )}
                      <FrameAvatar name={player.name} index={idx} size={34} />
                      <div className={`cc-th-name${isLeader ? ' cc-leader-name gold-glow' : ''}`}>{player.name}</div>
                    </th>
                  );
                })}
                {players.length < 6 && Array.from({ length: 6 - players.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="cc-th-player" style={{ opacity: 0.3 }}>
                    <div className="avatar-frame" style={{ width: 44, height: 44 }}>
                      <div className="cc-player-avatar" style={{ background: 'var(--c-surface-container-high)', width: 34, height: 34, fontSize: 12, color: 'var(--c-on-surface-variant)' }}>?</div>
                    </div>
                    <div className="cc-th-name" style={{ fontSize: 10 }}>Vacante</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roundsData.map((round, roundIdx) => {
                const isCurrent = roundIdx === currentRound - 1;
                const isPast = roundIdx < currentRound - 1;
                const rowClass = isCurrent ? 'cc-tr-current' : isPast ? 'cc-tr-past' : 'cc-tr-future';

                return (
                  <tr key={roundIdx} className={`cc-tr ${rowClass} relative${isCurrent ? ' bg-primary-container/10' : ''}${isCurrent ? ' etched-border' : ''}`}>
                    {isCurrent && <div className="active-row-rail"></div>}
                    <td className="cc-td-round-info" style={{ position: 'sticky', left: 0, zIndex: 5, background: isCurrent ? 'var(--c-surface-container)' : 'var(--c-surface)' }}>
                      <div className={`cc-round-title${isCurrent ? ' gold-glow' : ''}`}>R{round.round}: {round.requirement}</div>
                      {isPast && <span className="cc-round-status-badge completed">Completada</span>}
                      {isCurrent && <span className="cc-round-status-badge active animate-pulse">En curso</span>}
                    </td>
                    {players.map((player, pIdx) => {
                      const origIdx = players.findIndex(p => p.name === player.name);
                      const isLeader = stats && stats.winner.name === player.name;
                      const leaderCls = isLeader ? ' cc-td-leader' : '';

                      if (isCurrent) {
                        if (roundCloser === player.name) {
                          return (
                            <td key={player.name} className={`cc-td-score cc-td-current${leaderCls}`}>
                              <div className="recessed-panel rounded-sm py-1 font-bold text-lg">
                                <span className="cc-closer-value" style={{ color: '#1d1009' }}>-{10 * currentRound}</span>
                              </div>
                            </td>
                          );
                        }
                        const cs = currentRoundScores[player.name];
                        return (
                          <td key={player.name} className={`cc-td-score cc-td-current${leaderCls}`}>
                            {cs ? (
                              <div className="recessed-panel rounded-sm py-1 font-bold text-lg" onClick={() => onCellClick && onCellClick(player.name)}>
                                <span>{cs}</span>
                              </div>
                            ) : (
                              <div className="recessed-panel rounded-sm py-1 font-bold text-lg">
                                <span className="cc-placeholder" onClick={() => onCellClick && onCellClick(player.name)}>
                                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#1d1009', opacity: 0.3 }}>add</span>
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      } else if (isPast) {
                        const score = player.scores[roundIdx];
                        const isWinner = score < 0;
                        return (
                          <td key={player.name} className={`cc-td-score cc-td-past${score < 0 ? ' cc-td-negative' : ''}${leaderCls}`}>
                            <div className="recessed-panel rounded-sm py-1 font-bold text-lg relative">
                              {isWinner && <span className="star-badge material-symbols-outlined" style={{ fontVariationSettings: `'FILL' 1`, fontSize: 12 }}>star</span>}
                              <input
                                type="number"
                                className="recessed-input"
                                value={score || ''}
                                onChange={e => updateScore(origIdx, roundIdx, e.target.value)}
                                min="-999" max="999"
                              />
                            </div>
                          </td>
                        );
                      } else {
                        return (
                          <td key={player.name} className={`cc-td-score cc-td-future${leaderCls}`}>
                            <div className="recessed-panel rounded-sm py-1 font-bold text-lg opacity-25">
                              <span className="cc-dash">—</span>
                            </div>
                          </td>
                        );
                      }
                    })}
                    {players.length < 6 && Array.from({ length: 6 - players.length }).map((_, i) => (
                      <td key={`empty-cell-${i}`} className="cc-td-score cc-td-future">
                        <div className="recessed-panel rounded-sm py-1 font-bold text-lg opacity-25">
                          <span className="cc-dash">—</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="cc-total-row" style={{ background: 'var(--c-surface-container-highest)' }}>
                <td className="cc-td-round-info cc-total-label" style={{ position: 'sticky', left: 0, zIndex: 5, background: 'var(--c-surface-container-highest)' }}>
                  Puntuación Total
                </td>
                {players.map(player => {
                  const isLeader = stats && stats.winner.name === player.name;
                  return (
                    <td key={player.name} className={`cc-td-total${isLeader ? ' cc-total-leader gold-glow' : ''}`}>
                      <div className="font-score-display" style={{ fontSize: 24, fontWeight: 700 }}>{player.total || 0}</div>
                    </td>
                  );
                })}
                {players.length < 6 && Array.from({ length: 6 - players.length }).map((_, i) => (
                  <td key={`empty-total-${i}`} className="cc-td-total">
                    <div className="font-score-display" style={{ fontSize: 24, fontWeight: 700, opacity: 0.2 }}>—</div>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
