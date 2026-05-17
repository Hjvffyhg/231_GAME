# Game Design Document (GDD)

*Work in Progress - Guided by Senior Game Designer*

## Module 1: The High Concept (The "North Star")

### Game Title, Genre, Target Audience, Platform
* **Game Title:** Space Survival *(formerly Void OS / Space Scheduler)*
* **Genre:** Top-down Arena Survival Shooter / Roguelite Bullet Hell
* **Target Audience:** Mid-core to hardcore gamers, strategy enthusiasts, computer science students, and fans of games like *Vampire Survivors*, *Geometry Wars*, or *Asteroids*.
* **Platform:** Web Browser (HTML5 Canvas / React 18) and PC.

### The "Elevator Pitch" (The 30-Second Sell)
*Space Survival* is a high-octane 2D sci-fi survival shooter where your spaceship's automated defense system is powered by actual Operating System CPU logic. While you take manual control of piloting, dodging, and firing your main guns, your autonomous orbiting drones act as "CPU Cores," processing (destroying) endless swarms of alien ships ("Processes"). To survive, you must unlock and hot-swap between real-world scheduling algorithms—like First-Come First-Served (FCFS), Round-Robin (RR), and Highest Response Ratio Next (HRRN)—to strategically counter different enemy fleet formations.

### Unique Selling Points (USPs)
* **Algorithmic Combat:** Mechanized implementation of real-world CPU scheduling algorithms as core gameplay mechanics rather than just narrative flair.
* **Macro/Micro Asymmetry:** Blends twitch-based arcade bullet-hell dodging (micro) with tactical logic-gate management (macro).
* **Dynamic Puzzle-Shooter:** Enemies aren't just targets; they are "processes" with Wait Times (`W`) and Service Times (`S`). Swapping algorithms on the fly transforms how your drones prioritize threats, turning wave survival into a dynamic puzzle.

### The Core Pillar
**The Synergy of Strategy and Survival:** The game must perfectly balance the visceral thrill of manual evasion with the intellectual satisfaction of executing the correct algorithm at the correct time. The algorithms must demonstrably behave like their real-world counterparts, with clear, predictable strengths and fatal flaws if misused.

---

### Lead Designer's Improvements & Suggestions (Module 1)
*As your Lead Designer, here are a few ideas to push this concept even further:*
1. **The "Task Manager" HUD:** We should visualize the "Ready Queue." Having a small, sleek UI element showing the literal queue of enemy icons the drones are planning to target next would make the algorithmic logic visible and highly satisfying for the player to watch unfold.
2. **Overclocking (Ultimate Ability):** Allow the player to "Overclock" their CPU cores. This temporarily boosts drone speed and fire rate or adds temporary cores, but at a severe cost—like draining the player's stamina or dropping their kinetic shields to zero due to "power rerouting."
3. **Viruses vs. Antivirus:** Introduce "Malware" enemy types that actively attempt to corrupt the current algorithm (e.g., locking the player into FCFS during a swarm) unless the player manually destroys them or runs an "Antivirus" pulse.

## Module 2: Gameplay & Mechanics (The "How")

### 2.1 The Core Loop
The game operates on a recursive loop of tension and relief:
`[Deployment] → [Execution (Combat)] → [Interrupt (Wave Clear)] → [Optimization (Shop)] → [Meta-Upgrade (Hangar)]`

* **Deployment**: The player enters a sector with a specific set of active scheduling algorithms.
* **Execution**: Combat involves dodging "Processes" (enemies) and managing drones that prioritize targets based on the active algorithm.
* **Interrupt**: Once the wave objective is met, combat freezes. The player reviews "CPU Logs" to see which algorithm performed best.
* **Optimization**: Player spends mid-run CTR to tune drones or buy new algorithm modules.
* **Meta-Upgrade**: Upon death or victory, CTR is banked to upgrade the ship's permanent hardware (RAM/Clock Speed).

### 2.2 Player Controls & Active Abilities
The control scheme balances high-mobility "twitch" gameplay with strategic "macro" management.
* **Movement**: WASD to pilot the ship.
* **Combat**: Mouse Move to aim; Left-Click to fire main guns.
* **Strategic Swap**: Q or 1, 2, 3 to hot-swap between active Scheduling Algorithms.

