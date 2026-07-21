import React from 'react';

export function SettingsView({
  darkMode,
  setDarkMode,
  gameStarted,
  onOpenRules,
  handleNewGame,
  cancelGame,
  shareResults,
  onOpenHallOfFame,
  hasPlayers,
  showToast
}) {
  return (
    <div className="cc-settings">
      <div className="cc-page-title">Ajustes</div>
      <p className="cc-section-sub">Personalización, gestión de partida e información del club.</p>

      {/* ── SECCIÓN 1: APARIENCIA ── */}
      <div className="cc-settings-section" style={{ marginBottom: 20 }}>
        <div className="cc-settings-section-title">Apariencia</div>
        <div
          className="cc-settings-row"
          onClick={() => setDarkMode(!darkMode)}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div className="cc-settings-row-label">
              <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle', color: 'var(--c-primary)' }}>
                {darkMode ? 'dark_mode' : 'light_mode'}
              </span>
              Modo Oscuro
            </div>
            <div className="cc-settings-row-desc">
              {darkMode ? 'Tema de madera oscura y latón activo' : 'Tema de marfil claro activo'}
            </div>
          </div>
          <div className="cc-toggle-switch" style={{ display: 'flex', alignItems: 'center' }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 24, color: darkMode ? 'var(--c-primary)' : 'var(--c-on-surface-variant)' }}
            >
              {darkMode ? 'toggle_on' : 'toggle_off'}
            </span>
          </div>
        </div>
      </div>

      {/* ── SECCIÓN 2: CONTROL DE PARTIDA ── */}
      <div className="cc-settings-section" style={{ marginBottom: 20 }}>
        <div className="cc-settings-section-title">Control de Partida</div>

        <div className="cc-settings-row" onClick={handleNewGame}>
          <div>
            <div className="cc-settings-row-label">
              <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle', color: 'var(--c-primary)' }}>
                playing_cards
              </span>
              Nueva Partida
            </div>
            <div className="cc-settings-row-desc">Iniciar un nuevo juego conservando o cambiando jugadores</div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-on-surface-variant)' }}>chevron_right</span>
        </div>

        {gameStarted && (
          <div className="cc-settings-row" onClick={cancelGame}>
            <div>
              <div className="cc-settings-row-label" style={{ color: 'var(--c-error, #d9534f)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle', color: 'var(--c-error, #d9534f)' }}>
                  cancel
                </span>
                Cancelar Partida Activa
              </div>
              <div className="cc-settings-row-desc">Detener la partida actual y regresar al inicio</div>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-on-surface-variant)' }}>chevron_right</span>
          </div>
        )}

        {hasPlayers && (
          <div className="cc-settings-row" onClick={shareResults}>
            <div>
              <div className="cc-settings-row-label">
                <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle', color: 'var(--c-primary)' }}>
                  share
                </span>
                Compartir Puntuaciones
              </div>
              <div className="cc-settings-row-desc">Copiar o enviar el resumen de la tabla por WhatsApp / redes</div>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-on-surface-variant)' }}>chevron_right</span>
          </div>
        )}
      </div>

      {/* ── SECCIÓN 3: HISTORIAL Y REGISTROS ── */}
      <div className="cc-settings-section" style={{ marginBottom: 20 }}>
        <div className="cc-settings-section-title">Historial y Datos</div>

        <div className="cc-settings-row" onClick={onOpenHallOfFame}>
          <div>
            <div className="cc-settings-row-label">
              <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle', color: 'var(--c-primary)' }}>
                emoji_events
              </span>
              Salón de la Fama
            </div>
            <div className="cc-settings-row-desc">Ver tabla de campeones e historial de partidas completadas</div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-on-surface-variant)' }}>chevron_right</span>
        </div>
      </div>

      {/* ── SECCIÓN 4: AYUDA E INFORMACIÓN ── */}
      <div className="cc-settings-section">
        <div className="cc-settings-section-title">Ayuda e Información</div>

        <div className="cc-settings-row" onClick={onOpenRules}>
          <div>
            <div className="cc-settings-row-label">
              <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle', color: 'var(--c-primary)' }}>
                menu_book
              </span>
              Reglas del Continental
            </div>
            <div className="cc-settings-row-desc">Manual oficial con soporte de lectura por voz integrados</div>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--c-on-surface-variant)' }}>chevron_right</span>
        </div>

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
