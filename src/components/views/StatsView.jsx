import React from 'react';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { PLAYER_COLORS } from '../../constants/game';

export function StatsView({ players, stats, onOpenHallOfFame, shareResults }) {
  if (players.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--c-on-surface-variant)' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 56, marginBottom: 16, color: 'var(--c-on-surface-variant)' }}>
          query_stats
        </span>
        <div className="cc-page-title" style={{ marginBottom: 8 }}>Sin datos</div>
        <p>Inicia una partida para ver estadísticas.</p>
      </div>
    );
  }

  const sorted = [...players].sort((a, b) => a.total - b.total);
  const calculateRoundsWon = (player) => player.scores.filter(s => s < 0).length;

  /* ── Cumulative Scores per round for SVG line chart ── */
  const chartRounds = [1, 2, 3, 4, 5, 6, 7];
  const cumulativeScores = players.map((player, pIdx) => {
    let running = 0;
    const history = chartRounds.map((r, rIdx) => {
      running += player.scores[rIdx] || 0;
      return running;
    });
    return {
      name: player.name,
      color: PLAYER_COLORS[pIdx % PLAYER_COLORS.length],
      history
    };
  });

  /* Calculate Min/Max for chart scaling */
  const allValues = cumulativeScores.flatMap(p => p.history);
  const maxVal = Math.max(100, ...allValues);
  const minVal = Math.min(-70, ...allValues);
  const range = maxVal - minVal || 1;

  const width = 320;
  const height = 140;
  const padding = 25;

  const getX = (roundIdx) => padding + (roundIdx / 6) * (width - padding * 2);
  const getY = (val) => height - padding - ((val - minVal) / range) * (height - padding * 2);

  return (
    <div>
      <div className="cc-page-title">Estadísticas</div>
      <p className="cc-section-sub">Clasificación y rendimiento actual de los jugadores.</p>

      {/* ── Rankings List ── */}
      <div className="cc-rankings" style={{ marginBottom: 20 }}>
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

      {/* ── SVG Evolution Chart ── */}
      <div className="cc-rankings" style={{ padding: 16, marginBottom: 20 }}>
        <div className="cc-rankings-header" style={{ marginBottom: 12 }}>
          <div className="cc-rankings-title flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-primary)' }}>show_chart</span>
            Evolución de Puntos
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius)' }}>
            {/* Horizontal Grid lines */}
            {[0, 0.5, 1].map((ratio, i) => {
              const y = padding + ratio * (height - padding * 2);
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                />
              );
            })}

            {/* Round Labels */}
            {chartRounds.map((r, i) => (
              <text key={r} x={getX(i)} y={height - 6} fill="var(--c-on-surface-variant)" fontSize="9" textAnchor="middle">
                R{r}
              </text>
            ))}

            {/* Player Lines */}
            {cumulativeScores.map((p) => {
              const points = p.history.map((val, i) => `${getX(i)},${getY(val)}`).join(' ');
              return (
                <g key={p.name}>
                  <polyline
                    fill="none"
                    stroke={p.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                  {p.history.map((val, i) => (
                    <circle
                      key={i}
                      cx={getX(i)}
                      cy={getY(val)}
                      r="3.5"
                      fill={p.color}
                      stroke="var(--c-surface)"
                      strokeWidth="1"
                    />
                  ))}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12, justifyContent: 'center' }}>
          {cumulativeScores.map(p => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, display: 'inline-block' }}></span>
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="cc-btn cc-btn-secondary" onClick={onOpenHallOfFame} style={{ flex: 1 }}>
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
}