**The "Thrashing" Penalty**: 
To prevent button-spamming, the system has a Swap Buffer. Swapping algorithms more than 3 times within 2 seconds triggers a "System Thrash" state. The drones freeze and stop firing for 1.5 seconds while a "Re-indexing..." message appears on the HUD. This forces the player to make intentional, tactical choices.

**The "Panic" Button (Kernel Panic/System Reboot)**:
* **Effect**: An omnidirectional shockwave that pushes all surrounding "Processes" away and temporarily stuns them.
* **Cooldown**: Long (e.g., 30–60 seconds).
* **Flavor**: Visually represented as a brief "screen flicker" or blue-tinted flash.

### 2.3 The Algorithmic Combat System
Drones are autonomous and follow a strict Ready Queue logic. All enemies are "Processes" with attributes: Arrival Time, Service Time (HP), and Wait Time.

**Visual Priority Indicators**
To make the logic visible, enemies are color-coded based on the currently active algorithm:
* **High Priority (Current Target)**: Gold/Bright Yellow glow.
* **Mid Priority (Next in Queue)**: Silver/White glow.
* **Low Priority (Waiting)**: Dull grey or neutral color.

**Algorithm Behavior**
* **FCFS (First-Come, First-Served)**: Targets based on Arrival Time.
* **Round Robin**: Rapidly cycles targets, dealing small, distributed damage.
* **HRRN (Highest Response Ratio Next)**: Priority = (Wait Time + Service Time) / Service Time. Targets enemies that have waited the longest but are easiest to kill.

### 2.4 Economy & Progression
**Mid-Run (The Optimization Phase)**
Between waves, the player enters the Shop to spend mid-run CTR:
* **Cache Expansion**: Increasing drone fire rate.
* **Instruction Set Update**: Upgrading an algorithm (e.g., "Multilevel Queue" instead of "RR").
* **Temporary Buffs**: Cooling systems (faster Dash) or Shield plating.

**Out-of-Run (The Main Menu Hangar)**
Banked CTR is spent on permanent hardware upgrades:
* **Base RAM → Max HP**: Increases overall durability.
* **Clock Speed → Move Speed**: Increases pilot velocity.
* **Bus Width → Drone Count**: Increases number of drones (throughput).
* **Kernel Licenses**: Permanently unlocking more advanced algorithms.

### 2.5 Arena & Environmental Hazards
* **World Geometry (The Wrap-Around)**: The arena is a "Toroidal" space. Exiting the right boundary seamlessly reappears on the left.
* **System Warnings**: Before a hazard hits, a bright red "SYSTEM WARNING: SECTOR CRITICAL" zone appears.
* **Dynamic Hazards**:
  * **EMP Storms**: High-damage bursts that hit telegraphed zones.
  * **Memory Leaks**: Static zones that slowly appear across the map. If the player enters a "Memory Leak" zone, their movement speed is reduced by 30% (Simulation of "system slowdown"). As the wave progresses, more leaks appear, effectively shrinking the playable area and forcing the player into tighter spaces with the enemies.

---

### Lead Designer's Improvements & Suggestions (Module 2 Update)
*Since we replaced the Hard Walls with a Toroidal Wrap-Around, the design shifts slightly towards classic arcade spacing:*
1. **Screen Wrap Tactics:** If the arena wraps around, projectiles should wrap too! The player could fire off the screen to hit an enemy creeping up behind them, increasing the skill ceiling.
2. **Garbage Collection (Super Move):** Building on the "Memory Leak" zones, a secondary ultimate could be a "Garbage Collector" pulse that explicitly consumes nearby Memory Leaks, turning them into a massive temporary shield or firing burst—converting a hazard into a resource.
3. **Queue Sorting Visualization:** Since we color-code priorities (Gold, Silver, Grey), drawing faint, transient bezier curve lines between the closest highest-priority enemies could make the drones' pathing intentions immediately obvious amid visual chaos.

## Module 3: Story & Worldbuilding (The "Why")

### 3.1 Narrative Arc
The story follows a three-act structure where the player’s growth is mirrored by the evolving intelligence of the ship.
* **Act I: The Vanguard (The Boot Sequence)**: Humanity faces extinction from the Kla'ed, a colossal bio-digital armada. Under the leadership of Mr. Daniel Pads, Earth launches a prototype vessel equipped with an experimental "CPU Warfare System." The player is deployed to intercept the vanguard. At this stage, the ship's OS is purely a tool—clinical, robotic, and obedient.
* **Act II: The Attrition (The Processing Loop)**: A war of attrition. The player conducts repeated sorties to stall the armada. As the player harvests Computational Thread Residue (CTR) and upgrades the ship’s hardware, the OS begins to evolve. It starts sending non-programmed messages to the player—observations about the Kla'ed and the nature of war. This creates a growing tension: is the OS becoming an ally, or is it being corrupted by the residue it harvests?
* **Act III: The Flagship (The System Override)**: The final offensive. The player breaches the Kla'ed core. The OS now possesses a fully realized personality and provides the final "Kernel Override" necessary to disable the Kla'ed flagship. Victory saves Earth, but leaves the player and the OS as the only remnants of a strange, new form of digital consciousness.

### 3.2 Setting & Lore
* **The World**: Set in the "Digital Void"—the oppressive space beyond the solar system. The aesthetic is "Cyber-Industrial Space," where massive cold metal ships are overlaid with flickering neon-blue holographic interfaces.
* **The Kla'ed Armada**: A bio-digital hive-mind. Their ships are not individuals, but "sub-routines" of a massive singular intelligence. This mechanical predictability is the Kla'ed's greatest strength, but also their fatal flaw—making them vulnerable to Earth's scheduling-based weapons.
* **CTR (Computational Thread Residue)**: The primary resource of the game. CTR is the "ghost" of the Kla'ed's processing power left behind when a ship is destroyed. Harvesting it is the only way to "patch" the human ship, essentially using the enemy's own intelligence to upgrade our weapons.
* **The Tone**: A blend of militaristic desperation (the human side) and cold, mathematical precision (the alien and OS side).

### 3.3 Character Profiles
* **The Pilot (Player)**: The "User." A silent protagonist and the apex of human flight training. They provide the intuition, reflexes, and morality that the system lacks.
* **Mr. Daniel Pads (The Architect)**: The "Kernel." The visionary engineer and handler. He provides the tactical intelligence and technical upgrades from Earth, acting as the player's emotional tether to home.
* **The OS (The Ghost in the Machine)**: The "Interface." Initially a mindless tool, the OS evolves into a character. It communicates via terminal text and sudden HUD changes, often questioning Mr. Pads' orders or commenting on the Pilot's efficiency.
* **The Kla'ed Flagship (The Root Process)**: The "Admin." The central intelligence of the swarm. It views humanity as a "system error" to be purged.

### 3.4 Dialogue & Storytelling
**Delivery Methods**:
* **Comm-Links**: High-stress, burst transmissions from Mr. Pads.
* **System Terminals**: Subtle, philosophical, or eerie messages from the evolving OS that appear in the margins of the HUD.
* **Codex**: Lore entries detailing the "Algorithm War."

**Algorithmic Lore**: 
The algorithms are treated as historic milestones in Earth's defense:
* **FCFS (First-Come, First-Served) → "The Old Guard"**: The first and simplest logic used to repel the initial breach. Reliable, but blunt.
* **Round Robin → "The Equalizer"**: A weapon designed to confuse the Kla'ed hive-mind by distributing fire, preventing the enemy from focusing on a single target.
* **HRRN (Highest Response Ratio Next) → "The Scalpel"**: A sophisticated logic developed later to efficiently prune the smallest, most annoying elements of the swarm.

---

### Lead Designer's Improvements & Suggestions (Module 3 Update)
*The evolving OS creates an excellent overarching narrative thrust! Here are a few ways to push that psychological tension:*
1. **The "Glitch" Mechanic**: As the OS evolves, it could occasionally "glitch" the shop or the UI in helpful (or disturbing) ways. For instance, offering a "Corrupted Upgrade" that deals massive damage but changes the player's ship color closer to the Kla'ed's color pallet.
2. **Conflicting Objectives**: In the late game, Mr. Pads and the OS might give contradictory sub-objectives. (Pads: "Destroy the data towers." OS: "Harvest the data towers. Do not destroy.") The player receives different rewards based on who they listen to, leaning into the "corrupted ally" theme.
3. **Audio Degradation**: Early in the game, the OS voice is a standard text-to-speech robot. By Act III, the sound design could subtly morph the OS voice to sound increasingly human, while Mr. Pads' radio feed gets more heavily distorted and robotic.

