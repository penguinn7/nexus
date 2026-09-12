# LIMÓN — Immersive Lemon Experience

A cinematic, scroll-driven editorial website built with Next.js 14, GSAP, ScrollTrigger, and Lenis.

## Features

- **7 Immersive Scenes** — Introduction, The Object, The World, The Cut, Sour, Still Life, Finale
- **Smooth Scroll** — Lenis-powered buttery smooth scrolling
- **GSAP Animations** — ScrollTrigger-powered choreography matching reference video motion language
- **Sophisticated Visual Design** — Editorial, surreal, luxurious aesthetic
- **Responsive** — Works on desktop, tablet, and mobile
- **Accessible** — Reduced motion support, semantic HTML, ARIA labels

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis (Smooth Scroll)

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles, animations, design tokens
│   ├── layout.tsx           # Root layout with fonts
│   └── page.tsx             # Main page composing all scenes
├── components/
│   ├── SmoothScroll.tsx     # Lenis provider + GSAP integration
│   ├── Navigation.tsx       # Section navigation + progress indicator
│   ├── Lemon.tsx            # Lemon, slice, leaf components (SVG-based)
│   ├── AnimatedText.tsx     # Text animation utilities
│   ├── ParallaxLayer.tsx    # Parallax + pinning utilities
│   ├── SceneIntro.tsx       # Scene 1: Introduction
│   ├── SceneObject.tsx      # Scene 2: The Object
│   ├── SceneWorld.tsx       # Scene 3: The World
│   ├── SceneCut.tsx         # Scene 4: The Cut
│   ├── SceneSour.tsx        # Scene 5: Sour
│   ├── SceneStillLife.tsx   # Scene 6: Still Life
│   └── SceneFinale.tsx      # Scene 7: Finale
├── public/
│   ├── lemon-main.svg       # Main lemon illustration
│   ├── lemon-slice.svg      # Cross-section illustration
│   └── lemon-leaf.svg       # Leaf illustration
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Scene Breakdown

### Scene 1: Introduction
- Minimal opening composition
- Lemon enters viewport with scale/rotation choreography
- Title reveal with mask animation
- Pinned section with 200% scroll progress

### Scene 2: The Object
- Lemon becomes enormous (3.5x scale)
- Leaves orbit at different depths
- Text blocks reveal on scroll
- Ambient light transitions

### Scene 3: The World
- Multi-layer parallax with 10+ elements
- Lemons, slices, leaves at varying depths
- Horizontal scrolling text marquee
- Botanical data typography

### Scene 4: The Cut
- Dramatic transition: whole lemon → four slices
- Knife animation with precise timing
- Juice drop particles
- Phase-based progression (4 phases)

### Scene 5: Sour
- Minimal typography-focused composition
- Lemon color shift (hue rotation + saturation)
- Background color transition (cream → lemon)
- Interactive acidity index meter
- Word grid with staggered reveal

### Scene 6: Still Life
- Classical vanitas composition
- 9 elements arranged in Renaissance style
- Chiaroscuro lighting simulation
- Cloth ground plane reveal
- Art historical references

### Scene 7: Finale
- Single lemon, minimal composition
- Color inversion (dark → light)
- Progressive word revelation
- "FINIS" marker at conclusion
- Typewriter ending message

## Design Tokens

### Colors
- **Lemon**: 50-950 scale (yellow/amber)
- **Cream**: 50-950 scale (warm off-whites)
- **Charcoal**: 50-950 scale (deep neutrals)

### Typography
- **Display**: Playfair Display (serif, editorial)
- **Sans**: Inter (UI, labels)
- **Mono**: JetBrains Mono (data, technical)

### Animations
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (expo.out)
- **Durations**: 800ms-1200ms for entrances
- **Scrub**: 1-1.5 for scroll-driven animations

## Accessibility

- `prefers-reduced-motion` respected globally
- Semantic HTML structure
- ARIA labels on interactive elements
- Focus visible states
- High contrast mode support

## Performance

- SVG illustrations (scalable, small)
- GPU-accelerated transforms (`will-change`)
- Lazy loading for non-critical images
- `ScrollTrigger` refresh optimization
- Lenis RAF loop synchronization

## Customization

### Adding Scenes
1. Create new component in `components/`
2. Import and add to `app/page.tsx`
3. Add navigation item in `components/Navigation.tsx`

### Modifying Animations
- Adjust `scrub` values in ScrollTrigger configs
- Change `duration`/`ease` in GSAP timelines
- Modify `start`/`end` trigger positions

### Color Themes
Edit `tailwind.config.js` color scales and `app/globals.css` CSS variables.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT