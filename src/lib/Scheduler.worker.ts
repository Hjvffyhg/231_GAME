export interface EnemySnapshot {
  id: number;
  W: number; // Wait Time
  S: number; // Service Time (HP/MaxHP approximation or similar)
  priority: number;
}

export interface WorkerMessage {
  algo: "FCFS" | "RR" | "HRRN";
  enemies: EnemySnapshot[];
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { algo, enemies } = e.data;

  // We want to sort the enemies based on the algorithm and return a Priority List (array of IDs)
  // Higher priority comes FIRST in the array.

  const priorityList = enemies
    .sort((a, b) => {
      const pA = a.priority || 1;
      const pB = b.priority || 1;

      if (algo === "FCFS") {
        // Target the enemy with the absolute longest accumulated Wait Time (W)
        const valA = a.W * pA;
        const valB = b.W * pB;
        return valB - valA; // descending
      } else if (algo === "HRRN") {
        // HRRN: Target the enemy with the Highest Response Ratio R = (W+S)/S
        const rA = ((a.W + a.S) / Math.max(0.1, a.S)) * pA;
        const rB = ((b.W + b.S) / Math.max(0.1, b.S)) * pB;
        return rB - rA; // descending
      } else {
        // RR: Strict Round Robin should NOT sort numerically.
        // It is a circular FIFO queue. By maintaining the provided index map (or pushing prioritized up),
        // we avoid turning RR into FCFS. We just softly escalate Right-Click priorities.
        if (pA > 1 && pB <= 1) return -1;
        if (pB > 1 && pA <= 1) return 1;
        return 0; // Maintain current FIFO array order!
      }
    })
    .map((en) => en.id);

  self.postMessage({ priorityList });
};
