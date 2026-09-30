# PoEDoku

A daily 3x3 grid trivia game based on Path of Exile 1 active skill gems, inspired by PokéDoku and Immaculate Grid.

## Rules

- Complete the 3x3 grid by selecting an active skill gem for each cell.
- Each selected gem must satisfy both the row criterion and the column criterion.
- You have exactly 9 guesses for the 9 cells. Every guess counts.
- Each skill gem can only be used once per puzzle.
- A new puzzle is generated daily at 00:00 UTC and is identical for all players.

## Tech Stack

- React 18, TypeScript, Vite
- Tailwind CSS
- Data sourced from the PoE Community Wiki Cargo API

## Getting Started

### Prerequisites

Node.js (v18+) and npm.

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Update Gem Database

To re-fetch all active skill gems from the PoE Community Wiki:

```bash
npm run fetch:gems
```

## Deployment

The project is a static single-page application (SPA).

To deploy on Vercel:
1. Import this repository into Vercel.
2. Select the **Vite** preset (default build command: `npm run build`, output directory: `dist`).
3. Deploy.

## License & Credits

PoEDoku is an open-source fan project. Path of Exile and all related assets are trademarks or registered trademarks of Grinding Gear Games.
