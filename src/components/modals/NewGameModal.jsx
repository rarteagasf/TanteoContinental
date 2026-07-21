import React from 'react';

export function NewGameModal({ gameStarted, onConfirmSame, onConfirmNew, onClose }) {
  return (
    <div className="cc-overlay show">
      <div className="cc-modal" style={{ maxWidth: 400, textAlign: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 40, marginBottom: 12, color: 'var(--c-primary)' }}>
          playing_cards
        </span>
        <div className="cc-modal-title" style={{ marginBottom: 8 }}>Nueva Partida</div>
        
        {gameStarted && (
          <div style={{
            background: 'rgba(217, 83, 79, 0.1)',
            border: '1px solid rgba(217, 83, 79, 0.3)',
            borderRadius: 'var(--radius)',
            padding: '10px 12px',
            marginBottom: 16,
            fontSize: 12,
            color: 'var(--c-error, #d9534f)',
            textAlign: 'left'
          }}>
            <strong>⚠️ Atención:</strong> Hay una partida en curso. Al iniciar una nueva partida se descartarán los puntos no guardados de la partida actual.
          </div>
        )}

        <p style={{ fontSize: 13, color: 'var(--c-on-surface-variant)', marginBottom: 20 }}>
          ¿Deseas mantener los mismos jugadores o registrar jugadores nuevos?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="cc-btn cc-btn-primary cc-btn-full" onClick={onConfirmSame}>
            Mismos jugadores
          </button>
          <button className="cc-btn cc-btn-secondary cc-btn-full" onClick={onConfirmNew}>
            Jugadores nuevos
          </button>
          <button className="cc-btn cc-btn-secondary cc-btn-full" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
