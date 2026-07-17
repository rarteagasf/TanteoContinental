const { useState, useEffect, useRef } = React;

const roundsData = [
  { round: 1, cards: 7, requirement: "2 Tríos" },
  { round: 2, cards: 8, requirement: "1 Trío, 1 Escalera" },
  { round: 3, cards: 9, requirement: "2 Escaleras" },
  { round: 4, cards: 10, requirement: "3 Tríos" },
  { round: 5, cards: 11, requirement: "2 Tríos, 1 Escalera" },
  { round: 6, cards: 12, requirement: "1 Trío, 2 Escaleras" },
  { round: 7, cards: 13, requirement: "3 Escaleras" }
];

const PLAYER_COLORS = [
  '#7a4b1a', '#2a6b4a', '#2a4d7a', '#6a2a7a', '#7a6a1a', '#1a5a7a'
];

const continentalManualHTML = `
  <h1>Manual del Continental</h1>
  <h2>Número de Jugadores</h2>
  <p>El Continental se juega con <strong>2 a 6 jugadores</strong>, usando dos barajas de cartas (incluyendo comodines). En principio, no se usan las cartas 8, 9 y 10, aunque se incluirán si el número de jugadores lo requiere (5 o 6).</p>
  <h2>Objetivo del Juego</h2>
  <p>El objetivo es ser el jugador con la <strong>puntuación total más baja</strong> al final de las 7 rondas.</p>
  <h2>Combinaciones por Ronda</h2>
  <ul>
    <li><strong>Ronda 1:</strong> 7 Cartas, 2 Tríos</li>
    <li><strong>Ronda 2:</strong> 8 Cartas, 1 Trío y 1 Escalera</li>
    <li><strong>Ronda 3:</strong> 9 Cartas, 2 Escaleras</li>
    <li><strong>Ronda 4:</strong> 10 Cartas, 3 Tríos</li>
    <li><strong>Ronda 5:</strong> 11 Cartas, 2 Tríos y 1 Escalera</li>
    <li><strong>Ronda 6:</strong> 12 Cartas, 1 Trío y 2 Escaleras</li>
    <li><strong>Ronda 7:</strong> 13 Cartas, 3 Escaleras</li>
  </ul>
  <h2>Sistema de Puntuación</h2>
  <p>Al final de cada ronda, los jugadores suman los puntos de las cartas que les quedan en la mano:</p>
  <ul>
    <li><strong>Comodín:</strong> 100 puntos</li>
    <li><strong>Dos (2):</strong> 50 puntos</li>
    <li><strong>Figuras (J, Q, K):</strong> 20 puntos cada una</li>
    <li><strong>Cartas del 1 al 10:</strong> Su valor facial (ej. un 7 vale 7 puntos, un As vale 1 punto)</li>
  </ul>
  <p>El jugador que "cierra" la ronda recibe una puntuación negativa de <strong>-10 × número de ronda</strong>. Por ejemplo, en la Ronda 1, el que cierra obtiene -10 puntos; en la Ronda 7, -70 puntos.</p>
  <h2>Reglas Adicionales</h2>
  <h3>Definiciones</h3>
  <ul>
    <li><strong>Tríos:</strong> Tres o más cartas del mismo valor, independientemente del palo.</li>
    <li><strong>Escaleras:</strong> Cuatro o más cartas consecutivas del mismo palo.</li>
    <li><strong>Comodines:</strong> Los comodines pueden sustituir a cualquier carta para formar tríos o escaleras.</li>
  </ul>
  <h3>Mecánicas de Juego</h3>
  <ul>
    <li><strong>Bajar Cartas:</strong> Un jugador solo puede bajar sus combinaciones cuando tiene todas las cartas necesarias para la ronda actual.</li>
    <li><strong>Bajarse Antes de Cerrar:</strong> Un jugador puede "bajarse" una vez que ha completado los requisitos de la ronda, incluso si todavía tiene cartas en la mano.</li>
    <li><strong>Excepción para la Última Ronda:</strong> En la última ronda, el jugador no podrá "bajarse" hasta que no cierre.</li>
  </ul>
  <h3>Robo y Descarte</h3>
  <ul>
    <li><strong>Robar del Pozo:</strong> Los jugadores roban una carta del pozo al inicio de su turno y descartan una al final.</li>
    <li><strong>Descartes y Pozo:</strong> Los descartes de cada jugador se irán poniendo en el pozo boca arriba.</li>
    <li><strong>Robo Fuera de Turno:</strong> Si un jugador fuera de turno quiere la carta de arriba del descarte puede hacerlo.</li>
  </ul>
  <h3>Fin de Ronda</h3>
  <p>La ronda termina cuando un jugador "cierra" su mano.</p>
  <h2>Variaciones</h2>
  <ul>
    <li><strong>Mover Comodín:</strong> Se permite mover un comodín de una escalera a otra posición reglamentaria.</li>
    <li><strong>Robar una carta (más de 4 jugadores):</strong> En partida de más de cuatro jugadores se puede acordar robar solamente una carta.</li>
  </ul>
`;

/* ── Material Symbol Icon helper ── */
const Icon = ({ name, fill, className }) => (
  <span
    className={`material-symbols-outlined${className ? ' ' + className : ''}`}
    style={fill ? { fontVariationSettings: `'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24` } : undefined}
  >{name}</span>
);

