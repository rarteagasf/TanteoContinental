const {
  useState,
  useEffect,
  useRef
} = React;
const roundsData = [{
  round: 1,
  cards: 7,
  requirement: "2 Tríos"
}, {
  round: 2,
  cards: 8,
  requirement: "1 Trío, 1 Escalera"
}, {
  round: 3,
  cards: 9,
  requirement: "2 Escaleras"
}, {
  round: 4,
  cards: 10,
  requirement: "3 Tríos"
}, {
  round: 5,
  cards: 11,
  requirement: "2 Tríos, 1 Escalera"
}, {
  round: 6,
  cards: 12,
  requirement: "1 Trío, 2 Escaleras"
}, {
  round: 7,
  cards: 13,
  requirement: "3 Escaleras"
}];
const PLAYER_COLORS = ['#7a4b1a', '#2a6b4a', '#2a4d7a', '#6a2a7a', '#7a6a1a', '#1a5a7a'];
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

/* ── SVG Icon Components ── */
const IconChart = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("line", {
  x1: "18",
  y1: "20",
  x2: "18",
  y2: "10"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "20",
  x2: "12",
  y2: "4"
}), /*#__PURE__*/React.createElement("line", {
  x1: "6",
  y1: "20",
  x2: "6",
  y2: "14"
}), /*#__PURE__*/React.createElement("line", {
  x1: "2",
  y1: "20",
  x2: "22",
  y2: "20"
}));
const IconStats = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 3v18h18"
}), /*#__PURE__*/React.createElement("path", {
  d: "m19 9-5 5-4-4-3 3"
}));
const IconSettings = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "3"
}), /*#__PURE__*/React.createElement("path", {
  d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
}));
const IconHistory = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "12 6 12 12 16 14"
}));
const IconHelp = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("path", {
  d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "17",
  x2: "12.01",
  y2: "17"
}));
const IconSun = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "5"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "1",
  x2: "12",
  y2: "3"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "21",
  x2: "12",
  y2: "23"
}), /*#__PURE__*/React.createElement("line", {
  x1: "4.22",
  y1: "4.22",
  x2: "5.64",
  y2: "5.64"
}), /*#__PURE__*/React.createElement("line", {
  x1: "18.36",
  y1: "18.36",
  x2: "19.78",
  y2: "19.78"
}), /*#__PURE__*/React.createElement("line", {
  x1: "1",
  y1: "12",
  x2: "3",
  y2: "12"
}), /*#__PURE__*/React.createElement("line", {
  x1: "21",
  y1: "12",
  x2: "23",
  y2: "12"
}), /*#__PURE__*/React.createElement("line", {
  x1: "4.22",
  y1: "19.78",
  x2: "5.64",
  y2: "18.36"
}), /*#__PURE__*/React.createElement("line", {
  x1: "18.36",
  y1: "5.64",
  x2: "19.78",
  y2: "4.22"
}));
const IconMoon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
}));

/* ── Player Avatar ── */
function PlayerAvatar({
  name,
  index,
  size
}) {
  const sz = size || 40;
  const initial = (name || '?').charAt(0).toUpperCase();
  const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-player-avatar",
    style: {
      background: color,
      width: sz,
      height: sz,
      fontSize: Math.round(sz * 0.38)
    }
  }, initial);
}

/* ── Toast ── */
const Toast = ({
  message,
  onDismiss
}) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-toast"
  }, message);
};

/* ── Tooltip ── */
const Tooltip = ({
  children,
  text
}) => /*#__PURE__*/React.createElement("div", {
  className: "tooltip"
}, children, /*#__PURE__*/React.createElement("div", {
  className: "tooltip-text"
}, text));

