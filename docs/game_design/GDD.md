# Game Design Document (GDD)

*Finalized - Reflecting the Complete Built Game*

## Module 1: The High Concept (The "North Star")

### Game Title, Genre, Target Audience, Platform
* **Game Title:** Space Survival
* **Genre:** Top-down Arena Survival Shooter / Roguelite Bullet Hell
* **Target Audience:** Mid-core to hardcore gamers, strategy enthusiasts, computer science students, and fans of games like *Vampire Survivors*, *Geometry Wars*, or *Asteroids*.
* **Platform:** Web Browser (Desktop Physical Keyboard/Mouse & Mobile Twin-Stick Touch).

### The "Elevator Pitch" (The 30-Second Sell)
*Space Survival* is a high-octane 2D retro pixel-art sci-fi survival shooter where your spaceship's automated defense system is powered by actual Operating System CPU logic. While you take manual Twin-Stick control of piloting, dodging, and firing your main guns, your autonomous orbiting drones act as "CPU Cores," processing (destroying) endless swarms of alien ships ("Processes"). To survive, you must swap between real-world scheduling algorithms—First-Come First-Served (FCFS), Round-Robin (RR), and Highest Response Ratio Next (HRRN)—to strategically deploy your drones against different fleet threats.

### Unique Selling Points (USPs)
* **Algorithmic Combat:** Mechanized implementation of real-world CPU scheduling algorithms (FCFS, RR, HRRN) mapped directly onto player-orbiting auto-targeting drones.
* **Macro/Micro Asymmetry:** Blends twitch-based arcade bullet-hell dodging (micro) with tactical logic-gate management (macro).
* **AI Auto-Pilot & ML Layout:** Built-in Autonomous Tester Mode for boid-like swarm avoidance, combined with a precise MOBA-style (Mobile Legends) skill arc and dual-joystick HUD for intuitive touch controls.
* **Procedural Pixel-Art Cosmos:** Infinite procedural rendering of Gas Giants, Moons, Parallax Starfields, and Event Horizons running cleanly natively in HTML5 Canvas.

### The Core Pillar
**The Synergy of Strategy and Survival:** The game perfectly balances the visceral thrill of manual evasion with the intellectual satisfaction of executing the correct algorithm at the correct time. The algorithms demonstrably behave like their real-world counterparts, visualized via Drone Lock-on behaviors and real-time HUD Priority Queues.

## Module 2: Gameplay & Mechanics (The "How")

### 2.1 The Core Loop & Civilizations
The game operates on a recursive loop of tension and relief, spread across escalating Kardashev Scale dimensions:
`[Deployment via Hangar] → [Execution (Combat/Waves)] → [Optimization (Shop)] → [Meta-Upgrade (Hangar)]`