/* ── Player Avatar ── */
const PlayerAvatar = React.memo(function PlayerAvatar({ name, index, size }) {
  const sz = size || 40;
  const initial = (name || '?').charAt(0).toUpperCase();
  const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
  return (
    <div className="cc-player-avatar" style={{ background: color, width: sz, height: sz, fontSize: Math.round(sz * 0.38) }}>
      {initial}
    </div>
  );
});

const FrameAvatar = React.memo(function FrameAvatar({ name, index, size }) {
  const sz = size || 34;
  return (
    <div className="avatar-frame" style={{ width: sz + 10, height: sz + 10 }}>
      <PlayerAvatar name={name} index={index} size={sz} />
    </div>
  );
});

/* ── Toast ── */
const Toast = React.memo(({ message, onDismiss }) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return <div className="cc-toast">{message}</div>;
});

/* ── Tooltip ── */
const Tooltip = ({ children, text }) => (
  <div className="tooltip">
    {children}
    <div className="tooltip-text">{text}</div>
  </div>
);

/* ── Helpers ── */
const calculateRoundsWon = (player) => player.scores.filter(s => s < 0).length;

const saveLS = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
};
const loadLS = (key, def) => {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : def; } catch (e) { return def; }
};

/* ══════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════ */
function App() {
  const [players, setPlayers] = useState(() => loadLS('continental-players', []));
  const [currentRound, setCurrentRound] = useState(() => loadLS('continental-round', 1));
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [showHallOfFame, setShowHallOfFame] = useState(false);
  const [hallOfFameData, setHallOfFameData] = useState(() => loadLS('continental-global-stats', []));
  const [toasts, setToasts] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [gameStarted, setGameStarted] = useState(() => loadLS('continental-started', false));
  const [showFinalResults, setShowFinalResults] = useState(() => loadLS('continental-show-results', false));
  const [roundCloser, setRoundCloser] = useState(() => loadLS('continental-closer', ''));
  const [currentRoundScores, setCurrentRoundScores] = useState(() => loadLS('continental-round-scores', {}));
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(() => {
    const saved = loadLS('continental-players', []);
    const started = loadLS('continental-started', false);
    return saved.length > 0 && !started;
  });
  const [activeTab, setActiveTab] = useState(() => loadLS('continental-tab', 'puntos'));
  const [undoData, setUndoData] = useState(() => loadLS('continental-undo', null));
  const [redoData, setRedoData] = useState(() => loadLS('continental-redo', null));
  const [darkMode, setDarkMode] = useState(() => loadLS('continental-theme', true));
  const speechRef = useRef(null);
  const [speechStatus, setSpeechStatus] = useState('idle');
  const dragIndex = useRef(null);

  /* ── Persistence ── */
  useEffect(() => { saveLS('continental-players', players); }, [players]);
  useEffect(() => { saveLS('continental-started', gameStarted); }, [gameStarted]);
  useEffect(() => { saveLS('continental-show-results', showFinalResults); }, [showFinalResults]);
  useEffect(() => { saveLS('continental-closer', roundCloser); }, [roundCloser]);
  useEffect(() => { saveLS('continental-round-scores', currentRoundScores); }, [currentRoundScores]);
  useEffect(() => { saveLS('continental-round', currentRound); }, [currentRound]);
  useEffect(() => { saveLS('continental-global-stats', hallOfFameData); }, [hallOfFameData]);
  useEffect(() => { saveLS('continental-undo', undoData); }, [undoData]);
  useEffect(() => { saveLS('continental-redo', redoData); }, [redoData]);
  useEffect(() => { saveLS('continental-tab', activeTab); }, [activeTab]);
  useEffect(() => { saveLS('continental-theme', darkMode); }, [darkMode]);
  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  /* ── Force-save on unload ── */
  useEffect(() => {
    const save = () => {
      saveLS('continental-players', players);
      saveLS('continental-started', gameStarted);
      saveLS('continental-show-results', showFinalResults);
      saveLS('continental-round', currentRound);
      saveLS('continental-closer', roundCloser);
      saveLS('continental-round-scores', currentRoundScores);
      saveLS('continental-undo', undoData);
      saveLS('continental-redo', redoData);
      saveLS('continental-global-stats', hallOfFameData);
    };
    window.addEventListener('beforeunload', save);
    return () => window.removeEventListener('beforeunload', save);
  }, [players, gameStarted, showFinalResults, currentRound, roundCloser, currentRoundScores, undoData, redoData, hallOfFameData]);

  /* ── Touch drag: non-passive listener ensures preventDefault works ── */
  useEffect(() => {
    const onMove = e => {
      if (dragIndex.current === null) return;
      e.preventDefault();
    };
    document.addEventListener('touchmove', onMove, { passive: false });
    return () => document.removeEventListener('touchmove', onMove);
  }, []);

  /* ── Toast ── */
  const showToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg }]);
  };
  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  /* ── Speech ── */
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const div = document.createElement('div');
    div.innerHTML = text;
    const plain = div.textContent || div.innerText || '';
    const utt = new SpeechSynthesisUtterance(plain);
    utt.lang = 'es-ES';
    utt.onstart = () => setSpeechStatus('speaking');
    utt.onend = () => setSpeechStatus('idle');
    utt.onpause = () => setSpeechStatus('paused');
    utt.onresume = () => setSpeechStatus('speaking');
    utt.onerror = () => setSpeechStatus('idle');
    speechRef.current = utt;
    speechSynthesis.speak(utt);
  };
  const pauseSpeech = () => { if ('speechSynthesis' in window) speechSynthesis.pause(); };
  const resumeSpeech = () => { if ('speechSynthesis' in window) speechSynthesis.resume(); };
  const cancelSpeech = () => {
    if ('speechSynthesis' in window) { speechSynthesis.cancel(); speechRef.current = null; setSpeechStatus('idle'); }
  };

  /* ── Player Management ── */
  const addPlayer = () => {
    if (!newPlayerName.trim() || players.length >= 6) return;
    const cap = newPlayerName.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    if (players.some(p => p.name.toLowerCase() === cap.toLowerCase())) { showToast('Ya existe un jugador con ese nombre'); return; }
    setPlayers([...players, { name: cap, scores: Array(7).fill(0), total: 0 }]);
    setNewPlayerName('');
    showToast(`${cap} añadido`);
  };

  const removePlayer = (index) => {
    if (players.length > 2) {
      const n = players[index].name;
      setPlayers(players.filter((_, i) => i !== index));
      showToast(`${n} eliminado`);
    }
  };

  const editPlayer = (oldName, newName) => {
    if (!newName.trim()) return;
    const cap = newName.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    if (players.some(p => p.name.toLowerCase() === cap.toLowerCase() && p.name !== oldName)) { showToast('Ya existe ese nombre'); return; }
    setPlayers(prev => prev.map(p => p.name === oldName ? { ...p, name: cap } : p));
    showToast(`Renombrado a ${cap}`);
    setEditingPlayer(null);
  };

  const movePlayer = (di, hi) => {
    if (gameStarted) return;
    const arr = [...players];
    const [m] = arr.splice(di, 1);
    arr.splice(hi, 0, m);
    setPlayers(arr);
  };

  /* ── Game Helpers ── */
  const getDealerName = () => (!gameStarted || players.length === 0) ? '' : players[(currentRound - 1) % players.length].name;
  const getHandName = () => (!gameStarted || players.length < 2) ? '' : players[currentRound % players.length].name;

  const updateScore = (pi, ri, score) => {
    if (score === '' || score === null) return;
    const n = Number(score);
    if (!Number.isInteger(n)) { showToast('La puntuación debe ser un número entero'); return; }
    if (n === 0) { showToast('La puntuación no puede ser 0'); return; }
    const np = [...players];
    np[pi].scores[ri] = n;
    np[pi].total = np[pi].scores.reduce((s, v) => s + v, 0);
    setPlayers(np);
  };

  const setRoundCloserPlayer = (name) => {
    const cs = -10 * currentRound;
    setRoundCloser(name);
    const ns = { ...currentRoundScores };
    Object.keys(ns).forEach(k => { if (ns[k] === -10 * currentRound) ns[k] = 0; });
    ns[name] = cs;
    setCurrentRoundScores(ns);
  };

  const updateCurrentRoundScore = (name, score) => {
    if (score === '' || score === null) { setCurrentRoundScores(prev => ({ ...prev, [name]: 0 })); return; }
    const n = Number(score);
    if (!Number.isInteger(n)) { showToast('La puntuación debe ser un número entero'); return; }
    if (n === 0) { showToast('La puntuación no puede ser 0'); return; }
    setCurrentRoundScores(prev => ({ ...prev, [name]: n }));
  };

  /* ── Game Flow ── */
  const startGame = () => {
    setPlayers(prev => {
      const reset = prev.map(p => ({ ...p, scores: Array(7).fill(0), total: 0 }));
      setCurrentRoundScores(reset.reduce((acc, p) => { acc[p.name] = 0; return acc; }, {}));
      return reset;
    });
    setGameStarted(true);
    setShowFinalResults(false);
    setCurrentRound(1);
    setRoundCloser('');
    setUndoData(null);
    setRedoData(null);
    showToast('¡Partida iniciada!');
  };

  const confirmNewGameSame = () => {
    setPlayers(prev => prev.map(p => ({ ...p, scores: Array(7).fill(0), total: 0 })));
    setCurrentRound(1); setGameStarted(false); setCurrentRoundScores({}); setRoundCloser('');
    setShowResumePrompt(false); setUndoData(null); setRedoData(null);
    setShowFinalResults(false);
    showToast('¡Nueva partida lista!'); setShowNewGameDialog(false);
  };
  const confirmNewGameNew = () => {
    setPlayers([]); setCurrentRound(1); setGameStarted(false); setCurrentRoundScores({}); setRoundCloser('');
    setShowResumePrompt(false); setUndoData(null); setRedoData(null);
    setShowFinalResults(false);
    showToast('¡Empezando desde cero!'); setShowNewGameDialog(false);
  };
  const handleNewGame = () => {
    if (players.length > 0) setShowNewGameDialog(true);
    else { setGameStarted(false); setShowResumePrompt(false); }
  };
  const handleCancelGame = () => {
    setPlayers([]);
    setCurrentRound(1);
    setGameStarted(false);
    setCurrentRoundScores({});
    setRoundCloser('');
    setShowResumePrompt(false);
    setUndoData(null);
    setRedoData(null);
    setShowFinalResults(false);
    showToast('Partida cancelada');
  };
  const startNewGameFromResults = () => {
    setShowFinalResults(false);
    setGameStarted(false);
    setShowNewGameDialog(true);
  };

  const finishRound = () => {
    if (!roundCloser) { showToast('Selecciona quién cierra la ronda'); return; }
    for (const p of players) {
      if (p.name !== roundCloser) {
        const s = currentRoundScores[p.name] || 0;
        if (s === 0) { showToast(`Falta la puntuación de ${p.name}`); return; }
      }
    }
    setUndoData({ players: JSON.parse(JSON.stringify(players)), currentRound, currentRoundScores: { ...currentRoundScores }, roundCloser });
    setRedoData(null);
    const updated = players.map(player => {
      const rs = currentRoundScores[player.name] || 0;
      const ns = [...player.scores];
      ns[currentRound - 1] = rs;
      return { ...player, scores: ns, total: ns.reduce((s, v) => s + v, 0) };
    });
    setPlayers(updated);
    if (currentRound < 7) {
      setCurrentRound(prev => prev + 1);
      setCurrentRoundScores(players.reduce((acc, p) => { acc[p.name] = 0; return acc; }, {}));
      setRoundCloser('');
      showToast(`Ronda ${currentRound} completada ✓`);
    } else {
      const sorted = [...updated].sort((a, b) => a.total - b.total);
      const winner = sorted[0];
      setHallOfFameData(prev => [...prev, { date: new Date().toISOString(), winner: winner.name, players: sorted.map(p => ({ name: p.name, total: p.total })) }]);
      showToast(`¡Juego terminado! Ganador: ${winner.name} 🏆`);
      setGameStarted(false);
      setShowFinalResults(true);
    }
  };

  const handleUndoLast = () => {
    if (!undoData) { showToast('Nada que deshacer'); return; }
    setRedoData({ players: JSON.parse(JSON.stringify(players)), currentRound, currentRoundScores: { ...currentRoundScores }, roundCloser });
    setPlayers(undoData.players);
    setCurrentRound(undoData.currentRound);
    setCurrentRoundScores(undoData.currentRoundScores);
    setRoundCloser(undoData.roundCloser);
    setUndoData(null);
    showToast('Última ronda deshecha ↩');
  };

  const handleRedo = () => {
    if (!redoData) { showToast('Nada que rehacer'); return; }
    setUndoData({ players: JSON.parse(JSON.stringify(players)), currentRound, currentRoundScores: { ...currentRoundScores }, roundCloser });
    setPlayers(redoData.players);
    setCurrentRound(redoData.currentRound);
    setCurrentRoundScores(redoData.currentRoundScores);
    setRoundCloser(redoData.roundCloser);
    setRedoData(null);
    showToast('Rehecho ↩');
  };

  const shareResults = async () => {
    if (players.length === 0) return;
    const sorted = [...players].sort((a, b) => a.total - b.total);
    const text = `🏆 Resultados Continental\n\n${sorted.map((p, i) => `${i + 1}. ${p.name}: ${p.total} pts`).join('\n')}\n\n¡Ganador: ${sorted[0].name}!`;
    if (navigator.share) { try { await navigator.share({ title: 'Continental', text }); } catch (e) {} }
    else { navigator.clipboard.writeText(text); showToast('Resultados copiados al portapapeles'); }
  };

  const stats = React.useMemo(() => {
    if (players.length === 0) return null;
    const sorted = [...players].sort((a, b) => a.total - b.total);
    return { winner: sorted[0], sorted, averageScore: Math.round(players.reduce((s, p) => s + p.total, 0) / players.length) };
  }, [players]);

  const getMediaRonda = React.useCallback(() => {
    if (!gameStarted || players.length === 0 || currentRound <= 1) return '—';
    const rp = currentRound - 1;
    const all = players.flatMap(p => p.scores.slice(0, rp).filter(s => s !== 0));
    if (all.length === 0) return '—';
    return (all.reduce((s, v) => s + Math.abs(v), 0) / all.length).toFixed(1);
  }, [players, gameStarted, currentRound]);

  const currentRoundData = roundsData[currentRound - 1];
  const dealerName = getDealerName();
  const scoringPanelRef = useRef(null);

  /* ══════════════════════════════════════════
     RENDER: SETUP VIEW
  ══════════════════════════════════════════ */
  const renderSetupView = () => {
    if (showResumePrompt) {
      return (
        <div className="cc-resume-prompt">
          <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 12, color: 'var(--c-primary)' }}>restart_alt</span>
          <div className="cc-page-title" style={{ fontSize: 20, marginBottom: 8 }}>Partida Anterior Detectada</div>
          <p className="cc-resume-desc">
            Jugadores encontrados: <strong>{players.map(p => p.name).join(', ')}</strong>. ¿Qué deseas hacer?
          </p>
          <div className="cc-resume-actions">
            <button className="cc-btn cc-btn-secondary" onClick={() => { setPlayers([]); setCurrentRoundScores({}); setRoundCloser(''); setShowResumePrompt(false); }}>
              Empezar de cero
            </button>
            <button className="cc-btn cc-btn-primary" onClick={() => setShowResumePrompt(false)}>
              Continuar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="cc-setup">
        <div className="cc-page-title">Nueva Partida</div>
        <p className="cc-section-sub">Registra a los jugadores de 2 a 6. Arrastra para establecer el orden de turno.</p>

        <div className="cc-player-add-form">
          <input
            type="text"
            className="cc-player-name-input"
            value={newPlayerName}
            onChange={e => setNewPlayerName(e.target.value)}
            placeholder="Nombre del jugador..."
            maxLength="15"
            onKeyPress={e => e.key === 'Enter' && addPlayer()}
          />
          <button className="cc-btn-add" onClick={addPlayer} disabled={players.length >= 6 || !newPlayerName.trim()}>
            Añadir
          </button>
        </div>

        <div className="cc-player-list">
          {players.map((player, index) => (
            <div
              key={player.name}
              className="cc-player-item"
              draggable={!gameStarted}
              onDragStart={e => {
                dragIndex.current = index;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(index));
                e.currentTarget.classList.add('dragging');
              }}
              onDragOver={e => {
                e.preventDefault();
                if (dragIndex.current !== index) e.currentTarget.classList.add('drag-over');
              }}
              onDragLeave={e => e.currentTarget.classList.remove('drag-over')}
              onDrop={e => {
                e.preventDefault();
                e.currentTarget.classList.remove('drag-over');
                if (dragIndex.current !== null && dragIndex.current !== index && !gameStarted) movePlayer(dragIndex.current, index);
                dragIndex.current = null;
              }}
              onDragEnd={e => {
                e.currentTarget.classList.remove('dragging', 'drag-over');
                document.querySelectorAll('.cc-player-item.drag-over').forEach(el => el.classList.remove('drag-over'));
                dragIndex.current = null;
              }}
              onTouchStart={e => {
                if (gameStarted) return;
                dragIndex.current = index;
                e.currentTarget.classList.add('dragging');
              }}
              onTouchMove={e => {
                if (dragIndex.current === null || gameStarted) return;
                try { e.preventDefault(); } catch (_) {}
                const touch = e.touches[0];
                const el = document.elementFromPoint(touch.clientX, touch.clientY);
                if (!el) return;
                const item = el.closest('.cc-player-item');
                if (!item) return;
                const items = item.parentElement.querySelectorAll('.cc-player-item');
                const i = Array.from(items).indexOf(item);
                if (i !== -1 && i !== dragIndex.current) {
                  document.querySelectorAll('.cc-player-item.drag-over').forEach(x => x.classList.remove('drag-over'));
                  item.classList.add('drag-over');
                }
              }}
              onTouchEnd={e => {
                if (dragIndex.current === null) return;
                const from = dragIndex.current;
                const over = document.querySelector('.cc-player-item.drag-over');
                if (over && from !== null && from !== Array.from(over.parentElement.querySelectorAll('.cc-player-item')).indexOf(over) && !gameStarted) {
                  movePlayer(from, Array.from(over.parentElement.querySelectorAll('.cc-player-item')).indexOf(over));
                }
                e.currentTarget.classList.remove('dragging', 'drag-over');
                document.querySelectorAll('.cc-player-item.drag-over').forEach(x => x.classList.remove('drag-over'));
                dragIndex.current = null;
              }}
            >
              <span className="cc-drag-handle">⠿</span>
              <PlayerAvatar name={player.name} index={index} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                {editingPlayer === player.name ? (
                  <input
                    type="text"
                    defaultValue={player.name}
                    onBlur={e => editPlayer(player.name, e.target.value)}
                    onKeyPress={e => { if (e.key === 'Enter') editPlayer(player.name, e.target.value); }}
                    autoFocus
                    style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 600, fontSize: 13, outline: 'none', width: '100%' }}
                  />
                ) : (
                  <div className="cc-player-item-name" onClick={() => setEditingPlayer(player.name)} style={{ cursor: 'pointer' }}>
                    {player.name}
                  </div>
                )}
              </div>
              <div className="cc-player-item-badges">
                {index === 0 && <span className="cc-badge cc-badge-dealer">Reparte</span>}
                {index === 1 && players.length > 1 && <span className="cc-badge cc-badge-hand">Mano</span>}
                {players.length > 2 && (
                  <button className="cc-btn-remove" onClick={() => removePlayer(index)} title="Eliminar">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {players.length >= 2 && (
          <div className="cc-info-bar">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>
            <span>
              <strong>Repartidor R1:</strong> {players[0]?.name}&nbsp;&nbsp;·&nbsp;&nbsp;
              <strong>Mano R1:</strong> {players[1]?.name}
            </span>
          </div>
        )}

        <button className="cc-btn-start" onClick={startGame} disabled={players.length < 2}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>playing_cards</span>
          Iniciar Partida — {players.length} jugadores
        </button>
      </div>
    );
  };

  const renderFinalResultsView = () => {
    const sorted = [...players].sort((a, b) => a.total - b.total);
    const winner = sorted[0];

    return (
      <div className="cc-game-view animate-fade-in" style={{ paddingBottom: 40 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '32px 16px', borderRadius: 'var(--radius-xl)', background: 'var(--c-surface-container-low)', border: '1px solid rgba(212,175,55,0.15)', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#d4af37', marginBottom: 12, display: 'inline-block', textShadow: '0 0 20px rgba(212,175,55,0.4)' }}>emoji_events</span>
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
          <button className="brass-button" onClick={startNewGameFromResults} style={{ padding: '16px 24px', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, marginRight: 8 }}>replay</span>
            <span style={{ fontSize: 16 }}>Nueva Partida</span>
          </button>
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════
     RENDER: GAME VIEW (Puntos tab)
     ══════════════════════════════════════════ */
  const renderGameView = () => {
    const progress = Math.round((currentRound - 1) / 7 * 100);
    const remaining = 7 - currentRound + 1;

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

        {/* Score Table - Wood Texture + Recessed Panels */}
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
                          {isLeader && <div><span className="material-symbols-outlined gold-glow" style={{ fontSize: 18, fontVariationSettings: `'FILL' 1` }}>emoji_events</span></div>}
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
                                  <div className="recessed-panel  rounded-sm py-1 font-bold text-lg">
                                    <span className="cc-closer-value" style={{ color: '#1d1009' }}>-{10 * currentRound}</span>
                                  </div>
                                </td>
                              );
                            }
                            const cs = currentRoundScores[player.name];
                            return (
                              <td key={player.name} className={`cc-td-score cc-td-current${leaderCls}`}>
                                {cs ? (
                                  <div className="recessed-panel  rounded-sm py-1 font-bold text-lg">
                                    <span>{cs}</span>
                                  </div>
                                ) : (
                                  <div className="recessed-panel  rounded-sm py-1 font-bold text-lg">
                                    <span className="cc-placeholder" onClick={() => scoringPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}>
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
                                <div className="recessed-panel  rounded-sm py-1 font-bold text-lg relative">
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
                                <div className="recessed-panel  rounded-sm py-1 font-bold text-lg opacity-25">
                                  <span className="cc-dash">—</span>
                                </div>
                              </td>
                            );
                          }
                        })}
                        {players.length < 6 && Array.from({ length: 6 - players.length }).map((_, i) => (
                          <td key={`empty-cell-${i}`} className="cc-td-score cc-td-future">
                            <div className="recessed-panel  rounded-sm py-1 font-bold text-lg opacity-25">
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
                      <td key={`empty-total-${i}`} className="cc-td-total"><div className="font-score-display" style={{ fontSize: 24, fontWeight: 700, opacity: 0.2 }}>—</div></td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Scoring Panel */}
        <div className="cc-scoring-panel" ref={scoringPanelRef}>
          <div className="cc-scoring-header">
            <div className="cc-scoring-title">
              <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 4 }}>edit_note</span>
              Puntos · Ronda {currentRound}
            </div>
          </div>
          <p className="cc-scoring-desc">
            Selecciona quién cierra (se asignan -{10 * currentRound} pts automáticamente) e ingresa los puntos del resto.
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
                    <input
                      type="number"
                      className="cc-score-input-field ivory-plate"
                      value={currentRoundScores[player.name] || ''}
                      onChange={e => updateCurrentRoundScore(player.name, e.target.value)}
                      placeholder="Pts"
                      min="1" max="999"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Bento Grid */}
        <div className="cc-stats-grid">
          <div className="cc-stat-card" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
              <div style={{ background: 'rgba(242,202,80,0.1)', borderRadius: 'var(--radius-lg)', padding: 6, display: 'inline-flex' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--c-primary)', fontVariationSettings: `'FILL' 1`, fontSize: 20 }}>workspace_premium</span>
              </div>
              <div className="cc-stat-label" style={{ marginBottom: 0 }}>Líder</div>
            </div>
            <div className="cc-stat-value" style={{ fontSize: 22 }}>{stats ? stats.winner.name : '—'}</div>
            <div className="cc-stat-sub" style={{ marginTop: 2 }}>{stats ? `${stats.winner.total} pts` : ''}</div>
          </div>
          <div className="cc-stat-card" style={{ border: '1px solid rgba(207,208,184,0.1)' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
              <div style={{ background: 'rgba(207,208,184,0.08)', borderRadius: 'var(--radius-lg)', padding: 6, display: 'inline-flex' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--c-tertiary)', fontSize: 20 }}>analytics</span>
              </div>
              <div className="cc-stat-label" style={{ marginBottom: 0 }}>Media / Ronda</div>
            </div>
            <div className="cc-stat-value" style={{ fontSize: 22 }}>{getMediaRonda()}</div>
            <div className="cc-stat-sub" style={{ marginTop: 2 }}>pts por ronda</div>
          </div>
          <div className="cc-stat-card" style={{ border: '1px solid rgba(212,175,55,0.1)' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
              <div style={{ background: 'rgba(242,202,80,0.08)', borderRadius: 'var(--radius-lg)', padding: 6, display: 'inline-flex' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--c-primary)', fontSize: 20 }}>hourglass_empty</span>
              </div>
              <div className="cc-stat-label" style={{ marginBottom: 0 }}>Restantes</div>
            </div>
            <div className="cc-stat-value" style={{ fontSize: 22 }}>{remaining} <span className="cc-stat-sub" style={{ fontSize: 14 }}>de 7</span></div>
            <div className="cc-stat-bar-track" style={{ marginTop: 6 }}>
              <div className="cc-stat-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <div className="cc-stat-card relative overflow-hidden" style={{ border: '1px solid rgba(207,208,184,0.1)' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
              <div style={{ background: 'rgba(207,208,184,0.08)', borderRadius: 'var(--radius-lg)', padding: 6, display: 'inline-flex', position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' 1`, color: 'var(--c-secondary)', fontSize: 20 }}>hotel_class</span>
              </div>
              <div className="cc-stat-label" style={{ marginBottom: 0 }}>Progreso</div>
            </div>
            <div className="cc-stat-value" style={{ fontSize: 22 }}>{progress}%</div>
            <div className="cc-stat-hint">Completado</div>
          </div>
        </div>

        {/* Action Bar - Brass Buttons */}
        <div className="grid grid-cols-2 gap-2" style={{ marginBottom: 20 }}>
          <button className="brass-button" onClick={() => scoringPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })} style={{ padding: '16px 24px', flexDirection: 'column', gap: 2 }}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>exposure_plus_1</span>
              <span style={{ fontSize: 16 }}>Puntos</span>
            </div>
            <span className="sub-label" style={{ fontSize: 10 }}>Enteros / No Cero</span>
          </button>
          <button className="brass-button" onClick={finishRound} style={{ padding: '16px 24px', flexDirection: 'column', gap: 2 }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 16 }}>{currentRound < 7 ? 'Siguiente Ronda' : 'Finalizar Juego'}</span>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>arrow_forward</span>
            </div>
            <span className="sub-label" style={{ fontSize: 10 }}>Avanzar partida</span>
          </button>
        </div>

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

        <button className="cc-btn cc-btn-secondary cc-btn-full" onClick={handleCancelGame} style={{ fontSize: 12 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, marginRight: 4 }}>cancel</span>
          Cancelar Partida
        </button>
      </div>
    );
  };

  /* ══════════════════════════════════════════
     RENDER: ESTADÍSTICAS TAB
  ══════════════════════════════════════════ */
  const renderEstadisticasTab = () => {
    if (players.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--c-on-surface-variant)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 56, marginBottom: 16, color: 'var(--c-on-surface-variant)' }}>query_stats</span>
          <div className="cc-page-title" style={{ marginBottom: 8 }}>Sin datos</div>
          <p>Inicia una partida para ver estadísticas.</p>
        </div>
      );
    }

    const sorted = [...players].sort((a, b) => a.total - b.total);

    return (
      <div>
        <div className="cc-page-title">Estadísticas</div>
        <p className="cc-section-sub">Clasificación y rendimiento actual de los jugadores.</p>

        <div className="cc-rankings">
          <div className="cc-rankings-header">
            <div className="cc-rankings-title">Clasificación Actual</div>
            {stats && <div style={{ fontSize: 12, color: 'var(--c-on-surface-variant)' }}>Líder: {stats.winner.name}</div>}
          </div>
          {sorted.map((player, idx) => {
            const posClass = idx === 0 ? 'first' : idx === 1 ? 'second' : idx === 2 ? 'third' : 'other';
            const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
            const origIdx = players.findIndex(p => p.name === player.name);
            return (
              <div key={player.name} className="cc-ranking-row">
                <div className={`cc-rank-pos ${posClass}`}>{idx + 1}</div>
                <PlayerAvatar name={player.name} index={origIdx} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="cc-rank-name">{player.name} {medal}</div>
                  <div className="cc-rank-bar-track">
                    <div className="cc-rank-bar-fill" style={{ width: `${100 - (idx / Math.max(sorted.length - 1, 1)) * 65}%` }}></div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className={`cc-rank-total${idx === 0 ? ' leader' : ''}`}>{player.total}</div>
                  <div className="cc-rank-rounds-won">{calculateRoundsWon(player)} rondas ganadas</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="cc-btn cc-btn-secondary" onClick={() => setShowHallOfFame(true)} style={{ flex: 1 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>emoji_events</span>
            Salón de la Fama
          </button>
          <button className="cc-btn cc-btn-secondary" onClick={shareResults} style={{ flex: 1 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>share</span>
            Compartir Resultados
          </button>
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════
     RENDER: AJUSTES TAB
  ══════════════════════════════════════════ */
  const renderAjustesTab = () => (
    <div className="cc-settings">
      <div className="cc-page-title">Ajustes</div>
      <p className="cc-section-sub">Preferencias del club.</p>

      <div className="cc-settings-section">
        <div className="cc-settings-section-title">Partida</div>
        <div className="cc-settings-row" onClick={() => setShowRules(true)}>
          <div>
            <div className="cc-settings-row-label">
              <span className="material-symbols-outlined" style={{ fontSize: 16, marginRight: 6, verticalAlign: 'middle' }}>menu_book</span>
              Reglas del Continental
            </div>
            <div className="cc-settings-row-desc">Ver manual completo del juego</div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-on-surface-variant)' }}>chevron_right</span>
        </div>
        <div className="cc-settings-row" onClick={handleNewGame}>
          <div>
            <div className="cc-settings-row-label">
              <span className="material-symbols-outlined" style={{ fontSize: 16, marginRight: 6, verticalAlign: 'middle' }}>playing_cards</span>
              Nueva Partida
            </div>
            <div className="cc-settings-row-desc">Reiniciar con los mismos o nuevos jugadores</div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-on-surface-variant)' }}>chevron_right</span>
        </div>
        {players.length > 0 && (
          <div className="cc-settings-row" onClick={shareResults}>
            <div>
              <div className="cc-settings-row-label">
                <span className="material-symbols-outlined" style={{ fontSize: 16, marginRight: 6, verticalAlign: 'middle' }}>share</span>
                Compartir Resultados
              </div>
              <div className="cc-settings-row-desc">Enviar las puntuaciones actuales</div>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-on-surface-variant)' }}>chevron_right</span>
          </div>
        )}
        <div className="cc-settings-row" onClick={() => setShowHallOfFame(true)}>
          <div>
            <div className="cc-settings-row-label">
              <span className="material-symbols-outlined" style={{ fontSize: 16, marginRight: 6, verticalAlign: 'middle' }}>emoji_events</span>
              Salón de la Fama
            </div>
            <div className="cc-settings-row-desc">Historial de partidas y campeones</div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-on-surface-variant)' }}>chevron_right</span>
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════════ */
  return (
    <div className="cc-app">

      {/* ── Sidebar (desktop) ── */}
      <aside className="cc-sidebar">
        <div className="cc-sidebar-brand">
          <div className="cc-brand-name">CONTINENTAL</div>
          <div className="cc-brand-sub">
            El Libro de Cuentas
          </div>
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
          <button className={`cc-nav-item${activeTab === 'ajustes' ? ' active' : ''}`} onClick={() => setActiveTab('ajustes')}>
            <span className="material-symbols-outlined" style={activeTab === 'ajustes' ? { fontVariationSettings: `'FILL' 1` } : undefined}>settings</span>
            Ajustes
          </button>
        </nav>
        {gameStarted && players.length > 0 && (
          <div className="cc-sidebar-footer" style={{ border: '1px solid rgba(212,175,55,0.15)', borderRadius: 'var(--radius-xl)', background: 'var(--c-surface-container-low)', padding: 16, marginTop: 'auto' }}>
            <div className="flex items-center gap-3">
              <div className="cc-dealer-badge" style={{ width: 40, height: 40, fontSize: 16 }}>{getDealerName().charAt(0)}</div>
              <div>
                <div className="cc-dealer-label" style={{ fontSize: 10 }}>Repartidor</div>
                <div className="cc-dealer-name" style={{ fontSize: 11, color: 'var(--c-primary)' }}>{getDealerName()}</div>
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
            {gameStarted && (
              <>
                <div className="cc-topbar-sep"></div>
                <div className="cc-topbar-info" style={{ background: 'var(--c-surface-container)', borderRadius: 'var(--radius-full)', padding: '4px 12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>stadium</span>
                  Mesa Principal
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
            <button className="cc-icon-btn" onClick={() => showToast('Añadir jugador')} title="Añadir jugador">
              <span className="material-symbols-outlined">person_add</span>
            </button>
            <button className="cc-icon-btn" onClick={() => setShowHallOfFame(true)} title="Historial">
              <span className="material-symbols-outlined">history</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="cc-content">
          {activeTab === 'puntos' && (showFinalResults ? renderFinalResultsView() : (gameStarted ? renderGameView() : renderSetupView()))}
          {activeTab === 'estadisticas' && renderEstadisticasTab()}
          {activeTab === 'ajustes' && renderAjustesTab()}
        </div>

        {/* Bottom Nav (mobile) - rounded top */}
        <nav className="cc-bottom-nav rounded-t-xl">
          <button className={`cc-bottom-nav-item${activeTab === 'puntos' ? ' active' : ''}`} onClick={() => setActiveTab('puntos')}>
            <span className="material-symbols-outlined" style={activeTab === 'puntos' ? { fontVariationSettings: `'FILL' 1` } : undefined}>format_list_numbered</span>
            <span>Puntos</span>
          </button>
          <button className={`cc-bottom-nav-item${activeTab === 'estadisticas' ? ' active' : ''}`} onClick={() => setActiveTab('estadisticas')}>
            <span className="material-symbols-outlined" style={activeTab === 'estadisticas' ? { fontVariationSettings: `'FILL' 1` } : undefined}>leaderboard</span>
            <span>Estadísticas</span>
          </button>
          <button className={`cc-bottom-nav-item${activeTab === 'ajustes' ? ' active' : ''}`} onClick={() => setActiveTab('ajustes')}>
            <span className="material-symbols-outlined" style={activeTab === 'ajustes' ? { fontVariationSettings: `'FILL' 1` } : undefined}>settings</span>
            <span>Ajustes</span>
          </button>
        </nav>
      </div>

      {/* ══ MODALS ══ */}

      {showNewGameDialog && (
        <div className="cc-overlay show">
          <div className="cc-modal" style={{ maxWidth: 380, textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, marginBottom: 12, color: 'var(--c-primary)' }}>playing_cards</span>
            <div className="cc-modal-title" style={{ marginBottom: 8 }}>Nueva Partida</div>
            <p style={{ fontSize: 13, color: 'var(--c-on-surface-variant)', marginBottom: 20 }}>
              ¿Usar los mismos jugadores o empezar de nuevo?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="cc-btn cc-btn-primary cc-btn-full" onClick={confirmNewGameSame}>Mismos jugadores</button>
              <button className="cc-btn cc-btn-secondary cc-btn-full" onClick={confirmNewGameNew}>Jugadores nuevos</button>
              <button className="cc-btn cc-btn-secondary cc-btn-full" onClick={() => setShowNewGameDialog(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showHallOfFame && (
        <div className="cc-overlay show">
          <div className="cc-modal">
            <div className="cc-modal-header">
              <div className="cc-modal-title">
                <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 4, color: 'var(--c-primary)' }}>emoji_events</span>
                Salón de la Fama
              </div>
              <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={() => setShowHallOfFame(false)}>
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
                    <tr><th>#</th><th>Jugador</th><th>Victorias</th></tr>
                  </thead>
                  <tbody>
                    {Object.entries(hallOfFameData.reduce((acc, g) => { acc[g.winner] = (acc[g.winner] || 0) + 1; return acc; }, {}))
                      .sort((a, b) => b[1] - a[1])
                      .map(([name, wins], idx) => (
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
      )}

      {showRules && (
        <div className="cc-overlay show">
          <div className="cc-modal">
            <div className="cc-modal-header">
              <div className="cc-modal-title">
                <span className="material-symbols-outlined" style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 4 }}>menu_book</span>
                Manual del Continental
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {speechStatus === 'idle' && (
                  <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={() => speakText(continentalManualHTML)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>volume_up</span>
                  </button>
                )}
                {speechStatus === 'speaking' && (
                  <>
                    <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={pauseSpeech}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>pause</span>
                    </button>
                    <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={cancelSpeech}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>stop</span>
                    </button>
                  </>
                )}
                {speechStatus === 'paused' && (
                  <>
                    <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={resumeSpeech}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>play_arrow</span>
                    </button>
                    <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={cancelSpeech}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>stop</span>
                    </button>
                  </>
                )}
                <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={() => { cancelSpeech(); setShowRules(false); }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                </button>
              </div>
            </div>
            <div className="cc-rules-content" dangerouslySetInnerHTML={{ __html: continentalManualHTML }} />
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="cc-toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