/* ── Helpers ── */
const calculateRoundsWon = player => player.scores.filter(s => s < 0).length;
const saveLS = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
};
const loadLS = (key, def) => {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : def;
  } catch (e) {
    return def;
  }
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
  const [darkMode, setDarkMode] = useState(() => loadLS('continental-theme', 'dark') !== 'light');
  const [toasts, setToasts] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [gameStarted, setGameStarted] = useState(() => loadLS('continental-started', false));
  const [roundCloser, setRoundCloser] = useState(() => loadLS('continental-closer', ''));
  const [currentRoundScores, setCurrentRoundScores] = useState(() => loadLS('continental-round-scores', {}));
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(() => {
    const saved = loadLS('continental-players', []);
    const started = loadLS('continental-started', false);
    return saved.length > 0 && !started;
  });
  const [activeTab, setActiveTab] = useState('puntos');
  const [undoData, setUndoData] = useState(() => loadLS('continental-undo', null));
  const speechRef = useRef(null);
  const [speechStatus, setSpeechStatus] = useState('idle');
  const dragIndex = useRef(null);

  /* ── Persistence ── */
  useEffect(() => {
    saveLS('continental-players', players);
  }, [players]);
  useEffect(() => {
    saveLS('continental-started', gameStarted);
  }, [gameStarted]);
  useEffect(() => {
    saveLS('continental-closer', roundCloser);
  }, [roundCloser]);
  useEffect(() => {
    saveLS('continental-round-scores', currentRoundScores);
  }, [currentRoundScores]);
  useEffect(() => {
    saveLS('continental-round', currentRound);
  }, [currentRound]);
  useEffect(() => {
    saveLS('continental-global-stats', hallOfFameData);
  }, [hallOfFameData]);
  useEffect(() => {
    saveLS('continental-undo', undoData);
  }, [undoData]);
  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-scheme', theme);
    saveLS('continental-theme', theme);
  }, [darkMode]);

  /* ── Toast ── */
  const showToast = msg => {
    const id = Date.now();
    setToasts(prev => [...prev, {
      id,
      message: msg
    }]);
  };
  const dismissToast = id => setToasts(prev => prev.filter(t => t.id !== id));

  /* ── Speech ── */
  const speakText = text => {
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
  const pauseSpeech = () => {
    if ('speechSynthesis' in window) speechSynthesis.pause();
  };
  const resumeSpeech = () => {
    if ('speechSynthesis' in window) speechSynthesis.resume();
  };
  const cancelSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      speechRef.current = null;
      setSpeechStatus('idle');
    }
  };

  /* ── Player Management ── */
  const addPlayer = () => {
    if (!newPlayerName.trim() || players.length >= 6) return;
    const cap = newPlayerName.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    if (players.some(p => p.name.toLowerCase() === cap.toLowerCase())) {
      showToast('Ya existe un jugador con ese nombre');
      return;
    }
    setPlayers([...players, {
      name: cap,
      scores: Array(7).fill(0),
      total: 0
    }]);
    setNewPlayerName('');
    showToast(`${cap} añadido`);
  };
  const removePlayer = index => {
    if (players.length > 2) {
      const n = players[index].name;
      setPlayers(players.filter((_, i) => i !== index));
      showToast(`${n} eliminado`);
    }
  };
  const editPlayer = (oldName, newName) => {
    if (!newName.trim()) return;
    const cap = newName.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    if (players.some(p => p.name.toLowerCase() === cap.toLowerCase() && p.name !== oldName)) {
      showToast('Ya existe ese nombre');
      return;
    }
    setPlayers(prev => prev.map(p => p.name === oldName ? {
      ...p,
      name: cap
    } : p));
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
  const getDealerName = () => !gameStarted || players.length === 0 ? '' : players[(currentRound - 1) % players.length].name;
  const getHandName = () => !gameStarted || players.length < 2 ? '' : players[currentRound % players.length].name;
  const updateScore = (pi, ri, score) => {
    if (score === '' || score === null) return;
    const n = Number(score);
    if (!Number.isInteger(n)) {
      showToast('La puntuación debe ser un número entero');
      return;
    }
    if (n === 0) {
      showToast('La puntuación no puede ser 0');
      return;
    }
    const np = [...players];
    np[pi].scores[ri] = n;
    np[pi].total = np[pi].scores.reduce((s, v) => s + v, 0);
    setPlayers(np);
  };
  const setRoundCloserPlayer = name => {
    const cs = -10 * currentRound;
    setRoundCloser(name);
    const ns = {
      ...currentRoundScores
    };
    Object.keys(ns).forEach(k => {
      if (ns[k] === -10 * currentRound) ns[k] = 0;
    });
    ns[name] = cs;
    setCurrentRoundScores(ns);
  };
  const updateCurrentRoundScore = (name, score) => {
    if (score === '' || score === null) {
      setCurrentRoundScores(prev => ({
        ...prev,
        [name]: 0
      }));
      return;
    }
    const n = Number(score);
    if (!Number.isInteger(n)) {
      showToast('La puntuación debe ser un número entero');
      return;
    }
    if (n === 0) {
      showToast('La puntuación no puede ser 0');
      return;
    }
    setCurrentRoundScores(prev => ({
      ...prev,
      [name]: n
    }));
  };

  /* ── Game Flow ── */
  const startGame = () => {
    setGameStarted(true);
    setCurrentRound(1);
    setCurrentRoundScores(players.reduce((acc, p) => {
      acc[p.name] = 0;
      return acc;
    }, {}));
    setRoundCloser('');
    showToast('¡Partida iniciada!');
  };
  const confirmNewGameSame = () => {
    setPlayers(players.map(p => ({
      ...p,
      scores: Array(7).fill(0),
      total: 0
    })));
    setCurrentRound(1);
    setGameStarted(false);
    setCurrentRoundScores({});
    setRoundCloser('');
    setShowResumePrompt(false);
    setUndoData(null);
    showToast('¡Nueva partida lista!');
    setShowNewGameDialog(false);
  };
  const confirmNewGameNew = () => {
    setPlayers([]);
    setCurrentRound(1);
    setGameStarted(false);
    setCurrentRoundScores({});
    setRoundCloser('');
    setShowResumePrompt(false);
    setUndoData(null);
    showToast('¡Empezando desde cero!');
    setShowNewGameDialog(false);
  };
  const handleNewGame = () => {
    if (players.length > 0) setShowNewGameDialog(true);else {
      setGameStarted(false);
      setShowResumePrompt(false);
    }
  };
  const finishRound = () => {
    if (!roundCloser) {
      showToast('Selecciona quién cierra la ronda');
      return;
    }
    for (const p of players) {
      if (p.name !== roundCloser) {
        const s = currentRoundScores[p.name] || 0;
        if (s === 0) {
          showToast(`Falta la puntuación de ${p.name}`);
          return;
        }
      }
    }
    setUndoData({
      players: JSON.parse(JSON.stringify(players)),
      currentRound,
      currentRoundScores: {
        ...currentRoundScores
      },
      roundCloser
    });
    const updated = players.map(player => {
      const rs = currentRoundScores[player.name] || 0;
      const ns = [...player.scores];
      ns[currentRound - 1] = rs;
      return {
        ...player,
        scores: ns,
        total: ns.reduce((s, v) => s + v, 0)
      };
    });
    setPlayers(updated);
    if (currentRound < 7) {
      setCurrentRound(prev => prev + 1);
      setCurrentRoundScores(players.reduce((acc, p) => {
        acc[p.name] = 0;
        return acc;
      }, {}));
      setRoundCloser('');
      showToast(`Ronda ${currentRound} completada ✓`);
    } else {
      const sorted = [...updated].sort((a, b) => a.total - b.total);
      const winner = sorted[0];
      setHallOfFameData(prev => [...prev, {
        date: new Date().toISOString(),
        winner: winner.name,
        players: sorted.map(p => ({
          name: p.name,
          total: p.total
        }))
      }]);
      showToast(`¡Juego terminado! Ganador: ${winner.name} 🏆`);
      setGameStarted(false);
    }
  };
  const handleUndoLast = () => {
    if (!undoData) {
      showToast('Nada que deshacer');
      return;
    }
    setPlayers(undoData.players);
    setCurrentRound(undoData.currentRound);
    setCurrentRoundScores(undoData.currentRoundScores);
    setRoundCloser(undoData.roundCloser);
    setUndoData(null);
    showToast('Última ronda deshecha ↩');
  };
  const shareResults = async () => {
    if (players.length === 0) return;
    const sorted = [...players].sort((a, b) => a.total - b.total);
    const text = `🏆 Resultados Continental\n\n${sorted.map((p, i) => `${i + 1}. ${p.name}: ${p.total} pts`).join('\n')}\n\n¡Ganador: ${sorted[0].name}!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Continental',
          text
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(text);
      showToast('Resultados copiados al portapapeles');
    }
  };
  const getStats = () => {
    if (players.length === 0) return null;
    const sorted = [...players].sort((a, b) => a.total - b.total);
    return {
      winner: sorted[0],
      sorted,
      averageScore: Math.round(players.reduce((s, p) => s + p.total, 0) / players.length)
    };
  };
  const getMediaRonda = () => {
    if (!gameStarted || players.length === 0 || currentRound <= 1) return '—';
    const rp = currentRound - 1;
    const all = players.flatMap(p => p.scores.slice(0, rp).filter(s => s !== 0));
    if (all.length === 0) return '—';
    return (all.reduce((s, v) => s + Math.abs(v), 0) / all.length).toFixed(1);
  };
  const stats = getStats();
  const currentRoundData = roundsData[currentRound - 1];
  const dealerName = getDealerName();
  const scoringPanelRef = useRef(null);

  /* ══════════════════════════════════════════
     RENDER: SETUP VIEW
  ══════════════════════════════════════════ */
  const renderSetupView = () => {
    if (showResumePrompt) {
      return /*#__PURE__*/React.createElement("div", {
        className: "cc-resume-prompt"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 36,
          marginBottom: 12
        }
      }, "\uD83D\uDD04"), /*#__PURE__*/React.createElement("div", {
        className: "cc-page-title",
        style: {
          fontSize: 20,
          marginBottom: 8
        }
      }, "Partida Anterior Detectada"), /*#__PURE__*/React.createElement("p", {
        className: "cc-resume-desc"
      }, "Jugadores encontrados: ", /*#__PURE__*/React.createElement("strong", null, players.map(p => p.name).join(', ')), ". \xBFQu\xE9 deseas hacer?"), /*#__PURE__*/React.createElement("div", {
        className: "cc-resume-actions"
      }, /*#__PURE__*/React.createElement("button", {
        className: "cc-btn cc-btn-secondary",
        onClick: () => {
          setPlayers([]);
          setCurrentRoundScores({});
          setRoundCloser('');
          setShowResumePrompt(false);
        }
      }, "Empezar de cero"), /*#__PURE__*/React.createElement("button", {
        className: "cc-btn cc-btn-primary",
        onClick: () => setShowResumePrompt(false)
      }, "Continuar")));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "cc-setup"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-page-title"
    }, "Configurar Partida"), /*#__PURE__*/React.createElement("p", {
      className: "cc-section-sub"
    }, "A\xF1ade de 2 a 6 jugadores. Arrastra para reordenar el orden de turno."), /*#__PURE__*/React.createElement("div", {
      className: "cc-player-add-form"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "cc-player-name-input",
      value: newPlayerName,
      onChange: e => setNewPlayerName(e.target.value),
      placeholder: "Nombre del jugador...",
      maxLength: "15",
      onKeyPress: e => e.key === 'Enter' && addPlayer()
    }), /*#__PURE__*/React.createElement("button", {
      className: "cc-btn-add",
      onClick: addPlayer,
      disabled: players.length >= 6 || !newPlayerName.trim()
    }, "A\xF1adir")), /*#__PURE__*/React.createElement("div", {
      className: "cc-player-list"
    }, players.map((player, index) => /*#__PURE__*/React.createElement("div", {
      key: player.name,
      className: "cc-player-item",
      draggable: !gameStarted,
      onDragStart: e => {
        dragIndex.current = index;
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => e.currentTarget.classList.add('dragging'));
      },
      onDragOver: e => {
        e.preventDefault();
        if (dragIndex.current !== index) e.currentTarget.classList.add('drag-over');
      },
      onDragLeave: e => e.currentTarget.classList.remove('drag-over'),
      onDrop: e => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        if (dragIndex.current !== null && dragIndex.current !== index && !gameStarted) movePlayer(dragIndex.current, index);
        dragIndex.current = null;
      },
      onDragEnd: e => {
        e.currentTarget.classList.remove('dragging', 'drag-over');
        document.querySelectorAll('.cc-player-item.drag-over').forEach(el => el.classList.remove('drag-over'));
        dragIndex.current = null;
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cc-drag-handle"
    }, "\u283F"), /*#__PURE__*/React.createElement(PlayerAvatar, {
      name: player.name,
      index: index,
      size: 34
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, editingPlayer === player.name ? /*#__PURE__*/React.createElement("input", {
      type: "text",
      defaultValue: player.name,
      onBlur: e => editPlayer(player.name, e.target.value),
      onKeyPress: e => {
        if (e.key === 'Enter') editPlayer(player.name, e.target.value);
      },
      autoFocus: true,
      style: {
        background: 'transparent',
        border: 'none',
        color: 'inherit',
        fontWeight: 600,
        fontSize: 13,
        outline: 'none',
        width: '100%'
      }
    }) : /*#__PURE__*/React.createElement("div", {
      className: "cc-player-item-name",
      onClick: () => setEditingPlayer(player.name),
      style: {
        cursor: 'pointer'
      }
    }, player.name)), /*#__PURE__*/React.createElement("div", {
      className: "cc-player-item-badges"
    }, index === 0 && /*#__PURE__*/React.createElement("span", {
      className: "cc-badge cc-badge-dealer"
    }, "Reparte"), index === 1 && players.length > 1 && /*#__PURE__*/React.createElement("span", {
      className: "cc-badge cc-badge-hand"
    }, "Mano"), players.length > 2 && /*#__PURE__*/React.createElement("button", {
      className: "cc-btn-remove",
      onClick: () => removePlayer(index),
      title: "Eliminar"
    }, "\u2715"))))), players.length >= 2 && /*#__PURE__*/React.createElement("div", {
      className: "cc-info-bar"
    }, /*#__PURE__*/React.createElement("span", null, "\u2139"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Repartidor R1:"), " ", players[0]?.name, "\xA0\xA0\xB7\xA0\xA0", /*#__PURE__*/React.createElement("strong", null, "Mano R1:"), " ", players[1]?.name)), /*#__PURE__*/React.createElement("button", {
      className: "cc-btn-start",
      onClick: startGame,
      disabled: players.length < 2
    }, "\uD83C\uDFAE Iniciar Partida \u2014 ", players.length, " jugadores"));
  };

  /* ══════════════════════════════════════════
     RENDER: GAME VIEW (Puntos tab)
  ══════════════════════════════════════════ */
  const renderGameView = () => {
    const progress = Math.round((currentRound - 1) / 7 * 100);
    const remaining = 7 - currentRound + 1;
    return /*#__PURE__*/React.createElement("div", {
      className: "cc-game-view"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-game-header"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "cc-page-title"
    }, "Partida Activa"), /*#__PURE__*/React.createElement("p", {
      className: "cc-page-subtitle"
    }, "Jugando Ronda ", currentRound, " de 7 \u2014 ", currentRoundData.requirement, " \u2014 ", currentRoundData.cards, " cartas")), /*#__PURE__*/React.createElement("div", {
      className: "cc-winner-rule-badge"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-rule-icon-wrap"
    }, "\uD83C\uDCCF"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "cc-rule-label"
    }, "Regla del Ganador"), /*#__PURE__*/React.createElement("div", {
      className: "cc-rule-value"
    }, "(-10 \xD7 N\xBA de Ronda)")))), /*#__PURE__*/React.createElement("div", {
      className: "cc-table-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-table-scroll"
    }, /*#__PURE__*/React.createElement("table", {
      className: "cc-score-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      className: "cc-th-rounds"
    }, "Rondas"), players.map((player, idx) => {
      const isLeader = stats && stats.winner.name === player.name;
      return /*#__PURE__*/React.createElement("th", {
        key: player.name,
        className: `cc-th-player${isLeader ? ' cc-th-leader' : ''}`
      }, isLeader && /*#__PURE__*/React.createElement("div", {
        className: "cc-trophy-icon"
      }, "\uD83C\uDFC6"), /*#__PURE__*/React.createElement(PlayerAvatar, {
        name: player.name,
        index: idx,
        size: 38
      }), /*#__PURE__*/React.createElement("div", {
        className: `cc-th-name${isLeader ? ' cc-leader-name' : ''}`
      }, player.name));
    }))), /*#__PURE__*/React.createElement("tbody", null, roundsData.map((round, roundIdx) => {
      const isCurrent = roundIdx === currentRound - 1;
      const isPast = roundIdx < currentRound - 1;
      const rowClass = isCurrent ? 'cc-tr-current' : isPast ? 'cc-tr-past' : 'cc-tr-future';
      return /*#__PURE__*/React.createElement("tr", {
        key: roundIdx,
        className: `cc-tr ${rowClass}`
      }, /*#__PURE__*/React.createElement("td", {
        className: "cc-td-round-info"
      }, /*#__PURE__*/React.createElement("div", {
        className: "cc-round-title"
      }, "R", round.round, ": ", round.requirement), isPast && /*#__PURE__*/React.createElement("span", {
        className: "cc-round-status-badge completed"
      }, "Completada"), isCurrent && /*#__PURE__*/React.createElement("span", {
        className: "cc-round-status-badge active"
      }, "En curso")), players.map((player, pIdx) => {
        const origIdx = players.findIndex(p => p.name === player.name);
        const isLeader = stats && stats.winner.name === player.name;
        const leaderCls = isLeader ? ' cc-td-leader' : '';
        if (isCurrent) {
          if (roundCloser === player.name) {
            return /*#__PURE__*/React.createElement("td", {
              key: player.name,
              className: `cc-td-score cc-td-current${leaderCls}`
            }, /*#__PURE__*/React.createElement("span", {
              className: "cc-closer-value"
            }, "-", 10 * currentRound));
          }
          const cs = currentRoundScores[player.name];
          return /*#__PURE__*/React.createElement("td", {
            key: player.name,
            className: `cc-td-score cc-td-current${leaderCls}`
          }, cs ? /*#__PURE__*/React.createElement("span", {
            className: "cc-current-score"
          }, cs) : /*#__PURE__*/React.createElement("span", {
            className: "cc-placeholder",
            onClick: () => scoringPanelRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            })
          }, "+"));
        } else if (isPast) {
          const score = player.scores[roundIdx];
          return /*#__PURE__*/React.createElement("td", {
            key: player.name,
            className: `cc-td-score cc-td-past${score < 0 ? ' cc-td-negative' : ''}${leaderCls}`
          }, /*#__PURE__*/React.createElement("input", {
            type: "number",
            className: "cc-score-edit",
            value: score || '',
            onChange: e => updateScore(origIdx, roundIdx, e.target.value),
            min: "-999",
            max: "999"
          }));
        } else {
          return /*#__PURE__*/React.createElement("td", {
            key: player.name,
            className: `cc-td-score cc-td-future${leaderCls}`
          }, /*#__PURE__*/React.createElement("span", {
            className: "cc-dash"
          }, "\u2014"));
        }
      }));
    })), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
      className: "cc-total-row"
    }, /*#__PURE__*/React.createElement("td", {
      className: "cc-td-round-info cc-total-label"
    }, "Puntuaci\xF3n Total"), players.map(player => {
      const isLeader = stats && stats.winner.name === player.name;
      return /*#__PURE__*/React.createElement("td", {
        key: player.name,
        className: `cc-td-total${isLeader ? ' cc-total-leader' : ''}`
      }, player.total || 0);
    })))))), /*#__PURE__*/React.createElement("div", {
      className: "cc-scoring-panel",
      ref: scoringPanelRef
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-scoring-header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-scoring-title"
    }, "\u270F Puntos \u2014 Ronda ", currentRound), /*#__PURE__*/React.createElement("div", {
      className: "cc-scoring-hint"
    }, "ENTEROS / NO CERO")), /*#__PURE__*/React.createElement("p", {
      className: "cc-scoring-desc"
    }, "Selecciona qui\xE9n cierra (se asignan -", 10 * currentRound, " pts autom\xE1ticamente) e ingresa los puntos del resto."), /*#__PURE__*/React.createElement("div", {
      className: "cc-scoring-grid"
    }, players.map((player, idx) => /*#__PURE__*/React.createElement("div", {
      key: player.name,
      className: `cc-scoring-player${roundCloser === player.name ? ' cc-scoring-closer' : ''}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-scoring-player-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-scoring-mini-avatar",
      style: {
        background: PLAYER_COLORS[idx % PLAYER_COLORS.length]
      }
    }, player.name.charAt(0)), /*#__PURE__*/React.createElement("span", {
      className: "cc-scoring-player-name"
    }, player.name)), /*#__PURE__*/React.createElement("div", {
      className: "cc-scoring-input-area"
    }, /*#__PURE__*/React.createElement("label", {
      className: "cc-closer-toggle"
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: "roundCloser",
      checked: roundCloser === player.name,
      onChange: () => setRoundCloserPlayer(player.name)
    }), /*#__PURE__*/React.createElement("span", null, "Cierra")), roundCloser === player.name ? /*#__PURE__*/React.createElement("div", {
      className: "cc-auto-score"
    }, "-", 10 * currentRound, /*#__PURE__*/React.createElement("span", {
      className: "cc-auto-tag"
    }, "Auto")) : /*#__PURE__*/React.createElement("input", {
      type: "number",
      className: "cc-score-input-field",
      value: currentRoundScores[player.name] || '',
      onChange: e => updateCurrentRoundScore(player.name, e.target.value),
      placeholder: "Pts",
      min: "1",
      max: "999"
    })))))), /*#__PURE__*/React.createElement("div", {
      className: "cc-stats-grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-icon-wrap"
    }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-label"
    }, "Media Puntos/Ronda"), /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-value"
    }, getMediaRonda())), /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-icon-wrap"
    }, "\u23F1"), /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-label"
    }, "Rondas Restantes"), /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-value"
    }, remaining, " ", /*#__PURE__*/React.createElement("span", {
      className: "cc-stat-sub"
    }, "de 7 Total")), /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-hint"
    }, "Tiempo est. restante: ~", remaining * 7, " min")), /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-icon-wrap"
    }, "\u2B50"), /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-label"
    }, "Progreso de Partida"), /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-value"
    }, progress, "%"), /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-bar-track"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-stat-bar-fill",
      style: {
        width: `${progress}%`
      }
    })))), /*#__PURE__*/React.createElement("div", {
      className: "cc-actions-bar"
    }, /*#__PURE__*/React.createElement("button", {
      className: "cc-action-btn",
      onClick: handleUndoLast,
      disabled: !undoData
    }, "\u21A9 Deshacer \xDAltimo"), /*#__PURE__*/React.createElement("button", {
      className: "cc-action-btn",
      onClick: () => showToast('💾 Guardado automáticamente')
    }, "\uD83D\uDCBE Guardar Partida"), /*#__PURE__*/React.createElement("button", {
      className: "cc-action-btn cc-action-accent",
      onClick: () => scoringPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }, "+1 A\xF1adir Puntos"), /*#__PURE__*/React.createElement("button", {
      className: "cc-action-btn cc-action-primary",
      onClick: finishRound
    }, currentRound < 7 ? 'SIGUIENTE RONDA' : 'FINALIZAR JUEGO', " \u2192")));
  };

  /* ══════════════════════════════════════════
     RENDER: ESTADÍSTICAS TAB
  ══════════════════════════════════════════ */
  const renderEstadisticasTab = () => {
    if (players.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--cc-text-sec)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 56,
          marginBottom: 16
        }
      }, "\uD83D\uDCCA"), /*#__PURE__*/React.createElement("div", {
        className: "cc-page-title",
        style: {
          marginBottom: 8
        }
      }, "Sin datos"), /*#__PURE__*/React.createElement("p", null, "Inicia una partida para ver estad\xEDsticas."));
    }
    const sorted = [...players].sort((a, b) => a.total - b.total);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "cc-page-title"
    }, "Estad\xEDsticas"), /*#__PURE__*/React.createElement("p", {
      className: "cc-section-sub"
    }, "Clasificaci\xF3n y rendimiento actual de los jugadores."), /*#__PURE__*/React.createElement("div", {
      className: "cc-rankings"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-rankings-header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cc-rankings-title"
    }, "Clasificaci\xF3n Actual"), stats && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--cc-text-sec)'
      }
    }, "L\xEDder: ", stats.winner.name)), sorted.map((player, idx) => {
      const posClass = idx === 0 ? 'first' : idx === 1 ? 'second' : idx === 2 ? 'third' : 'other';
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
      const origIdx = players.findIndex(p => p.name === player.name);
      return /*#__PURE__*/React.createElement("div", {
        key: player.name,
        className: "cc-ranking-row"
      }, /*#__PURE__*/React.createElement("div", {
        className: `cc-rank-pos ${posClass}`
      }, idx + 1), /*#__PURE__*/React.createElement(PlayerAvatar, {
        name: player.name,
        index: origIdx,
        size: 32
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "cc-rank-name"
      }, player.name, " ", medal), /*#__PURE__*/React.createElement("div", {
        className: "cc-rank-bar-track"
      }, /*#__PURE__*/React.createElement("div", {
        className: "cc-rank-bar-fill",
        style: {
          width: `${100 - idx / Math.max(sorted.length - 1, 1) * 65}%`
        }
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: 'right',
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: `cc-rank-total${idx === 0 ? ' leader' : ''}`
      }, player.total), /*#__PURE__*/React.createElement("div", {
        className: "cc-rank-rounds-won"
      }, calculateRoundsWon(player), " rondas ganadas")));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "cc-btn cc-btn-secondary",
      onClick: () => setShowHallOfFame(true),
      style: {
        flex: 1
      }
    }, "\uD83C\uDFC6 Sal\xF3n de la Fama"), /*#__PURE__*/React.createElement("button", {
      className: "cc-btn cc-btn-secondary",
      onClick: shareResults,
      style: {
        flex: 1
      }
    }, "\uD83D\uDCE4 Compartir Resultados")));
  };

  /* ══════════════════════════════════════════
     RENDER: AJUSTES TAB
  ══════════════════════════════════════════ */
  const renderAjustesTab = () => /*#__PURE__*/React.createElement("div", {
    className: "cc-settings"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-page-title"
  }, "Ajustes"), /*#__PURE__*/React.createElement("p", {
    className: "cc-section-sub"
  }, "Configuraci\xF3n de la aplicaci\xF3n."), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-section-title"
  }, "Apariencia"), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row",
    onClick: () => setDarkMode(!darkMode)
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-label"
  }, "Modo Oscuro"), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-desc"
  }, "Tema de madera oscura premium")), /*#__PURE__*/React.createElement("div", {
    className: `cc-toggle${darkMode ? ' on' : ''}`
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-section-title"
  }, "Partida"), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row",
    onClick: () => setShowRules(true)
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-label"
  }, "\uD83D\uDCD6 Reglas del Continental"), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-desc"
  }, "Ver manual completo del juego")), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-action"
  }, "\u203A")), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row",
    onClick: handleNewGame
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-label"
  }, "\uD83C\uDCCF Nueva Partida"), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-desc"
  }, "Reiniciar con los mismos o nuevos jugadores")), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-action"
  }, "\u203A")), players.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row",
    onClick: shareResults
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-label"
  }, "\uD83D\uDCE4 Compartir Resultados"), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-desc"
  }, "Enviar las puntuaciones actuales")), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-action"
  }, "\u203A")), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row",
    onClick: () => setShowHallOfFame(true)
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-label"
  }, "\uD83C\uDFC6 Sal\xF3n de la Fama"), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-desc"
  }, "Historial de partidas y campeones")), /*#__PURE__*/React.createElement("div", {
    className: "cc-settings-row-action"
  }, "\u203A"))));

  /* ══════════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════════ */
  return /*#__PURE__*/React.createElement("div", {
    className: "cc-app"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "cc-sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-sidebar-brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-brand-name"
  }, "CONTINENTAL"), /*#__PURE__*/React.createElement("div", {
    className: "cc-brand-sub"
  }, "El Libro de Cuentas", gameStarted && players.length > 0 ? ` | Suite ${players.length}` : '')), /*#__PURE__*/React.createElement("nav", {
    className: "cc-sidebar-nav"
  }, /*#__PURE__*/React.createElement("button", {
    className: `cc-nav-item${activeTab === 'puntos' ? ' active' : ''}`,
    onClick: () => setActiveTab('puntos')
  }, /*#__PURE__*/React.createElement(IconChart, null), " Puntos"), /*#__PURE__*/React.createElement("button", {
    className: `cc-nav-item${activeTab === 'estadisticas' ? ' active' : ''}`,
    onClick: () => setActiveTab('estadisticas')
  }, /*#__PURE__*/React.createElement(IconStats, null), " Estad\xEDsticas"), /*#__PURE__*/React.createElement("button", {
    className: `cc-nav-item${activeTab === 'ajustes' ? ' active' : ''}`,
    onClick: () => setActiveTab('ajustes')
  }, /*#__PURE__*/React.createElement(IconSettings, null), " Ajustes")), gameStarted && players.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cc-sidebar-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-dealer-badge"
  }, getDealerName().charAt(0)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cc-dealer-label"
  }, "Director de Partida"), /*#__PURE__*/React.createElement("div", {
    className: "cc-dealer-name"
  }, getDealerName())))), /*#__PURE__*/React.createElement("div", {
    className: "cc-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-topbar-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-topbar-title"
  }, "CONTINENTAL CLUB"), gameStarted && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "cc-topbar-sep"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cc-topbar-info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-topbar-dot"
  }), "Mesa Principal", /*#__PURE__*/React.createElement("span", null, "\xB7"), currentRoundData.requirement))), /*#__PURE__*/React.createElement("div", {
    className: "cc-topbar-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "cc-icon-btn",
    onClick: () => setShowHallOfFame(true),
    title: "Historial"
  }, /*#__PURE__*/React.createElement(IconHistory, null)), /*#__PURE__*/React.createElement("button", {
    className: "cc-icon-btn",
    onClick: () => setShowRules(true),
    title: "Reglas"
  }, /*#__PURE__*/React.createElement(IconHelp, null)), /*#__PURE__*/React.createElement("button", {
    className: "cc-icon-btn",
    onClick: () => setDarkMode(!darkMode),
    title: "Cambiar tema"
  }, darkMode ? /*#__PURE__*/React.createElement(IconSun, null) : /*#__PURE__*/React.createElement(IconMoon, null)))), /*#__PURE__*/React.createElement("div", {
    className: "cc-content"
  }, activeTab === 'puntos' && (gameStarted ? renderGameView() : renderSetupView()), activeTab === 'estadisticas' && renderEstadisticasTab(), activeTab === 'ajustes' && renderAjustesTab()), /*#__PURE__*/React.createElement("nav", {
    className: "cc-bottom-nav"
  }, /*#__PURE__*/React.createElement("button", {
    className: `cc-bottom-nav-item${activeTab === 'puntos' ? ' active' : ''}`,
    onClick: () => setActiveTab('puntos')
  }, /*#__PURE__*/React.createElement(IconChart, null), /*#__PURE__*/React.createElement("span", null, "Puntos")), /*#__PURE__*/React.createElement("button", {
    className: `cc-bottom-nav-item${activeTab === 'estadisticas' ? ' active' : ''}`,
    onClick: () => setActiveTab('estadisticas')
  }, /*#__PURE__*/React.createElement(IconStats, null), /*#__PURE__*/React.createElement("span", null, "Estad\xEDsticas")), /*#__PURE__*/React.createElement("button", {
    className: `cc-bottom-nav-item${activeTab === 'ajustes' ? ' active' : ''}`,
    onClick: () => setActiveTab('ajustes')
  }, /*#__PURE__*/React.createElement(IconSettings, null), /*#__PURE__*/React.createElement("span", null, "Ajustes")))), showNewGameDialog && /*#__PURE__*/React.createElement("div", {
    className: "cc-overlay show"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-modal",
    style: {
      maxWidth: 380,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      marginBottom: 12
    }
  }, "\uD83C\uDCCF"), /*#__PURE__*/React.createElement("div", {
    className: "cc-modal-title",
    style: {
      marginBottom: 8
    }
  }, "Nueva Partida"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--cc-text-sec)',
      marginBottom: 20
    }
  }, "\xBFUsar los mismos jugadores o empezar de nuevo?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "cc-btn cc-btn-primary cc-btn-full",
    onClick: confirmNewGameSame
  }, "Mismos jugadores"), /*#__PURE__*/React.createElement("button", {
    className: "cc-btn cc-btn-secondary cc-btn-full",
    onClick: confirmNewGameNew
  }, "Jugadores nuevos"), /*#__PURE__*/React.createElement("button", {
    className: "cc-btn cc-btn-secondary cc-btn-full",
    onClick: () => setShowNewGameDialog(false)
  }, "Cancelar")))), showHallOfFame && /*#__PURE__*/React.createElement("div", {
    className: "cc-overlay show"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-modal-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-modal-title"
  }, "\uD83C\uDFC6 Sal\xF3n de la Fama"), /*#__PURE__*/React.createElement("button", {
    className: "cc-btn cc-btn-secondary cc-btn-sm",
    onClick: () => setShowHallOfFame(false)
  }, "\u2715")), hallOfFameData.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '32px 0',
      color: 'var(--cc-text-sec)'
    }
  }, "A\xFAn no hay partidas registradas. \xA1Completa una partida para aparecer aqu\xED!") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("table", {
    className: "cc-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Jugador"), /*#__PURE__*/React.createElement("th", null, "Victorias"))), /*#__PURE__*/React.createElement("tbody", null, Object.entries(hallOfFameData.reduce((acc, g) => {
    acc[g.winner] = (acc[g.winner] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).map(([name, wins], idx) => /*#__PURE__*/React.createElement("tr", {
    key: name
  }, /*#__PURE__*/React.createElement("td", null, idx + 1), /*#__PURE__*/React.createElement("td", null, name, " ", idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : ''), /*#__PURE__*/React.createElement("td", null, wins, " ", wins === 1 ? 'victoria' : 'victorias'))))), /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: 'pointer',
      fontSize: 12,
      color: 'var(--cc-text-sec)',
      padding: '4px 0'
    }
  }, "Historial completo (", hallOfFameData.length, " partidas)"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 200,
      overflowY: 'auto',
      marginTop: 8
    }
  }, [...hallOfFameData].reverse().map((game, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    style: {
      padding: '8px 0',
      borderBottom: '1px solid var(--cc-border-sub)',
      fontSize: 12,
      color: 'var(--cc-text-sec)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--cc-text)'
    }
  }, game.winner), " gan\xF3 el ", new Date(game.date).toLocaleDateString(), " \u2014", game.players.map(p => ` ${p.name} (${p.total}pts)`).join(',')))))))), showRules && /*#__PURE__*/React.createElement("div", {
    className: "cc-overlay show"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-modal-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cc-modal-title"
  }, "\uD83D\uDCD6 Manual del Continental"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, speechStatus === 'idle' && /*#__PURE__*/React.createElement("button", {
    className: "cc-btn cc-btn-secondary cc-btn-sm",
    onClick: () => speakText(continentalManualHTML)
  }, "\uD83D\uDD0A"), speechStatus === 'speaking' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "cc-btn cc-btn-secondary cc-btn-sm",
    onClick: pauseSpeech
  }, "\u23F8"), /*#__PURE__*/React.createElement("button", {
    className: "cc-btn cc-btn-secondary cc-btn-sm",
    onClick: cancelSpeech
  }, "\u23F9")), speechStatus === 'paused' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "cc-btn cc-btn-secondary cc-btn-sm",
    onClick: resumeSpeech
  }, "\u25B6"), /*#__PURE__*/React.createElement("button", {
    className: "cc-btn cc-btn-secondary cc-btn-sm",
    onClick: cancelSpeech
  }, "\u23F9")), /*#__PURE__*/React.createElement("button", {
    className: "cc-btn cc-btn-secondary cc-btn-sm",
    onClick: () => {
      cancelSpeech();
      setShowRules(false);
    }
  }, "\u2715"))), /*#__PURE__*/React.createElement("div", {
    className: "cc-rules-content",
    dangerouslySetInnerHTML: {
      __html: continentalManualHTML
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "cc-toast-container"
  }, toasts.map(toast => /*#__PURE__*/React.createElement(Toast, {
    key: toast.id,
    message: toast.message,
    onDismiss: () => dismissToast(toast.id)
  }))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
