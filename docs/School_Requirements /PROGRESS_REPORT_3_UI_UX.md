# PROGRESS REPORT #3 - UI/UX Improvements & Final Presentation
## Initial Concepts, Planning, and Coordination for the Final Project

**Course:** IT231 - OPERATING SYSTEMS  
**Program:** BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY  
**Date:** MAY 4, 2025  

**Team Members:**
* ALMARIO, MARK JUSTINE M.
* GERONIMO JR, EDDIE B.
* ONTE, JOHN PETER B.
* PIANO, MARK ANDRE C.
* TENDIDO, DANIEL MARK

---

# Project: Space Survival

## 1. Overview of UI/UX Direction
* **Brief description of the visual style:** The game employs a bold, sci-fi cyberpunk aesthetic built with React, Tailwind CSS, and Framer Motion. It heavily features neon accents, transparent glassmorphism, and angular, octagonal shapes to convey a technical, aerospace combat feel.
* **Target players and their expectations:** Targeting fans of bullet-hell and roguelite space shooters. They expect high-octane action, clear visibility of threats, and an immersive, easy-to-read HUD that doesn't obstruct gameplay.
* **Overall goals of the UI/UX:** The primary goals are extreme readability during chaotic bullet-hell sequences, seamless immersion with animated UI elements, and providing necessary tactical information (like stamina and ability cooldowns) at a glance.

## 2. Screen Layouts & Wireframes
**Main Screens:**
* Main Menu (Play, Settings, Exit)
* Hangar / Ship Selection Screen
* In-Game HUD (health, shields, score, wave, abilities, scheduler indicator)
* Pause Menu
* Game Over / Results Screen

**For each screen:**
* **Purpose of the screen:** To guide the player from launching the game, navigating upgrades, reading mid-game telemetry, pausing for strategic decisions, and reviewing performance upon death.
* **Key elements:** Animated backgrounds, distinct neon-colored octagonal buttons, prominent health/stamina bars, and clear typography.
* **Layout description (top, middle, bottom sections):** 
  * Top: Score, Wave stats, and current OS CPU Algorithm indicator (FCFS, RR, HRRN).
  * Middle: Unobstructed view for the main canvas, crosshair, and combat telemetry.
  * Bottom: Weapons, stamina, and ability cooldown indicators (Dash, Shield, Overdrive) clustered centrally.
* **Navigation flow:** Main Menu -> Hangar (optional) -> In-Game -> Pause Menu (can return to game or Main Menu) / Game Over -> Main Menu or Instant Retry.

## 3. UI Components & Elements
**List the main UI components and how they will look/behave:**
* **Health & Shield Bars:** Angular, segmented bars positioned dynamically. Red for health, cyan for shields, pulsating when critically low.
* **Score & Credits Display:** Bold, monospace font at the top-left or top-right.
* **Wave / Level Indicator:** Centered at the top, pulsing slightly on wave completion.
* **Scheduler / Algorithm Indicator (FCFS, RR, HRRN):** Tech-styled labels indicating the current enemy AI spawn/targeting strategy.
* **Buttons:** Octagonal cut-outs with borders.
* **Pop-ups / Dialogs:** Glassmorphism backing, blurs the gameplay underneath, utilizing Framer Motion for smooth scale-in animations.

**States & Feedback:**
* **Normal state:** Semi-transparent, clean borders.
* **Hover / Focus state:** Increased opacity, brighter border colors, and subtle drop shadows (glows).
* **Pressed / Active state:** Scale down slightly (click effect) and intense neon glow.
* **Disabled state (if any):** Grayscale, low opacity, and crossed out or "charging" overlay if on cooldown.

