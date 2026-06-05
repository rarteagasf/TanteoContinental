---
name: Continental Classic Scorekeeper
colors:
  surface: '#1d1009'
  surface-dim: '#1d1009'
  surface-bright: '#46362d'
  surface-container-lowest: '#170b05'
  surface-container-low: '#261911'
  surface-container: '#2a1d15'
  surface-container-high: '#36271e'
  surface-container-highest: '#413129'
  on-surface: '#f7ddd0'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#f7ddd0'
  inverse-on-surface: '#3d2d24'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#d8c2b9'
  on-secondary: '#3b2d27'
  secondary-container: '#53433d'
  on-secondary-container: '#c6b1a8'
  tertiary: '#cfd0b8'
  on-tertiary: '#303221'
  tertiary-container: '#b4b49d'
  on-tertiary-container: '#454634'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#f5ded5'
  secondary-fixed-dim: '#d8c2b9'
  on-secondary-fixed: '#251913'
  on-secondary-fixed-variant: '#53433d'
  tertiary-fixed: '#e4e4cc'
  tertiary-fixed-dim: '#c8c8b0'
  on-tertiary-fixed: '#1b1d0e'
  on-tertiary-fixed-variant: '#474836'
  background: '#1d1009'
  on-background: '#f7ddd0'
  surface-variant: '#413129'
typography:
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  score-display:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  button-text:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  touch-target: 48px
  gutter-md: 1.5rem
  margin-edge: 1rem
  container-padding: 1.25rem
---

## Brand & Style
The design system embodies the atmosphere of a high-stakes, traditional gentlemen's club or a classic card room. It targets enthusiasts of traditional games who value heritage and tactile luxury. The emotional response is one of focus, prestige, and quiet confidence.

The style is **Tactile / Skeuomorphic** with a heavy emphasis on rich textures. The primary background is a deep, polished dark wood grain, providing a grounded and warm foundation. UI elements are treated as physical objects—brass plates, inlaid ivory buttons, and etched gold accents. This digital craftsmanship ensures that even a utility app for scorekeeping feels like a premium heirloom accessory.

## Colors
The palette is derived from classic materials:
- **Primary (Metallic Gold):** Used for interactive borders, active states, and critical score highlights. It mimics polished brass.
- **Secondary (Dark Walnut):** The base canvas. A deep, dark wood texture with subtle specular highlights to give it depth.
- **Tertiary (Ivory):** Used for high-readability text and secondary button faces to provide contrast against the wood.
- **Neutral (Leather/Burnt Umber):** Used for container backgrounds and input fields, suggesting the texture of a desk blotter or leather card mat.

## Typography
The typographic hierarchy balances authoritative elegance with functional precision. **Libre Caslon Text** is utilized for headlines and the primary score displays to evoke a classic, printed-press aesthetic. For the scores themselves, the `score-display` level ensures maximum legibility at a distance.

**Work Sans** provides a grounded, professional feel for body text and navigation, ensuring that small text remains legible against textured backgrounds. **JetBrains Mono** is used sparingly for labels and historical logs (e.g., "Round 1", "Total"), providing a precise, "ledger-style" feel that differentiates meta-data from the core score values.

## Layout & Spacing
The layout uses a **fixed grid** approach to maintain the integrity of the "wooden tabletop" metaphor. 

- **Mobile:** A single-column "scorecard" view. Touch targets are strictly enforced at a minimum of 48px to allow for rapid score entry during active gameplay.
- **Tablet/Desktop:** A multi-pane layout mimicking a spread-out ledger. 
- **Rhythm:** An 8px base unit is used for all spacing. Score input controls (plus/minus buttons) are positioned at the bottom or sides for easy thumb reach on mobile devices.

## Elevation & Depth
This system eschews modern flat layers in favor of **physical depth**:
- **Inset Elements:** Score input fields and historical logs appear "carved" or "recessed" into the wood surface using inner shadows (dark top/left, light bottom/right).
- **Raised Elements:** Action buttons and active player cards appear "mounted" on the wood. They use dual-source shadows: a sharp 1px "highlight" edge on the top and a soft, dark drop shadow on the bottom to simulate thickness.
- **Material Transitions:** Use subtle radial gradients on gold elements to simulate a metallic sheen that shifts slightly as the user scrolls.

## Shapes
Shapes follow a **Soft (0.25rem)** roundedness to mimic hand-finished edges of wood and metal.
- **Buttons:** Sharp enough to feel geometric and formal, but with enough radius to feel comfortable for touch.
- **Input Fields:** Slightly more rounded (0.5rem) to suggest a milled slot in the wooden surface.
- **Dividers:** Use etched "groove" lines (1px dark, 1px light highlight) rather than flat solid colors.

## Components
- **Score Buttons:** Large, tactile brass-style buttons. Use a "pressed" state that removes the drop shadow and shifts the element down by 1px to provide physical feedback.
- **Score Card:** A central container with a "leather desk blotter" background (`#2C1E16`). It features a thin gold inner-border (0.5pt).
- **Inputs (Numeric):** Styled as recessed ivory plates. The font is high-contrast black on cream.
- **Chips/Status Tags:** Styled as inlaid wood of a different grain or small enamel pins with gold trim.
- **Player Lists:** Rows are separated by "etched" horizontal lines. The active player is highlighted by a faint gold glow or a "brass plate" background behind their name.
- **Stepper Control:** For score increments, use large '+' and '-' buttons flanking the score, ensuring the total touch area is easily accessible for one-handed use.