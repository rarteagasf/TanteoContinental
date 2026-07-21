import React, { useState } from 'react';

export function CardCalculatorModal({ playerName, initialScore, onApply, onClose }) {
  const [jokers, setJokers] = useState(0);
  const [twos, setTwos] = useState(0);
  const [figures, setFigures] = useState(0);
  const [cardsSum, setCardsSum] = useState(0);

  const calculateTotal = () => {
    return (jokers * 100) + (twos * 50) + (figures * 20) + cardsSum;
  };

  const total = calculateTotal();

  const handleApply = () => {
    onApply(playerName, total > 0 ? total : (initialScore || 0));
    onClose();
  };

  const addNumberCard = (val) => {
    setCardsSum(prev => prev + val);
  };

  const resetAll = () => {
    setJokers(0);
    setTwos(0);
    setFigures(0);
    setCardsSum(0);
  };

  return (
    <div className="cc-overlay show" style={{ zIndex: 1000 }}>
      <div className="cc-modal" style={{ maxWidth: 420 }}>
        <div className="cc-modal-header">
          <div className="cc-modal-title">
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--c-primary)', marginRight: 6, verticalAlign: 'middle' }}>
              calculate
            </span>
            Calculadora de Cartas: <strong>{playerName}</strong>
          </div>
          <button className="cc-btn cc-btn-secondary cc-btn-sm" onClick={onClose}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '16px 0' }}>
          {/* Card Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {/* Joker */}
            <div className="recessed-panel" style={{ padding: 10, textAlign: 'center', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 11, color: 'var(--c-on-surface-variant)', fontWeight: 600 }}>Comodín (100pt)</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}>
                <button className="cc-btn-remove" onClick={() => setJokers(Math.max(0, jokers - 1))} style={{ width: 26, height: 26 }}>-</button>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{jokers}</span>
                <button className="cc-btn-add" onClick={() => setJokers(jokers + 1)} style={{ width: 26, height: 26, padding: 0 }}>+</button>
              </div>
            </div>

            {/* Dos */}
            <div className="recessed-panel" style={{ padding: 10, textAlign: 'center', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 11, color: 'var(--c-on-surface-variant)', fontWeight: 600 }}>Dos (50pt)</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}>
                <button className="cc-btn-remove" onClick={() => setTwos(Math.max(0, twos - 1))} style={{ width: 26, height: 26 }}>-</button>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{twos}</span>
                <button className="cc-btn-add" onClick={() => setTwos(twos + 1)} style={{ width: 26, height: 26, padding: 0 }}>+</button>
              </div>
            </div>

            {/* Figuras */}
            <div className="recessed-panel" style={{ padding: 10, textAlign: 'center', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 11, color: 'var(--c-on-surface-variant)', fontWeight: 600 }}>J, Q, K (20pt)</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}>
                <button className="cc-btn-remove" onClick={() => setFigures(Math.max(0, figures - 1))} style={{ width: 26, height: 26 }}>-</button>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{figures}</span>
                <button className="cc-btn-add" onClick={() => setFigures(figures + 1)} style={{ width: 26, height: 26, padding: 0 }}>+</button>
              </div>
            </div>
          </div>

          {/* Quick Number Card Pad */}
          <div style={{ background: 'var(--c-surface-container)', padding: 10, borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: 11, color: 'var(--c-on-surface-variant)', marginBottom: 6, fontWeight: 600 }}>
              Cartas Numéricas (Añadir valor facial):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
              {[1, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                <button
                  key={val}
                  className="cc-btn cc-btn-secondary"
                  style={{ padding: '6px 0', fontSize: 13, fontWeight: 600, justifyContent: 'center' }}
                  onClick={() => addNumberCard(val)}
                >
                  +{val}
                </button>
              ))}
              <button
                className="cc-btn cc-btn-secondary"
                style={{ padding: '6px 0', fontSize: 11, color: 'var(--c-error, #d9534f)', justifyContent: 'center' }}
                onClick={() => setCardsSum(0)}
              >
                Cero
              </button>
            </div>
            <div style={{ fontSize: 11, marginTop: 6, textAlign: 'right', color: 'var(--c-on-surface-variant)' }}>
              Suma numéricas: <strong>{cardsSum} pt</strong>
            </div>
          </div>

          {/* Display Total */}
          <div style={{
            textAlign: 'center',
            padding: '12px',
            background: 'var(--c-surface-container-high)',
            borderRadius: 'var(--radius)',
            border: '1px solid rgba(212,175,55,0.3)'
          }}>
            <div style={{ fontSize: 12, color: 'var(--c-on-surface-variant)' }}>Puntuación Calculada</div>
            <div className="font-score-display" style={{ fontSize: 32, fontWeight: 700, color: 'var(--c-primary)' }}>
              {total} <span style={{ fontSize: 14 }}>pts</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="cc-btn cc-btn-secondary" onClick={resetAll} style={{ flex: 1 }}>
              Limpiar
            </button>
            <button className="cc-btn cc-btn-primary" onClick={handleApply} style={{ flex: 2 }}>
              Aplicar {total} pts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
