# PoEDoku ⚔️

A daily grid puzzle game built for **Path of Exile 1** enthusiasts, inspired by PokéDoku and Immaculate Grid.

![PoEDoku Preview](https://raw.githubusercontent.com/placeholder/preview.png)

## 🎮 How to Play

1. **Fill the 3x3 Grid**: Select a Path of Exile 1 active skill gem for each cell.
2. **Match Tags**: The selected gem must satisfy both the **Row criterion** and the **Column criterion**.
3. **9 Guesses**: You have exactly 9 attempts to solve all 9 cells. Every guess counts!
4. **No Duplicates**: Each gem can only be used once per puzzle.
5. **Daily Sync**: A new puzzle is automatically generated every day at **00:00 UTC** and is identical for players worldwide.
6. **Share**: Copy your daily emoji grid (`🟩 / 🟥`) and share your score with friends!

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Effects**: Canvas Confetti
- **Deployment**: [Vercel](https://vercel.com/) (100% Static SPA)

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Update Gem Data (Optional)
To fetch and update the full skill gem database from the PoE Community Wiki:
```bash
npm run fetch:gems
```

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deploy to Vercel

1. Create a repository on GitHub and push the code:
   ```bash
   git init -b main
   git add .
   git commit -m "feat: initial release"
   git remote add origin https://github.com/<your-username>/poedoku.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `poedoku` repository.
4. Leave settings as default (Framework Preset: **Vite**).
5. Click **Deploy**.

---

## 🤖 AI Agents & Architecture Documentation

For complete technical specifications, architecture diagrams, data models, and coding conventions, refer to [AGENTS.md](AGENTS.md).

---

## ⚖️ License & Disclaimer

PoEDoku is an open-source, fan-created project. Path of Exile is a registered trademark of [Grinding Gear Games](https://www.grindinggear.com/). Skill gem data and art assets are property of Grinding Gear Games.
