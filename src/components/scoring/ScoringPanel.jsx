import React from 'react';
import { PLAYER_COLORS } from '../../constants/game';

export function ScoringPanel({
  players,
  currentRound,
  roundCloser,
  setRoundCloserPlayer,
  currentRoundScores,
  updateCurrentRoundScore,
  onOpenCalculator,
  scoringPanelRef
}) {
  return (
    <div className="cc-scoring-panel" ref={scoringPanelRef}>
      <div className="cc-scoring-header">
        <div className="cc-scoring-title">
          <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 4 }}>
            edit_note
          </span>
          Puntos · Ronda {currentRound}
        </div>
      </div>
      <p className="cc-scoring-desc">
        Selecciona quién cierra (se asignan -{10 * currentRound} pts automáticamente) e ingresa o calcula los puntos del resto.
      </p>
      <div className="cc-scoring-grid">
        {players.map((player, idx) => (
          <div key={player.name} className={`cc-scoring-player${roundCloser === player.name ? ' cc-scoring-closer' : ''}`}>
            <div className="cc-scoring-player-info">
              <div className="cc-scoring-mini-avatar" style={{ background: PLAYER_COLORS[idx % PLAYER_COLORS.length] }}>
                {player.name.charAt(0)}
              </div>
              <span className="cc-scoring-player-name">{player.name}</span>
            </div>
            <div className="cc-scoring-input-area">
              <label className="cc-closer-toggle">
                <input
                  type="radio"
                  name="roundCloser"
                  checked={roundCloser === player.name}
                  onChange={() => setRoundCloserPlayer(player.name)}
                />
                <span>Cierra</span>
              </label>
              {roundCloser === player.name ? (
                <div className="cc-auto-score">
                  -{10 * currentRound}
                  <span className="cc-auto-tag">Auto</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="number"
                    className="cc-score-input-field ivory-plate"
                    value={currentRoundScores[player.name] || ''}
                    onChange={e => updateCurrentRoundScore(player.name, e.target.value)}
                    placeholder="Pts"
                    min="1" max="999"
                  />
                  <button
                    className="cc-icon-btn"
                    title="Calcular puntos con el asistente de cartas"
                    onClick={() => onOpenCalculator(player.name)}
                    style={{ width: 32, height: 32, flexShrink: 0, padding: 0 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-primary)' }}>
                      calculate
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
