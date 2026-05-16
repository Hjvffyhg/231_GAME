# Space Survival - Game Concept Document

**Logline:** A top-down 2D sci-fi survival shooter where your ship's automated defense drones act as CPU cores, using real-world scheduling algorithms (FCFS, Round-Robin, HRRN) to "process" endless swarms of alien ships.

## 1. Core Identity

- **Genre:** Top-down Arena Survival Shooter
- **Visuals:** Retro 2D pixel art, set in a dark sci-fi void with neon cyan/magenta UI elements representing a terminal OS interface.
- **Hook:** The player controls the ship's movement and main guns, but their primary defense comes from autonomous orbiting drones. These drones are "CPU Cores" that target enemies ("Processes") based on the current CPU Scheduling Algorithm. As waves advance, the OS upgrades to more complex algorithms, changing the macro strategy of the defense line.

## 2. Gameplay Loop

1. **Navigate & Evade:** Move through a procedurally generated starfield, avoiding enemy collision and projectiles.
2. **Main Guns vs Drones:** Manual main guns handle immediate threats. Orbiting drones handle the swarm autonomously.
3. **Algorithm Pacing:**
   - **Wave 1-2 (FCFS - First-Come, First-Served):** Drones lock onto the oldest enemies first.
   - **Wave 3-4 (Round Robin):** Drones rapidly cycle targets via time slices, suppressing the whole swarm.
   - **Wave 5+ (HRRN - Highest Response Ratio Next):** Drones calculate Wait Time + Burst Time to optimally snipe high-priority threats.
4. **Resource Management:** Manage HP, Shield (recharges out of combat), and Stamina (for dash maneuvers). Collect ammo and health from destroyed ships.
5. **Progression:** Survive waves to face Boss algorithmic dreadnoughts.

## 3. Scope Restraints (Keeping it Strong, not Broad)

To keep the demo focused, we will restrict the features to the definitive "Space Survival" experience:

- **One Player Ship:** The cyan "Kernel" fighter.
- **Enemy Types:** Grunts (swarming), Tanks (bullet sponges), Kamikaze (Bombers), Turrets, and one Boss Dreadnought per algorithm upgrade.
- **Three Algorithms:** Strictly FCFS, RR, and HRRN as the visual progression hooks.
- **One Arena:** Infinite scrolling void with parallax stars, a safe zone border, and destructible asteroids.

---

## Technical Stack & Architecture

- **Framework:** React 18
- **Language:** TypeScript
- **Rendering:** HTML5 `<canvas>` using native 2D Canvas API (for gameplay)
- **UI:** Tailwind CSS for UI overlays (Main Menu, HUD, Game Over screens, Tactical Map)
- **Assets:** VoidFleetPack (ships & projectiles) -> see `AIStudio_Prompt.md` for sprite rules.
