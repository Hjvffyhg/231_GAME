# Space Survival OS - Demo Script

This guide provides a structured, step-by-step script for demonstrating the game. Follow these steps to showcase the core features, UI/UX, and gameplay loop.

## 1. The Boot Sequence & Main Menu
**Goal:** Showcase the thematic immersion and Polish of the UI.
*   **Action:** Launch the application or refresh the page.
*   **Visuals:** Let the audience watch the retro terminal **Boot Sequence** scroll by, establishing the "OS / Hacker" visual identity.
*   **Action:** Once the boot sequence concludes, the **Main Menu** appears.
*   **Talking Points:** 
    *   Highlight the high-contrast aesthetic (deep space blues, vibrant cyans, and magenta/amber accents).
    *   Show off the interactive hover states on the menu buttons with their CRT scanlines and glitch text effects.
    *   Briefly mention the options available: Deploy, Shop, Codex, and Interface Customization.

## 2. The Shop & Progression System
**Goal:** Demonstrate the meta-progression loop.
*   **Action:** Click the **[ SYSTEM UPGRADES ]** (Shop) button.
*   **Talking Points:** 
    *   Point out the UI layout and the currency tracker (CTR / OS Data Points) at the top.
    *   Hover over the different upgrade modules: **Max Hull** (Health), **Energy Regen** (Plasma), **Drone Damage** (Auto-turret), and **Thrusters** (Speed/Dash).
    *   Explain the Roguelite loop: Players survive as long as possible, collect currency, die, and return here to grow stronger for the next run.
*   **Action:** Click "Return to Root" to head back to the main menu.

## 3. Launching Gameplay & Controls
**Goal:** Introduce the player controls and HUD.
*   **Action:** Click **[ INITIALIZE DEPLOYMENT ]** (Start Game).
*   **Visuals:** Transition into the HTML5 Canvas view.
*   **Talking Points & Actions:** 
    *   **Movement:** Use W, A, S, D to fly around the grid. Press Spacebar or Shift to trigger the Thruster Dash.
    *   **Aiming & Firing:** Use the mouse cursor to aim. Hold Left-Click to fire.
    *   **Weapons:** Press `1` for the standard Kinetic Blaster (Infinite Ammo, smaller bullets) and `2` for the Plasma Emitter (Multi-spread, consumes the cyan **Energy** pool).
    *   **HUD:** Point out the bottom UI displays: Hull Integrity (HP) on the left, Energy (Plasma Ammo) on the right, and the CPU Scheduler at the bottom center.

## 4. The Algorithm Drone Mechanics
**Goal:** Showcase the unique auto-targeting drone logic based on Operating System CPU Scheduling.
*   **Action:** Let enemies spawn and observe the orbiting blue Drone.
*   **Talking Points:** 
    *   Explain that the drone fires automatically at enemies using real computer science algorithms, visible in the bottom-middle HUD.
    *   **[ FOCUS ] (FCFS - First-Come, First-Served):** The drone hyper-focuses on the first enemy that spawns and won't switch targets until it's dead. Great for single-target boss damage.
    *   **[ PATROL ] (RR - Round Robin):** The drone rapidly cycles its target array, shooting everyone equally for a set "time quantum." Great for crowd suppression.
    *   **[ ATTACK ] (HRRN - Highest Response Ratio Next):** The drone dynamically calculating priority based on threat level and time alive.
*   **Action:** Press the UI buttons or numbers (if bound) to switch algorithms and watch the drone's behavior shift on the fly. 

## 5. Combat Dynamics & The Minimap
**Goal:** Show the chaos of survival and tactical mapping.
*   **Action:** Survive through Waves 1 and 2. 
*   **Talking Points:** 
    *   Notice the debris, asteroids, and enemy projectiles tracking you.
    *   Switch to Weapon 2 and show the **Energy pool depleting**. Note how you must let go of the trigger or switch to Weapon 1 to let it organically recharge.
    *   Point out the **Tactical Minimap** in the top right. Red dots are enemies, magenta/pink dots are bosses, and cyan/green/amber dots are collectible item drops yielding Energy/Health/Overclocking.
    *   Mention anomalies like "Memory Leaks" (large growing hazards) that appear dynamically.

## 6. The Black Box & Game Over
**Goal:** Conclude the demo and show the cycle resetting.
*   **Action:** Intentionally fly into a group of enemies or a boss line of fire to let your Hull drop to 0%.
*   **Visuals:** The game freezes, and a red/glitching fatal error UI appears.
*   **Talking Points:** 
    *   Review the **Crash Report** screen. It summarizes the Wave reached, time survived, and exactly what process terminated you.
    *   Highlight the final Score translation into usable Currency.
*   **Action:** Click **[ REBOOT SYSTEM ]**.
*   **Closing:** You are dropped effortlessly back into the Main Menu, ready to hit the Shop and try again. 
