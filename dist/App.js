const {
  useState,
  useEffect,
  useRef
} = React;

// Datos de las rondas
const roundsData = [{
  round: 1,
  cards: 7,
  requirement: "2 Tríos"
}, {
  round: 2,
  cards: 8,
  requirement: "1 Trío y 1 Escalera"
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
  requirement: "2 Tríos y 1 Escalera"
}, {
  round: 6,
  cards: 12,
  requirement: "1 Trío y 2 Escaleras"
}, {
  round: 7,
  cards: 13,
  requirement: "3 Escaleras"
}];

// Manual del Continental
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
      
      <p>El jugador que "cierra" la ronda (es decir, el primero en quedarse sin cartas después de haber bajado todas sus combinaciones) recibe una puntuación negativa de <strong>-10 × número de ronda</strong>. Por ejemplo, en la Ronda 1, el que cierra obtiene -10 puntos; en la Ronda 7, -70 puntos.</p>

      <h2>Reglas Adicionales</h2>
      
      <h3>Definiciones</h3>
      <ul>
        <li><strong>Tríos:</strong> Tres o más cartas del mismo valor, independientemente del palo (ej. tres 7s, cuatro Reinas).</li>
        <li><strong>Escaleras:</strong> Cuatro o más cartas consecutivas del mismo palo (ej. 5, 6, 7, 8 de corazones). Las escaleras pueden empezar en cualquier carta y continuar hasta completarla.</li>
        <li><strong>Comodines:</strong> Los comodines pueden sustituir a cualquier carta para formar tríos o escaleras. Una vez bajados, no se pueden mover.</li>
      </ul>

      <h3>Mecánicas de Juego</h3>
      <ul>
        <li><strong>Bajar Cartas:</strong> Un jugador solo puede bajar sus combinaciones cuando tiene todas las cartas necesarias para la ronda actual. Una vez bajadas, puede "colgar" cartas adicionales en sus propias combinaciones o en las de otros jugadores en la mesa.</li>
        <li><strong>Bajarse Antes de Cerrar:</strong> Un jugador puede "bajarse" (mostrar sus combinaciones) una vez que ha completado los requisitos de la ronda, incluso si todavía tiene cartas en la mano. Sin embargo, no puede "cerrar" hasta que haya bajado todas sus combinaciones y no le quede ninguna carta en la mano.</li>
        <li><strong>Excepción para la Última Ronda:</strong> En la última ronda, el jugador no podrá "bajarse" hasta que no cierre. Es decir, debe tener todas sus combinaciones listas y quedarse sin cartas para poder bajarlas.</li>
      </ul>

      <h3>Robo y Descarte</h3>
      <ul>
        <li><strong>Robar del Pozo:</strong> Los jugadores roban una carta del pozo al inicio de su turno y descartan una al final. Tras repartir, se pondrá una carta boca arriba y junto a ella el resto boca abajo.</li>
        <li><strong>Descartes y Pozo:</strong> Los descartes de cada jugador se irán poniendo en el pozo boca arriba. El jugador al que le corresponda robar, podrá coger la superior del montón boca arriba o la del montón boca abajo.</li>
        <li><strong>Robo Fuera de Turno:</strong> Si un jugador fuera de turno quiere la carta de arriba del descarte puede hacerlo, si los que van antes que él estuviera de acuerdo. En ese caso, además de la carta elegida, deberá robar 2 más del montón. Si el número de cartas del pozo fuera escaso, en vez de dos, robaría una.</li>
      </ul>

      <h3>Fin de Ronda</h3>
      <p>La ronda termina cuando un jugador "cierra" su mano.</p>

      <h2>Variaciones</h2>
      <ul>
        <li><strong>Mover Comodín:</strong> Se permite mover un comodín de una escalera a otra posición reglamentaria de la misma si se tiene la carta que lo sustituya y el jugador ya se ha bajado.</li>
        <li><strong>Robar una carta (más de 4 jugadores):</strong> En partida de más de cuatro jugadores se puede acordar robar solamente una carta en lugar de dos.</li>
        <li><strong>Posibilidad de leerlas en voz alta:</strong> Para ayudar a jugadores con dificultades de lectura o para mayor accesibilidad.</li>
      </ul>
    `;

// Componente Toast
const Toast = ({
  message,
  onDismiss
}) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  return /*#__PURE__*/React.createElement("div", {
    className: "toast"
  }, message);
};

// Componente Tooltip
const Tooltip = ({
  children,
  text
}) => /*#__PURE__*/React.createElement("div", {
  className: "tooltip"
}, children, /*#__PURE__*/React.createElement("div", {
  className: "tooltip-text"
}, text));

// Funciones de utilidad
const getHandPlayer = (players, dealerName) => {
  if (!dealerName || players.length < 2) return '';
  const idx = players.findIndex(p => p.name === dealerName);
  if (idx < 0) return '';
  return players[(idx + 1) % players.length].name;
};
const calculateRoundsWon = player => {
  return player.scores.filter(score => score < 0).length;
};
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

// Componente gráfico avanzado con D3.js
const AdvancedChart = ({
  players,
  gameHistory
}) => {
  const svgRef = useRef();
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        setChartWidth(entries[0].contentRect.width);
        setChartHeight(Math.min(entries[0].contentRect.width * 0.6, 400));
      }
    });
    if (svgRef.current) {
      resizeObserver.observe(svgRef.current.parentElement);
    }
    return () => {
      if (svgRef.current && svgRef.current.parentElement) {
        resizeObserver.unobserve(svgRef.current.parentElement);
      }
    };
  }, []);
  useEffect(() => {
    if (players.length === 0 || chartWidth === 0 || chartHeight === 0) {
      d3.select(svgRef.current).selectAll("*").remove();
      return;
    }
    const margin = {
      top: 20,
      right: 30,
      bottom: 60,
      left: 50
    };
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;
    const svg = d3.select(svgRef.current).attr("width", chartWidth).attr("height", chartHeight).html("").append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const sortedPlayers = [...players].sort((a, b) => a.total - b.total);
    const allFinalTotals = sortedPlayers.map(p => p.total);
    const maxTotal = d3.max(allFinalTotals) || 0;
    const minTotal = d3.min(allFinalTotals) || 0;
    const x = d3.scaleBand().domain(sortedPlayers.map(p => p.name)).range([0, width]).padding(0.2);
    const y = d3.scaleLinear().domain([Math.min(0, minTotal), Math.max(0, maxTotal)]).range([height, 0]);
    const yAxis = d3.axisLeft(y).ticks(5);
    svg.append("g").call(yAxis).attr("class", "text-gray-600");
    const xAxis = d3.axisBottom(x);
    svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis).attr("class", "text-gray-600");

    // Línea en y=0
    svg.append("line").attr("x1", 0).attr("y1", y(0)).attr("x2", width).attr("y2", y(0)).attr("stroke", "#d1d5db").attr("stroke-width", 1).attr("stroke-dasharray", "5,5");
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    // Barras
    svg.selectAll(".bar").data(sortedPlayers).enter().append("rect").attr("class", "bar").attr("x", d => x(d.name)).attr("width", x.bandwidth()).attr("y", d => d.total >= 0 ? y(d.total) : y(0)).attr("height", d => Math.abs(y(d.total) - y(0))).attr("fill", (d, i) => colors(i)).attr("opacity", 0.8).on("mouseover", (event, d) => {
      // Tooltip simple
      console.log(`${d.name}: ${d.total} puntos`);
    });
  }, [players, gameHistory, chartWidth, chartHeight]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: 'auto',
      minHeight: '200px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    ref: svgRef
  }));
};

// Componente principal
function App() {
  const [players, setPlayers] = useState(() => loadFromLocalStorage('continental-players', []));
  const [currentRound, setCurrentRound] = useState(() => loadFromLocalStorage('continental-round', 1));
  const [dealer, setDealer] = useState(() => loadFromLocalStorage('continental-dealer', ''));
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHallOfFame, setShowHallOfFame] = useState(false);
  const [hallOfFameData, setHallOfFameData] = useState(() => loadFromLocalStorage('continental-global-stats', []));
  const [darkMode, setDarkMode] = useState(() => loadFromLocalStorage('continental-theme', 'light') === 'dark');
  const [gameHistory, setGameHistory] = useState(() => loadFromLocalStorage('continental-history', []));
  const [toasts, setToasts] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [gameStarted, setGameStarted] = useState(() => loadFromLocalStorage('continental-started', false));
  const [roundCloser, setRoundCloser] = useState(() => loadFromLocalStorage('continental-closer', ''));
  const [currentRoundScores, setCurrentRoundScores] = useState(() => loadFromLocalStorage('continental-round-scores', {}));
  const speechUtteranceRef = useRef(null);
  const [speechStatus, setSpeechStatus] = useState('idle');
  const [showAbandonConfirmation, setShowAbandonConfirmation] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(() => {
    const saved = loadFromLocalStorage('continental-players', []);
    return saved.length > 0;
  });

  // Guardar datos automáticamente
  useEffect(() => {
    saveToLocalStorage('continental-players', players);
  }, [players]);
  useEffect(() => {
    saveToLocalStorage('continental-started', gameStarted);
  }, [gameStarted]);
  useEffect(() => {
    saveToLocalStorage('continental-closer', roundCloser);
  }, [roundCloser]);
  useEffect(() => {
    saveToLocalStorage('continental-round-scores', currentRoundScores);
  }, [currentRoundScores]);
  useEffect(() => {
    saveToLocalStorage('continental-round', currentRound);
  }, [currentRound]);
  useEffect(() => {
    saveToLocalStorage('continental-dealer', dealer);
  }, [dealer]);
  useEffect(() => {
    saveToLocalStorage('continental-history', gameHistory);
  }, [gameHistory]);
  useEffect(() => {
    saveToLocalStorage('continental-global-stats', hallOfFameData);
  }, [hallOfFameData]);

  // Aplicar tema
  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-scheme', theme);
    saveToLocalStorage('continental-theme', theme);
  }, [darkMode]);

  // Sistema de toasts
  const showToast = message => {
    const id = Date.now();
    setToasts(prev => [...prev, {
      id,
      message
    }]);
  };
  const dismissToast = id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Síntesis de voz
  const speakText = text => {
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
  const pauseSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.pause();
    }
  };
  const resumeSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.resume();
    }
  };
  const cancelSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      speechUtteranceRef.current = null;
      setSpeechStatus('idle');
    }
  };

  // Gestión de jugadores
  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 6) {
      const capitalized = newPlayerName.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
      if (players.some(p => p.name.toLowerCase() === capitalized.toLowerCase())) {
        showToast('Ya existe un jugador con ese nombre');
        return;
      }
      const newPlayer = {
        name: capitalized,
        scores: Array(7).fill(0),
        total: 0
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
      showToast(`Jugador ${capitalized} añadido`);
      const historyEntry = {
        timestamp: new Date().toISOString(),
        player: newPlayer.name,
        action: 'player_added'
      };
      setGameHistory(prev => [...prev.slice(-49), historyEntry]);
    }
  };
  const removePlayer = index => {
    if (players.length > 2) {
      const removedPlayer = players[index];
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
      if (dealer === removedPlayer.name) {
        setDealer(newPlayers[0].name);
      }
      showToast(`Jugador ${removedPlayer.name} eliminado`);
      const historyEntry = {
        timestamp: new Date().toISOString(),
        player: removedPlayer.name,
        action: 'player_removed'
      };
      setGameHistory(prev => [...prev.slice(-49), historyEntry]);
    }
  };
  const editPlayer = (oldName, newName) => {
    if (!newName.trim()) return;
    const capitalized = newName.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    if (players.some(p => p.name.toLowerCase() === capitalized.toLowerCase() && p.name !== oldName)) {
      showToast('Ya existe un jugador con ese nombre');
      return;
    }
    setPlayers(prev => prev.map(player => player.name === oldName ? {
      ...player,
      name: capitalized
    } : player));
    if (dealer === oldName) {
      setDealer(capitalized);
    }
    showToast(`Jugador renombrado a ${capitalized}`);
    setEditingPlayer(null);
  };

  // Drag and drop para reordenar jugadores
  const movePlayer = (dragIndex, hoverIndex) => {
    const dragPlayer = players[dragIndex];
    const newPlayers = [...players];
    newPlayers.splice(dragIndex, 1);
    newPlayers.splice(hoverIndex, 0, dragPlayer);
    setPlayers(newPlayers);
  };

  // Navegación de rondas
  const changeRound = direction => {
    let newRound = currentRound;
    if (direction === 'next' && currentRound < 7) {
      newRound = currentRound + 1;
      changeDealer();
    } else if (direction === 'prev' && currentRound > 1) {
      newRound = currentRound - 1;
    }
    setCurrentRound(newRound);
    const historyEntry = {
      timestamp: new Date().toISOString(),
      round: newRound,
      action: 'round_changed'
    };
    setGameHistory(prev => [...prev.slice(-49), historyEntry]);
  };
  const changeDealer = () => {
    const currentIndex = players.findIndex(p => p.name === dealer);
    const nextIndex = (currentIndex + 1) % players.length;
    setDealer(players[nextIndex].name);
  };

  // Actualizar puntuación
  const updateScore = (playerIndex, roundIndex, score) => {
    const newPlayers = [...players];
    const newScore = parseInt(score) || 0;
    newPlayers[playerIndex].scores[roundIndex] = newScore;
    newPlayers[playerIndex].total = newPlayers[playerIndex].scores.reduce((sum, s) => sum + s, 0);
    setPlayers(newPlayers);
    const historyEntry = {
      timestamp: new Date().toISOString(),
      player: newPlayers[playerIndex].name,
      round: roundIndex + 1,
      score: newScore,
      action: 'score_update'
    };
    setGameHistory(prev => [...prev.slice(-49), historyEntry]);
  };
  const setRoundCloserPlayer = playerName => {
    const closerScore = -10 * currentRound;
    setRoundCloser(playerName);
    const newScores = {
      ...currentRoundScores
    };
    // Limpiar puntuaciones de otros jugadores que podrían haber sido "cerrador"
    Object.keys(newScores).forEach(name => {
      if (newScores[name] === -10 * currentRound) {
        newScores[name] = 0;
      }
    });
    newScores[playerName] = closerScore;
    setCurrentRoundScores(newScores);
  };
  const updateCurrentRoundScore = (playerName, score) => {
    setCurrentRoundScores(prev => ({
      ...prev,
      [playerName]: parseInt(score) || 0
    }));
  };

  // Iniciar juego
  const startGame = () => {
    setGameStarted(true);
    setCurrentRound(1);
    setCurrentRoundScores(players.reduce((acc, player) => {
      acc[player.name] = 0;
      return acc;
    }, {}));
    setRoundCloser('');
    showToast('¡Juego iniciado!');
  };

  // Reiniciar juego
  const confirmReset = () => {
    setPlayers(players.map(p => ({
      ...p,
      scores: Array(7).fill(0),
      total: 0
    })));
    setCurrentRound(1);
    setDealer(players.length > 0 ? players[0].name : '');
    setGameHistory([]);
    setGameStarted(false);
    setCurrentRoundScores({});
    setRoundCloser('');
    showToast('Juego reiniciado');
    setShowAbandonConfirmation(false);
  };
  const resetGame = () => {
    setShowAbandonConfirmation(true);
  };

  // Finalizar ronda
  const finishRound = () => {
    if (!roundCloser) {
      showToast('Debes seleccionar quién cierra la ronda');
      return;
    }

    // Actualizar puntuaciones
    const updatedPlayers = players.map(player => {
      const roundScore = currentRoundScores[player.name] || 0;
      const newScores = [...player.scores];
      newScores[currentRound - 1] = roundScore;
      return {
        ...player,
        scores: newScores,
        total: newScores.reduce((sum, s) => sum + s, 0)
      };
    });
    setPlayers(updatedPlayers);
    if (currentRound < 7) {
      setCurrentRound(prev => prev + 1);
      setCurrentRoundScores(players.reduce((acc, player) => {
        acc[player.name] = 0;
        return acc;
      }, {}));
      setRoundCloser('');
      changeDealer();
      showToast(`Ronda ${currentRound} finalizada`);
    } else {
      const sortedPlayers = [...updatedPlayers].sort((a, b) => a.total - b.total);
      const winner = sortedPlayers[0];
      const gameResult = {
        date: new Date().toISOString(),
        winner: winner.name,
        players: sortedPlayers.map(p => ({
          name: p.name,
          total: p.total
        }))
      };
      setHallOfFameData(prev => [...prev, gameResult]);
      showToast(`¡Juego terminado! Ganador: ${winner.name}`);
      setGameStarted(false);
    }
  };

  // Compartir resultados
  const shareResults = async () => {
    const winner = players.reduce((w, p) => p.total < w.total ? p : w);
    const resultsText = `🏆 Resultados Continental\n\n${players.sort((a, b) => a.total - b.total).map((p, i) => `${i + 1}. ${p.name}: ${p.total} pts`).join('\n')}\n\n¡Ganador: ${winner.name}!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Resultados Continental',
          text: resultsText
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(resultsText);
      showToast('Resultados copiados al portapapeles');
    }
  };

  // Exportar a CSV
  const exportToCSV = () => {
    const header = ['Jugador', ...roundsData.map(r => `R${r.round}`), 'Total'];
    const rows = players.map(player => [player.name, ...player.scores, player.total]);
    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `continental_resultados_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Archivo CSV descargado');
  };

  // Obtener estadísticas
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
  const handPlayer = getHandPlayer(players, dealer);
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("header", {
    className: "glass-panel header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Continental Pro"), /*#__PURE__*/React.createElement("p", {
    className: "subtitle"
  }, "\uD83D\uDCCA Contador profesional de puntuaciones"))), /*#__PURE__*/React.createElement("div", {
    className: "header-buttons"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    text: "Ver gr\xE1fico de progreso"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowChart(!showChart),
    className: "btn btn-secondary btn-sm"
  }, "\uD83D\uDCCA")), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Ver historial de acciones"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowHistory(!showHistory),
    className: "btn btn-secondary btn-sm"
  }, "\uD83D\uDCDD")), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Sal\xF3n de la Fama"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowHallOfFame(true),
    className: "btn btn-secondary btn-sm"
  }, "\uD83C\uDFC6")), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Ver reglas del juego"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowRules(true),
    className: "btn btn-secondary btn-sm"
  }, "\uD83D\uDCCB")), /*#__PURE__*/React.createElement(Tooltip, {
    text: darkMode ? 'Modo claro' : 'Modo oscuro'
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDarkMode(!darkMode),
    className: "btn btn-secondary btn-sm"
  }, darkMode ? '☀️' : '🌙')))), !gameStarted ? showResumePrompt ? /*#__PURE__*/React.createElement("div", {
    className: "glass-panel card",
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", null, "\uD83D\uDD04 Partida Anterior Detectada"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '1rem 0',
      color: 'var(--text-muted)'
    }
  }, "Hemos encontrado jugadores de una sesi\xF3n anterior (", players.map(p => p.name).join(', '), "). \xBFQu\xE9 deseas hacer?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '1.5rem',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => {
      setPlayers([]);
      setDealer('');
      setGameHistory([]);
      setCurrentRoundScores({});
      setRoundCloser('');
      setShowResumePrompt(false);
    }
  }, "Empezar de cero"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setShowResumePrompt(false)
  }, "Continuar con los mismos"))) :
  /*#__PURE__*/
  /* Configuración inicial */
  React.createElement("div", {
    className: "glass-panel card"
  }, /*#__PURE__*/React.createElement("h2", null, "\uD83D\uDC65 Configuraci\xF3n de Jugadores"), /*#__PURE__*/React.createElement("div", {
    className: "player-input"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newPlayerName,
    onChange: e => setNewPlayerName(e.target.value),
    placeholder: "Nombre del jugador",
    maxLength: "15",
    onKeyPress: e => e.key === 'Enter' && addPlayer()
  }), /*#__PURE__*/React.createElement(Tooltip, {
    text: "A\xF1adir jugador (m\xE1ximo 6)"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: addPlayer,
    disabled: players.length >= 6 || !newPlayerName.trim(),
    className: "btn btn-primary"
  }, "\u2795 A\xF1adir"))), /*#__PURE__*/React.createElement("div", {
    className: "player-list"
  }, players.map((player, index) => /*#__PURE__*/React.createElement("div", {
    key: player.name,
    className: "player-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "player-info"
  }, editingPlayer === player.name ? /*#__PURE__*/React.createElement("input", {
    type: "text",
    defaultValue: player.name,
    onBlur: e => editPlayer(player.name, e.target.value),
    onKeyPress: e => {
      if (e.key === 'Enter') {
        editPlayer(player.name, e.target.value);
      }
    },
    autoFocus: true,
    style: {
      background: 'transparent',
      border: 'none',
      fontWeight: 'bold'
    }
  }) : /*#__PURE__*/React.createElement("strong", {
    onClick: () => setEditingPlayer(player.name),
    style: {
      cursor: 'pointer'
    }
  }, player.name), /*#__PURE__*/React.createElement("small", null, player.total, " pts \u2022 ", calculateRoundsWon(player), " rondas ganadas")), /*#__PURE__*/React.createElement("div", {
    className: "player-badges"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "dealer",
    checked: dealer === player.name,
    onChange: () => setDealer(player.name),
    style: {
      marginRight: '4px'
    }
  }), "Repartidor"), handPlayer === player.name && /*#__PURE__*/React.createElement("span", {
    className: "badge badge-hand"
  }, "Mano"), players.length > 2 && /*#__PURE__*/React.createElement(Tooltip, {
    text: "Eliminar jugador"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => removePlayer(index),
    className: "btn btn-secondary btn-sm"
  }, "\u274C")))))), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Iniciar partida con jugadores configurados"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: startGame,
    disabled: players.length < 2,
    className: "btn btn-primary",
    style: {
      width: '100%',
      marginTop: '1rem'
    }
  }, "\uD83C\uDFAE Iniciar Juego (", players.length, " Jugadores)"))) :
  /*#__PURE__*/
  /* Juego en curso */
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "glass-panel round-header"
  }, /*#__PURE__*/React.createElement("h2", null, "\uD83C\uDFAF Ronda ", currentRoundData.round, " de 7 \u2022 ", currentRoundData.cards, " cartas \u2022 ", currentRoundData.requirement)), /*#__PURE__*/React.createElement("div", {
    className: "card-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-panel card"
  }, /*#__PURE__*/React.createElement("h3", null, "\uD83C\uDFAE Estado del Juego"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Repartidor:"), " ", dealer), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Mano:"), " ", handPlayer), stats && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "\uD83C\uDFC6 L\xEDder:"), " ", stats.winner.name, " (", stats.winner.total, " pts)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem'
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    text: "Ronda anterior"
  }, /*#__PURE__*/React.createElement("button", {
    className: `btn btn-secondary ${currentRound === 1 ? 'disabled' : ''}`,
    onClick: () => changeRound('prev'),
    disabled: currentRound === 1
  }, "\u2190 Anterior")), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Siguiente ronda"
  }, /*#__PURE__*/React.createElement("button", {
    className: `btn btn-primary ${currentRound === 7 ? 'disabled' : ''}`,
    onClick: () => changeRound('next'),
    disabled: currentRound === 7
  }, "Siguiente \u2192")))), stats && /*#__PURE__*/React.createElement("div", {
    className: "glass-panel card"
  }, /*#__PURE__*/React.createElement("h3", null, "\uD83D\uDCC8 Estad\xEDsticas"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Promedio:"), " ", stats.averageScore, " pts"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "M\xE1ximo:"), " ", stats.maxScore, " pts"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Rondas completadas:"), " ", stats.totalRounds), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Jugadores:"), " ", players.length))), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel card"
  }, /*#__PURE__*/React.createElement("h3", null, "\uD83D\uDCCA Puntuaciones Ronda ", currentRound), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--md-body-small)',
      color: 'var(--md-on-surface-variant)',
      marginBottom: 'var(--sp-3)'
    }
  }, "Selecciona qui\xE9n cierra la ronda \u2014 su puntuaci\xF3n se calcula autom\xE1ticamente (-10 \xD7 ", currentRound, " = ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--md-tertiary)'
    }
  }, "-", 10 * currentRound, " pts"), "). Ingresa los puntos de penalizaci\xF3n de los dem\xE1s jugadores."), /*#__PURE__*/React.createElement("div", {
    className: "scoreboard-scroll"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Jugador"), /*#__PURE__*/React.createElement("th", null, "Cierra"), /*#__PURE__*/React.createElement("th", null, "Puntos"), /*#__PURE__*/React.createElement("th", null, "Total"))), /*#__PURE__*/React.createElement("tbody", null, players.map((player, index) => /*#__PURE__*/React.createElement("tr", {
    key: player.name
  }, /*#__PURE__*/React.createElement("td", {
    className: "player-name"
  }, player.name, dealer === player.name && /*#__PURE__*/React.createElement(React.Fragment, null, " ", /*#__PURE__*/React.createElement("span", {
    className: "badge badge-dealer"
  }, "Reparte")), handPlayer === player.name && /*#__PURE__*/React.createElement(React.Fragment, null, " ", /*#__PURE__*/React.createElement("span", {
    className: "badge badge-hand"
  }, "Mano"))), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "roundCloser",
    checked: roundCloser === player.name,
    onChange: () => setRoundCloserPlayer(player.name),
    style: {
      accentColor: 'var(--md-primary)',
      transform: 'scale(1.2)',
      cursor: 'pointer'
    }
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  }, roundCloser === player.name ? /*#__PURE__*/React.createElement("span", {
    className: "negative-score",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.5rem 0.75rem',
      borderRadius: 'var(--md-shape-sm)',
      fontWeight: 700
    }
  }, "-", 10 * currentRound, /*#__PURE__*/React.createElement("span", {
    className: "auto-score-tag"
  }, "Auto")) : /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: `score-input ${roundCloser === player.name ? 'negative-score' : ''}`,
    value: currentRoundScores[player.name] || '',
    onChange: e => updateCurrentRoundScore(player.name, e.target.value),
    disabled: roundCloser === player.name,
    min: "0",
    max: "999",
    placeholder: "0"
  }))), /*#__PURE__*/React.createElement("td", {
    className: "total-score"
  }, player.total)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1rem',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: finishRound,
    className: "btn btn-primary"
  }, currentRound < 7 ? 'Finalizar Ronda' : 'Finalizar Juego')))), showHistory && /*#__PURE__*/React.createElement("div", {
    className: "glass-panel card"
  }, /*#__PURE__*/React.createElement("h3", null, "\uD83D\uDCDD Historial de Acciones"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: '200px',
      overflowY: 'auto',
      border: '1px solid var(--color-gray-200)',
      borderRadius: 'var(--radius)',
      padding: 'var(--space-3)'
    }
  }, gameHistory.slice(-20).reverse().map((entry, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    style: {
      padding: '0.5rem',
      borderBottom: '1px solid var(--color-gray-200)',
      fontSize: '0.875rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-gray-500)'
    }
  }, new Date(entry.timestamp).toLocaleTimeString(), " -"), entry.action === 'score_update' && ` ${entry.player} marcó ${entry.score} pts en R${entry.round}`, entry.action === 'player_added' && ` Se añadió jugador: ${entry.player}`, entry.action === 'player_removed' && ` Se eliminó jugador: ${entry.player}`, entry.action === 'round_changed' && ` Cambio a Ronda ${entry.round}`)))), showChart && /*#__PURE__*/React.createElement("div", {
    className: "glass-panel card"
  }, /*#__PURE__*/React.createElement("h3", null, "\uD83D\uDCCA Progreso de Jugadores"), /*#__PURE__*/React.createElement("div", {
    className: "chart-container"
  }, /*#__PURE__*/React.createElement(AdvancedChart, {
    players: players,
    gameHistory: gameHistory
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel scoreboard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "scoreboard-scroll"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Jugador"), roundsData.map((round, idx) => /*#__PURE__*/React.createElement("th", {
    key: idx,
    className: idx === currentRound - 1 ? 'current-round' : '',
    title: `${round.cards} cartas - ${round.requirement}`
  }, "R", round.round)), /*#__PURE__*/React.createElement("th", null, "Total"), /*#__PURE__*/React.createElement("th", null, "\uD83C\uDFC6"))), /*#__PURE__*/React.createElement("tbody", null, players.map((player, originalIndex) => ({
    ...player,
    originalIndex
  })).sort((a, b) => a.total - b.total).map((player, position) => /*#__PURE__*/React.createElement("tr", {
    key: player.originalIndex,
    className: position === 0 ? 'winner-row' : ''
  }, /*#__PURE__*/React.createElement("td", {
    className: "position"
  }, position + 1), /*#__PURE__*/React.createElement("td", {
    className: "player-name"
  }, player.name, position === 0 && ' 🥇', position === 1 && ' 🥈', position === 2 && ' 🥉'), player.scores.map((score, roundIndex) => /*#__PURE__*/React.createElement("td", {
    key: roundIndex
  }, /*#__PURE__*/React.createElement(Tooltip, {
    text: score < 0 ? 'Ronda ganada' : score > 0 ? 'Puntos penalización' : 'Sin puntos'
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: score || '',
    onChange: e => updateScore(player.originalIndex, roundIndex, e.target.value),
    className: `score-input ${score < 0 ? 'negative-score' : ''}`,
    min: "-1000",
    max: "999"
  })))), /*#__PURE__*/React.createElement("td", {
    className: "total-score"
  }, player.total), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: 'center'
    }
  }, calculateRoundsWon(player)))))))), /*#__PURE__*/React.createElement("div", {
    className: "controls"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    text: "Cambiar repartidor"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: changeDealer
  }, "\uD83D\uDD04 Cambiar Repartidor")), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Reiniciar partida completa"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: resetGame
  }, "\u267B\uFE0F Reiniciar Partida")), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Compartir resultados"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: shareResults
  }, "\uD83D\uDCE4 Compartir Resultados")), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Exportar tabla a CSV"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: exportToCSV
  }, "\uD83D\uDCE5 Exportar a Excel"))), showAbandonConfirmation && /*#__PURE__*/React.createElement("div", {
    className: "overlay show"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content",
    style: {
      maxWidth: '400px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      marginBottom: '1rem',
      color: 'var(--color-primary)'
    }
  }, "\u26A0\uFE0F Confirmaci\xF3n"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: '1.5rem'
    }
  }, "\xBFEst\xE1s seguro de que quieres reiniciar todas las puntuaciones?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setShowAbandonConfirmation(false)
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: confirmReset
  }, "S\xED, reiniciar")))), showHallOfFame && /*#__PURE__*/React.createElement("div", {
    className: "overlay show"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    }
  }, /*#__PURE__*/React.createElement("h3", null, "\uD83C\uDFC6 Sal\xF3n de la Fama"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => setShowHallOfFame(false)
  }, "\u274C")), hallOfFameData.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      textAlign: 'center',
      padding: '2rem'
    }
  }, "A\xFAn no hay partidas registradas. \xA1Juega una partida completa para aparecer aqu\xED!") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", {
    style: {
      marginBottom: '0.5rem'
    }
  }, "Ranking de Campeones"), /*#__PURE__*/React.createElement("div", {
    className: "scoreboard-scroll"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Jugador"), /*#__PURE__*/React.createElement("th", null, "Victorias"))), /*#__PURE__*/React.createElement("tbody", null, Object.entries(hallOfFameData.reduce((acc, game) => {
    acc[game.winner] = (acc[game.winner] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).map(([name, wins], idx) => /*#__PURE__*/React.createElement("tr", {
    key: name,
    className: idx === 0 ? 'winner-row' : ''
  }, /*#__PURE__*/React.createElement("td", null, idx + 1), /*#__PURE__*/React.createElement("td", null, name, " ", idx === 0 && '🥇', idx === 1 && '🥈', idx === 2 && '🥉'), /*#__PURE__*/React.createElement("td", null, wins, " ", wins === 1 ? 'victoria' : 'victorias')))))), /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: '1rem'
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: 'pointer',
      color: 'var(--text-muted)'
    }
  }, "Historial de partidas (", hallOfFameData.length, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: '200px',
      overflowY: 'auto',
      marginTop: '0.5rem'
    }
  }, [...hallOfFameData].reverse().map((game, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    style: {
      padding: '0.5rem',
      borderBottom: '1px solid var(--glass-border)',
      fontSize: '0.85rem'
    }
  }, /*#__PURE__*/React.createElement("strong", null, game.winner), " gan\xF3 el ", new Date(game.date).toLocaleDateString(), " -", game.players.map(p => `${p.name} (${p.total}pts)`).join(', ')))))))), showRules && /*#__PURE__*/React.createElement("div", {
    className: "overlay show"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    }
  }, /*#__PURE__*/React.createElement("h3", null, "\uD83D\uDCD6 Manual del Continental"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    }
  }, speechStatus === 'idle' && /*#__PURE__*/React.createElement(Tooltip, {
    text: "Leer en voz alta"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => speakText(continentalManualHTML)
  }, "\uD83D\uDD0A")), speechStatus === 'speaking' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tooltip, {
    text: "Pausar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: pauseSpeech
  }, "\u23F8\uFE0F")), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Detener"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: cancelSpeech
  }, "\u23F9\uFE0F"))), speechStatus === 'paused' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tooltip, {
    text: "Reanudar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: resumeSpeech
  }, "\u25B6\uFE0F")), /*#__PURE__*/React.createElement(Tooltip, {
    text: "Detener"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: cancelSpeech
  }, "\u23F9\uFE0F"))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => {
      cancelSpeech();
      setShowRules(false);
    }
  }, "\u274C"))), /*#__PURE__*/React.createElement("div", {
    className: "rules-content",
    dangerouslySetInnerHTML: {
      __html: continentalManualHTML
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "toast-container"
  }, toasts.map(toast => /*#__PURE__*/React.createElement(Toast, {
    key: toast.id,
    message: toast.message,
    onDismiss: () => dismissToast(toast.id)
  }))), /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '1rem'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Continental Pro Ultimate"), " - La mejor experiencia de Continental"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDCCF Tradicional"), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCF1 Responsive"), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCBE Auto-guardado"), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCCA Gr\xE1ficos D3"), /*#__PURE__*/React.createElement("span", null, "\uD83C\uDFAF Profesional"))));
}

// Renderizado
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
