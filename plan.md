# AI Tester (Auto-Pilot) Enhancements Plan
**Objective:** Overhaul the AI Tester ("Auto-Pilot") so that its physical navigation and evasion are mathematically robust and intuitively reflect the active OS-Scheduling Algorithm, ensuring it survives longer while demonstrating the system mechanics effectively.

## 1. Algorithmically Driven Target Selection
Currently, the Auto-Pilot simply points at the Boss or the closest enemy, ignoring the actual OS scheduling configurations. This creates a disconnect where drones target one entity (based on FCFS/RR/HRRN), but the ship flies elsewhere.
* **FCFS (The Convoy):** The AI Tester will physically navigate toward the enemy that has been wandering the field the longest (Highest Wait Time $W$).
* **HRRN (The Executor):** The AI Tester calculates the threat ratio $((W+S)/S) \times Priority$ and routes the ship to hunt the mathematically highest threat, matching the drone behavior natively.
* **RR (The Time-Slicer):** The AI tester will target the closest entity, creating a tighter "spin" behavior combined with the Round Robin quantum slicing.

## 2. Advanced Threat Evasion & Dogfighting
Currently, the AI Tester relies on basic repulsive forces against bullets, often getting stuck in "corners" or running straight backward into more hazards.
* **Tangential Strafing:** Calculate perpendicular velocity vectors to incoming bullets and enemies. The AI will physically strafe (side-step) incoming boss lasers and projectiles instead of just reversing.
* **Predictive Enemy Separation:** Smooth out the steering forces to softly repel from standard drones, avoiding "clumping" that gets the AI destroyed by splash damage.

## 3. Automated Garbage Collection Simulation
* **Memory Leak Avoidance vs. Execution:** Give the AI Tester awareness of the Memory Leaks (`black_hole` anomalies). Since "G" triggers Garbage Collection under the hood, the AI Tester could either route the ship away from the leaks using massive repulsive forces (which it currently tries but often fails at during high-density waves), OR automatically trigger Garbage Collection conditionally when swarmed by leaks to visualize OS stability maintenance.

## 4. Contextual Optimal Spacing
* The AI will parse whether it has `Overdrive` active (preferring 150px close quarters combat) or if it's fighting a `Boss` (maintaining 500px safe distance) and steer toward these exact sweet spots.

## 5. Map & Spatial Awareness
* **Out-of-Bounds & Cluster Containment:** Although the map is technically infinite, the AI Tester will maintain awareness of the global center (or the dense cluster center of spawned enemies) to prevent drifting excessively far into empty space.
* **Environmental Navigation:** Enhanced pathfinding to steer clear of overlapping danger zones (like Asteroid clusters or active Anomalies) *before* getting trapped inside them, predicting the safest vector based on local space density.

# Future Implementation: Drone Combat Upgrades & Balancing Plan
**Objective:** Introduce a progressive scale for Drone functionality—integrating upgrade paths for Damage, Output Range, and Swarm Interaction, tying deeply into the Database metrics and Hangar System.

## 1. Dynamic Damage Scaling
* **Range-Based Attenuation:** Drones will deal maximum damage output at closer tactical ranges (e.g., 300-500px). Extending drone operational range via the Tactical Minimap directly introduces damage falloff, forcing strategic balancing between global reach and localized DPS power.
* **Hangar Refit Synergies:** The `Weapon Overdrive` upgrade module in the hangar will apply a flat base-multiplier to drone damage arrays, visualizing the interconnected power structure.

## 2. Drone Capability Modules
* Introduce unlockable Drone types alongside OS strategies.
* Update the "Database: Swarm Observation" and "Mission Report" screens to explicitly log Drone DPS, tracking the efficiency of distance management versus pure execution damage.

Would you like me to begin engineering this AI Tester logic into `GameCanvas.tsx`?
