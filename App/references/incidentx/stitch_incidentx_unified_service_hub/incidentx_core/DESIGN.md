---
name: IncidentX Core
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#909097'
  outline-variant: '#45464d'
  surface-tint: '#bec6e0'
  primary: '#bec6e0'
  on-primary: '#283044'
  primary-container: '#0f172a'
  on-primary-container: '#798098'
  inverse-primary: '#565e74'
  secondary: '#44e2cd'
  on-secondary: '#003731'
  secondary-container: '#03c6b2'
  on-secondary-container: '#004d44'
  tertiary: '#7bd0ff'
  on-tertiary: '#00354a'
  tertiary-container: '#001a27'
  on-tertiary-container: '#008abb'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  h3:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-code:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  gutter: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for technical precision, rapid response, and high-stakes reliability. It targets DevOps engineers and security professionals who require a high-density, low-friction interface that balances data intensity with aesthetic clarity.

The visual style is a fusion of **Modern Corporate** and **Glassmorphism**. It utilizes a dark-mode-first approach to reduce eye strain during long incident shifts, featuring deep layers of translucent surfaces and sharp, vibrant accents. The result is a high-tech, "command center" aesthetic that feels both authoritative and innovative, making it ideal for high-impact demonstrations.

## Colors

The palette for this design system is anchored in deep "Midnight Blue" tones to establish a foundation of trust and stability. The primary interaction color is a vibrant "Cyber Teal," used sparingly to draw attention to critical actions and system status updates.

- **Primary (Deep Blue):** Used for global backgrounds and sidebars.
- **Secondary (Vibrant Teal):** Used for success states, primary buttons, and active indicators.
- **Tertiary (Electric Blue):** Used for informational elements and secondary highlights.
- **Surface:** A lighter tint of the primary blue used to create layered containers and cards.

## Typography

This design system employs a dual-font strategy. **Space Grotesk** is used for headlines and technical data points to provide a geometric, cutting-edge tech feel. **Inter** serves as the workhorse for body copy and UI labels, ensuring maximum legibility and a clean, utilitarian aesthetic.

- Use **h1** through **h3** for major page sections and dashboard titles.
- **Label-caps** should be used for table headers, small metadata, and category tags.
- **Mono-code** is reserved for log entries, incident IDs, and terminal-style readouts.

## Layout & Spacing

The layout philosophy follows a **12-column fluid grid** with fixed gutters to maintain structure across various screen sizes. The spacing rhythm is built on an 8px base unit, ensuring consistent vertical and horizontal cadence.

- **Desktop:** 12 columns, 24px margins, 16px gutters.
- **Tablet:** 8 columns, 16px margins, 16px gutters.
- **Mobile:** 4 columns, 16px margins, 12px gutters.

Large dashboard views should utilize "safe margins" of 32px to allow the interface to breathe, while data-heavy sidebars should use a more compact 12px stack.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** and **Tonal Layers** rather than heavy shadows. This design system treats the UI as a series of translucent panes stacked in a 3D space.

- **Level 0 (Background):** Solid deep blue (#0F172A).
- **Level 1 (Cards/Panels):** Semi-transparent background (10-15% opacity white) with a 20px backdrop blur and a subtle 1px border (#FFFFFF10).
- **Level 2 (Popovers/Modals):** Increased transparency (25% opacity) with a more aggressive 40px backdrop blur and a soft, outer glow in the primary teal color.

Avoid drop shadows with high offset; instead, use inner glows or thin high-contrast borders to define edges.

## Shapes

The shape language of this design system is "Modern Rounded." It avoids the playfulness of fully circular pill shapes in favor of a professional, structured radius.

- **Standard Elements (Buttons, Inputs):** 8px (0.5rem) radius.
- **Large Containers (Cards, Modals):** 16px (1rem) radius.
- **Small Elements (Tags, Badges):** 4px (0.25rem) radius to maintain sharpness at small scales.

Borders should always be thin (1px) and use low-opacity strokes to maintain the sleek, technical feel.

## Components

### Buttons
- **Primary:** Solid teal background with dark navy text. Use a subtle outer glow on hover.
- **Secondary:** Transparent background with a 1px teal border. 
- **Ghost:** Minimalistic, using only text or icons until hovered.

### Service Cards
Designed for a grid layout, service cards should feature a 1px top border in teal to denote "active" status. Include a small Space Grotesk "status" label in the top right corner. The card background must be glassmorphic to differentiate from the page surface.

### Input Fields
Inputs are fully transparent with a bottom-only border or a very subtle 4-sided stroke. Upon focus, the border transitions to vibrant teal with a soft "neon" glow (box-shadow).

### Sophisticated Chat Interface
The chat interface avoids traditional message bubbles. Instead, it uses a stream-like layout with clear sender avatars and timestamped technical logs.
- **System Messages:** Monospaced font in teal.
- **User Messages:** Standard Inter font with a subtle vertical line on the left to group consecutive messages.
- **Input Area:** A floating glass pane at the bottom of the chat container.

### Status Indicators
Small, pulsing circular indicators are used to signify real-time system health. Green/Teal for operational, Amber for warning, and Red for critical incidents.