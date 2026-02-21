# Observer Universe

> *A world where reality depends on your attention.*

An interactive, immersive web experience exploring the philosophy of observation — inspired by quantum mechanics, Vogue editorial aesthetics, and the intersection of science, art, and spirituality.

---

## Concept

In quantum mechanics, particles behave differently when observed. In **Observer Universe**, everything follows this rule. Objects appear, transform, or vanish based on where you direct your attention. Typography dominates the screen. The environment breathes around you.

**Move your cursor. Click. Watch reality respond.**

---

## Structure

```
observer-universe/
├── index.html                 # Entry — OBJECTIVE
├── README.md
│
├── /sections/                 # Full-screen modules
│   ├── science.html           # Quantum mechanics
│   ├── art.html               # Editorial composition
│   ├── philosophy.html        # Existence & perception
│   ├── technology.html        # Generative systems
│   ├── spirituality.html      # Impermanence & awareness
│   └── reflection.html        # Final questions
│
├── /style/
│   ├── main.css               # Layout, objects, Vogue palette
│   └── typography.css         # Type system, animations
│
├── /scripts/
│   ├── main.js                # Observer engine, cursor, navigation
│   ├── objects.js             # Quantum visual objects
│   ├── typography.js          # Text reactions, glitch, scatter
│   └── sound.js               # Web Audio API ambient soundscape
│
├── /assets/
│   ├── /fonts/                # Add Tropikal or Seasons if licensed
│   ├── /images/               # Optional visual assets
│   └── /audio/                # Optional pre-recorded audio files
│
└── /examples/
    └── demo.html              # Feature testing page
```

---

## Features

| Feature | Description |
|---|---|
| **Quantum Objects** | SVG/CSS objects appear when cursor is nearby |
| **Observer Engine** | Proximity-based observation, probabilistic visibility |
| **Typography Reactions** | Glitch, scatter, shimmer, magnetic pull |
| **Generative Soundscape** | Web Audio API — drones, forest noise, bell pings |
| **Session Variance** | Each visit is unique; randomized seed on load |
| **Page Transitions** | Smooth fade between sections |
| **Keyboard Navigation** | Arrow keys to move between sections |

---

## How to Use

1. **Clone or download** this repository
2. Open `index.html` in a modern browser (Chrome, Firefox, Safari, Edge)
3. **No build step required** — pure HTML/CSS/JS
4. For GitHub Pages: push to `main` branch, enable Pages from root

---

## Customization

### Colors
Edit CSS variables in `/style/main.css`:
```css
:root {
  --color-accent: #c8a96e;  /* Gold — change per section */
  --color-bg: #0a0a0a;      /* Deep black */
}
```

Each section has its own theme override:
```css
.section-science { --color-accent: #4a9eca; }
.section-art     { --color-accent: #c86ea0; }
```

### Fonts
Google Fonts are loaded automatically (Playfair Display, Lato, Montserrat).  
For **Tropikal** or **Seasons** (premium fonts), purchase licenses and add to `/assets/fonts/`, then update:
```css
@font-face {
  font-family: 'Tropikal';
  src: url('../assets/fonts/Tropikal.woff2') format('woff2');
}
```
Then replace `--font-display` in `:root`.

### Proximity Radius
In `main.js`, adjust how close the cursor must be to "observe" objects:
```js
proximityRadius: 220,  // pixels
```

### Sound Scale
In `sound.js`, each section has a pitch set. Customize for different moods:
```js
SECTION_SCALES: {
  science: [146.83, 220, 293.66, 440],  // D scale
  ...
}
```

---

## Interaction Guide

| Action | Effect |
|---|---|
| Move cursor | Objects appear in proximity radius |
| Hover over headline | Glitch effect triggers |
| Move cursor fast | Text chars scatter temporarily |
| Click | Quantum collapse — nearby objects toggle state |
| Press `→` or `↓` | Next section |
| Press `←` or `↑` | Previous section |
| Click SOUND button | Enable generative ambient audio |

---

## Browser Notes

- Web Audio API requires a user gesture to start (click SOUND button)
- Custom cursor hidden on touch devices; proximity uses touch events
- Reduced motion media query respected: animations disabled if user prefers

---

## Philosophy

*"Does something exist if it is not seen?"*

This project is an artwork and an experiment. Every session is unique. You are not just a viewer — you are the author of this universe.

---

## Credits

Built with HTML, CSS, and vanilla JavaScript.  
No frameworks. No dependencies beyond Google Fonts.  
Inspired by the Copenhagen interpretation of quantum mechanics.

*Observer Universe — Reality you create.*
