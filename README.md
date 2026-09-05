# 🟢 Ben 10: Omnitrix Protocol

### ⚡ A fan-made HTML5 action game powered by JavaScript & Canvas

> **One watch. Four aliens. One mission. Protect Earth.**

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Game-orange?style=for-the-badge&logo=html5" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-UI-blue?style=for-the-badge&logo=css3" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-Game%20Logic-yellow?style=for-the-badge&logo=javascript" alt="JavaScript">
  <img src="https://img.shields.io/badge/Canvas-Rendering-black?style=for-the-badge" alt="Canvas">
  <img src="https://img.shields.io/badge/Web%20Audio-SFX-purple?style=for-the-badge" alt="Web Audio">
</p>

<p align="center">
  <a href="YOUR_GITHUB_PAGES_URL">
    <img src="https://img.shields.io/badge/🎮%20PLAY%20NOW-7EE23A?style=for-the-badge&logoColor=black" alt="Play Now">
  </a>
  <a href="#-features">
    <img src="https://img.shields.io/badge/EXPLORE%20FEATURES-111111?style=for-the-badge" alt="Explore Features">
  </a>
</p>

---

## 🎮 Play Now

### 👉 [🚀 PLAY BEN 10: OMNITRIX PROTOCOL](file:///C:/Users/moham/Downloads/Ben%2010%20game%20coding4/index.html)

**No installation. No downloads. Open the link and play directly in your browser.**

> 💡 Best experienced on desktop with keyboard controls, but the game also includes touch controls for mobile devices.

---

## 🕹️ About the Game

**Ben 10: Omnitrix Protocol** is a fan-made browser action game inspired by the Ben 10 universe.

The game combines **story-driven gameplay, real-time combat, alien transformations, enemy waves, boss encounters, scoring, combo mechanics, and an endless survival mode** into a lightweight HTML5 experience.

The entire game is built around the browser's native capabilities — including **HTML, CSS, JavaScript, Canvas rendering, Web Audio API, and LocalStorage**.

### 🟢 Your mission

> **Defend Bellwood. Protect the Rust Bucket. Survive Vilgax's invasion.**

---

# ✨ Features

| Feature                   | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| 📖 **Story Mode**         | 3-chapter campaign with dialogue and progression                |
| 👽 **4 Alien Forms**      | Heatblast, XLR8, Four Arms & Diamondhead                        |
| ⚔️ **Real-Time Combat**   | Different attacks and combat styles for each form               |
| 🤖 **Multiple Enemies**   | Drones, fast attackers, armored hunters & turrets               |
| 👹 **Boss Battle**        | Multi-phase Vilgax encounter                                    |
| 🔥 **Combo System**       | Chain eliminations to increase your score multiplier            |
| ⚡ **Omnitrix Energy**     | Transformations consume energy and require strategic management |
| 🛡️ **Alien Abilities**   | Each transformation has unique strengths and weaknesses         |
| 🏆 **Hero Mode**          | Unlockable endless survival mode                                |
| 🔊 **Dynamic SFX**        | Synthesized game audio using Web Audio API                      |
| 📱 **Touch Controls**     | Playable on touch-enabled devices                               |
| 💾 **Local Progress**     | Hero Mode unlock is remembered using browser storage            |
| ✨ **Particle Effects**    | Explosions, impacts, transformations and combat effects         |
| 🎬 **Story Presentation** | Character dialogue, chapter transitions and cinematic banners   |
| 🎨 **Responsive UI**      | Game interface scales to different screen sizes                 |

---

# 👽 Choose Your Alien

Each transformation is designed around a different gameplay style.

### 🔥 Heatblast

**Role:** Ranged attacker

* Launches fireballs
* Strong against flying enemies
* Fast ranged attacks
* Less effective against armored enemies

### ⚡ XLR8

**Role:** Speed / Dash

* Extremely high movement speed
* Dash-based attacks
* Can rapidly reposition during combat
* Excellent for aggressive hit-and-run gameplay

### 💪 Four Arms

**Role:** Heavy melee

