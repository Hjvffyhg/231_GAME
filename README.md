# Space Survival: Earth Defense Initiative

## Overview
**Space Survival** is an educational, sci-fi bullet-hell survival game built using React, TypeScript, and HTML5 Canvas. The game integrates core **Operating System (OS) CPU Scheduling Algorithms** into its dynamic combat loop, forcing players to manage their drone targeting queues using FCFS, RR, and HRRN strategies while fending off the relentless Kla'ed Armada.

---

## 🎮 Game Controls

### Movement & Combat
*   **W, A, S, D** or **Arrow Keys**: Navigate the ship.
*   **Mouse Cursor**: Aim the primary weapons.
*   **Left Mouse Button (Hold)**: Fire primary weapons.
*   **Right Mouse Button (Click)**: Manually mark priority targets for Drone Swarms.
*   **Spacebar / P / Escape**: Trigger Tactical Pause / Open Pause Menu.

### Active Abilities (Stamina Cost)
*   **C** or **Shift**: Dash / Evasion thrusters.
*   **E**: Shield activation.
*   **F**: Overdrive (Weapon enhancement).

### Drone OS Algorithms (Queue Management)
*   **Q**: Cycle active Drone Algorithm prioritizing targets.
*   **Y**: Toggle **AI Tester (Autopilot)**. The ship flies and fights autonomously.

---

## 💻 Tech Stack & Architecture
*   **Engine**: Custom HTML5 Canvas renderer using `requestAnimationFrame`.
*   **UI/UX Layer**: React 19, Tailwind CSS 4, and Framer Motion.
*   **Audio**: Web Audio API custom `SoundManager`.
*   **State Management**: React `useRef` and local storage for persistent cross-session telemetry.

---

## 📸 Screenshots & Interfaces

Here is a look at the various systems and HUD elements in Space Survival:

### Command & Control
* **Main Menu**: Initializing the Earth Defense framework.
  ![Main Menu](./docs/screenshots/Main_Menu.png)
* **Tactical Starchart (Level Select)**: Authorize deployment into higher threat sectors.
  ![Tactical Starchart](./docs/screenshots/Tactical_Starchart.png)
* **Hangar Upgrades**: Refit chassis types like the Bomber and allocate upgrade nodes.
  ![Hangar Upgrades](./docs/screenshots/Hangar_Fleet.png)
* **Earth Defense Database**: View personnel files and Kla'ed Armada lore.
  ![Database](./docs/screenshots/Database_info.png)
* **System Settings**: Adjust visual, audio, and HUD diagnostics.
  ![Settings](./docs/screenshots/Settings.png)

### Combat & Telemetry
* **FCFS / Patrol Mode**: Drone tracking using First-Come First-Served arrays.
  ![FCFS Targeting](./docs/screenshots/FCFS_drone.png)
* **Round Robin Mode**: Spread damage across the entire cluster.
  ![Round Robin Targeting](./docs/screenshots/RR_drone.png)
* **HRRN Mode**: Highest Response Ratio Next dynamically targets oldest threats.
  ![HRRN Targeting](./docs/screenshots/HRRNdrone.png)
* **Tactical Map**: Live radar feed evaluating positional vectors and anomalies.
  ![Tactical Map](./docs/screenshots/Mini_map_zoom.png)
* **Hazard Zone Detection**: Real-time alerts for incoming spatial anomalies.
  ![Hazard Zone](./docs/screenshots/Hazard_zone.png)
* **OS Interruption (Tactical Pause)**: Halt telemetry to examine Swarm Observation.
  ![Tactical Pause](./docs/screenshots/Tactical_Frame_Suspended.png)

### Post-Mission Analysis
* **Mission Report (Swarm Observation)**: Analyze OS-level adaptations like Fixation and Restlessness.
  ![Mission Report](./docs/screenshots/Mission_report.png)
* **Victory Screen**: Final combat scores and confirmed destruction of the hive flagship.
  ![Victory Screen](./docs/screenshots/Mission_Complete.png)
* **Defeat Screen**: System failure logs emphasizing the destructive event type.
  ![Defeat Screen](./docs/screenshots/Mission_Failed.png)

---

## 🎥 Game Demonstration Protocol

