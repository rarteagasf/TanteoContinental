import React, { useState, useEffect, useCallback } from 'react';
import { roundsData } from './constants/game';
import { useGameState } from './hooks/useGameState';
import { useSpeech } from './hooks/useSpeech';
import { ToastContainer } from './components/common/Toast';
import { SetupView } from './components/views/SetupView';
import { GameView } from './components/views/GameView';
import { FinalResultsView } from './components/views/FinalResultsView';
import { StatsView } from './components/views/StatsView';
import { InfoView } from './components/views/InfoView';
import { RulesModal } from './components/modals/RulesModal';
import { HallOfFameModal } from './components/modals/HallOfFameModal';
import { NewGameModal } from './components/modals/NewGameModal';

const loadLS = (key, def) => {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : def;
  } catch (e) {
    return def;
  }
};
const saveLS = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
};

export default function App() {
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState(() => {
    const saved = loadLS('continental-tab', 'puntos');
    return saved === 'ajustes' ? 'informacion' : saved;
  });
  const [darkMode, setDarkMode] = useState(() => loadLS('continental-theme', true));
  const [showRules, setShowRules] = useState(false);
  const [showHallOfFame, setShowHallOfFame] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);

  const showToast = useCallback((msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const state = useGameState(showToast);
  const speech = useSpeech();

  const [showResumePrompt, setShowResumePrompt] = useState(() => {
    const saved = loadLS('continental-players', []);
    const started = loadLS('continental-started', false);
    return saved.length > 0 && !started;
  });

  useEffect(() => { saveLS('continental-tab', activeTab); }, [activeTab]);
  useEffect(() => { saveLS('continental-theme', darkMode); }, [darkMode]);
  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleNewGame = () => {
    setShowNewGameDialog(true);
  };

  const confirmNewGameSame = () => {
    state.confirmNewGameSame();
    setShowResumePrompt(false);
    setShowNewGameDialog(false);
  };

  const confirmNewGameNew = () => {
    state.confirmNewGameNew();
    setShowResumePrompt(false);
    setShowNewGameDialog(false);
  };

  const shareResults = async () => {
    if (state.players.length === 0) return;
    const sorted = [...state.players].sort((a, b) => a.total - b.total);
    const text = `🏆 Resultados Continental\n\n${sorted.map((p, i) => `${i + 1}. ${p.name}: ${p.total} pts`).join('\n')}\n\n¡Ganador: ${sorted[0].name}!`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Continental', text }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(text);
      showToast('Resultados copiados al portapapeles');
    }
  };

  const currentRoundData = roundsData[state.currentRound - 1] || roundsData[0];
  const isInfoTab = activeTab === 'informacion' || activeTab === 'ajustes';

  return (
    <div className="cc-app">
      {/* ── Sidebar (desktop) ── */}
      <aside className="cc-sidebar">
        <div className="cc-sidebar-brand">
          <div className="cc-brand-name">CONTINENTAL</div>
          <div className="cc-brand-sub">El Libro de Cuentas</div>
        </div>
        <nav className="cc-sidebar-nav">
          <button className={`cc-nav-item${activeTab === 'puntos' ? ' active' : ''}`} onClick={() => setActiveTab('puntos')}>
            <span className="material-symbols-outlined" style={activeTab === 'puntos' ? { fontVariationSettings: `'FILL' 1` } : undefined}>leaderboard</span>
            Puntos
          </button>
          <button className={`cc-nav-item${activeTab === 'estadisticas' ? ' active' : ''}`} onClick={() => setActiveTab('estadisticas')}>
            <span className="material-symbols-outlined" style={activeTab === 'estadisticas' ? { fontVariationSettings: `'FILL' 1` } : undefined}>query_stats</span>
            Estadísticas
          </button>
          <button className={`cc-nav-item${isInfoTab ? ' active' : ''}`} onClick={() => setActiveTab('informacion')}>
            <span className="material-symbols-outlined" style={isInfoTab ? { fontVariationSettings: `'FILL' 1` } : undefined}>info</span>
            Información
          </button>
          <div style={{ margin: '12px 0 4px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}></div>
          <button className="cc-nav-item" onClick={handleNewGame} style={{ color: 'var(--c-primary)' }}>
            <span className="material-symbols-outlined">add_circle</span>
            Nueva Partida
          </button>
        </nav>
        {state.gameStarted && state.players.length > 0 && (
          <div className="cc-sidebar-footer" style={{ border: '1px solid rgba(212,175,55,0.15)', borderRadius: 'var(--radius-xl)', background: 'var(--c-surface-container-low)', padding: 16, marginTop: 'auto' }}>
            <div className="flex items-center gap-3">
              <div className="cc-dealer-badge" style={{ width: 40, height: 40, fontSize: 16 }}>{state.getDealerName().charAt(0)}</div>
              <div>
                <div className="cc-dealer-label" style={{ fontSize: 10 }}>Repartidor</div>
                <div className="cc-dealer-name" style={{ fontSize: 11, color: 'var(--c-primary)' }}>{state.getDealerName()}</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── Main Area ── */}
      <div className="cc-main">
        {/* Top Bar */}
        <div className="cc-topbar">
          <div className="cc-topbar-left">
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--c-primary)' }}>menu_book</span>
            <div className="cc-topbar-title">Marcador Continental</div>
            {state.gameStarted && (
              <>
                <div className="cc-topbar-sep"></div>
                <div className="cc-topbar-info" style={{ background: 'var(--c-surface-container)', borderRadius: 'var(--radius-full)', padding: '4px 12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>playing_cards</span>
                  Ronda Actual
                  <span>·</span>
                  {currentRoundData.requirement}
                </div>
              </>
            )}
          </div>
          <div className="cc-topbar-actions">
            <button className="cc-icon-btn" onClick={() => setDarkMode(!darkMode)} title={darkMode ? 'Modo claro' : 'Modo oscuro'}>
              <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button className="cc-icon-btn" onClick={handleNewGame} title="Nueva Partida">
              <span className="material-symbols-outlined">add_circle</span>
            </button>
            <button className="cc-icon-btn" onClick={() => setShowHallOfFame(true)} title="Salón de la Fama">
              <span className="material-symbols-outlined">emoji_events</span>
            </button>
          </div>
        </div>

        {/* Content Views */}
        <div className="cc-content">
          {activeTab === 'puntos' && (
            state.showFinalResults ? (
              <FinalResultsView
                players={state.players}
                shareResults={shareResults}
                onNewGame={() => { state.setShowFinalResults(false); handleNewGame(); }}
              />
            ) : state.gameStarted ? (
              <GameView
                players={state.players}
                currentRound={state.currentRound}
                roundCloser={state.roundCloser}
                setRoundCloserPlayer={state.setRoundCloserPlayer}
                currentRoundScores={state.currentRoundScores}
                updateCurrentRoundScore={state.updateCurrentRoundScore}
                updateScore={state.updateScore}
                finishRound={state.finishRound}
                handleUndoLast={state.handleUndoLast}
                handleRedo={state.handleRedo}
                undoData={state.undoData}
                redoData={state.redoData}
                cancelGame={state.cancelGame}
                stats={state.stats}
                getMediaRonda={state.getMediaRonda}
              />
            ) : (
              <SetupView
                players={state.players}
                gameStarted={state.gameStarted}
                showResumePrompt={showResumePrompt}
                addPlayer={state.addPlayer}
                removePlayer={state.removePlayer}
                editPlayer={state.editPlayer}
                movePlayer={state.movePlayer}
                startGame={() => { setShowResumePrompt(false); state.startGame(); }}
                confirmNewGameNew={confirmNewGameNew}
              />
            )
          )}

          {activeTab === 'estadisticas' && (
            <StatsView
              players={state.players}
              stats={state.stats}
              onOpenHallOfFame={() => setShowHallOfFame(true)}
              shareResults={shareResults}
            />
          )}

          {isInfoTab && (
            <InfoView
              onOpenRules={() => setShowRules(true)}
              onOpenHallOfFame={() => setShowHallOfFame(true)}
            />
          )}
        </div>

        {/* Bottom Nav (mobile) */}
        <nav className="cc-bottom-nav rounded-t-xl">
          <button className={`cc-bottom-nav-item${activeTab === 'puntos' ? ' active' : ''}`} onClick={() => setActiveTab('puntos')}>
            <span className="material-symbols-outlined" style={activeTab === 'puntos' ? { fontVariationSettings: `'FILL' 1` } : undefined}>format_list_numbered</span>
            <span>Puntos</span>
          </button>
          <button className={`cc-bottom-nav-item${activeTab === 'estadisticas' ? ' active' : ''}`} onClick={() => setActiveTab('estadisticas')}>
            <span className="material-symbols-outlined" style={activeTab === 'estadisticas' ? { fontVariationSettings: `'FILL' 1` } : undefined}>leaderboard</span>
            <span>Estadísticas</span>
          </button>
          <button className={`cc-bottom-nav-item${isInfoTab ? ' active' : ''}`} onClick={() => setActiveTab('informacion')}>
            <span className="material-symbols-outlined" style={isInfoTab ? { fontVariationSettings: `'FILL' 1` } : undefined}>info</span>
            <span>Información</span>
          </button>
        </nav>
      </div>

      {/* Modals */}
      {showNewGameDialog && (
        <NewGameModal
          gameStarted={state.gameStarted}
          onConfirmSame={confirmNewGameSame}
          onConfirmNew={confirmNewGameNew}
          onClose={() => setShowNewGameDialog(false)}
        />
      )}

      {showHallOfFame && (
        <HallOfFameModal
          hallOfFameData={state.hallOfFameData}
          onDeleteGame={state.deleteHallOfFameGame}
          onClearHallOfFame={state.clearHallOfFame}
          onClose={() => setShowHallOfFame(false)}
        />
      )}

      {showRules && (
        <RulesModal
          speechStatus={speech.speechStatus}
          speakText={speech.speakText}
          pauseSpeech={speech.pauseSpeech}
          resumeSpeech={speech.resumeSpeech}
          cancelSpeech={speech.cancelSpeech}
          onClose={() => setShowRules(false)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