* Powerful close-range attacks
* Effective against armored enemies
* Can destroy incoming projectiles
* Slower movement but extremely strong attacks

### 💎 Diamondhead

**Role:** Defensive / Ranged hybrid

* Fires crystal shards
* Excellent against armored enemies
* Reduced incoming damage
* Strong defensive option

The game defines separate speed, jump, defense and size characteristics for each form, making the transformations mechanically different rather than purely cosmetic.

---

# ⚔️ Combat System

Combat is built around **real-time movement, attacks, projectiles, enemy collision, damage, knockback and transformation-specific abilities**.

Different aliens interact with enemies differently.

```text
              OMNITRIX
                  │
        ┌─────────┴─────────┐
        │                   │
    TRANSFORM             BEN
        │                   │
   ┌────┼────┬────┐         │
   ▼    ▼    ▼    ▼         ▼
  🔥   ⚡   💪   💎       Recharge
  Fire Dash Punch Shards    Energy
```

The Omnitrix consumes energy while transformed, and reverting to Ben allows the player to recharge. If energy reaches zero, the Omnitrix enters a temporary lock state.

---

# 🤖 Enemy System

The game includes multiple enemy archetypes with different behaviors:

### 🛸 Drone

Flying enemy capable of firing projectiles.

### ⚡ Fast

Fast-moving aerial enemy designed to pressure the player.

### 🛡️ Hunter

Armored ground enemy that can perform lunging attacks.

### 🔫 Turret

Stationary defensive unit that fires projectile patterns.

Enemy definitions include different health, damage, score, movement and armor properties.

---

# 👹 Boss Battle — VILGAX

The final chapter introduces **Vilgax**, the main boss.

The encounter includes:

* Boss health bar
* Entry sequence
* Movement AI
* Multiple attack patterns
* Leap attacks
* Projectile attacks
* Summoning behavior
* Enraged second phase
* Boss defeat sequence

The boss has **60 HP** and transitions into an enraged phase after reaching half health.

> ⚠️ **Prepare for the final fight.**

---

# 📖 Story Mode

The campaign contains **3 chapters**.

### Chapter 1 — Strangers in Bellwood

> **HOLD THE STREET**

Ben discovers the Omnitrix while an alien invasion begins.

### Chapter 2 — Ambush on the Highway

> **PROTECT THE RUST BUCKET**

The invasion escalates as armored enemies attempt to stop Ben and his team.

### Chapter 3 — The Conqueror's Deck

> **CLEAR THE DECK**

Ben boards Vilgax's flagship for the final confrontation.

After completing the campaign, **Hero Mode is unlocked**.

---

# ♾️ Hero Mode

Think you've mastered the Omnitrix?

### Prove it.

After completing Story Mode, **Hero Mode — Endless** becomes available.

Instead of progressing through the campaign, enemies continue arriving in increasingly difficult waves.

```text
WAVE 1
  ↓
WAVE 2
  ↓
WAVE 3
  ↓
  ...
  ↓
HOW LONG CAN YOU SURVIVE?
```

Hero Mode dynamically increases enemy compositions and rewards the player for surviving waves.

---

# 🏆 Score & Combo System

Defeating enemies increases your score.

Consecutive eliminations build your combo:

```text
1 KILL
   ↓
2 KILLS
   ↓
3 KILLS
   ↓
🔥 COMBO
   ↓
💰 SCORE MULTIPLIER
```

Higher combos increase the score multiplier, allowing skilled players to chase higher scores and leaderboard-style personal records.

---

# 🎮 Controls

## Keyboard

| Key       | Action                 |
| --------- | ---------------------- |
| `A` / `D` | Move                   |
| `◀` / `▶` | Move                   |
| `SPACE`   | Jump                   |
| `S`       | Drop through platforms |
| `J`       | Attack                 |
| `1`       | Heatblast              |
| `2`       | XLR8                   |
| `3`       | Four Arms              |
| `4`       | Diamondhead            |
| `Q`       | Revert to Ben          |
| `P`       | Pause                  |
| `ENTER`   | Advance story          |

These controls are also built directly into the game's **How to Play** interface.

## 📱 Touch

Touch devices receive:

* ◀ Left
* ▶ Right
* JUMP
* HIT
* Omnitrix transformation buttons

---

# 🧠 Technical Highlights

This project was built without a game engine.

### Rendering

The game uses the **HTML5 Canvas API** for:

* Player rendering
* Enemy rendering
* Projectiles
* Particles
* Background environments
* Combat effects
* Boss animations
* UI/gameplay visuals

### Game Logic

JavaScript manages:

* Game state
* Player physics
* Enemy behavior
* Collision detection
* Combat
* Damage
* Waves
* Boss logic
* Story progression
* Transformation mechanics
* Scoring

### Audio

The project generates sound effects using the **Web Audio API**, including transformation, attacks, damage, projectiles, boss effects, victory and other gameplay sounds.

### Persistence

Browser `localStorage` is used to remember the Hero Mode unlock between sessions.

---

# 🛠️ Tech Stack

```text
Frontend
├── HTML5
├── CSS3
└── JavaScript

Game Technology
├── HTML5 Canvas API
├── Web Audio API
├── LocalStorage
└── Browser APIs

Development
└── Git + GitHub
```

---

# 📂 Project Structure

```text
omnitrix-protocol/
│
├── index.html
├── README.md
│
└── screenshots/
    ├── title-screen.png
    ├── gameplay.png
    ├── transformations.png
    └── boss-battle.png
```

> The current game is intentionally lightweight and can run directly from a browser without a traditional game engine.

---

# 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/omnitrix-protocol.git
```

### 2. Open the project

Open the project folder in your IDE.

### 3. Launch

Open:

```text
index.html
```

in a modern browser.

### Recommended

For development, use a local development server such as **VS Code Live Server**.

---

# 🌐 Live Demo

## 🎮 [PLAY THE GAME →](YOUR_GITHUB_PAGES_URL)

The project is deployed using **GitHub Pages**.

---

# 📸 Screenshots

> Add your screenshots here after publishing.

### Title Screen

![Title Screen](screenshots/title-screen.png)

### Gameplay

![Gameplay](screenshots/gameplay.png)

### Alien Transformations

![Transformations](screenshots/transformations.png)

### Vilgax Boss Battle

![Boss Battle](screenshots/boss-battle.png)

---

# 🎯 Project Goals

This project was created to explore browser-based game development while implementing a complete playable experience using native web technologies.

### Key development goals

* Build a complete game loop
* Implement real-time player movement
* Create multiple enemy behaviors
* Implement transformation-based gameplay
* Build a boss encounter
* Create a story progression system
* Implement scoring and combo mechanics
* Add synthesized audio
* Support desktop and touch controls
* Deploy the game as a playable web application

---

# 🧩 What I Learned

Through this project, I explored practical concepts including:

* Game loops
* Canvas rendering
* Collision detection
* 2D physics
* State management
* Enemy AI
* Projectile systems
* Combat systems
* Particle effects
* Procedural background generation
* Audio synthesis
* Responsive interfaces
* Browser persistence
* Web deployment

---

# ⚠️ Disclaimer

**Ben 10: Omnitrix Protocol is a fan-made, non-commercial project created for educational and portfolio purposes.**

Ben 10 and its associated characters, names, artwork and intellectual property belong to their respective copyright and trademark holders.

This project is **not affiliated with, endorsed by, or officially associated with the owners of the Ben 10 franchise.**

---

# 📜 License

This repository contains a fan-made project based on an existing intellectual property.

The project should not be used commercially or represented as an official Ben 10 product.

For the original code written for this project, see the repository history and accompanying project files.

---

# 👨‍💻 Developer

**Your Name**

> AIML Student • Developer • Game & Web Projects

### Connect

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github)](https://github.com/YOUR-USERNAME)

---

<p align="center">

### 🟢 HERO TIME.

**Built with JavaScript. Powered by the Omnitrix.**

⭐ If you enjoyed the project, consider starring the repository.

</p>