* **Galaxy Modes**: The player can unlock up to 7 distinct "Galaxy Modes" (Type 0 to Type 7 Civilization) based on peak High Scores. Higher modes drastically scale difficulty, speed, and asteroid density.
* **Execution**: Combat involves dodging "Processes" (Kla'ed Swarm) and navigating space junk/asteroids while drones prioritize targets based on the active structural OS algorithm.
* **Meta-Upgrade (Hangar)**: Banked CTR (Credits) extracted from defeated enemies is used permanently in the Hangar to purchase advanced ships (Scout, Bomber, Frigate, Battlecruiser) and hardware upgrades (Hull Reinforcement, Weapon Overclock, Advanced Thrusters).

### 2.2 Player Controls & Active Abilities
The control scheme accommodates Desktop and precise "Mobile Legends" (ML) Twin-Stick touch patterns:
* **Movement**: WASD (Desktop) or Left Virtual Joystick (Touch).
* **Combat**: Mouse Move/Left-Click (Desktop) or Right Virtual Joystick (Touch) to fire default Kinetics or Plasma spread.
* **Strategic Swap**: Press `Q` to hot-swap between active Scheduling Algorithms (FCFS, RR, HRRN).
* **Weapons Swap**: Press `1` and `2` to toggle primary blasters.
* **Abilities**: 
  * **Dash (Shift / DSH Button)**: Micro warp burst utilizing Stamina.
  * **Shield (E / SHD Button)**: Instantly injects temporary shield buffering in exchange for Stamina penalty.

### 2.3 The Algorithmic Combat System (Drones)
Drones physically orbit the player ship. Rather than restricting enemy movement, algorithms strictly dictate Drone Lock-on logic and homing laser dispatch queues.
* **FCFS (First-Come, First-Served)**: Lock-on occurs purely based on oldest spawn arrival.
* **Round Robin (RR)**: Rapidly cycles drone targets evenly across the proximity radius. (Visualized by rapid laser cycling).
* **HRRN (Highest Response Ratio Next)**: Priority = (Wait Time + Service Time) / Service Time. Targets enemies that have survived the longest but maintain the lowest HP threshold, generating a mathematical 'clean-up' phase.

### 2.4 Economy & Progression (The Hangar)
Out-of-Run, players access a persistent `localStorage` Hangar:
* **Fleet Upgrades**: Trade CTR for Battlecruisers and Dreadnoughts, which map dynamically to `ShipRenderer` geometries and base stats.
* **Hardware Pipelines**: Invest credits into 'Hull Reinforcement' (Max HP), 'Weapon Overclock' (Base multiplier), and 'Advanced Thrusters'.

### 2.5 Arena & Space Hazards
* **The Safe Zone Boundary**: A visual dashed-lining forms the operational sector. Navigating outside the designated grid decays Hull Integrity persistently until returning.
* **Supermassive Black Holes**: An active gamma-hazard that spawns locally. Simulates relativistic gravity wells grabbing bullets, asteroids, and ships, pulling them towards an Event Horizon. Getting caught causes rapid spaghettification and applies mathematical "Time Dilation" crushing movement vectors.
* **Asteroids**: Free-roaming physics rocks that act as bullet sponges and hazards. Shattering them spawns independent ricocheting debris chunks (`isDebris`) suffering drag and pseudo-gravity.

## Module 3: Story & Worldbuilding (The "Why")

### 3.1 Narrative Arc
The story follows a digital progression against a biomechanical swarm.
* **Act I: The Vanguard (The Boot Sequence)**: Humanity faces extinction from the Kla'ed, a colossal bio-digital armada. Under the leadership of Mr. Daniel Pads, Earth launches a prototype vessel equipped with an experimental "CPU Warfare System." The player is deployed to intercept the vanguard.
* **Act II: The Attrition (The Processing Loop)**: A war of attrition. The player conducts repeated sorties to stall the armada. Harvesting Computational Thread Residue (CTR) acts as the bridge to upgrade the ship’s hardware.
* **Act III: The Overlords (The Boss Core)**: Spawning sequentially waves, encountering massive algorithmically-themed Kla'ed logic gates: The Cycler (RR) and The Executor (HRRN).

### 3.2 Setting & Lore
* **The World**: Set in the "Digital Void"—the oppressive space beyond the solar system. The aesthetic is "Cyber-Industrial Space," where massive cold metal ships are overlaid with retro holographic interfaces and procedurally generated nebulas.
* **The Kla'ed Armada**: A bio-digital hive-mind. Their ships are not individuals, but "sub-routines" of a massive singular intelligence.

### 3.3 Enemy Roster (The Swarm)
* **Grunts / Scouts**: Basic execution threads, linear pathing.
* **Tanks**: High HP blocks designed to waste CPU slicing.
* **Kamikazes**: Direct threat interrupts prioritizing collision damage before drone lock-on can process.
* **Turrets**: Fixed-position artillery forcing manual evasion overrides.
* **The Bosses**: Goliath, The Cycler (Round Robin Dreadnought firing concentric laser ripples), and The Executor (HRRN Mothership leveraging math-amplified tracing beams).

## Module 4: Aesthetics (The "Feel")

### 4.1 Visual Direction: "Retro Pixel Space"
The game will employ a distinct 16-bit retro pipeline.

**Layer 1: The Gameplay (HTML5 Canvas)**:
* **Style**: Retro 2D Pixel Art with `image-rendering: pixelated`.
* **Environment**: Procedurally generated chunky pixel-art Gas Giants, ringed planets, craters, and drifting deep-space nebulas. 
* **Effects**: Parallax scrolling layers mapping exact 3D depth, particle-engine debris physics, and dynamic `<canvas>` geometric lasers with high contrast drop shadows (bloom effects).

**Layer 2: The Interface (React + Tailwind + Framer Motion)**:
* **Style**: The "Mobile Legends" minimal MOBA tactical arc overlying a VT323 pixel-art system monitor.
* **Palette**: Neon Cyan for OS functions, Magenta/Purple for Boss warnings/health.

### 4.2 The "Task Manager" HUD (Visualizing the Logic)
To make the CPU Scheduling a core visual experience, the HUD features:
* **Active OS Readout**: Top center telemetry displaying actual Core Count (`Q` swapping FCFS > RR > HRRN).
* **Drone Lock-on**: Tangible white/cyan geometric vector rendering directly from the player's orbit lock, pinning onto the assigned victim.
* **Entity Bending**: Bosses and targets visually display `<canvas>`-native hitpoint bars, tracking real-time damage decay strictly when active/targeted. 

### 4.3 Audio Landscape: "The Glitch-Synth Score"
The audio design reinforces the theme of a retro machine struggling to stay stable:
* **BGM**: Continuous intense synthwave soundtracks driving pacing.
* **SFX**: Distinct Web Audio API generated alerts (Warning Sirens), level-ups, structural impacts, and laser dispatches.

## Module 5: Technical & Project Scope (The "Reality")

### 5.1 Final Built Deliverables
* **Graphics Engine**: Scalable Object-Oriented Canvas pipeline managing thousands of stars, asteroids, particles, text nodes, and layered VoidFleet pack PNG extractions securely. 
* **Meta-Progression**: Complete frontend `localStorage` persistence logic for CTR, Wave Unlocks (Galaxy Mode 0-7), Ship classes, and Hull/Weapon attributes in the fully fledged React Hangar.
* **GameTester/Autopilot**: Included an engineering tool—pressing `P` engages full AI Boid-based autopilot logic to stress-test collision, rendering, and logic stability across infinite waves automatically.
* **Responsive Layouts**: Touch-detection triggering dynamic twin-stick overlay and skill arc architectures strictly replacing keyboard dependency on mobile phones natively.

### 5.2 Technical Successes
* **React Render Lag Mitigation**: Safely decoupled physical collision modeling (`GameCanvas.tsx` loops) away from the React state (DOM updates), preserving strict 60 FPS.
* **ZIP Auto-Extraction pipeline**: Setup `postinstall` decompress commands to safely unpack the VoidFleet sprites universally across Node environments securely.
* **Mathematical Integrity**: Properly integrated mathematical equivalents of Wait Time (`W`), Service Time (`S`) to explicitly trigger HRRN / Priority algorithms mirroring CS architectural standards natively.

> *The game is finalized, properly balancing classic twin-stick momentum mechanics wrapped within a computer-science operating-system thematic package.*
