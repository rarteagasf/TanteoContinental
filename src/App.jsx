const { useState, useEffect, useRef } = React;

const roundsData = [
  { round: 1, cards: 7, requirement: "2 Tríos" },
  { round: 2, cards: 8, requirement: "1 Trío y 1 Escalera" },
  { round: 3, cards: 9, requirement: "2 Escaleras" },
  { round: 4, cards: 10, requirement: "3 Tríos" },
  { round: 5, cards: 11, requirement: "2 Tríos y 1 Escalera" },
  { round: 6, cards: 12, requirement: "1 Trío y 2 Escaleras" },
  { round: 7, cards: 13, requirement: "3 Escaleras" }
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

const Toast = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  return <div className="toast">{message}</div>;
};

const Tooltip = ({ children, text }) => (
  <div className="tooltip">
    {children}
    <div className="tooltip-text">{text}</div>
  </div>
);

const calculateRoundsWon = (player) => player.scores.filter(score => score < 0).length;

const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

function App() {
  const [players, setPlayers] = useState(() =>
    loadFromLocalStorage('continental-players', [])
  );

  const [currentRound, setCurrentRound] = useState(() =>
    loadFromLocalStorage('continental-round', 1)
  );
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [showHallOfFame, setShowHallOfFame] = useState(false);
  const [hallOfFameData, setHallOfFameData] = useState(() =>
    loadFromLocalStorage('continental-global-stats', [])
  );
  const [darkMode, setDarkMode] = useState(() =>
    loadFromLocalStorage('continental-theme', 'light') === 'dark'
  );
  const [toasts, setToasts] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [gameStarted, setGameStarted] = useState(() =>
    loadFromLocalStorage('continental-started', false)
  );
  const [roundCloser, setRoundCloser] = useState(() =>
    loadFromLocalStorage('continental-closer', '')
  );
  const [currentRoundScores, setCurrentRoundScores] = useState(() =>
    loadFromLocalStorage('continental-round-scores', {})
  );
  const speechUtteranceRef = useRef(null);
  const [speechStatus, setSpeechStatus] = useState('idle');
  const [showAbandonConfirmation, setShowAbandonConfirmation] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(() => {
    const savedPlayers = loadFromLocalStorage('continental-players', []);
    const savedStarted = loadFromLocalStorage('continental-started', false);
    return savedPlayers.length > 0 && !savedStarted;
  });
  const dragIndex = useRef(null);

  useEffect(() => { saveToLocalStorage('continental-players', players); }, [players]);
  useEffect(() => { saveToLocalStorage('continental-started', gameStarted); }, [gameStarted]);
  useEffect(() => { saveToLocalStorage('continental-closer', roundCloser); }, [roundCloser]);
  useEffect(() => { saveToLocalStorage('continental-round-scores', currentRoundScores); }, [currentRoundScores]);
  useEffect(() => { saveToLocalStorage('continental-round', currentRound); }, [currentRound]);
  useEffect(() => { saveToLocalStorage('continental-global-stats', hallOfFameData); }, [hallOfFameData]);

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-scheme', theme);
    saveToLocalStorage('continental-theme', theme);
  }, [darkMode]);

  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = text;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = 'es-ES';
      utterance.onstart = () => setSpeechStatus('speaking');
      utterance.onend = () => setSpeechStatus('idle');
      utterance.onpause = () => setSpeechStatus('paused');
      utterance.onresume = () => setSpeechStatus('speaking');
      utterance.onerror = () => setSpeechStatus('idle');
      speechUtteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const pauseSpeech = () => { if ('speechSynthesis' in window) speechSynthesis.pause(); };
  const resumeSpeech = () => { if ('speechSynthesis' in window) speechSynthesis.resume(); };
  const cancelSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      speechUtteranceRef.current = null;
      setSpeechStatus('idle');
    }
  };

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 6) {
      const capitalized = newPlayerName.trim().split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');

      if (players.some(p => p.name.toLowerCase() === capitalized.toLowerCase())) {
        showToast('Ya existe un jugador con ese nombre');
        return;
      }

      setPlayers([...players, { name: capitalized, scores: Array(7).fill(0), total: 0 }]);
      setNewPlayerName('');
      showToast(`Jugador ${capitalized} añadido`);
    }
  };

  const removePlayer = (index) => {
    if (players.length > 2) {
      const removedPlayer = players[index];
      setPlayers(players.filter((_, i) => i !== index));
      showToast(`Jugador ${removedPlayer.name} eliminado`);
    }
  };

  const editPlayer = (oldName, newName) => {
    if (!newName.trim()) return;
    const capitalized = newName.trim().split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    if (players.some(p => p.name.toLowerCase() === capitalized.toLowerCase() && p.name !== oldName)) {
      showToast('Ya existe un jugador con ese nombre');
      return;
    }
    setPlayers(prev => prev.map(player =>
      player.name === oldName ? { ...player, name: capitalized } : player
    ));
    showToast(`Jugador renombrado a ${capitalized}`);
    setEditingPlayer(null);
  };

  const movePlayer = (dragIdx, hoverIdx) => {
    if (gameStarted) return;
    const newPlayers = [...players];
    const [moved] = newPlayers.splice(dragIdx, 1);
    newPlayers.splice(hoverIdx, 0, moved);
    setPlayers(newPlayers);
  };

  const getDealerName = () => {
    if (!gameStarted || players.length === 0) return '';
    return players[(currentRound - 1) % players.length].name;
  };

  const getHandName = () => {
    if (!gameStarted || players.length < 2) return '';
    return players[currentRound % players.length].name;
  };

  const changeRound = (direction) => {
    let newRound = currentRound;
    if (direction === 'next' && currentRound < 7) newRound = currentRound + 1;
    else if (direction === 'prev' && currentRound > 1) newRound = currentRound - 1;
    setCurrentRound(newRound);
  };

  const updateScore = (playerIndex, roundIndex, score) => {
    if (score === '' || score === null || score === undefined) return;
    const numScore = Number(score);
    if (!Number.isInteger(numScore)) { showToast('La puntuación debe ser un número entero'); return; }
    if (numScore === 0) { showToast('La puntuación no puede ser 0'); return; }
    const newPlayers = [...players];
    newPlayers[playerIndex].scores[roundIndex] = numScore;
    newPlayers[playerIndex].total = newPlayers[playerIndex].scores.reduce((sum, s) => sum + s, 0);
    setPlayers(newPlayers);
  };

  const setRoundCloserPlayer = (playerName) => {
    const closerScore = -10 * currentRound;
    setRoundCloser(playerName);
    const newScores = { ...currentRoundScores };
    Object.keys(newScores).forEach(name => {
      if (newScores[name] === -10 * currentRound) newScores[name] = 0;
    });
    newScores[playerName] = closerScore;
    setCurrentRoundScores(newScores);
  };

  const updateCurrentRoundScore = (playerName, score) => {
    if (score === '' || score === null || score === undefined) {
      setCurrentRoundScores(prev => ({ ...prev, [playerName]: 0 }));
      return;
    }
    const numScore = Number(score);
    if (!Number.isInteger(numScore)) { showToast('La puntuación debe ser un número entero'); return; }
    if (numScore === 0) { showToast('La puntuación no puede ser 0'); return; }
    setCurrentRoundScores(prev => ({ ...prev, [playerName]: numScore }));
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentRound(1);
    setCurrentRoundScores(players.reduce((acc, player) => { acc[player.name] = 0; return acc; }, {}));
    setRoundCloser('');
    showToast('¡Juego iniciado!');
  };

  const confirmReset = () => {
    setPlayers(players.map(p => ({ ...p, scores: Array(7).fill(0), total: 0 })));
    setCurrentRound(1);
    setGameStarted(false);
    setCurrentRoundScores({});
    setRoundCloser('');
    setShowResumePrompt(false);
    showToast('Juego reiniciado');
    setShowAbandonConfirmation(false);
  };

  const resetGame = () => setShowAbandonConfirmation(true);

  const finishRound = () => {
    if (!roundCloser) { showToast('Debes seleccionar quién cierra la ronda'); return; }

    for (const player of players) {
      if (player.name !== roundCloser) {
        const score = currentRoundScores[player.name] || 0;
        if (score === 0) { showToast(`Debes ingresar la puntuación de ${player.name}`); return; }
      }
    }

    const updatedPlayers = players.map(player => {
      const roundScore = currentRoundScores[player.name] || 0;
      const newScores = [...player.scores];
      newScores[currentRound - 1] = roundScore;
      return { ...player, scores: newScores, total: newScores.reduce((sum, s) => sum + s, 0) };
    });

    setPlayers(updatedPlayers);

    if (currentRound < 7) {
      setCurrentRound(prev => prev + 1);
      setCurrentRoundScores(players.reduce((acc, player) => { acc[player.name] = 0; return acc; }, {}));
      setRoundCloser('');
      showToast(`Ronda ${currentRound} finalizada`);
    } else {
      const sortedPlayers = [...updatedPlayers].sort((a, b) => a.total - b.total);
      const winner = sortedPlayers[0];
      setHallOfFameData(prev => [...prev, {
        date: new Date().toISOString(),
        winner: winner.name,
        players: sortedPlayers.map(p => ({ name: p.name, total: p.total }))
      }]);
      showToast(`¡Juego terminado! Ganador: ${winner.name}`);
      setGameStarted(false);
    }
  };

  const shareResults = async () => {
    const winner = players.reduce((w, p) => p.total < w.total ? p : w);
    const resultsText = `🏆 Resultados Continental\n\n${players
      .sort((a, b) => a.total - b.total)
      .map((p, i) => `${i + 1}. ${p.name}: ${p.total} pts`)
      .join('\n')}\n\n¡Ganador: ${winner.name}!`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Resultados Continental', text: resultsText }); }
      catch (error) { console.log('Error sharing:', error); }
    } else {
      navigator.clipboard.writeText(resultsText);
      showToast('Resultados copiados al portapapeles');
    }
  };

  const getStats = () => {
    if (players.length === 0) return null;
    const sortedPlayers = [...players].sort((a, b) => a.total - b.total);
    const winner = sortedPlayers[0];
    const maxScore = Math.max(...players.map(p => p.total));
    const totalRounds = players.reduce((sum, p) => sum + calculateRoundsWon(p), 0);
    return {
      winner,
      maxScore,
      totalRounds,
      averageScore: Math.round(players.reduce((sum, p) => sum + p.total, 0) / players.length)
    };
  };

  const stats = getStats();
  const currentRoundData = roundsData[currentRound - 1];
  const dealerName = getDealerName();
  const handName = getHandName();

  return (
    <div className="container">
      <header className="glass-panel header">
        <div className="header-left">
          <div className="logo"></div>
          <div>
            <h1>Continental Pro</h1>
            <p className="subtitle">Contador profesional de puntuaciones</p>
          </div>
        </div>
        <div className="header-buttons">
          <Tooltip text="Salón de la Fama">
            <button onClick={() => setShowHallOfFame(true)} className="btn btn-secondary btn-sm">🏆</button>
          </Tooltip>
          <Tooltip text="Ver reglas del juego">
            <button onClick={() => setShowRules(true)} className="btn btn-secondary btn-sm">📋</button>
          </Tooltip>
          <Tooltip text={darkMode ? 'Modo claro' : 'Modo oscuro'}>
            <button onClick={() => setDarkMode(!darkMode)} className="btn btn-secondary btn-sm">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </Tooltip>
        </div>
      </header>

      {!gameStarted ? (
        showResumePrompt ? (
          <div className="glass-panel card" style={{ textAlign: 'center' }}>
            <h2>🔄 Partida Anterior Detectada</h2>
            <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
              Hemos encontrado jugadores de una sesión anterior ({players.map(p => p.name).join(', ')}). ¿Qué deseas hacer?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => {
                setPlayers([]);
                setCurrentRoundScores({});
                setRoundCloser('');
                setShowResumePrompt(false);
              }}>
                Empezar de cero
              </button>
              <button className="btn btn-primary" onClick={() => setShowResumePrompt(false)}>
                Continuar con los mismos
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel card">
            <h2>👥 Configuración de Jugadores</h2>
            <p style={{ font: 'var(--md-body-small)', color: 'var(--md-on-surface-variant)', marginBottom: 'var(--sp-3)' }}>
              Arrastra los jugadores para reordenarlos. El primer jugador será <strong>Repartidor</strong> y el segundo <strong>Mano</strong> en la primera ronda.
            </p>

            <div className="player-input">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Nombre del jugador"
                maxLength="15"
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              />
              <Tooltip text="Añadir jugador (máximo 6)">
                <button onClick={addPlayer} disabled={players.length >= 6 || !newPlayerName.trim()} className="btn btn-primary">
                  ➕ Añadir
                </button>
              </Tooltip>
            </div>

            <div className="player-list">
              {players.map((player, index) => (
                <div
                  key={player.name}
                  className="player-card"
                  draggable={!gameStarted}
                  onDragStart={(e) => {
                    if (gameStarted) return;
                    dragIndex.current = index;
                    e.dataTransfer.effectAllowed = 'move';
                    setTimeout(() => e.currentTarget.classList.add('player-card-dragging'));
                  }}
                  onDragOver={(e) => {
                    if (gameStarted) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragIndex.current !== index) {
                      e.currentTarget.classList.add('player-card-drag-over');
                    }
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('player-card-drag-over');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('player-card-drag-over');
                    if (dragIndex.current !== null && dragIndex.current !== index && !gameStarted) {
                      movePlayer(dragIndex.current, index);
                    }
                    dragIndex.current = null;
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.classList.remove('player-card-dragging', 'player-card-drag-over');
                    document.querySelectorAll('.player-card-drag-over').forEach(el => el.classList.remove('player-card-drag-over'));
                    dragIndex.current = null;
                  }}
                >
                  <div className="player-info">
                    {editingPlayer === player.name ? (
                      <input
                        type="text"
                        defaultValue={player.name}
                        onBlur={(e) => editPlayer(player.name, e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter') editPlayer(player.name, e.target.value); }}
                        autoFocus
                        style={{ background: 'transparent', border: 'none', fontWeight: 'bold' }}
                      />
                    ) : (
                      <strong onClick={() => setEditingPlayer(player.name)} style={{ cursor: 'pointer' }}>
                        <span className="drag-handle">⠿</span> {player.name}
                      </strong>
                    )}
                    <small>{player.total} pts • {calculateRoundsWon(player)} rondas ganadas</small>
                  </div>
                  <div className="player-badges">
                    {index === 0 && <span className="badge badge-dealer">Repartidor</span>}
                    {index === 1 && players.length > 1 && <span className="badge badge-hand">Mano</span>}
                    {players.length > 2 && (
                      <Tooltip text="Eliminar jugador">
                        <button onClick={() => removePlayer(index)} className="btn btn-secondary btn-sm">❌</button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Tooltip text="Iniciar partida con jugadores configurados">
              <button onClick={startGame} disabled={players.length < 2} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                🎮 Iniciar Juego ({players.length} Jugadores)
              </button>
            </Tooltip>
          </div>
        )
      ) : (
        <>
          <div className="glass-panel round-header">
            <h2>🎯 Ronda {currentRoundData.round} de 7 • {currentRoundData.cards} cartas • {currentRoundData.requirement}</h2>
          </div>

          <div className="card-grid">
            <div className="glass-panel card">
              <h3>🎮 Estado del Juego</h3>
              <p><strong>Repartidor:</strong> {dealerName}</p>
              <p><strong>Mano:</strong> {handName}</p>
              {stats && <p><strong>🏆 Líder:</strong> {stats.winner.name} ({stats.winner.total} pts)</p>}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Tooltip text="Ronda anterior">
                  <button className={`btn btn-secondary ${currentRound === 1 ? 'disabled' : ''}`} onClick={() => changeRound('prev')} disabled={currentRound === 1}>
                    ← Anterior
                  </button>
                </Tooltip>
                <Tooltip text="Siguiente ronda">
                  <button className={`btn btn-primary ${currentRound === 7 ? 'disabled' : ''}`} onClick={() => changeRound('next')} disabled={currentRound === 7}>
                    Siguiente →
                  </button>
                </Tooltip>
              </div>
            </div>
            {stats && (
              <div className="glass-panel card">
                <h3>📈 Estadísticas</h3>
                <p><strong>Promedio:</strong> {stats.averageScore} pts</p>
                <p><strong>Máximo:</strong> {stats.maxScore} pts</p>
                <p><strong>Rondas completadas:</strong> {stats.totalRounds}</p>
                <p><strong>Jugadores:</strong> {players.length}</p>
              </div>
            )}
          </div>

          <div className="glass-panel card">
            <h3>📊 Puntuaciones Ronda {currentRound}</h3>
            <p style={{ font: 'var(--md-body-small)', color: 'var(--md-on-surface-variant)', marginBottom: 'var(--sp-3)' }}>
              Selecciona quién cierra la ronda — su puntuación se calcula automáticamente (-10 × {currentRound} = <strong style={{ color: 'var(--md-tertiary)' }}>-{10 * currentRound} pts</strong>).
              Ingresa los puntos de penalización de los demás jugadores.
            </p>
            <div className="scoreboard-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Jugador</th>
                    <th>Cierra</th>
                    <th>Puntos</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.name}>
                      <td className="player-name">
                        {player.name}
                        {dealerName === player.name && <> <span className="badge badge-dealer">Reparte</span></>}
                        {handName === player.name && <> <span className="badge badge-hand">Mano</span></>}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="radio"
                          name="roundCloser"
                          checked={roundCloser === player.name}
                          onChange={() => setRoundCloserPlayer(player.name)}
                          style={{ accentColor: 'var(--md-primary)', transform: 'scale(1.2)', cursor: 'pointer' }}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {roundCloser === player.name ? (
                            <span className="negative-score" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--md-shape-sm)', fontWeight: 700 }}>
                              -{10 * currentRound}
                              <span className="auto-score-tag">Auto</span>
                            </span>
                          ) : (
                            <input
                              type="number"
                              className="score-input"
                              value={currentRoundScores[player.name] || ''}
                              onChange={(e) => updateCurrentRoundScore(player.name, e.target.value)}
                              disabled={roundCloser === player.name}
                              min="1"
                              max="999"
                              placeholder="0"
                            />
                          )}
                        </div>
                      </td>
                      <td className="total-score">{player.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button onClick={finishRound} className="btn btn-primary">
                {currentRound < 7 ? 'Finalizar Ronda' : 'Finalizar Juego'}
              </button>
            </div>
          </div>
        </>
      )}

      {players.length > 0 && (
        <div className="glass-panel scoreboard">
          <div className="scoreboard-scroll">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Jugador</th>
                  {roundsData.map((round, idx) => (
                    <th
                      key={idx}
                      className={idx === currentRound - 1 && gameStarted ? 'current-round' : ''}
                      title={`${round.cards} cartas - ${round.requirement}`}
                    >
                      R{round.round}
                    </th>
                  ))}
                  <th>Total</th>
                  <th>🏆</th>
                </tr>
              </thead>
              <tbody>
                {[...players].sort((a, b) => a.total - b.total).map((player, position) => {
                  const originalIndex = players.findIndex(p => p.name === player.name);
                  return (
                    <tr key={player.name} className={position === 0 ? 'winner-row' : ''}>
                      <td className="position">{position + 1}</td>
                      <td className="player-name">
                        {player.name}
                        {position === 0 && ' 🥇'}
                        {position === 1 && ' 🥈'}
                        {position === 2 && ' 🥉'}
                      </td>
                      {player.scores.map((score, roundIndex) => (
                        <td key={roundIndex}>
                          <input
                            type="number"
                            value={score || ''}
                            onChange={(e) => updateScore(originalIndex, roundIndex, e.target.value)}
                            className={`score-input${score < 0 ? ' negative-score' : ''}`}
                            min="-999"
                            max="999"
                          />
                        </td>
                      ))}
                      <td className="total-score">{player.total}</td>
                      <td style={{ textAlign: 'center' }}>{calculateRoundsWon(player)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {players.length > 0 && (
        <div className="controls">
          <Tooltip text="Reiniciar partida completa">
            <button className="btn btn-secondary" onClick={resetGame}>♻️ Reiniciar Partida</button>
          </Tooltip>
          <Tooltip text="Compartir resultados">
            <button className="btn btn-secondary" onClick={shareResults}>📤 Compartir Resultados</button>
          </Tooltip>
        </div>
      )}

      {showAbandonConfirmation && (
        <div className="overlay show">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>⚠️ Confirmación</h3>
            <p style={{ marginBottom: '1.5rem' }}>¿Estás seguro de que quieres reiniciar todas las puntuaciones?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowAbandonConfirmation(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={confirmReset}>Sí, reiniciar</button>
            </div>
          </div>
        </div>
      )}

      {showHallOfFame && (
        <div className="overlay show">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>🏆 Salón de la Fama</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowHallOfFame(false)}>❌</button>
            </div>
            {hallOfFameData.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                Aún no hay partidas registradas. ¡Juega una partida completa para aparecer aquí!
              </p>
            ) : (
              <>
                <h4 style={{ marginBottom: '0.5rem' }}>Ranking de Campeones</h4>
                <div className="scoreboard-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Jugador</th>
                        <th>Victorias</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(hallOfFameData.reduce((acc, game) => {
                        acc[game.winner] = (acc[game.winner] || 0) + 1;
                        return acc;
                      }, {})).sort((a, b) => b[1] - a[1]).map(([name, wins], idx) => (
                        <tr key={name} className={idx === 0 ? 'winner-row' : ''}>
                          <td>{idx + 1}</td>
                          <td>{name} {idx === 0 && '🥇'}{idx === 1 && '🥈'}{idx === 2 && '🥉'}</td>
                          <td>{wins} {wins === 1 ? 'victoria' : 'victorias'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <details style={{ marginTop: '1rem' }}>
                  <summary style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
                    Historial de partidas ({hallOfFameData.length})
                  </summary>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '0.5rem' }}>
                    {[...hallOfFameData].reverse().map((game, idx) => (
                      <div key={idx} style={{ padding: '0.5rem', borderBottom: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
                        <strong>{game.winner}</strong> ganó el {new Date(game.date).toLocaleDateString()} -
                        {game.players.map(p => `${p.name} (${p.total}pts)`).join(', ')}
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
        <div className="overlay show">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>📖 Manual del Continental</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {speechStatus === 'idle' && (
                  <Tooltip text="Leer en voz alta">
                    <button className="btn btn-secondary btn-sm" onClick={() => speakText(continentalManualHTML)}>🔊</button>
                  </Tooltip>
                )}
                {speechStatus === 'speaking' && (
                  <>
                    <Tooltip text="Pausar"><button className="btn btn-secondary btn-sm" onClick={pauseSpeech}>⏸️</button></Tooltip>
                    <Tooltip text="Detener"><button className="btn btn-secondary btn-sm" onClick={cancelSpeech}>⏹️</button></Tooltip>
                  </>
                )}
                {speechStatus === 'paused' && (
                  <>
                    <Tooltip text="Reanudar"><button className="btn btn-secondary btn-sm" onClick={resumeSpeech}>▶️</button></Tooltip>
                    <Tooltip text="Detener"><button className="btn btn-secondary btn-sm" onClick={cancelSpeech}>⏹️</button></Tooltip>
                  </>
                )}
                <button className="btn btn-secondary btn-sm" onClick={() => { cancelSpeech(); setShowRules(false); }}>❌</button>
              </div>
            </div>
            <div className="rules-content" dangerouslySetInnerHTML={{ __html: continentalManualHTML }} />
          </div>
        </div>
      )}

      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </div>

      <footer className="footer">
        <div style={{ marginBottom: '1rem' }}>
          <strong>Continental Pro Ultimate</strong> - La mejor experiencia de Continental
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <span>🃏 Tradicional</span>
          <span>📱 Responsive</span>
          <span>💾 Auto-guardado</span>
          <span>🎯 Profesional</span>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
