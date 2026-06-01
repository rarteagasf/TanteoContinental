// script.js - Archivo opcional para funciones separadas
// Todo el código React está ahora integrado en index.html

// Forzar aplicación de tema guardado al cargar
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('continental-theme');
  if (saved) document.documentElement.setAttribute('data-color-scheme', saved);
});

// Cálculo de "mano" tras cambiar repartidor
function getHandPlayer(players, dealerName) {
  if (!dealerName || players.length < 2) return '';
  const idx = players.findIndex(p => p.name === dealerName);
  if (idx < 0) return '';
  return players[(idx + 1) % players.length].name;
}

// Exposición de la función al resto de módulo
window.getHandPlayer = getHandPlayer;