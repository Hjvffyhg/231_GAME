# Space Survival OS - Terminology & UI Glossary

This document outlines the thematic terminology used throughout the UI and gameplay of "Space Survival OS".  
The game uses clean sci-fi tactical language inspired by operating systems, AI systems, and futuristic combat interfaces while remaining easy for players to understand.

---

# 1. Core Systems & Menus

* **Start Mission:** The "Start Game" or "Play" button.
* **Main Menu:** The navigation option used to return to the title screen.
* **Upgrades:** The in-game progression store where players spend Credits between runs.
* **Database:** The encyclopedia explaining enemies, mechanics, and systems.
* **Restart Mission:** The "Play Again" button displayed after death.
* **System Boot:** The retro loading screen shown when the game launches.
* **Settings:** The options/configuration menu.
* **Audio:** Sound and music volume settings.
* **Mission Report:** The post-death summary screen showing score and statistics.
* **Credits:** The main currency earned by defeating enemies and completing waves.

---

# 2. Player Readouts (HUD Elements)

* **Hull:** The player's health points (HP). If Hull reaches zero, the ship is destroyed.
* **Energy:** The regenerating resource used for Weapon 2. Displayed in Cyan (`#00D9FF`).
* **Shield:** A temporary defensive barrier that absorbs incoming damage.
* **Boost:** The cooldown resource used for Dash abilities.
* **Radar:** The top-right minimap tracking enemies, bosses, and item drops.

---

# 3. Arsenal & Abilities

* **Blaster (WPN-1):** The standard infinite-ammo primary weapon.
* **Plasma Cannon (WPN-2):** A heavy spread weapon that drains Energy rapidly.
* **Dash:** A fast evasive movement ability.
* **Overdrive:** A temporary power-up that increases fire rate and weapon strength.

---

# 4. Autonomous Drone Modes

The player's support drone automatically targets enemies using different combat behaviors inspired by real-world CPU scheduling systems.

* **Drone Core:** The orbital support drone that attacks enemies automatically.

### Focus Mode
Targets a single enemy until it is destroyed.  
Inspired by **FCFS (First-Come, First-Served)** scheduling.

### Patrol Mode
Switches rapidly between nearby enemies to spread damage evenly.  
Inspired by **Round Robin (RR)** scheduling.

### Adaptive Mode
Prioritizes dangerous enemies dynamically based on threat level and battlefield conditions.  
Inspired by **HRRN (Highest Response Ratio Next)** scheduling.

* **Target Queue:** The list of enemies currently tracked by the drone.

---

# 5. Battlefield & Threats

* **Wave:** The current difficulty level. Enemy intensity increases over time.
* **Scouts / Fighters / Vipers:** Standard lightweight enemy ships.
* **Carrier / Dreadnought / Boss:** Massive high-health enemy ships.
* **Hazards:** Environmental dangers that appear during combat.
* **Memory Leak:** A growing hazardous zone that damages the player while inside it.
* **Data Fragments:** Visual particles and energy fragments dropped by destroyed enemies.

---

# 6. System Dialogs & Tactical Messages

The game uses system logs, combat alerts, and AI notifications to reinforce the sci-fi atmosphere.

---

## Boot Sequence Logs

* `"INITIALIZING SYSTEM..."`
* `"LOADING TACTICAL MODULES... OK"`
* `"ESTABLISHING COMMAND LINK..."`
* `"CHECKING CORE SYSTEMS..."`
* `"ALL SYSTEMS ONLINE"`
* `"WELCOME, PILOT."`

---

## Gameplay Alerts

* `"WARNING: HULL CRITICAL"`  
  Displayed when Hull drops below 25%.

* `"RADIATION HAZARD DETECTED"`  
  Displayed while inside a Memory Leak zone.

* `"BOSS TARGET ELIMINATED"`  
  Displayed after defeating a boss.

* `"HULL REPAIRS ACTIVE"`  
  Displayed after collecting a health pickup.

* `"SHIELDS RECHARGING"`  
  Displayed after collecting a shield item.

* `"OVERDRIVE ACTIVATED"`  
  Displayed after collecting the Overdrive power-up.

---

## Drone Notifications

* `"FOCUS MODE ACTIVE"`
* `"PATROL MODE ACTIVE"`
* `"ADAPTIVE MODE ACTIVE"`
* `"TARGET PRIORITY UPDATED"`

---

## Mission Failure / Game Over

* `"MISSION FAILED"`
* `"SHIP DESTROYED"`
* `"SYSTEM FAILURE DETECTED"`
* `"MISSION REPORT SAVED"`
* `"UPGRADE YOUR SHIP TO IMPROVE SURVIVABILITY"`

---

## Victory Sequence

* `"HIVE NETWORK DESTROYED"`
* `"ENEMY FLAGSHIP ELIMINATED"`
* `"EARTH DEFENSE COMMAND CONFIRMS VICTORY"`

---

## Upgrade Bay / Engineering Menu

* `"EARTH DEFENSE INITIATIVE // ENGINEERING BAY"`
* `"UPGRADE LEVEL"`
* `"SHIP ENHANCEMENTS"`
* `"DRONE SYSTEMS"`
* `"TACTICAL UPGRADES"`