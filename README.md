# 🎮 PocketQuest 30: Survive the ₹10k Month

> **Gamified RPG / Roguelike Financial Survival Simulator** tailored for Gen Z college students & first-jobbers.

Can you survive 30 days starting with **₹10,000**, juggled between living costs, spontaneous social invites, medical emergencies, scheduled subscriptions, and a **₹2,000 Savings Shield** target?

---

## ⚡ Core Concept & Financial Mechanics

PocketQuest 30 turns budget management into an engaging RPG where every rupee spend directly ripples across 4 vital stats:

### 1. 📊 4 Vital Stats (0–100%)
* **Cash Runway**: Spendable balance vs. days left, measured against a baseline comfortable burn rate.
* **Savings Shield**: Target **₹2,000** emergency fund locked. Progress towards the buffer shields you from unplanned shocks.
* **Vibe / Social Meter**: Mental peace and social battery. Decays if spending is zero for too long; surges on social events; triggers a **⚠️ Burnout Warning** if Vibe falls below 20%.
* **Financial Health**: Master composite metric ($0.35 \times \text{Runway} + 0.30 \times \text{Shield} + 0.20 \times \text{Vibe} + 0.15 \times \text{Discipline}$) with letter grades (**Grade S** Grandmaster to **Grade F** Financial Flatline).

### 2. 🧮 Interconnection & Alarms
* **Strict Penny Pinching**: Boosts Cash Runway, but triggers a **Burnout Warning** if Vibe falls below 20%.
* **Oversplurging**: Raises Vibe, but slashes Safe Daily Allowance and triggers the **🚨 Broke Alarm**.
* **Overdraft Penalties**: Unfunded auto-debits incur a **₹250 penalty fee**.
* **Safe Daily Allowance**: Real-time formula:
  $$\text{Safe Daily Allowance} = \frac{\text{Spendable Cash} - \text{Pending Commitments}}{\text{Days Remaining}}$$

---

## 🚀 Key Interactive Features

* **30-Day Calendar Timeline Stepper**: Step through each day of the month or jump to inspect milestone encounters (Day 15 halfway check, Day 30 finale).
* **Daily Financial Dilemmas (Random Encounter Deck)**:
  * *Friend's Birthday Dinner at Brewpub*: Pitch in ₹700, go for dessert only (₹250), or stay in (₹0)?
  * *Wisdom Tooth Pain*: Clinic visit (₹800), unlock emergency savings, or generic home remedy?
  * *Flash Sale on Myntra*: 50% off hoodie (₹1,199), 48-hour cool-off rule, or thrift alternative?
  * *Late-Night Freelance Hustle*: Put in 4 hours for +₹1,200 cash vs protect sleep.
* **The "Decision Lab" (Simulate Before You Spend)**:
  * Test any impulse purchase before spending.
  * Instantaneous Consequence Matrix showing daily allowance drop, cost per remaining day, and savings goal delay.
  * Gen Z Smart Alternatives engine (*"Cook at hostel + tapri chai (+₹360 saved)"*, *"Host BYOB game night"*).
* **Subscription & Commitment Vault**:
  * Track recurring bills (WiFi, OTT streaming, mobile recharge).
  * **"Snip" Tool**: Cancel subscriptions with instant feedback boosting monthly survival probability.
* **Roguelike Perks & Badges**: Unlock achievements like *Maggi Connoisseur*, *Vault Snipper*, *Zen Saver*, and *₹10k Grandmaster*.
* **Synthesized Retro Audio Engine**: Built using pure Web Audio API (zero audio file dependencies).

---

## 🛠️ Tech Stack

* **Frontend**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Cyber-Y2K meets Apple Cash aesthetic)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) + Web Audio API synthesizer

---

## 💻 Local Setup & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/pocketquest-30.git
   cd pocketquest-30
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📜 License
MIT License. Created for the Gen Z personal finance revolution.
