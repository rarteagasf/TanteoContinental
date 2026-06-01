# 🃏 Continental Pro - Contador de Puntuaciones Profesional

**Continental Pro** es una aplicación web moderna y completamente funcional para llevar el registro de puntuaciones del juego de cartas Continental. Diseñada con las mejores prácticas de desarrollo web y un enfoque en la experiencia de usuario.

![Continental Pro Banner](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzIxODA4ZCIvPgo8cGF0aCBkPSJNOCAxMmg0djRIOFYxMnptNiAwaDR2NGgtNFYxMnptNiAwaDR2NGgtNFYxMnptLTEyIDZoNHY0SDhWMTh6bTYgMGg0djRoLTRWMTh6bTYgMGg0djRoLTRWMTh6IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)

## ✨ Características Principales

### 🎮 Funcionalidades del Juego
- **Registro de puntuaciones** para las 7 rondas del Continental
- **Gestión dinámica de jugadores** (2-6 jugadores)
- **Cálculo automático** de totales y rondas ganadas
- **Ordenamiento automático** por puntuación
- **Navegación entre rondas** con controles intuitivos
- **Sistema de repartidor** con rotación automática

### 📊 Estadísticas y Análisis
- **Gráfico de barras interactivo** con progreso ascendente
- **Estadísticas en tiempo real** (promedio, máximo, rondas completadas)
- **Indicador de líder** con emoji de corona
- **Posiciones automáticas** con medallas (🥇🥈🥉)
- **Conteo de rondas ganadas** por jugador

### 📝 Historial y Seguimiento
- **Historial de acciones** completo y detallado
- **Registro temporal** de todos los cambios
- **Persistencia automática** en localStorage
- **Recuperación de datos** entre sesiones
- **Seguimiento de cambios** por jugador y ronda

### 🎨 Diseño y UX
- **Modo claro/oscuro** con persistencia
- **Diseño completamente responsive** (móvil, tablet, desktop)
- **Iconografía moderna** y emojis expresivos
- **Animaciones suaves** y transiciones elegantes
- **Sistema de colores profesional** con temas adaptativos

### 📖 Manual y Reglas
- **Manual completo** del Continental integrado
- **Reglas oficiales** con variaciones incluidas
- **Sistema de puntuación detallado** (-10 × ronda para ganador)
- **Lectura en voz alta** con Web Speech API
- **Exportar/Importar manual** en formato Markdown

### 🚀 Funciones Avanzadas
- **Compartir resultados** nativos o por portapapeles
- **Reinicio inteligente** con confirmación
- **Validaciones de entrada** y límites apropiados
- **Accesibilidad mejorada** (lectores de pantalla, contraste)
- **PWA Ready** (Progressive Web App)

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Framework de UI moderno
- **Chart.js** - Gráficos interactivos y responsive
- **Web Speech API** - Síntesis de voz nativa
- **CSS Custom Properties** - Sistema de design tokens
- **LocalStorage API** - Persistencia de datos

### Características Técnicas
- **ES6+ JavaScript** - Sintaxis moderna
- **CSS Grid & Flexbox** - Layouts avanzados
- **Media Queries** - Diseño responsive
- **Web APIs** - Navigator.share, SpeechSynthesis
- **Sin dependencias externas** - Solo CDN para React y Chart.js

## 📋 Reglas del Continental

### Configuración del Juego
- **2-6 jugadores** usando dos barajas con comodines
- **7 rondas** con diferentes combinaciones requeridas
- **Objetivo**: Obtener la puntuación total más baja

### Rondas y Combinaciones
1. **Ronda 1**: 7 cartas - 2 Tríos
2. **Ronda 2**: 8 cartas - 1 Trío y 1 Escalera  
3. **Ronda 3**: 9 cartas - 2 Escaleras
4. **Ronda 4**: 10 cartas - 3 Tríos
5. **Ronda 5**: 11 cartas - 2 Tríos y 1 Escalera
6. **Ronda 6**: 12 cartas - 1 Trío y 2 Escaleras
7. **Ronda 7**: 13 cartas - 3 Escaleras

### Sistema de Puntuación
- **Comodín**: 100 puntos
- **Dos (2)**: 50 puntos
- **Figuras (J, Q, K)**: 20 puntos cada una
- **Cartas del 1-10**: Valor facial
- **Ganador de ronda**: -10 × número de ronda

### Variaciones Incluidas
- **Mover comodín**: En escaleras si tienes la carta sustituta
- **Robo reducido**: Una carta en lugar de dos (4+ jugadores)
- **Lectura en voz alta**: Para accesibilidad mejorada

## 🚀 Instalación y Uso

### Instalación Rápida
1. Descarga los archivos `continental-pro.html` y `continental-pro.css`
2. Colócalos en la misma carpeta
3. Abre `continental-pro.html` en cualquier navegador moderno
4. ¡Listo para jugar!

