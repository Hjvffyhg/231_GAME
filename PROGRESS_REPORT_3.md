# PROGRESS REPORT #3

**User Interface and User Experience Design Documentation**
*User Perspective, Visual Design, and Interaction Development*

**IT231 - OPERATING SYSTEMS**
BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY

**Presented By:**
* ALMARIO, MARK JUSTINE M.
* GERONIMO JR, EDDIE B.
* ONTE, JOHN PETER B.
* PIANO, MARK ANDRE C.
* TENDIDO, DANIEL MARK 

**Date:** MAY 22, 2025

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Game Information](#2-game-information)
3. [System Requirements](#3-system-requirements)
4. [User Interface (UI) Guide](#4-user-interface-ui-guide)
    * 4.1. Main Menu Interface
    * 4.2. Gameplay Interface
    * 4.3. Hangar and Upgrades Interface
    * 4.4. Algorithm Integration Interface
5. [User Experience (UX) Flow](#5-user-experience-ux-flow)
    * 5.1. General UX Flow
    * 5.2. Sample UX Flow Explanation
    * 5.3. UX Flow with Algorithm Application
6. [Installation Guide](#6-installation-guide)
7. [Audio and Visual Design](#7-audio-and-visual-design)
8. [Future Updates and Expansion Plans](#8-future-updates-and-expansion-plans)
9. [References](#9-references)

---

## 1. Introduction 
Welcome to Space Survival, an endless, top-down bullet-hell roguelite that doesn't just play like a game—it operates like a computer. Players pilot an advanced fighter craft across deep space, battling relentless cybernetic alien swarms. The game gamifies Operating Systems CPU scheduling concepts (FCFS, RR, HRRN) in real-time combat scenarios while offering extensive HUD customization and persistent upgrades to restore order to a corrupted sector.

## 2. Game Information 
* **Title:** Space Survival
* **Genre:** Sci-Fi / Endless Bullet-Hell / Roguelite
* **Target Platform:** Web Browser (Desktop optimized)
* **Target Audience:** Fans of action-packed, fast-paced arcade shooters and computer science students.
* **Game Engine / Tech Stack:** React 19, TypeScript, Vite, HTML5 Canvas API, Tailwind CSS 4, Framer Motion.

## 3. System Requirements 
Minimum System Requirements:
* **OS:** Windows 10 / macOS 10.14 / Linux
* **CPU:** Dual-Core 2.0 GHz or higher
* **RAM:** 4 GB RAM
* **GPU:** WebGL-compatible browser with Hardware Acceleration enabled
* **Storage:** Minimal (Web-based application)
* **Browser:** Google Chrome, Mozilla Firefox, Microsoft Edge, Safari (latest versions)

## 4. User Interface (UI) Guide 
The User Interface (UI) of Space Survival is designed to provide high readability during chaotic bullet-hell sequences, seamless immersion with animated UI elements, and the display of necessary tactical information (like stamina and ability cooldowns) without obstructing gameplay.

### 4.1. Main Menu Interface 
The main menu is the first screen displayed when the game starts, featuring a cybernetic boot sequence followed by access to the major game modes.

| UI Element | Description |
| :--- | :--- |
| **Start Mission** | Launches the player into the combat zone. |
| **Upgrades (Hangar)** | Access to the ship engineering bay for upgrades. |
| **Level Select** | Authorize deployment to advanced sectors based on threat mitigation scores. |
| **Settings** | Lets the player adjust HUD layout and combat audio (accessible in-game). |
| **Database (Codex)** | Displays lore, enemy database, and personnel files. |
| **Mission Report** | Post-combat breakdown of swarm adaptation, lethality metrics, and threats. |

### 4.2. Gameplay Interface 
The gameplay interface displays the player status, quest information, mini map, interaction prompts, and OS algorithm panel during exploration and combat.

| UI Element | Description |
| :--- | :--- |
| **Health / Hull Bar** | Displays the remaining integrity of the player's ship (Cyan/Red). |
| **Boost / Stamina Bar** | Shows energy available for dashing and evasive maneuvers (Pink). |
| **Weapons & Skills** | Dynamic cooldown tracking for Kinetic Blaster, Plasma Cannon, Dash, Shield, and Overdrive. |
| **Score & Wave** | Displays current accumulated points and the ongoing wave level centered at the top. |
| **OS Algorithm Panel** | Indicates the currently active companion drone AI targeting strategy (FCFS/Patrol, RR/Focus, HRRN/Adaptive) with shift rates. |
| **Tactical Radar** | Top-right minimap providing an expanded view of enemy locations compared to the core viewport. |

### 4.3. Hangar and Upgrades Interface 
The Hangar interface allows the player to use collected credits to purchase persistent upgrades and improve ship combat capabilities.

| UI Element | Description |
| :--- | :--- |
| **Chassis Fleet** | Selectable ship types such as Fighter, Scout, Bomber, Frigate, and Battlecruiser. |
| **System Upgrades** | Selectable improvements like Hull Reinforcement, Weapon Overdrive, and Advanced Thrusters. |
| **Credits Display** | Shows the total amount of currency available in the top right corner. |
| **Item Description Box** | Provides the exact stat boost an upgrade will provide (e.g., +180 Max HP). |
| **Authorize Refit Button** | Spends credits to lock in the upgrade module. |

### 4.4. Algorithm Integration Interface 
The algorithm interface shows how the assigned Operating System algorithms are applied dynamically to companion drone targeting systems and boss behaviors in gameplay.

| Algorithm | UI Application |
| :--- | :--- |
| **First-Come, First-Served (FCFS / Patrol)** | Drone systems lock onto the first enemy that spawns and will not switch targets until it is destroyed. The "Commander" boss also enforces this strictly as a massive tank. |
| **Round Robin (RR / Focus)** | Drones cycle their focus across all available targets for an equal "time quantum" before switching. The "Cycler" boss uses repeating cyclical attack patterns, requiring rapid maneuvering. |
| **Highest Response Ratio Next (HRRN / Adaptive)** | Drones calculate target priority using `(Wait Time + Service Time) / Service Time` to shift attack priorities dynamically. Utilized dynamically against bosses that have survived the longest. |

## 5. User Experience (UX) Flow 
The User Experience (UX) Flow outlines the player's journey from launch through active gameplay loops and failure states.

### 5.1. General UX Flow 
1. `Boot Sequence -> Main Menu -> Pre-game Upgrades -> Combat Execution -> Destruction -> Mission Report -> Main Menu (loop).`

### 5.2. Sample UX Flow Explanation
When the player opens Space Survival, the retro terminal boot sequence is displayed. The player may:
* Dive straight into combat (`Start Mission`).
* Visit the `Upgrades` bay to spend previously earned credits.
* Investigate the `Database` to study the Kla'ed Armada.

After launching, the HUD overlays cleanly on top of the HTML5 Canvas action. Players experience wave progression and must actively balance dodging bullets with tracking incoming threats. The screen flashes text warnings (e.g., `"SPACETIME ANOMALY DETECTED"`) when special forces spawn, and visual pop-ups display damage numbers (e.g., `+94 CRIT`).

Upon destruction, the `MISSION FAILED` modal displays stats, logging the "Process" (enemy) that caused system failure, and finalizes the combat score which converts to credits.

### 5.3. UX Flow with Algorithm Application
**Sample Scenario:**
A massive swarm of varied enemies spawns, including high-health tanks and low-health scouts. 
* The player presses `Q` to switch the Drone System to *Round Robin (Focus Mode)* to deal splash damage across the entire swarm.
* When a heavy Boss spawns, the player switches the algorithm to *First-Come, First-Served (Patrol Mode)*, directing all drone fire entirely onto the highest priority, longest-surviving boss.
This creates an interactive puzzle of threat management via OS scheduling theory.

## 6. Installation Guide
1. Ensure you have a modern web browser installed (Google Chrome, Firefox, or Edge).
2. Navigate to the game's deployed URL.
3. The game will load directly within the browser window.
4. No external downloads, plugins, or installations are required.

## 7. Audio and Visual Design
* **Visual Theme:** Deep Space Sci-Fi cyberpunk. Heavy use of terminal-cyan glows, red alerts, glassmorphism UI overlays, octagonal UI layouts, and high-contrast particle effects over a dynamic starfield canvas.
* **Color Scheme:**
   * Deep Space Navy (`#0A0F1F`) for backgrounds and void space.
   * Neon Cyan (`#00D9FF`) for player HUD elements and primary telemetry bounds.
   * Radar Crimson (`#EF4444`) for enemy projectiles, critical alerts, and hostile radar blips.
* **Audio Design:** Utilizing a custom Web Audio API synthesizer engine (`lib/audio`) that plays procedural kick drums, sci-fi arpeggios, and glitching alert sounds depending on the combat state, mimicking a retro-futuristic arcade environment perfectly tied into browser standards.

## 8. Future Updates and Expansion Plans
* **Leaderboards:** Introduction of a global high-score backend database.
* **Asset Creation & Expansion:** Integrating custom sprite sheets and higher fidelity visual assets.
* **UI & UX Enhancements:** Expanding the settings diagnostics, adding color-blind friendly toggles.
* **New Enemies:** Expanding the Hive Network's roster with stealth/ambush units.
* **Touch Controls:** Adding full mobile/tablet support with virtual dual-joystick overlays (already in prototype testing).

## 9. References
* Silberschatz, A., Galvin, P. B., & Gagne, G. (2018). *Operating System Concepts* (10th ed.). Wiley.
* MDN Web Docs. (2024). Canvas API. Retrieved from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
* React Documentation. (2024). Retrieved from https://react.dev/
