# Space Survival - Final Presentation Outline

**Course:** IT231 - OPERATING SYSTEMS
**Project Name:** Space Survival
**Team Members:** Almario, Geronimo Jr, Onte, Piano, Tendido

This document serves as the master plan and structural outline for the final class presentation. It is designed to guide the presenters through the slide deck, talking points, and the live demonstration of the Operating Systems integration.

---

## 1. Title Slide & Introduction (2-3 Minutes)
*   **Visual:** Title sequence showing the Space Survival boot screen and logo.
*   **Talking Points:**
    *   Introduce team members.
    *   **The Hook:** Briefly pitch the game. *“Space Survival is an endless, top-down bullet-hell roguelite that doesn't just play like a game—it operates like a computer.”*
    *   **The Goal:** We built a high-octane survival game that teaches and directly utilizes OS CPU scheduling algorithms (FCFS, Round Robin, HRRN) in real-time combat scenarios.

## 2. Story Mode & Narrative Context (2 Minutes)
*   **Visual:** Snapshots from the Database (Codex) and Mission Report lore entries.
*   **Talking Points:**
    *   **The Premise:** Present the game's core interactive narrative—the player acts as a contracted pilot for the Earth Defense Command thrust into deep space.
    *   **The Adversary:** The "Hive Network," a relentless cybernetic alien swarm commanded by Flagships and an ultimate algorithmic Overlord entity.
    *   **World-Building Integration:** Explain how story elements are seamlessly woven into the UI itself, through "Mission Reports," "Boot Sequences," and the in-game Database (Codex). It bridges the gap between raw arcade survival and a driven campaign.

## 3. Core Mechanics & Gameplay Loop (3 Minutes)
*   **Visual:** Short gameplay loop clip showing movement, shooting, and dying. 
*   **Talking Points:**
    *   **The Player:** Pilots an advanced fighter craft fighting endless swarms of enemies, managing Hull (Health) and Boost (Stamina).
    *   **Weapons:** Players swap between an infinite-ammo Kinetic Blaster and an energy-draining Plasma Cannon.
    *   **The Roguelite Loop:** Survive as long as possible -> collect Credits from defeated enemies -> inevitably crash / be destroyed -> use Credits in the Hangar Engineering Bay to buy persistent upgrades -> launch again.

## 4. The Hive Network: Enemy Typology & Boss Hierarchies (3 Minutes)
*   **Visual:** Snapshots and gifs of different enemies and boss encounters from the Codex.
*   **Talking Points:**
    *   **Standard Swarm:** Discuss the baseline "Drone" enemies designed to overwhelm the OS queue with sheer volume, and "Scout" interceptors that test player mobility.
    *   **Heavy Artillery:** Introduce the "Turret" entities that disrupt movement with multi-directional fire, representing high-priority "Processes" in the CPU queue.
    *   **The Boss Hierarchy (Algorithmic Adversaries):** Explain how major sector milestones are not just enemies, but aggressive manifestations of the core OS scheduling algorithms:
        *   **The Commander:** Acts as a strict **"First-Come, First-Served (FCFS)"** enforcer, locking onto rigid attack vectors relentlessly until destroyed.
        *   **The Cycler:** Functions as a **"Round Robin (RR)"** combatant, dividing its attacks into strict, repeating time slices and cyclical patterns, testing the player's mobility.
        *   **The Executor & Kla'ed Sovereign (Hive Overlord):** These endgame entities embody **"Highest Response Ratio Next (HRRN)"** alongside **"System Preemption."** They dynamically calculate threat levels to shift attack priorities in real-time, using intense EMP shockwaves to forcefully interrupt player systems.

## 5. The Core Concept: Operating Systems Integration (5 Minutes) *[CRITICAL SECTION]*
*   **Visual:** Slides detailing the 'Drone Systems' and HUD OS panel.
*   **Talking Points:**
    *   **The Concept:** Instead of standard "auto-aim," the player's companion drones run on actual CPU scheduling algorithms, treating enemies as "Processes" executing "Burst Times".
    *   **First-Come, First-Served (FCFS / FOCUS MODE):** Drones lock onto the first enemy that spawns and will not switch targets until that entity is destroyed. (Best for single-target boss damage).
    *   **Round Robin (RR / PATROL MODE):** Drones cycle their focus across all available targets for an equal "time quantum" before switching. (Best for crowd suppression).
    *   **Highest Response Ratio Next (HRRN / ADAPTIVE MODE):** Drones calculate target priority using the actual HRRN equation: `(Wait Time + Service Time) / Service Time`. They dynamically execute high-threat targets based on how long the enemy has been alive and their inherent difficulty.
    *   **Player Interaction:** The player can cycle these algorithms dynamically during combat via the UI or keyboard (`Q`) based on the tactical situation.

