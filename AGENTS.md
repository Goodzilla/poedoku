# AGENTS.md — Developer & AI Agent Guide for PoEDoku

Welcome to **PoEDoku**! This guide outlines the system architecture, code conventions, dataset pipelines, game rules, and development workflows for both human engineers and AI coding agents.

---

## 1. Project Overview

**PoEDoku** is a daily 3x3 grid trivia game inspired by PokéDoku and Immaculate Grid, built for Path of Exile 1 players.
- Players must identify an **Active Skill Gem** for each cell at the intersection of a **Row Criterion** and a **Column Criterion**.
- **Rules**:
  - Exactly 9 guesses for 9 cells (1 incorrect guess prevents a 9/9 perfect score).
  - Each skill gem can only be used once per puzzle.
  - All players worldwide receive the identical daily puzzle synchronized at **00:00 UTC**.
  - LocalStorage tracks in-progress games and persistent player stats (streak, score distribution).
  - Results can be copied to the clipboard as an emoji grid (🟩 / 🟥).

---

## 2. Architecture & Tech Stack

- **Architecture**: 100% Static Single Page Application (SPA). Zero server-side runtime needed.
- **Frontend Framework**: React 18 + TypeScript.
- **Bundler & Dev Server**: Vite.
- **Styling**: Tailwind CSS with a dark mode color palette (`poe.dark`, `poe.gold`, etc.).
- **Icons**: `lucide-react`.
- **Celebration Effects**: `canvas-confetti`.
- **Hosting Target**: Vercel (or Cloudflare Pages / GitHub Pages).

---

## 3. Directory Structure

```text
poedoku/
├── AGENTS.md                # This comprehensive architecture and agent guide
├── README.md                # User-facing summary and setup instructions
├── index.html               # Main HTML entry point
├── package.json             # NPM dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS design tokens
├── postcss.config.js        # PostCSS configuration
├── vercel.json              # Vercel deployment rewrites
├── scripts/
│   └── fetch-gems.ts        # Data ingestion script from PoEWiki Cargo API
└── src/
    ├── main.tsx             # Application bootstrap
    ├── App.tsx              # Core app container, game loop, and modal coordinator
    ├── index.css            # Tailwind directives and custom animation styles
    ├── types/
    │   ├── gem.ts           # SkillGem and attribute type definitions
    │   └── game.ts          # Criterion, GameState, and PlayerStats interfaces
    ├── data/
    │   └── gems.json        # Compiled active skill gems database
    ├── utils/
    │   ├── criteria.ts      # Criteria definitions, tags matchers, and validation
    │   ├── daily.ts         # Deterministic PRNG seed and solvable grid generator
    │   ├── storage.ts       # LocalStorage serialization for state and streaks
    │   └── share.ts         # Wordle-style emoji grid generator and clipboard copy
    └── components/
        ├── Header.tsx       # Navigation bar, score, and remaining guesses
        ├── Grid.tsx         # 4x4 layout (criteria headers + 3x3 cells)
        ├── Cell.tsx         # Individual cell (empty button or revealed gem)
        ├── SearchModal.tsx  # Autocomplete gem search with tag previews
        ├── GameOverModal.tsx# Win/Loss summary, share button, and UTC countdown
        ├── StatsModal.tsx   # Player streak and score distribution chart
        └── HowToPlayModal.tsx # Rules walkthrough
```

---

## 4. Gem Dataset & Ingestion Pipeline

### Data Model (`src/types/gem.ts`)

```typescript
export type GemColor = 'red' | 'green' | 'blue' | 'white';

export interface SkillGem {
  id: string;               // e.g. "arc", "cyclone_of_tumult"
  name: string;             // "Arc", "Cyclone of Tumult"
  icon: string;             // CDN URL to wiki icon image
  color: GemColor;          // "red" | "green" | "blue" | "white"
  primaryAttribute: 'strength' | 'dexterity' | 'intelligence' | 'none';
  tags: string[];           // ["Spell", "Lightning", "Chaining"]
  isVaal: boolean;
  isTransfigured: boolean;
  baseGem?: string;
  weaponTypes?: string[];
  requiredLevel: number;
}
```

### Ingestion Script (`scripts/fetch-gems.ts`)

- Interrogates the **PoE Community Wiki MediaWiki Cargo API** (`poewiki.net/api.php`).
- Queries the joined `skill_gems` and `items` tables where `item_class_id = "Active Skill Gem"`.
- Paginates in 500-gem increments, extracts canonical attributes, gem tags, and direct image paths.
- Writes the clean, deduplicated result directly to `src/data/gems.json`.
- Execute with:
  ```bash
  npm run fetch:gems
  ```

---

## 5. Daily Deterministic Grid Algorithm (`src/utils/daily.ts`)

1. **Date Key**: UTC date string `YYYY-MM-DD`.
2. **Seed Generation**: Hash string `poedoku-daily-${dateString}`.
3. **PRNG**: Mulberry32 32-bit generator.
4. **Criteria Selection & Verification**:
   - Picks 3 criteria for Rows and 3 criteria for Columns from `ALL_CRITERIA`.
   - Rejects identical or mutually impossible orthogonal criteria (e.g., Attack vs Spell).
   - **Solvability Constraint**: Every one of the 9 cells $(r, c)$ must have at least 1 valid gem in `gems.json`.
   - If unsolvable, advances the PRNG seed attempt and recalculates until a fully solvable grid is found.

---

## 6. Development & Deployment Commands

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run TypeScript type-check and production build
npm run build

# Preview production build locally
npm run preview

# Re-fetch latest PoE 1 gems from PoEWiki Cargo API
npm run fetch:gems
```

### Deploying to Vercel

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: initial PoEDoku architecture"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Import the project in [Vercel Dashboard](https://vercel.com/new).
3. Framework Preset: **Vite**.
4. Root Directory: `./`.
5. Deploy! Every future `git push` to `main` will automatically build and deploy.

---

## 7. Guidelines for AI Agents Modifying Code

- **Preserve Solvability**: When adding new criteria to `src/utils/criteria.ts`, always ensure there is adequate overlap across existing active gems.
- **Do Not Break Seed Determinism**: Do not alter `hashString` or `createPrng` without a migration strategy, as this would alter the daily grid for existing dates.
- **Maintain English Localization**: All user-facing strings, code comments, and documentation must remain in English.
- **Single-Use Constraint**: Never allow a player to submit a gem ID that already appears in `gameState.usedGemIds`.
