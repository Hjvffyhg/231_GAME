export class SoundManager {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  bgmGain: GainNode | null = null;
  bgmFilter: BiquadFilterNode | null = null;
  currentBgmInterval: any = null;
  bgmIntensity: "low" | "med" | "high" = "low";

  currentBgmVolume: number = 0.15;
  currentMasterVolume: number = 0.3;

  setMasterVolume(val: number) {
    this.currentMasterVolume = val;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  setBgmVolume(val: number) {
    this.currentBgmVolume = val;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.bgmGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  init() {
    if (!this.ctx) {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.currentMasterVolume; // Default volume
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.currentBgmVolume;
      this.bgmFilter = this.ctx.createBiquadFilter();
      this.bgmFilter.type = "lowpass";
      this.bgmFilter.frequency.value = 20000;
      this.bgmGain.connect(this.bgmFilter);
      this.bgmFilter.connect(this.masterGain);
    }
    // Required by browsers: resume if suspended
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setLowRamEffect(isLow: boolean) {
    if (!this.bgmFilter || !this.bgmGain || !this.ctx) return;
    const now = this.ctx.currentTime;

    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmFilter.frequency.cancelScheduledValues(now);

    if (isLow) {
      // Muffled and glitching
      this.bgmFilter.frequency.setTargetAtTime(800, now, 0.5);
      this.bgmGain.gain.setTargetAtTime(this.currentBgmVolume * 0.4, now, 0.5);
    } else {
      // Clear
      this.bgmFilter.frequency.setTargetAtTime(20000, now, 0.5);
      this.bgmGain.gain.setTargetAtTime(this.currentBgmVolume, now, 0.5);
    }
  }

  stopBGM() {
    if (this.currentBgmInterval) {
      clearInterval(this.currentBgmInterval);
      this.currentBgmInterval = null;
    }
  }

  playBGM(intensity: "low" | "med" | "high") {
    this.bgmIntensity = intensity;
    if (this.currentBgmInterval || !this.ctx || !this.bgmGain) return;

    let step = 0;
    const baseTempo = 120;
    let nextNoteTime = this.ctx.currentTime;

    const scheduleBGM = () => {
      while (nextNoteTime < this.ctx!.currentTime + 0.1) {
        const bps = baseTempo / 60;
        const eighthNote = 0.5 / bps;

        // Dynamic complexity based on intensity
        // Low: Just bass arp. Med: + Kick. High: + fast arp & hat

        // Kick drum every quarter note
        if (
          step % 2 === 0 &&
          (this.bgmIntensity === "med" || this.bgmIntensity === "high")
        ) {
          const kick = this.ctx!.createOscillator();
          const kickGain = this.ctx!.createGain();
          kick.type = "square";
          kick.frequency.setValueAtTime(150, nextNoteTime);
          kick.frequency.exponentialRampToValueAtTime(0.01, nextNoteTime + 0.1);
          kickGain.gain.setValueAtTime(0.4, nextNoteTime);
          kickGain.gain.exponentialRampToValueAtTime(0.01, nextNoteTime + 0.1);
          kick.connect(kickGain);
          kickGain.connect(this.bgmGain!);
          kick.start(nextNoteTime);
          kick.stop(nextNoteTime + 0.1);
        }

        // Driving Bassline (Eighth notes)
        const bassNotes = [55.0, 55.0, 55.0, 65.41, 55.0, 55.0, 61.74, 58.27]; // A1, A1, A1, C2, A1, A1, B1, Bb1
        const hz = bassNotes[step % 8];

        const bass = this.ctx!.createOscillator();
        const bassVol = this.ctx!.createGain();
        bass.type = "sawtooth";
        bass.frequency.setValueAtTime(
          this.bgmIntensity === "high" ? hz * 2 : hz,
          nextNoteTime,
        );
        bassVol.gain.setValueAtTime(0.3, nextNoteTime);
        bassVol.gain.exponentialRampToValueAtTime(
          0.01,
          nextNoteTime + eighthNote * 0.9,
        );
        bass.connect(bassVol);
        bassVol.connect(this.bgmGain!);
        bass.start(nextNoteTime);
        bass.stop(nextNoteTime + eighthNote * 0.9);

        nextNoteTime += eighthNote;
        step++;
      }
    };

    this.currentBgmInterval = setInterval(scheduleBGM, 50);
  }

  playShoot(isHeavy: boolean = false) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isHeavy ? "sawtooth" : "square";

    // Random pitch variation to prevent audio fatigue
    const pitchShift = 1.0 + (Math.random() * 0.2 - 0.1);
    const baseFreq = isHeavy ? 150 : 300;
    osc.frequency.setValueAtTime(baseFreq * pitchShift, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      (isHeavy ? 50 : 100) * pitchShift,
      this.ctx.currentTime + (isHeavy ? 0.3 : 0.1),
    );

    gain.gain.setValueAtTime(isHeavy ? 0.6 : 0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      this.ctx.currentTime + (isHeavy ? 0.3 : 0.1),
    );

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + (isHeavy ? 0.3 : 0.1));
  }

  playTakeDamage() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playAlgoSelect(algo: string) {
    if (!this.ctx || !this.masterGain) return;
    const gain = this.ctx.createGain();
    gain.connect(this.masterGain);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    if (algo === "FCFS") {
      // Heavy CLUNK
      const osc = this.ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        40,
        this.ctx.currentTime + 0.15,
      );
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } else if (algo === "RR") {
      // Rapid zip-zip
      const osc1 = this.ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

      const osc2 = this.ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(600, this.ctx.currentTime + 0.08);
      osc2.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.13);

      const gain1 = this.ctx.createGain();
      gain1.connect(this.masterGain);
      gain1.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(
        0.01,
        this.ctx.currentTime + 0.05,
      );

      const gain2 = this.ctx.createGain();
      gain2.connect(this.masterGain);
      gain2.gain.setValueAtTime(0, this.ctx.currentTime);
      gain2.gain.setValueAtTime(0.3, this.ctx.currentTime + 0.08);
      gain2.gain.exponentialRampToValueAtTime(
        0.01,
        this.ctx.currentTime + 0.13,
      );

      osc1.connect(gain1);
      osc2.connect(gain2);

      osc1.start(this.ctx.currentTime);
      osc1.stop(this.ctx.currentTime + 0.05);
      osc2.start(this.ctx.currentTime + 0.08);
      osc2.stop(this.ctx.currentTime + 0.13);
    } else if (algo === "HRRN") {
      // Sharp chirp
      const osc = this.ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1500, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        200,
        this.ctx.currentTime + 0.1,
      );
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    }
  }

  playExplosion() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playEnemySpawn() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playEnemyAttack() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      200,
      this.ctx.currentTime + 0.15,
    );

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playBossWarning() {
    if (!this.ctx || !this.masterGain) return;

    const freqs = [350, 450];
    const timeOffset = 0.35;

    for (let i = 0; i < 10; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";

      const freq = i % 2 === 0 ? freqs[0] : freqs[1];
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * timeOffset);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * timeOffset);
      gain.gain.linearRampToValueAtTime(
        0.3,
        this.ctx.currentTime + i * timeOffset + 0.05,
      );
      gain.gain.linearRampToValueAtTime(
        0.01,
        this.ctx.currentTime + i * timeOffset + timeOffset,
      );

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + i * timeOffset);
      osc.stop(this.ctx.currentTime + (i + 1) * timeOffset);
    }
  }

  playLowHealthAlarm() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.05); // softer so it doesn't blast ears continuously
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playSystemBlip() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2000, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      4000,
      this.ctx.currentTime + 0.05,
    );

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playGameOver() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.5);
  }

  playWaveCompletion() {
    if (!this.ctx || !this.masterGain) return;

    const freqs = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    const timeOffset = 0.1;

    freqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, this.ctx!.currentTime + i * timeOffset);
      gain.gain.linearRampToValueAtTime(
        0.3,
        this.ctx!.currentTime + i * timeOffset + 0.05,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        this.ctx!.currentTime + i * timeOffset + 0.3,
      );

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(this.ctx!.currentTime + i * timeOffset);
      osc.stop(this.ctx!.currentTime + i * timeOffset + 0.3);
    });
  }

  playCollect(type?: string) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    let freq1 = 800;
    let freq2 = 1200;

    if (type === "health") {
      freq1 = 400;
      freq2 = 800;
    } else if (type === "shield") {
      freq1 = 600;
      freq2 = 1000;
    } else if (type === "speed") {
      freq1 = 1200;
      freq2 = 1600;
    } else if (type === "weapon") {
      freq1 = 300;
      freq2 = 900;
      osc.type = "square";
    }

    osc.type = osc.type === "square" ? "square" : "sine";
    osc.frequency.setValueAtTime(freq1, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(freq2, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
  playUISelect() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playPowerup() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }
}

export const soundManager = new SoundManager();
