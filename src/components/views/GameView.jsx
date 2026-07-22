import React, { useState } from 'react';
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
  stats
}) {
  const [calculatorPlayer, setCalculatorPlayer] = useState(null);

  const currentRoundData = roundsData[currentRound - 1];

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

      {/* Action Button: Siguiente Ronda */}
      <button
        className="brass-button"
        onClick={finishRound}
        style={{
          width: '100%',
          padding: '16px 24px',
          justify: 'center',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <span style={{ fontSize: 17, fontWeight: 700 }}>
          {currentRound < 7 ? `Avanzar a Ronda ${currentRound + 1}` : 'Finalizar Juego y Ver Ganador'}
        </span>
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
          {currentRound < 7 ? 'arrow_forward' : 'emoji_events'}
        </span>
      </button>

      {/* Undo / Redo */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button className="cc-action-btn" onClick={handleUndoLast} disabled={!undoData} style={{ flex: 1, justifyContent: 'center', padding: '8px 16px', fontSize: 12 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>undo</span>
          Deshacer Ronda
        </button>
        <button className="cc-action-btn" onClick={handleRedo} disabled={!redoData} style={{ flex: 1, justifyContent: 'center', padding: '8px 16px', fontSize: 12 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>redo</span>
          Rehacer Ronda
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