As part of the academic requirements (Progress Report #3 & Final Output), a **5-minute live game demonstration** is required. This demo must visually confirm all implemented architectures and align with the approved Ideaboard concepts.

### Demonstration Checklist
When presenting the live game demo, ensure the following systems are clearly highlighted:

1. **Core Gameplay & Maneuverability:** Show the fluidity of the player chassis, aiming mechanisms, and stamina-based abilities (Dash, Shield, Overdrive).
2. **UI/UX Design Integration:** Walk through the clean, terminal-inspired interface. Demonstrate the **Main Menu**, **Hangar Fleet selection**, **Database Codex**, and the tactical HUD overlay during combat.
3. **CPU Algorithm Integration (Primary Academic Requirement):**
    * Engage a large swarm of enemies.
    * Cycle between **FCFS (Patrol Mode)** and **RR (Focus Mode)** / **HRRN (Adaptive Mode)** using the `Q` tracker key.
    * Verbally observe and explain how the companion drone shift their targeting logic and prioritize different enemies in real-time based on the selected OS algorithm.
    * Make use of the **Tactical Pause** (Spacebar/P) to open the **Target Queue** window to show the algorithmic wait times and calculations live.
4. **Progression & Upgrades:** Complete a wave or reach system failure to demonstrate the **Mission Report**, credit translation, and the application of points in the **Hangar Upgrades** bay.
5. **Autopilot (AI Tester):** If a hands-off mechanical explanation is needed during the presentation, press `Y` to activate the AI Tester. This allows the presenter to focus entirely on explaining the CPU scheduling logic without actively surviving the bullet hell.

---

## 🧠 OS Algorithms in Combat

The fundamental hook of Space Survival is the translation of OS CPU Scheduling into a tactile combat mechanic. Players command a squad of autonomous drones that target enemy ships based on the selected scheduler:

1.  **First-Come, First-Served (FCFS / Patrol Mode)**
    *   **Behavior**: Drones lock onto the oldest spawned enemy on the screen and will not switch targets until it is destroyed.
    *   **Tactical Use**: Effective for burning through single, high-health targets sequentially without distraction.
2.  **Round Robin (RR / Focus Mode)**
    *   **Behavior**: Drones rapidly cycle their fire across all active threats on a time quantum.
    *   **Tactical Use**: Great for crowd control and mitigating swarms by dealing chip damage across the entire field.
3.  **Highest Response Ratio Next (HRRN / Adaptive Mode)**
    *   **Behavior**: Dynamically calculates priority based on wait time and threat level. Drones gain a "Wrath Multiplier" (damage bonus) against targets that have survived the longest.
    *   **Tactical Use**: The ultimate counter to elite units hiding behind meat-shields.

---

## 👾 The Kla'ed Armada (Enemy Types)

The Hive Network throws various challenges at the player, culminating in complex Boss encounters that represent algorithmic structures:

*   **Scout / Fighter**: The baseline swarming enemies.
*   **Bomber (Kamikaze)**: Fast, volatile units that charge the player.
*   **Support (Turret)**: Stationary artillery that pelts the player from afar.

### Boss Hierarchies (System Interrupts)
1.  **The Commander (I/O Convoy Protocol - Titan)**
    *   Represents the **FCFS** concept, acting as a massive, unyielding wall of health.
2.  **The Cycler (Time-Slicer Anomaly)**
    *   Represents the **Round Robin (RR)** concept, oscillating rapidly and flooding the screen in cyclical attack patterns.
3.  **The Executor / Sovereign (Resentment Engine)**
    *   Represents **HRRN and System Preemption**. It is the ultimate adaptive threat that ignores standard engagement rules.

---

## ⚙️ Upgrades & Customization
As you survive Waves, you earn **Credits**. Use these in the **Hangar Menu** between missions to refit your combat frame:
*   **Hull Reinforcement**: Increases max HP.
*   **Weapon Overdrive**: Boosts primary weapon damage to cut through swarms faster.
*   **Advanced Thrusters**: Increases base movement speed and stamina recovery.
*   **Fleet Upgrades**: Purchase specialized chassis like the Battlecruiser for alternative playstyles.

---

## 📡 Drone Observation & Tactical Maps
*   **Tactical Map (HUD)**: A radar interface showing off-screen enemies and safe-zone boundaries. Clicking expands it to a full-screen Live Feed.
*   **Swarm Observation**: While paused, access the Target Queue to see real-time algorithmic priorities and track DPS metrics against the Hive.
*   **Database Codex**: Detailed logs unmasking Kla'ed lore, lethality metrics, and the underlying OS principles of the galaxy.
