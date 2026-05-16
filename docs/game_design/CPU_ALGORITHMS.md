# CPU Scheduling Algorithms in Space Survival

In Space Survival, the player is accompanied by auto-targeting drones ("cores") that act as an automated defense system. The assignment of these drones to the available enemy targets is governed by real-world CPU scheduling algorithms. As the game progresses and waves increase, the scheduling algorithm dynamically upgrades, providing a unique blend of gameplay and computer science!

## The Context

- **Cores (Drones):** The drones orbiting the player's ship. Each drone act as a CPU core that can "process" (shoot at) one enemy at a time. The number of cores increases as the waves progress.
- **Processes (Enemies):** The enemies spawned around the player.
- **Ready Queue:** The list of enemies waiting to be targeted. Enemies enter the "Ready Queue" as soon as they spawn and come within the drone's firing range.
- **Burst Time ($S$):** Assigned when an enemy spawns, loosely correlated to its hit points or danger level.
- **Wait Time ($W$):** The time an enemy spends in the Ready Queue waiting to be targeted by a drone.

---

## 1. FCFS (First-Come, First-Served)
**Wave 1 | 2 Cores**

The initial scheduling algorithm. In FCFS:
- The drone simply targets the enemy that has been in the Ready Queue the longest (the one with the highest accumulated Wait Time $W$).
- **No Preemption:** Once an enemy is targeted, the drone will continuously fire at it until it is destroyed or it moves out of range. 
- **Gameplay Effect:** Predictable, but can be dangerous if a high-health enemy is targeted while many low-health enemies swarm the player, causing the "cores" to be blocked.

## 2. RR (Round Robin)
**Waves 2 - 3 | 3-4 Cores**

As the difficulty scales, the system switches to Round Robin to prevent process starvation.
- **Time Quantum:** The drone is assigned a specific "time slice" (e.g., $0.8$ or $0.4$ seconds).
- **Preemption:** The drone fires at its target for the duration of its time quantum. Once the quantum expires, the current target is pre-empted (pushed back to the Ready Queue).
- The drone then acquires the next enemy in the queue order.
- **Gameplay Effect:** The drones spread their fire continuously among all nearby enemies. You'll see targets flashing cyan and the indicator ring above them depleting based on the remaining quantum.

## 3. HRRN (Highest Response Ratio Next)
**Wave 4+ | 4-8 Cores**

The ultimate algorithm for advanced waves, mitigating the weaknesses of both FCFS and RR.
- **Response Ratio ($R$):** The drone calculates the priorities based on $R = \frac{W + S}{S}$ (where $W$ is Wait Time and $S$ is the estimated Burst Time / duration priority).
- **Selection:** The drone targets the enemy with the highest Response Ratio. This ensures that enemies that have been waiting a long time get prioritized, while still favoring enemies with shorter "burst times" (faster to destroy).
- **Preemption:** The HRRN implementation is partially preemptive here (to fit the gameplay needs) where the drone processes the target for $S$ seconds before re-evaluating the queue. 
- **Gameplay Effect:** A highly efficient and visually dynamic targeting system where enemies with high Wait Time begin to glow amber to indicate their rising priority in the Ready Queue.


## Relevant Code Snippets
*(From `src/components/GameCanvas.tsx`)*

Here's an excerpt of how the target selection logic is handled when a drone is idle:

```typescript
const inRangeEnemies = state.readyQueue
   .map(id => state.enemies.find((x: any) => x.id === id))
   .filter(e => e && Math.hypot(e.x - state.player.x, e.y - state.player.y) <= droneRangeRef.current);

if (inRangeEnemies.length > 0) {
   if (cfg.algo === 'FCFS') {
      // FCFS: Target the enemy with the absolute longest accumulated Wait Time (W)
      let maxW = -1;
      for (const e of inRangeEnemies) {
         if (e.W > maxW) {
            maxW = e.W;
            nextEnemyId = e.id;
         }
      }
   } else if (cfg.algo === 'RR') {
      // RR: Target the first enemy in the queue order (Round Robin cycling)
      nextEnemyId = inRangeEnemies[0].id;
   } else if (cfg.algo === 'HRRN') {
      // HRRN: Target the enemy with the Highest Response Ratio R = (W+S)/S
      let maxRatio = -1;
      for (const e of inRangeEnemies) {
         const R = (e.W + e.S) / Math.max(0.1, e.S); // prevent div/0
         if (R > maxRatio) {
            maxRatio = R;
            nextEnemyId = e.id;
         }
      }
   }
}
```
