# ⚡ VaultFlow — Sleek Dark-Mode Expense & Balance Tracker

**VaultFlow** is a modern, responsive personal finance and balance tracking web application crafted with a futuristic dark glassmorphic design system, glowing gradients, live financial computation, and interactive visual charts.

---

## ✨ Key Features

- **💎 Live Balance & Hero KPIs**: Real-time calculation of your Net Available Balance, Total Inflows, Total Outflows, and Savings Rate.
- **🎯 Monthly Budget Goal Tracker**: Visual gauge with dynamic warning states (Safe, 80%+ Alert, Exceeded Cap).
- **📊 Interactive Analytics**:
  - **Expense Distribution Chart**: Interactive SVG donut chart with hover slice details, percentages, and legend breakdowns.
  - **Inflow vs. Outflow Velocity**: Grouped monthly bar chart comparing income and spending trends.
- **⚡ Smart Ledger & Transaction Feed**:
  - Instant full-text search across descriptions, categories, and notes.
  - Quick filter tabs (*All*, *Incomes*, *Expenses*).
  - Multi-criteria sorting (Newest, Oldest, Highest, Lowest).
  - Quick edit modal and one-click deletion with "Undo" notification toast.
- **🔒 Privacy & Portability**:
  - 100% offline-capable with local browser storage (`localStorage`).
  - Export ledger to **RFC-compliant CSV** or **JSON Backup**.
  - One-click JSON import and restoration.
  - Multi-currency switcher (**₹ INR**, **$ USD**, **€ EUR**, **£ GBP**).

---

## 🛠️ Technology Stack

- **Structure**: Semantic HTML5 with accessible modal dialogs and ARIA labels.
- **Styling**: Pure Vanilla CSS3 featuring custom design tokens, glassmorphism (`backdrop-filter`), glowing orbs, and keyframe micro-interactions.
- **Logic**: Vanilla ES6+ JavaScript with reactive state management, mathematical computations, and SVG rendering (zero build dependencies).

---

## 🚀 Quick Start

No package installation or build step required!

### Option 1: Direct in Browser
Simply double-click [`index.html`](index.html) or open it in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server
Using Python:
```bash
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your browser.

---

## 👤 Author

- **GitHub**: [@nileshgupta7082](https://github.com/nileshgupta7082)
