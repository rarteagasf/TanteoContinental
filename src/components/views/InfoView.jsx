import React from 'react';

export function InfoView({
  onOpenRules,
  onOpenHallOfFame
}) {
  return (
    <div className="cc-settings">
      <div className="cc-page-title">Información</div>
      <p className="cc-section-sub">Historial del club, manual oficial e información de la aplicación.</p>

      <div className="cc-settings-section">

        {/* 1. Salón de la Fama */}
        <div className="cc-settings-row" onClick={onOpenHallOfFame}>
          <div>
            <div className="cc-settings-row-label">
              <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle', color: 'var(--c-primary)' }}>
                emoji_events
              </span>
              Salón de la Fama
            </div>
            <div className="cc-settings-row-desc">Tabla de campeones e historial de partidas completadas</div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-on-surface-variant)' }}>chevron_right</span>
        </div>

        {/* 2. Reglas del Continental */}
        <div className="cc-settings-row" onClick={onOpenRules}>
          <div>
            <div className="cc-settings-row-label">
              <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle', color: 'var(--c-primary)' }}>
                menu_book
              </span>
              Reglas del Continental
            </div>
            <div className="cc-settings-row-desc">Manual oficial con reproductor e instrucciones por voz</div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-on-surface-variant)' }}>chevron_right</span>
        </div>

        {/* 3. Acerca de Continental Club */}
        <div className="cc-settings-row" style={{ cursor: 'default' }}>
          <div>
            <div className="cc-settings-row-label">
              <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle', color: 'var(--c-primary)' }}>
                info
              </span>
              Acerca de Continental Club
            </div>
            <div className="cc-settings-row-desc">Versión 1.0.0 Pro · PWA Web App Offline Ready</div>
          </div>
        </div>

      </div>
    </div>
  );
}
