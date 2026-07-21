import React, { memo } from 'react';
import { PLAYER_COLORS } from '../../constants/game';

export const Icon = memo(function Icon({ name, fill, className }) {
  return (
    <span
      className={`material-symbols-outlined${className ? ' ' + className : ''}`}
      style={fill ? { fontVariationSettings: `'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24` } : undefined}
    >
      {name}
    </span>
  );
});

export const PlayerAvatar = memo(function PlayerAvatar({ name, index, size }) {
  const sz = size || 40;
  const initial = (name || '?').charAt(0).toUpperCase();
  const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
  return (
    <div
      className="cc-player-avatar"
      style={{
        background: color,
        width: sz,
        height: sz,
        fontSize: Math.round(sz * 0.38)
      }}
    >
      {initial}
    </div>
  );
});

export const FrameAvatar = memo(function FrameAvatar({ name, index, size }) {
  const sz = size || 34;
  return (
    <div className="avatar-frame" style={{ width: sz + 10, height: sz + 10 }}>
      <PlayerAvatar name={name} index={index} size={sz} />
    </div>
  );
});