## 6. UI/UX Goals & Design Philosophy (3 Minutes)
*   **Visual:** Snapshots of the HUD, Pause Task Manager, and the interactive HUD customizer.
*   **Talking Points:**
    *   **Aesthetic Principle:** A highly readable, cyberpunk glassmorphic terminal. Combines Deep Space Blue (`#0A0F1F`) with Neon Cyan (`#00D9FF`) and Radar Red (`#EF4444`) to direct player focus.
    *   **Dual-Layer Architecture:** Emphasize that the game strictly utilizes an HTML5 `<canvas>` layer for rendering 60FPS high-speed combat, beneath a complex React DOM layer managing the stylized Tailwind/Framer HUD overlays.
    *   **Accessibility & Customization:** Detail the "Settings" menu that allows players to drag, drop, and scale UI elements for their personalized layout. 

## 7. Live Demonstration (5-7 Minutes)
*   **Role:** One team member pilots the game while another narrates.
*   **Checklist:**
    1.  **Boot & Menus:** Show the retro boot sequence and main menu interactivity. Navigate strictly to the Hangar to demonstrate the upgrade economy.
    2.  **Deployment:** Start the game. Show basic movement and Blaster vs. Plasma cannon usage.
    3.  **OS Integration Live:** Let enemies amass. Toggle the algorithms visibly on screen. Specifically, point out how HRRN acquires targets compared to Round Robin.
    4.  **Pause Screen Analysis:** Hit 'Pause' mid-combat to show the "Task Manager" overlay, displaying the raw target queue and algorithmic calculations perfectly frozen in time.
    5.  **Failure & Reset:** Die to an enemy bullet. Show the Mission Report system logging the exact "Process" that caused the system failure, and the translation of score into Credits.

## 8. Technical Stack & Architecture (3 Minutes)
*   **Visual:** Technical diagram slide or bulleted list.
*   **Talking Points:**
    *   **Frontend Engine:** React 19, TypeScript, Vite.
    *   **Styling & Animation:** Tailwind CSS 4 for rapid UI prototyping, Framer Motion for terminal glitch and transition animations.
    *   **Combat Engine:** Pure HTML5 Canvas API running `requestAnimationFrame` game loops. No external game engines (Unity, Godot) were used, proving technical programming capability.
    *   **AI-Assisted Vibe Coding:** In accordance with the project guidelines, we utilized AI-assisted coding (Google AI Studio Build / Gemini) to accelerate UI/UX prototyping, mechanic logic bridging, and styling implementation. We maintained full architectural oversight and can thoroughly explain and defend all generated output.

## 9. Challenges & Lessons Learned (3 Minutes)
*   **Visual:** Bulleted slide (React renders vs. Canvas).
*   **Talking Points:**
    *   **Bridging Frameworks:** The biggest challenge was passing dynamic game states (ammo, health, shield cooldowns, algorithm changes) from a pure Javascript game loop up to the React DOM efficiently without causing infinite re-renders.
    *   **Algorithmic Translation:** Converting theoretical OS scheduling numbers (W, S) into visible, functional game mechanics that felt fair to the player.

## 10. Q&A and Conclusion (2-3 Minutes)
*   **Visual:** "ALL SYSTEMS NORMAL - QUESTIONS?" slide.
*   **Ending Statement:** Reiterate that Space Survival bridges the gap between educational computer science theory and entertaining action-arcade mechanics.

---
**Preparedness Checklist Before the Presentation:**
- [ ] Ensure local or hosted deployment is running and stable.
- [ ] Connect the driving laptop to external monitors and test resolution scaling on the canvas.
- [ ] Ensure audio is outputting correctly for the "Dynamic Glitch-Synth" soundtrack.
- [ ] Reset local storage (`localStorage.clear()`) to demonstrate a completely fresh progression state if desired.