## 4. Visual Design & Style Guide
**Color Usage (based on your palette):**
* **Background (Deep Space / Midnight Blue #0A0F1F):** Used for space canvas backdrop and semi-transparent UI container backgrounds.
* **Primary Accent (Neon Cyan #00D9FF):** Used for shields, selected options, player-related info, and positive feedback.
* **Danger / Alerts (Laser Red / Orange #EF4444):** Used for low HP warnings, enemy projectiles, and critical alerts.
* **Secondary Accent (Electric Indigo #6366F1):** Used for the Overdrive ability, special UI panels, and shop elements.

**Typography:**
* **Main Title Font:** Bold, angular sans-serif font matching the sci-fi theme.
* **UI / Labels Font:** 'Inter' or system sans-serif for general text readability.
* **In-game Numbers / Score Font:** 'JetBrains Mono' or a similar monospace font for technical layout precision.

**Iconography:**
* **Style:** Outlined and clean, using the `lucide-react` library for consistent SVG icons.
* **Icons for:** Health (cross/heart), Shield (shield), Credits (coin/currency), Pause (bars), Settings (cog/sliders).

## 5. UX Flow & Player Journey
**Describe the step-by-step experience:**
1. Launch game → See splash / main menu with pulsing title.
2. Navigate to Hangar / Ship Selection to view unlocked vessels.
3. Start mission → HUD slides in, showing weapon loadouts and stats.
4. Experience wave progression → Visual text warnings prompt incoming difficulty.
5. Visit shop / upgrade screen (between runs).
6. Game over → "SHIP DESTROYED" modal with stats → Option to retry.

**For each step:**
* **Player goal:** Transition smoothly between phases without friction.
* **UI support:** Clear calls to action, distinct color coding for positive vs negative actions.
* **Potential confusion points & fixes:** Cooldowns might be missed. *Fix:* Implemented clear visual clip-path overlays covering the skill icon that deplete as the cooldown resets.

## 6. Feedback, Animations & Effects
**Explain how the game will communicate clearly with the player:**
* **Hit feedback:** The canvas shakes, damage text numbers fly off enemies, and the player flashes red/white.
* **Damage indicators:** The screen edges tint red during low health or heavy damage.
* **Power-up pickup feedback:** Floating text indicators (e.g., "+ SHIELD") with corresponding collect sounds.
* **UI transitions:** Framer Motion `<motion.div>` handles smooth fade-ins and scale-outs for all menus and modals.
* **Error / invalid actions:** Abilities grayed out with "NO STM" text if stamina is lacking.

## 7. Accessibility & Usability
* **Font size and readability:** Numbers and critical labels are bold and scaled generously, with high contrast text.
* **Colorblind-friendly options:** Distinct shape differences (e.g., octagonal icons vs rectangular bars) and text labels accompany color cues.
* **Clear contrast:** Backdrop-blur and semi-opaque backgrounds ensure UI text is legible regardless of the stars or particles behind it.
* **Simple, consistent control hints:** Small keybind letters (1, 2, X, C, E, F) overlay the skill icons directly.

## 8. Final Presentation Plan
**Presentation Structure:**
* **Introduction:** 
  * Present the game title: **Space Survival**. 
  * Introduce the group members and the project's inspiration.
* **Concept Recap & Core Mechanics:** 
  * Explain the premise: a top-down, endless bullet-hell space shooter. 
  * Detail the core mechanics: ship movement, stamina management, dodging, and utilizing primary (Kinetic) / secondary (Plasma) weapons, along with Dash, Shield, and Overdrive abilities.
* **Operating Systems Integration (IT231 Focus):**
  * Highlight how OS CPU scheduling concepts are gamified.
  * Detail how enemy attacks, targeting, and spawn behaviors are dictated by dynamic algorithms: **First-Come, First-Served (FCFS)**, **Round Robin (RR)**, and **Highest Response Ratio Next (HRRN)**.
* **UI/UX Goals & Design Philosophy:** 
  * Discuss the objective to create a clean, responsive, and highly readable HUD in a chaotic bullet-hell environment.
  * Point out the sci-fi cyberpunk aesthetic, glassmorphism, and neon UI components.
* **Screen-by-Screen Walkthrough:** 
  * **Main Menu / Hangar:** Show the initial player experience and progression system.
  * **In-Game HUD:** Break down the weapon active states, health/stamina bars, dynamic skill cooldowns (clip-path animations), and the OS Scheduler layout.
  * **Pause & Diagnostic Menus:** Show the tactical pause screen and clear UI navigation.
* **Live Demonstration:** 
  * Present a short gameplay demo (or video) showcasing combat speed, evasive maneuvers, and power-up collection.
  * Specifically highlight visual feedback mechanisms: UI scaling, screen shake, damage numbers, and critical health overlays.
* **Technical Architecture:** 
  * Define the tech stack: React, TypeScript, HTML5 `<canvas>`, Tailwind CSS, and Framer Motion.
  * Explain the dual-layer architecture: HTML5 Canvas handles the 60+ FPS high-density collision and rendering, while React DOM manages the complex UI/HUD overlay.
* **Lessons Learned & Future Enhancements:** 
  * Share the challenges of balancing bullet-hell performance with React state management.
  * Discuss possible future additions like mobile joystick controls, a global leaderboard database, or additional scheduling algorithms.

**Materials for Presentation:**
* Slide Deck (Google Slides / PowerPoint) acting as a visual guide.
* Code snippets showcasing the OS-algorithm enemy logic and the React-to-Canvas bridge.
* UI snapshots showing the various button states (hover, disabled, active).
* A recorded gameplay video (in case of live-demo technical difficulties).
* Asset references and credits (e.g., Void Fleet Pack by foozlecc).
