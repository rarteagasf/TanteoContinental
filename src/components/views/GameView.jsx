import React, { useRef, useState } from 'react';
import { roundsData } from '../../constants/game';
import { ScoreTable } from '../scoring/ScoreTable';
import { ScoringPanel } from '../scoring/ScoringPanel';
import { CardCalculatorModal } from '../scoring/CardCalculatorModal';

export function GameView({
  players,
  currentRound,
  roundCloser,
  setRoundCloserPlayer,
  currentRoundScores,
  updateCurrentRoundScore,
  updateScore,
  finishRound,
  handleUndoLast,
  handleRedo,
  undoData,
  redoData,
  cancelGame,
  stats,
  getMediaRonda
}) {
  const [calculatorPlayer, setCalculatorPlayer] = useState(null);
  const scoringPanelRef = useRef(null);

  const currentRoundData = roundsData[currentRound - 1];
  const progress = Math.round((currentRound - 1) / 7 * 100);
  const remaining = 7 - currentRound + 1;

  const handleOpenCalculator = (playerName) => {
    setCalculatorPlayer(playerName);
  };

  const handleApplyCalculatorScore = (playerName, score) => {
    updateCurrentRoundScore(playerName, score);
  };

  return (
    <div className="cc-game-view">
      {/* Header */}
      <div className="cc-game-header">
        <div>
          <h1 className="cc-page-title">Partida Activa</h1>
          <p className="cc-page-subtitle">
            Jugando Ronda {currentRound} de 7 · {currentRoundData.requirement} · {currentRoundData.cards} cartas
          </p>
        </div>
      </div>

      {/* Score Table */}
      <ScoreTable
        players={players}
        currentRound={currentRound}
        roundCloser={roundCloser}
        currentRoundScores={currentRoundScores}
        updateScore={updateScore}
        stats={stats}
        onCellClick={handleOpenCalculator}
      />

      {/* Scoring Panel */}
      <ScoringPanel
        players={players}
        currentRound={currentRound}
        roundCloser={roundCloser}
        setRoundCloserPlayer={setRoundCloserPlayer}
        currentRoundScores={currentRoundScores}
        updateCurrentRoundScore={updateCurrentRoundScore}
        onOpenCalculator={handleOpenCalculator}
        scoringPanelRef={scoringPanelRef}
      />

      {/* Leader Stat Card */}
      {stats && (
        <div className="cc-stat-card" style={{ border: '1px solid rgba(212,175,55,0.2)', marginBottom: 20, padding: '12px 16px' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
            <div style={{ background: 'rgba(242,202,80,0.1)', borderRadius: 'var(--radius-lg)', padding: 6, display: 'inline-flex' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--c-primary)', fontVariationSettings: `'FILL' 1`, fontSize: 20 }}>
                workspace_premium
              </span>
            </div>
            <div className="cc-stat-label" style={{ marginBottom: 0 }}>Líder Actual</div>
          </div>
          <div className="cc-stat-value" style={{ fontSize: 22 }}>{stats.winner.name}</div>
          <div className="cc-stat-sub" style={{ marginTop: 2 }}>{stats.winner.total} pts en total</div>
        </div>
      )}

      {/* Action Bar */}
      <div className="grid grid-cols-2 gap-2" style={{ marginBottom: 20 }}>
        <button
          className="brass-button"
          onClick={() => scoringPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
          style={{ padding: '16px 24px', flexDirection: 'column', gap: 2 }}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>exposure_plus_1</span>
            <span style={{ fontSize: 16 }}>Puntos</span>
          </div>
          <span className="sub-label" style={{ fontSize: 10 }}>Enteros / No Cero</span>
        </button>

        <button
          className="brass-button"
          onClick={finishRound}
          style={{ padding: '16px 24px', flexDirection: 'column', gap: 2 }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 16 }}>{currentRound < 7 ? 'Siguiente Ronda' : 'Finalizar Juego'}</span>
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>arrow_forward</span>
          </div>
          <span className="sub-label" style={{ fontSize: 10 }}>Avanzar partida</span>
        </button>
      </div>

      {/* Undo / Redo */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button className="cc-action-btn" onClick={handleUndoLast} disabled={!undoData} style={{ flex: 1, justifyContent: 'center', padding: '8px 16px', fontSize: 12 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>undo</span>
          Deshacer
        </button>
        <button className="cc-action-btn" onClick={handleRedo} disabled={!redoData} style={{ flex: 1, justifyContent: 'center', padding: '8px 16px', fontSize: 12 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>redo</span>
          Rehacer
        </button>
      </div>

      <button className="cc-btn cc-btn-secondary cc-btn-full" onClick={cancelGame} style={{ fontSize: 12 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16, marginRight: 4 }}>cancel</span>
        Cancelar Partida
      </button>

      {/* Card Calculator Modal */}
      {calculatorPlayer && (
        <CardCalculatorModal
          playerName={calculatorPlayer}
          initialScore={currentRoundScores[calculatorPlayer]}
          onApply={handleApplyCalculatorScore}
          onClose={() => setCalculatorPlayer(null)}
        />
      )}
    </div>
  );
}
