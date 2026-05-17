export interface DeathSnapshot {
  timestamp: number;
  algorithm: 'FCFS' | 'RR' | 'HRRN';
  wave: number;
  causeOfDeath: string;
  enemiesOnScreen: number;
  activeHazards: string[];
  sessionDuration: number;
}

export class BlackBox {
  static recordDeath(snapshot: DeathSnapshot) {
    // In the demo, we save to LocalStorage; in production, we send to a database/API
    const logs = JSON.parse(localStorage.getItem('death_logs') || '[]');
    logs.push(snapshot);
    localStorage.setItem('death_logs', JSON.stringify(logs));
    console.log("Black Box Data Captured:", snapshot);
  }

  static getLogs(): DeathSnapshot[] {
    return JSON.parse(localStorage.getItem('death_logs') || '[]');
  }
}
