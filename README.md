# Continental Pro - Contador de Puntuaciones Profesional

**Continental Pro** es una aplicación web moderna y completamente funcional para llevar el registro de puntuaciones del juego de cartas Continental. Diseñada con las mejores prácticas de desarrollo web y un enfoque en la experiencia de usuario.

## Caracterí­sticas Principales

### Funcionalidades del Juego

* **Registro de puntuaciones** para las 7 rondas del Continental
* **Gestión dinámica de jugadores** (2-6 jugadores)
* **Cálculo automático** de totales y rondas ganadas
* **Ordenamiento automático** por puntuación
* **Navegación entre rondas** con controles intuitivos
* **Sistema de repartidor** con rotación automática

### Estadí­sticas y Análisis

* **Gráfico de barras interactivo** con progreso ascendente
* **Estadísticas en tiempo real** (promedio, máximo, rondas completadas)
* **Indicador de líder** con emoji de corona
* **Posiciones automáticas** con medallas
* **Conteo de rondas ganadas** por jugador

### Historial y Seguimiento

* **Historial de acciones** completo y detallado
* **Registro temporal** de todos los cambios
* **Persistencia automática** en localStorage
* **Recuperación de datos** entre sesiones
* **Seguimiento de cambios** por jugador y ronda

### Diseí±o y Ux

* **Modo claro/oscuro** con persistencia
* **Diseño completamente responsive** (móvil, tablet, desktop)
* **Iconografía moderna** y emojis expresivos
* **Animaciones suaves** y transiciones elegantes
* **Sistema de colores profesional** con temas adaptativos

### Manual y Reglas

* **Manual completo** del Continental integrado
* **Reglas oficiales** con variaciones incluidas
* **Sistema de puntuación detallado** (-10 × ronda para ganador)
* **Lectura en voz alta** con Web Speech API
* **Exportar/importar manual** en formato Markdown

### Funciones Avanzadas

* **Compartir resultados** nativos o por portapapeles
* **Reinicio inteligente** con confirmación
* **Validaciones de entrada** y límites apropiados
* **Accesibilidad mejorada** (lectores de pantalla, contraste)
* **PWA ready** (Progressive Web App)

## Tecnologí­as Utilizadas

### Frontend

* **React 18** - Framework de UI moderno
* **Chart.js** - Gráficos interactivos y responsive
* **Web Speech API** - Síntesis de voz nativa
* **CSS Custom Properties** - Sistema de design tokens
* **LocalStorage API** - Persistencia de datos

### Caracterí­sticas Técnicas

* **ES6+ JavaScript** - Sintaxis moderna
* **CSS Grid y Flexbox** - Layouts avanzados
* **Media Queries** - Diseño responsive
* **Web APIs** - Navigator.share, SpeechSynthesis
* **Sin dependencias externas** - Solo CDN para React y Chart.js

## Reglas del Continental

### Configuración del Juego

* **2-6 jugadores** usando dos barajas con comodines
* **7 rondas** con diferentes combinaciones requeridas
* **Objetivo**: obtener la puntuación total más baja

### Rondas y Combinaciones

1. **Ronda 1**: 7 cartas - 2 tríos
2. **Ronda 2**: 8 cartas - 1 trío y 1 escalera
3. **Ronda 3**: 9 cartas - 2 escaleras
4. **Ronda 4**: 10 cartas - 3 tríos
5. **Ronda 5**: 11 cartas - 2 tríos y 1 escalera
6. **Ronda 6**: 12 cartas - 1 trío y 2 escaleras
7. **Ronda 7**: 13 cartas - 3 escaleras

### Sistema de Puntuación

* **Comodín**: 100 puntos
* **Dos (2)**: 50 puntos
* **Figuras (J, Q, K)**: 20 puntos cada una
* **Cartas del 1-10**: valor facial
* **Ganador de ronda**: -10 × número de ronda

### Variaciones Incluidas

* **Mover comodín**: en escaleras si tienes la carta sustituta
* **Robo reducido**: una carta en lugar de dos (4+ jugadores)
* **Lectura en voz alta**: para accesibilidad mejorada

## Instalación y Uso

### Requisitos del Sistema