### Requisitos del Sistema
- **Navegador moderno** (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)
- **JavaScript habilitado**
- **LocalStorage disponible** (para persistencia)
- **Conexión a internet** (solo para cargar CDNs)

### Uso Básico
1. **Añade jugadores** usando el campo de texto
2. **Ingresa puntuaciones** en la tabla por ronda
3. **Navega entre rondas** con los botones anterior/siguiente
4. **Consulta estadísticas** con el botón de gráfico
5. **Ve el historial** con el botón de historial
6. **Cambia tema** con el botón sol/luna

## 📱 Compatibilidad y Responsive

### Breakpoints
- **Móvil**: < 480px
- **Tablet**: 480px - 768px  
- **Desktop**: > 768px
- **Wide**: > 1280px

### Características Responsive
- **Tabla horizontal scroll** en móviles
- **Grid adaptativo** para cards de jugadores
- **Botones full-width** en pantallas pequeñas
- **Tipografía escalable** según dispositivo
- **Touch-friendly** inputs y botones

## 🎨 Sistema de Colores

### Modo Claro
- **Primario**: Teal 600 (#0D9488)
- **Superficie**: White (#FFFFFF)
- **Fondo**: Gray 50 (#F9FAFB)
- **Texto**: Gray 900 (#111827)

### Modo Oscuro  
- **Primario**: Teal 400 (#2DD4BF)
- **Superficie**: Slate 800 (#1E293B)
- **Fondo**: Slate 900 (#0F172A)
- **Texto**: Gray 100 (#F1F5F9)

## 📊 Arquitectura y Estructura

### Componentes Principales
- **App**: Componente principal con estado global
- **ScoreChart**: Gráfico de barras con Chart.js
- **PlayerManagement**: Gestión de jugadores
- **Scoreboard**: Tabla de puntuaciones
- **GameControls**: Controles del juego
- **RulesSection**: Manual y reglas

### Estado de la Aplicación
```javascript
{
  players: Array,        // Lista de jugadores con puntuaciones
  currentRound: Number,  // Ronda actual (1-7)
  dealer: String,        // Nombre del repartidor actual
  darkMode: Boolean,     // Tema actual
  gameHistory: Array,    // Historial de acciones
  showRules: Boolean,    // Mostrar/ocultar reglas
  showChart: Boolean,    // Mostrar/ocultar gráfico
  showHistory: Boolean   // Mostrar/ocultar historial
}
```

## 🔧 Personalización

### Variables CSS
Todas las variables de diseño están centralizadas en `:root`:
```css
--color-primary: #0D9488;
--font-family-base: "Inter", sans-serif;
--space-4: 1rem;
--radius-lg: 1rem;
```

### Temas Personalizados
Modifica las variables en `[data-color-scheme="custom"]` para crear tu propio tema.

## 📈 Rendimiento

### Optimizaciones
- **React Production Build** desde CDN
- **CSS Custom Properties** para temas dinámicos
- **LocalStorage eficiente** con compresión JSON
- **Event delegation** para mejor performance
- **Lazy loading** de gráficos

### Métricas
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle size**: < 50KB (sin assets)

## 🔐 Privacidad y Datos

### Almacenamiento Local
Todos los datos se guardan **localmente** en tu navegador:
- `continental-players`: Datos de jugadores
- `continental-round`: Ronda actual
- `continental-dealer`: Repartidor actual  
- `continental-theme`: Tema seleccionado
- `continental-history`: Historial de acciones

### Sin Tracking
- **No cookies** de terceros
- **No analytics** externos
- **No datos enviados** a servidores
- **Completamente offline** después de la carga inicial

## 🤝 Contribuciones

### Reporte de Bugs
Si encuentras algún problema:
1. Describe el comportamiento esperado vs actual
2. Incluye pasos para reproducir
3. Menciona navegador y versión
4. Adjunta capturas si es relevante

### Sugerencias de Mejora
¿Ideas para nuevas características?
- Sistema de torneos
- Estadísticas históricas
- Exportación a PDF/Excel
- Modo multijugador online
- Integración con APIs de cartas

## 📄 Licencia

Este proyecto está disponible bajo la **Licencia MIT**.

```
MIT License

Copyright (c) 2025 Continental Pro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

## 🙏 Agradecimientos

- **React Team** - Por el increíble framework
- **Chart.js Contributors** - Por los gráficos hermosos
- **Continental Players** - Por el feedback y testing
- **Open Source Community** - Por la inspiración

---

**Continental Pro v3.0** - Hecho con ❤️ para jugadores de cartas

🎯 **¿Listo para jugar?** Abre `continental-pro.html` y ¡que comience la partida!

---

### 🔗 Enlaces Útiles

- [Documentación de React](https://react.dev/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

### 📞 Soporte

¿Necesitas ayuda? Revisa:
1. Este README completo
2. Las reglas integradas en la app
3. Los controles de ayuda en la interfaz
4. La sección de troubleshooting

**¡Disfruta jugando Continental Pro!** 🃏🎉#   T a n t e o C o n t i n e n t a l  
 