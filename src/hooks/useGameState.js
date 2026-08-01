import { useState, useEffect, useCallback, useMemo } from 'react';

const saveLS = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
};
const loadLS = (key, def) => {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : def;
  } catch (e) {
    return def;
  }
};

export function useGameState(showToast) {
  const [players, setPlayers] = useState(() => loadLS('continental-players', []));
  const [currentRound, setCurrentRound] = useState(() => loadLS('continental-round', 1));
  const [gameStarted, setGameStarted] = useState(() => loadLS('continental-started', false));
  const [showFinalResults, setShowFinalResults] = useState(() => loadLS('continental-show-results', false));
  const [roundCloser, setRoundCloser] = useState(() => loadLS('continental-closer', ''));
  const [currentRoundScores, setCurrentRoundScores] = useState(() => loadLS('continental-round-scores', {}));
  const [hallOfFameData, setHallOfFameData] = useState(() => loadLS('continental-global-stats', []));
  const [undoData, setUndoData] = useState(() => loadLS('continental-undo', null));
  const [redoData, setRedoData] = useState(() => loadLS('continental-redo', null));

  /* ── Auto-save to LocalStorage ── */
  useEffect(() => { saveLS('continental-players', players); }, [players]);
  useEffect(() => { saveLS('continental-started', gameStarted); }, [gameStarted]);
  useEffect(() => { saveLS('continental-show-results', showFinalResults); }, [showFinalResults]);
  useEffect(() => { saveLS('continental-closer', roundCloser); }, [roundCloser]);
  useEffect(() => { saveLS('continental-round-scores', currentRoundScores); }, [currentRoundScores]);
  useEffect(() => { saveLS('continental-round', currentRound); }, [currentRound]);
  useEffect(() => { saveLS('continental-global-stats', hallOfFameData); }, [hallOfFameData]);
  useEffect(() => { saveLS('continental-undo', undoData); }, [undoData]);
  useEffect(() => { saveLS('continental-redo', redoData); }, [redoData]);

  /* ── Force save on beforeunload ── */
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

  /* ── Derived Helper Properties ── */
  const getDealerName = useCallback(() => {
    if (!gameStarted || players.length === 0) return '';
    return players[(currentRound - 1) % players.length].name;
  }, [gameStarted, players, currentRound]);

  const getHandName = useCallback(() => {
    if (!gameStarted || players.length < 2) return '';
    return players[currentRound % players.length].name;
  }, [gameStarted, players, currentRound]);

  const stats = useMemo(() => {
    if (players.length === 0) return null;
    const sorted = [...players].sort((a, b) => a.total - b.total);
    return {
      winner: sorted[0],
      sorted,
      averageScore: Math.round(players.reduce((s, p) => s + p.total, 0) / players.length)
    };
  }, [players]);

  const getMediaRonda = useCallback(() => {
    if (!gameStarted || players.length === 0 || currentRound <= 1) return '—';
    const rp = currentRound - 1;
    const all = players.flatMap(p => p.scores.slice(0, rp).filter(s => s !== 0));
    if (all.length === 0) return '—';
    return (all.reduce((s, v) => s + Math.abs(v), 0) / all.length).toFixed(1);
  }, [players, gameStarted, currentRound]);

  /* ── Player Management ── */
  const addPlayer = (rawName) => {
    if (!rawName.trim() || players.length >= 6) return false;
    const cap = rawName.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    if (players.some(p => p.name.toLowerCase() === cap.toLowerCase())) {
      showToast('Ya existe un jugador con ese nombre');
      return false;
    }
    setPlayers(prev => [...prev, { name: cap, scores: Array(7).fill(0), total: 0 }]);
    showToast(`${cap} añadido`);
    return true;
  };

  const removePlayer = (index) => {
    if (players.length > 2) {
      const n = players[index].name;
      setPlayers(prev => prev.filter((_, i) => i !== index));
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
    setPlayers(prev => prev.map(p => p.name === oldName ? { ...p, name: cap } : p));
    showToast(`Renombrado a ${cap}`);
  };

  const movePlayer = (fromIndex, toIndex) => {
    if (gameStarted) return;
    setPlayers(prev => {
      const arr = [...prev];
      const [m] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, m);
      return arr;
    });
  };

  /* ── Score & Round Operations ── */
  const setRoundCloserPlayer = (name) => {
    const cs = -10 * currentRound;
    setRoundCloser(name);
    setCurrentRoundScores(prev => {
      const ns = { ...prev };
      Object.keys(ns).forEach(k => { if (ns[k] === -10 * currentRound) ns[k] = 0; });
      ns[name] = cs;
      return ns;
    });
  };

  const updateCurrentRoundScore = (name, score) => {
    if (score === '' || score === null) {
      setCurrentRoundScores(prev => ({ ...prev, [name]: 0 }));
      return;
    }
    const n = Number(score);
    if (!Number.isInteger(n)) { showToast('La puntuación debe ser un número entero'); return; }
    if (n === 0) { showToast('La puntuación no puede ser 0'); return; }
    setCurrentRoundScores(prev => ({ ...prev, [name]: n }));
  };

  const updateScore = (playerIndex, roundIndex, score) => {
    if (score === '' || score === null) return;
    const n = Number(score);
    if (!Number.isInteger(n)) { showToast('La puntuación debe ser un número entero'); return; }
    if (n === 0) { showToast('La puntuación no puede ser 0'); return; }
    setPlayers(prev => {
      const np = [...prev];
      np[playerIndex].scores[roundIndex] = n;
      np[playerIndex].total = np[playerIndex].scores.reduce((s, v) => s + v, 0);
      return np;
    });
  };

  /* ── Flow Controls ── */
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

  const finishRound = (isEarlyFinish = false) => {
    if (!roundCloser) { showToast('Selecciona quién cierra la ronda'); return; }
    for (const p of players) {
      if (p.name !== roundCloser) {
        const s = currentRoundScores[p.name] || 0;
        if (s === 0) { showToast(`Falta la puntuación de ${p.name}`); return; }
      }
    }
    setUndoData({
      players: JSON.parse(JSON.stringify(players)),
      currentRound,
      currentRoundScores: { ...currentRoundScores },
      roundCloser
    });
    setRedoData(null);

    const updated = players.map(player => {
      const rs = currentRoundScores[player.name] || 0;
      const ns = [...player.scores];
      ns[currentRound - 1] = rs;
      return { ...player, scores: ns, total: ns.reduce((s, v) => s + v, 0) };
    });
    setPlayers(updated);

    if (currentRound < 7 && !isEarlyFinish) {
      setCurrentRound(prev => prev + 1);
      setCurrentRoundScores(players.reduce((acc, p) => { acc[p.name] = 0; return acc; }, {}));
      setRoundCloser('');
      showToast(`Ronda ${currentRound} completada ✓`);
    } else {
      const sorted = [...updated].sort((a, b) => a.total - b.total);
      const minTotal = sorted[0].total;
      const winners = sorted.filter(p => p.total === minTotal);
      const winnerNames = winners.map(w => w.name);

      if (currentRound === 7 && !isEarlyFinish) {
        setHallOfFameData(prev => [
          ...prev,
          {
            date: new Date().toISOString(),
            winner: winnerNames.length === 1 ? winnerNames[0] : winnerNames.join(' & '),
            winners: winnerNames,
            roundsPlayed: 7,
            players: sorted.map(p => ({ name: p.name, total: p.total }))
          }
        ]);
        showToast(winnerNames.length > 1
          ? `¡Juego terminado! Empate: ${winnerNames.join(' y ')} 🏆`
          : `¡Juego terminado! Ganador: ${winnerNames[0]} 🏆`
        );
      } else {
        showToast(winnerNames.length > 1
          ? `¡Partida finalizada en Ronda ${currentRound}! Empate: ${winnerNames.join(' y ')} 🏆`
          : `¡Partida finalizada en Ronda ${currentRound}! Ganador: ${winnerNames[0]} 🏆`
        );
      }
      setGameStarted(false);
      setShowFinalResults(true);
    }
  };

  const deleteHallOfFameGame = (index) => {
    setHallOfFameData(prev => prev.filter((_, i) => i !== index));
    showToast('Partida eliminada del Salón de la Fama');
  };

  const clearHallOfFame = () => {
    setHallOfFameData([]);
    showToast('Salón de la Fama vaciado');
  };

  const handleUndoLast = () => {
    if (!undoData) { showToast('Nada que deshacer'); return; }
    setRedoData({
      players: JSON.parse(JSON.stringify(players)),
      currentRound,
      currentRoundScores: { ...currentRoundScores },
      roundCloser
    });
    setPlayers(undoData.players);
    setCurrentRound(undoData.currentRound);
    setCurrentRoundScores(undoData.currentRoundScores);
    setRoundCloser(undoData.roundCloser);
    setUndoData(null);
    showToast('Última ronda deshecha ↩');
  };

  const handleRedo = () => {
    if (!redoData) { showToast('Nada que rehacer'); return; }
    setUndoData({
      players: JSON.parse(JSON.stringify(players)),
      currentRound,
      currentRoundScores: { ...currentRoundScores },
      roundCloser
    });
    setPlayers(redoData.players);
    setCurrentRound(redoData.currentRound);
    setCurrentRoundScores(redoData.currentRoundScores);
    setRoundCloser(redoData.roundCloser);
    setRedoData(null);
    showToast('Rehecho ↩');
  };

  const confirmNewGameSame = () => {
    setPlayers(prev => prev.map(p => ({ ...p, scores: Array(7).fill(0), total: 0 })));
    setCurrentRound(1);
    setGameStarted(false);
    setCurrentRoundScores({});
    setRoundCloser('');
    setUndoData(null);
    setRedoData(null);
    setShowFinalResults(false);
    showToast('¡Nueva partida lista!');
  };

  const confirmNewGameNew = () => {
    setPlayers([]);
    setCurrentRound(1);
    setGameStarted(false);
    setCurrentRoundScores({});
    setRoundCloser('');
    setUndoData(null);
    setRedoData(null);
    setShowFinalResults(false);
    showToast('¡Empezando desde cero!');
  };

  const cancelGame = () => {
    setPlayers([]);
    setCurrentRound(1);
    setGameStarted(false);
    setCurrentRoundScores({});
    setRoundCloser('');
    setUndoData(null);
    setRedoData(null);
    setShowFinalResults(false);
    showToast('Partida cancelada');
  };

  return {
    players,
    setPlayers,
    currentRound,
    setCurrentRound,
    gameStarted,
    setGameStarted,
    showFinalResults,
    setShowFinalResults,
    roundCloser,
    setRoundCloser,
    currentRoundScores,
    setCurrentRoundScores,
    hallOfFameData,
    undoData,
    redoData,
    getDealerName,
    getHandName,
    stats,
    getMediaRonda,
    addPlayer,
    removePlayer,
    editPlayer,
    movePlayer,
    setRoundCloserPlayer,
    updateCurrentRoundScore,
    updateScore,
    startGame,
    finishRound,
    handleUndoLast,
    handleRedo,
    confirmNewGameSame,
    confirmNewGameNew,
    cancelGame,
    deleteHallOfFameGame,
    clearHallOfFame
  };
}