* **Navegador moderno** (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)
* **JavaScript habilitado**
* **LocalStorage disponible** (para persistencia)
* **Conexión a internet** (solo para cargar CDNs)

### Uso Básico

1. **Añade jugadores** usando el campo de texto
2. **Ingresa puntuaciones** en la tabla por ronda
3. **Navega entre rondas** con los botones anterior/siguiente
4. **Consulta estadísticas** con el botón de gráfico
5. **Ve el historial** con el botón de historial
6. **Cambia tema** con el botón sol/luna

## Compatibilidad y Responsive

### Breakpoints

* **Móvil**: < 480px
* **Tablet**: 480px - 768px
* **Desktop**: > 768px
* **Wide**: > 1280px

### Caracterí­sticas Responsive

* **Tabla horizontal scroll** en móviles
* **Grid adaptativo** para cards de jugadores
* **Botones full-width** en pantallas pequeñas
* **Tipografía escalable** según dispositivo
* **Touch-friendly** inputs y botones

## Sistema de Colores

### Modo Claro

* **Primario**: teal 600 (#0D9488)
* **Superficie**: white (#FFFFFF)
* **Fondo**: gray 50 (#F9FAFB)
* **Texto**: gray 900 (#111827)

### Modo Oscuro

* **Primario**: teal 400 (#2DD4BF)
* **Superficie**: slate 800 (#1E293B)
* **Fondo**: slate 900 (#0F172A)
* **Texto**: gray 100 (#F1F5F9)

## Arquitectura y Estructura

### Componentes Principales

* **App**: componente principal con estado global
* **ScoreChart**: gráfico de barras con Chart.js
* **PlayerManagement**: gestión de jugadores
* **Scoreboard**: tabla de puntuaciones
* **GameControls**: controles del juego
* **RulesSection**: manual y reglas

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

## Personalización

### Variables Css

Todas las variables de diseño están centralizadas en `:root`:

```css
--color-primary: #0D9488;
--font-family-base: "Inter", sans-serif;
--space-4: 1rem;
--radius-lg: 1rem;

```

### Temas Personalizados

Modifica las variables en `[data-color-scheme="custom"]` para crear tu propio tema.

## Rendimiento

### Optimizaciones

* **React production build** desde CDN
* **CSS Custom Properties** para temas dinámicos
* **LocalStorage eficiente** con compresión JSON
* **Event delegation** para mejor performance
* **Lazy loading** de gráficos

### Métricas

* **First Contentful Paint**: < 1.5s
* **Time to Interactive**: < 3s
* **Bundle size**: < 50KB (sin assets)

## Privacidad y Datos

### Almacenamiento Local

Todos los datos se guardan **localmente** en tu navegador:

* `continental-players`: datos de jugadores
* `continental-round`: ronda actual
* `continental-dealer`: repartidor actual
* `continental-theme`: tema seleccionado
* `continental-history`: historial de acciones

### Sin Tracking

* **No cookies** de terceros
* **No analytics** externos
* **No datos enviados** a servidores
* **Completamente offline** después de la carga inicial

## Contribuciones

### Reporte de Bugs

Si encuentras algún problema:

1. Describe el comportamiento esperado vs actual
2. Incluye pasos para reproducir
3. Menciona navegador y versión
4. Adjunta capturas si es relevante

### Sugerencias de Mejora

¿Ideas para nuevas características?

* Sistema de torneos
* Estadísticas históricas
* Exportación a PDF/Excel
* Modo multijugador online
* Integración con APIs de cartas

## Licencia

Este proyecto está disponible bajo la **Licencia MIT**.

```text
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

## Agradecimientos

* **React Team** - Por el increíble framework
* **Chart.js Contributors** - Por los gráficos hermosos
* **Continental Players** - Por el feedback y testing
* **Open Source Community** - Por la inspiración

---

### Enlaces íštiles

* [Documentación de React](https://react.dev/)
* [Chart.js Documentation](https://www.chartjs.org/docs/)
* [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
* [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

### Soporte

¿Necesitas ayuda? Revisa:

1. Este README completo
2. Las reglas integradas en la app
3. Los controles de ayuda en la interfaz
4. La sección de troubleshooting