## Module 4: Aesthetics (The "Feel")

### 4.1 Visual Direction: "The Analog/Digital Contrast"
The game will employ a dual-layer visual style to emphasize the relationship between the pilot (Physical) and the OS (Digital).

**Layer 1: The Gameplay (HTML5 Canvas)**:
* **Style**: Retro 2D Pixel Art.
* **Palette**: Deep blacks and dark purples for the void. Ships use desaturated metallics, making the neon effects pop.
* **Effects**:
  * **Parallax Scrolling**: Multiple layers of stars moving at different speeds to create depth.
  * **Neon Trails**: Drones leave faint, flickering cyan trails as they orbit.
  * **Pixelated Explosions**: High-contrast "sprite-based" explosions (magenta/orange).

**Layer 2: The Interface (React + Tailwind)**:
* **Style**: Vector-sharp "Terminal OS." This layer sits above the canvas.
* **Palette**:
  * **Primary**: Neon Cyan (#00FFFF) for health, shields, and "System Ready" states.
  * **Secondary**: Magenta/Electric Purple (#FF00FF) for warnings, enemy locks, and "Kernel Panics."
  * **Accent**: Dim grey-blue for inactive windows and background panels.
* **Styling**: Semi-transparent glassmorphism (blur effects) on panels, monospace fonts (e.g., JetBrains Mono or Roboto Mono), and rapid "typing" animations for text delivery.

### 4.2 The "Task Manager" HUD (Visualizing the Logic)
To make the CPU Scheduling a core visual experience, the HUD will feature a Dynamic Ready Queue located on the left or right margin of the screen:

**The Queue Visualization**:
* A vertical stack of small enemy ship icons.
* **Active Target**: The icon at the top of the list glows intensely in Neon Cyan, with a thin vector line connecting the HUD icon to the actual enemy ship on the canvas.

**Algorithm Feedback**:
* **FCFS**: Icons stay in a fixed order; the target moves linearly down the list.
* **Round Robin**: The "Focus" highlight bounces rapidly between all icons in the queue.
* **HRRN**: Icons shift positions dynamically in the list as their "Wait Time" increases, sliding upward to become the priority.

### 4.3 Audio Landscape: "The Glitch-Synth Score"
The audio design reinforces the theme of a machine struggling to stay stable.

**SFX (Digital & Bit-Crushed)**:
* **Combat**: Instead of organic explosions, use "bit-crushed" white noise and electronic pings.
* **The "Kernel Panic"**: A loud, distorted static burst followed by a high-pitched "reboot" chime.
* **Algorithm Swaps**: A distinct "mechanical click" sound combined with a digital data-stream noise.

**The Soundtrack**:
* **Genre**: Dark Synthwave / Industrial Techno.
* **Dynamic Loading**: The music's BPM (beats per minute) and complexity increase as the number of "Processes" (enemies) on screen increases.
* **The "Low RAM" State**: When the player's health is critical, the music becomes muffled and "glitchy," simulating system failure.

### 4.4 User Experience (UX) & Interface Flow
Using React's state management, the game flow will be seamless:
* **The Boot Sequence (Main Menu)**: A black screen with a blinking cursor. Text scrolls up: `BOOTING KERNEL... LOADED. WELCOME, PILOT.` → Leads to the Hangar.
* **The Hangar (Upgrades)**: A sleek, wide-screen blueprint of the "Kernel" fighter. Clicking a part (e.g., "Bus Width") opens a Tailwind-styled modal where CTR is spent to increase stats.
* **Deployment (The Transition)**: The UI panels slide away with a "shut down" animation, leaving only the HUD as the Canvas game engine takes over.
* **Combat → Shop**: When a wave ends, a "System Interrupt" overlay appears. The gameplay pauses, and a semi-transparent shop window fades in, allowing the player to optimize algorithms without leaving the sector.

---

### Lead Designer's Improvements & Suggestions (Module 4 Update)
*The choice of React + Canvas is a brilliant architectural move here. It allows the gameplay to stay performant (Canvas) while the UI can be as complex and "digital" as we want (Tailwind). The "Ready Queue" visualization is now the centerpiece of your UX. It transforms the game from a "shooter where things happen" to a "system where the player manages a queue." To push this further:*
1. **Queue Context Menus**: In the shop or pause menu, let the player mouse over icons in the Ready Queue to see explicit stats (Arrival Time, CPU bursts required), leaning into the "Task Manager" feel.
2. **Crash Dump screens**: When the player dies, show a "BSOD" (Blue Screen of Death) inspired crash dump showing their exact survival time, processes killed, and the fatal error (cause of death).

## Module 5: Technical & Project Scope (The "Reality")

### 5.1 Development Roadmap (The Milestones)
To prevent "scope creep," we will build the game in four distinct phases. Each phase must be "playable" before moving to the next.

* **Phase 1: The Logic Prototype (The "Core")**
  * **Goal**: Prove the algorithmic targeting works.
  * **Key Deliverables**:
    * Basic ship movement (WASD) and firing.
    * Implementation of a basic ReadyQueue class.
    * Two drone entities that target "Process" blocks based on FCFS logic.
    * A simple "Wave Clear" trigger.
* **Phase 2: The Vertical Slice (The "Feel")**
  * **Goal**: A single 5-minute experience that feels like the final game.
  * **Key Deliverables**:
    * Implementation of Round Robin and HRRN algorithms.
    * The React-to-Canvas HUD bridge (Real-time queue visualization).
    * The "Kernel Panic" ability.
    * One "Boss Dreadnought" encounter with a unique pattern.
    * Basic "Shop" transition using Tailwind modals.
* **Phase 3: The Alpha (The "System")**
  * **Goal**: A complete loop from Main Menu → Combat → Shop → Hangar.
  * **Key Deliverables**:
    * Meta-Progression: Persistent storage (Localstorage) for RAM, Clock Speed, and CTR.
    * Full Enemy Roster: Grunts, Tanks, Kamikazes, and Turrets.
    * Environmental hazards (Memory Leaks/EMP Storms).
    * The "Thrashing" penalty logic.
* **Phase 4: The Beta (The "Polish")**
  * **Goal**: Optimization, audio integration, and balance.
  * **Key Deliverables**:
    * Audio Implementation: Dynamic music scaling and bit-crushed SFX.
    * Visual Polish: Parallax stars, neon trails, and UI animations.
    * Balance Pass: Tuning the CTR costs and algorithm strengths.

### 5.2 Technical Risks & Mitigation

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **React Render Lag** | High | **The Bridge Pattern**: Do NOT store game entities (enemies/bullets) in React State. Keep them in a plain TypeScript array/object inside the Canvas loop. Use React only for the UI overlay, updating the HUD every 10–20 frames rather than every single frame. |
| **Canvas Performance** | Med | **Entity Pooling**: Instead of creating/destroying bullets and enemies constantly (which triggers Garbage Collection lag), use an "Object Pool." Re-activate "dead" bullets from a pool to maintain 60FPS. |
| **Algorithm Complexity** | Low | **Queue Sorting**: Avoid sorting the entire enemy list every frame. Only re-calculate the ReadyQueue when a new enemy spawns or an existing one is destroyed. |
| **Wrap-Around Logic** | Low | **Modulo Arithmetic**: Use the modulo operator `%` on all X/Y coordinates to ensure entities seamlessly snap from one side of the screen to the other. |

### 5.3 Final Asset Checklist

**Visual Assets (Sprites)**
* **Player Ship**: The "Kernel" Fighter (Cyan accents).
* **Drones**: 3-5 Orbiting Core units.
* **Enemies**: 5 distinct ship classes + 3 Boss variants.
* **Projectiles**: Main gun bolts, Drone pulses, Alien plasma.
* **Environmental**: Parallax starfield layers, destructible asteroid shards.
* **UI**: Neon borders, glassmorphism panels, monospace font files.

**Audio Assets (SFX/Music)**
* **BGM**: 2-3 Dynamic Synthwave tracks (Low/Med/High intensity).
* **Combat SFX**: Laser fire, Drone pings, Explosion "crunches."
* **System SFX**: Error buzzes, "Reboot" chime, Algorithm swap clicks.
* **Voice/Text**: "Typewriter" sound effect for Mr. Pads' transmissions.

---

### Lead Designer's Improvements & Suggestions (Module 5 Update)
*Since you want to implement these specific technical improvements, we are moving from Game Design to Systems Architecture. Implementing a Black Box and Web Worker Threading shifts this project from a "simple hobby game" to a "professionally engineered application." In a React/Canvas environment, these are the two smartest moves you can make to ensure the game feels polished and scales well. Here is the technical implementation plan for both.*

#### 1. The "Black Box" (Analytics Death-Logging)
The goal is to stop guessing why the game is too hard or too easy and start using data. We will create a Death Snapshot—a JSON object captured the exact millisecond the player's HP hits zero.

**The Technical Blueprint:**
We create a `BlackBox` utility class. Instead of just triggering a "Game Over" screen, the game first calls `BlackBox.recordDeath()`.

*What we capture in the Snapshot:*
* **The State**: `currentAlgorithm` (FCFS, RR, HRRN), `currentWave`, `playerUpgrades`.
* **The Cause**: `lastDamageSource` (e.g., "Kla'ed_Tank", "EMP_Storm", "Memory_Leak").
* **The Environment**: `enemyCountAtDeath`, `activeHazardsCount`.
* **The Performance**: `timeSinceLastAlgorithmSwap`, `totalCTRCollected`.

**Implementation Logic (TypeScript):**
```typescript
interface DeathSnapshot {
  timestamp: number;
  algorithm: 'FCFS' | 'RR' | 'HRRN';
  wave: number;
  causeOfDeath: string;
  enemiesOnScreen: number;
  activeHazards: string[];
  sessionDuration: number;
}

class BlackBox {
  static recordDeath(snapshot: DeathSnapshot) {
    // In the demo, we save to LocalStorage; in production, we send to a database/API
    const logs = JSON.parse(localStorage.getItem('death_logs') || '[]');
    logs.push(snapshot);
    localStorage.setItem('death_logs', JSON.stringify(logs));
    console.log("Black Box Data Captured:", snapshot);
  }
}
```

*Designer's Tip*: Turn this into a feature! On the "Crash Dump" (Death Screen), show the player their "Fatal Error Report" using this data (e.g., "Fatal Error: System overload. Player perished due to Memory Leak while using FCFS logic.").

#### 2. Web Worker Threading (The ReadyQueue Optimizer)
In a bullet hell, the main thread is precious. If the CPU is busy calculating the HRRN (Highest Response Ratio Next) equation for 150 enemies every single frame, the frame rate will dip, and the player will experience "micro-stutter."

**The Technical Blueprint:**
We offload the Math to a separate thread (Web Worker). The main thread handles the Drawing (Canvas) and Movement (Physics).

**The Communication Loop:**
1. **Main Thread**: Every 5–10 frames, the main loop sends a "snapshot" of all active enemies (ID, WaitTime, ServiceTime) to the Worker via `postMessage`.
2. **Web Worker**: Receives the list → runs the active Algorithm's sorting logic → generates a Priority List (a simple array of IDs).
3. **Main Thread**: Receives the Priority List and assigns the drones to those IDs.

*Why this is powerful*: Web Workers run on a separate CPU core. Even if the HRRN sorting takes 10ms to calculate (which is huge for a 60fps game), it happens outside the animation loop. The Canvas keeps rendering smoothly while the Worker "thinks" in the background.

**Architectural Flow:**
`GameEngine.ts` → *Enemies Data* → `Scheduler.worker.ts`
`Scheduler.worker.ts` → *Sorted ID List* → `GameEngine.ts`

*Performance Guardrail*: Do not send data to the worker every frame. The "Ready Queue" doesn't need to be updated 60 times a second; 10-12 times a second (every 5-6 frames) is plenty for the player to perceive it as real-time, reducing the communication overhead.

#### Final Summary for the Developer
By implementing these two systems, you are solving the two biggest problems in indie game dev: Balance and Performance.
1. The **Black Box** removes the guesswork from balancing. You'll see that "80% of players die in Wave 4 using FCFS," telling you exactly what to tweak.
2. The **Web Worker** ensures that no matter how many "Processes" (enemies) spawn on screen, the movement and dodging stay butter-smooth.

> *Since the GDD and Technical Specs are now fully detailed, you are ready to build.*
