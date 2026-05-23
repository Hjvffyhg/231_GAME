# Space Survival: HUD & UI Demonstration Script

This document is a guided script and reference manual for your live Game Demo. It is designed so you can narrate the **Story**, walk through the **Main Menu**, and then explain the **In-Game HUD** (Heads-Up Display) while the game is paused. 

---

## 📖 Part 1: The Story Introduction
*(Speak this while on the Main Menu screen before starting the game)*

**Presenter Script:**
"Welcome to Space Survival. In the year 2342, Earth is under siege by an overwhelming alien armada known as the Kla'ed. Traditional piloting is no longer enough to survive the sheer volume of threats. To combat this, the Earth Defense Initiative has developed the Autonomous Drone Framework—swarms of automated combat drones that surround the pilot's ship.

However, these drones need a brain. That's where you come in. As the Commander, you are not just flying the ship; you are acting as the CPU, managing the Operating System's Scheduling Algorithms—like First-Come-First-Serve and Round Robin—to dictate how your drone swarm targets the alien threat. Your decisions calculate the survival of humanity."

---

## 🖥️ Part 2: Main Menu Navigation
*(Click through each menu item and explain its function)*

**1. START MISSION**
*   **Action:** Click this button.
*   **Description:** "Bypasses everything and immediately deploys you into the core combat gameplay."

**2. UPGRADES**
*   **Action:** Click to open the Hangar Upgrades bay.
*   **Description:** "Opens the Hangar Fleet interface where you can spend credits earned during missions to upgrade your ship's health, speed, damage, and drone capabilities."

**3. LEVEL SELECT**
*   **Action:** Click to open the Tactical Starchart.
*   **Description:** "Opens the Tactical Starchart, allowing you to choose different threat sectors or difficulty levels for your next mission."

**4. DATABASE (Codex)**
*   **Action:** Click to open the Database Codex.
*   **Description:** "Opens the Earth Defense Database (Codex) to read up on enemy lore, ship classifications, and detailed telemetry records."

**5. MISSION REPORT**
*   **Action:** Click to open the Mission Report screen.
*   **Description:** "Displays the analytics from your most recent combat run, including your score, enemy kill counts, and the performance metrics of your chosen operating system algorithms."

---

## 🚀 Part 3: Live Gameplay & Movement
*(Action: Click 'Start Mission'. Place your fingers on the **W, A, S, D** keys. Begin moving the ship to dodge the first few incoming Kla'ed swarm enemies. Do not shoot manually—let the drones auto-fire. Then immediately press **SPACEBAR** to engage Tactical Pause. Leave it paused.)*

**Presenter Script:**
"As we drop into the sector, I have full directional control of the ship using the W, A, S, D keys to pilot through the asteroid field. My primary objective is evasion. Notice that I am not manually pressing a fire button—the autonomous drone framework is automatically scanning and engaging the Kla'ed vessels around me based on our active OS scheduling algorithm. 

Before the swarm gets too dense, let me initiate a Tactical Pause so I can walk you through the HUD—the Heads-Up Display."

### Top-Left: System Integrity & Stamina
*   **Armor/Hull Bar (Blue/Cyan):** "This is our ship's health. If this reaches zero, it's a catastrophic system failure (Game Over)."
*   **Energy/Stamina Bar (Purple):** "This dictates our active abilities. Boosting engines or deploying defensive shields drains this meter. It recharges over time."

### Top-Right: Telemetry & Threat Metrics
*   **Score / Threat Neutralized:** "Tracks our total points based on enemies destroyed."
*   **Credits:** "The currency we are actively collecting from debris, used for the Upgrade Hangar later."
*   **Wave / Time Survivability:** "Shows our current progression and how long we've survived the current onslaught."

### Bottom-Center: The OS Scheduling Engine
*   **Current Algorithm Display:** "This is the core of our game. Right now, it shows our active CPU algorithm (e.g., FCFS or HRRN). Using the 'Q' and 'E' keys, I can dynamically cycle these algorithms in real-time."
*   **Algorithm Description text:** "Below the primary algorithm name, the HUD provides a brief explanation of how the drones are currently prioritizing targets."

### Bottom-Right: Tactical Mini-Map
*   **Radar:** "This shows the immediate quadrant. Red dots represent incoming Kla'ed swarm trajectories, helping us avoid being flanked off-screen."

### The Center Overlay: Target Queue (When Spacebar is pressed)
*   **Queue Window:** "When we use the Spacebar tactical pause, we bring up the Target Queue. This directly mirrors a CPU's Ready Queue. It lists all enemies currently detected in the hazard zone, their wait times, and who the drones will fire at next based on the mathematical OS algorithm we selected."

---

## ⏸️ Part 4: System Pause Menu
*(Action: Press ESC to bring up the System Pause menu)*

**System Suspended Menu**
*   **Resume:** "Returns us to the active combat frame."
*   **Settings/Audio:** "Adjusts telemetry volume and environmental soundscapes."
*   **Abort Mission:** "Clicking this immediately terminates the simulation, acting as a tactical retreat. It will take us directly to the Mission Failed report."

---

## ⚔️ Part 5: Live Combat & Algorithm Switching
*(Action: Unpause the game and resume active movement using **W, A, S, D**. Continue dodging enemies while the drones fire.)*

**Presenter Script:**
"With the telemetry and systems understood, let's resume live combat."

*(Action: Continue flying around. Use **Q** and **E** to swap algorithms. Make sure to point this out visually to the audience.)*

"Notice as I fly, I am constantly monitoring the radar and adjusting my thrusters. The swarm is thickening. I will now press 'E' to switch our drone logic from First-Come-First-Serve to Round Robin. You'll see the drones instantly start evenly distributing their fire across multiple targets instead of focusing on just the oldest enemy on-screen."

---

## 🏁 Part 6: The End Game (Mission Report)
*(Action: Either survive the wave duration to trigger 'Mission Complete', or intentionally fly into enemies to deplete the Armor/Hull bar to 0 to trigger 'Game Over'.)*

**Presenter Script (Upon Defeat/Victory):**
"And there we have it. The mission has concluded. 

When the ship's hull reaches zero—as you just saw—the screen flashes into a red 'System Failure' overlay. Conversely, surviving the entire wave displays a blue 'Mission Complete' frame.

This final screen is our Mission Report. It calculates our final score, grants our collected credits based on performance, and provides two options: **Retry** to immediately drop back into a new sector, or **Return to Hangar** to spend our hard-earned credits on ship upgrades before the next launch.

Thank you. This concludes the Space Survival OS simulation demonstration."
