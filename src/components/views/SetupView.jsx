import React, { useState, useRef, useEffect } from 'react';
import { PlayerAvatar } from '../common/PlayerAvatar';

export function SetupView({
  players,
  gameStarted,
  showResumePrompt,
  addPlayer,
  removePlayer,
  editPlayer,
  movePlayer,
  startGame,
  confirmNewGameNew
}) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayer, setEditingPlayer] = useState(null);
  const dragIndex = useRef(null);

  /* Touch drag: non-passive listener ensures preventDefault works */
  useEffect(() => {
    const onMove = e => {
      if (dragIndex.current === null) return;
      try { e.preventDefault(); } catch (_) {}
    };
    document.addEventListener('touchmove', onMove, { passive: false });
    return () => document.removeEventListener('touchmove', onMove);
  }, []);

  const handleAdd = () => {
    if (addPlayer(newPlayerName)) {
      setNewPlayerName('');
    }
  };

  if (showResumePrompt) {
    return (
      <div className="cc-resume-prompt">
        <span className="material-symbols-outlined" style={{ fontSize: 36, marginBottom: 12, color: 'var(--c-primary)' }}>
          restart_alt
        </span>
        <div className="cc-page-title" style={{ fontSize: 20, marginBottom: 8 }}>Partida Anterior Detectada</div>
        <p className="cc-resume-desc">
          Jugadores encontrados: <strong>{players.map(p => p.name).join(', ')}</strong>. ¿Qué deseas hacer?
        </p>
        <div className="cc-resume-actions">
          <button className="cc-btn cc-btn-secondary" onClick={confirmNewGameNew}>
            Empezar de cero
          </button>
          <button className="cc-btn cc-btn-primary" onClick={startGame}>
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cc-setup">
      <div className="cc-page-title">Nueva Partida</div>
      <p className="cc-section-sub">Registra de 2 a 6 jugadores. Usa las flechas ▲ ▼ o arrastra para cambiar el orden de turno.</p>

      <div className="cc-player-add-form">
        <input
          type="text"
          className="cc-player-name-input"
          value={newPlayerName}
          onChange={e => setNewPlayerName(e.target.value)}
          placeholder="Nombre del jugador..."
          maxLength="15"
          onKeyPress={e => e.key === 'Enter' && handleAdd()}
        />
        <button className="cc-btn-add" onClick={handleAdd} disabled={players.length >= 6 || !newPlayerName.trim()}>
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
              e.dataTransfer.dropEffect = 'move';
              if (dragIndex.current !== null && dragIndex.current !== index) {
                e.currentTarget.classList.add('drag-over');
              }
            }}
            onDragLeave={e => {
              e.currentTarget.classList.remove('drag-over');
            }}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.classList.remove('drag-over');
              if (dragIndex.current !== null && dragIndex.current !== index && !gameStarted) {
                movePlayer(dragIndex.current, index);
              }
              dragIndex.current = null;
            }}
            onDragEnd={() => {
              document.querySelectorAll('.cc-player-item.drag-over, .cc-player-item.dragging').forEach(el => el.classList.remove('drag-over', 'dragging'));
              dragIndex.current = null;
            }}
            onTouchStart={() => {
              if (gameStarted) return;
              dragIndex.current = index;
            }}
            onTouchMove={e => {
              if (dragIndex.current === null || gameStarted) return;
              const touch = e.touches[0];
              const el = document.elementFromPoint(touch.clientX, touch.clientY);
              if (!el) return;
              const item = el.closest('.cc-player-item');
              if (!item) return;
              const items = Array.from(item.parentElement.querySelectorAll('.cc-player-item'));
              const overIdx = items.indexOf(item);
              if (overIdx !== -1 && overIdx !== dragIndex.current) {
                items.forEach(x => x.classList.remove('drag-over'));
                item.classList.add('drag-over');
              }
            }}
            onTouchEnd={() => {
              if (dragIndex.current === null) return;
              const over = document.querySelector('.cc-player-item.drag-over');
              if (over && dragIndex.current !== null && !gameStarted) {
                const items = Array.from(over.parentElement.querySelectorAll('.cc-player-item'));
                const to = items.indexOf(over);
                if (to !== -1 && dragIndex.current !== to) {
                  movePlayer(dragIndex.current, to);
                }
              }
              document.querySelectorAll('.cc-player-item.drag-over, .cc-player-item.dragging').forEach(x => x.classList.remove('drag-over', 'dragging'));
              dragIndex.current = null;
            }}
          >
            {/* Reorder Arrows & Handle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 4 }}>
              <span className="cc-drag-handle" title="Arrastrar para reordenar" style={{ cursor: 'grab' }}>⠿</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); if (index > 0) movePlayer(index, index - 1); }}
                  disabled={index === 0 || gameStarted}
                  title="Subir posición"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: index === 0 ? 'default' : 'pointer',
                    opacity: index === 0 ? 0.2 : 0.7,
                    color: 'var(--c-on-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>expand_less</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); if (index < players.length - 1) movePlayer(index, index + 1); }}
                  disabled={index === players.length - 1 || gameStarted}
                  title="Bajar posición"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: index === players.length - 1 ? 'default' : 'pointer',
                    opacity: index === players.length - 1 ? 0.2 : 0.7,
                    color: 'var(--c-on-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>expand_more</span>
                </button>
              </div>
            </div>

            <PlayerAvatar name={player.name} index={index} size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {editingPlayer === player.name ? (
                <input
                  type="text"
                  defaultValue={player.name}
                  onBlur={e => { editPlayer(player.name, e.target.value); setEditingPlayer(null); }}
                  onKeyPress={e => { if (e.key === 'Enter') { editPlayer(player.name, e.target.value); setEditingPlayer(null); } }}
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
}
