import React, { useEffect, useRef, useState } from "react";
import { soundManager } from "../lib/audio";
import {
  loadShip,
  loadProjectile,
  loadAllProjectiles,
  ShipRenderer,
  SHIP_CONFIGS,
  PROJECTILE_CONFIGS,
  AnimSprite,
  ShipName,
  ShipSprites,
} from "../lib/voidFleet";
import { generateNebula, generatePlanet } from "../lib/proceduralGraphics";
import { getSavedLayout, HudLayout, DEFAULT_LAYOUT } from "../lib/hudLayout";
import { HudEditor } from "./HudEditor";
import { BlackBox } from "../lib/BlackBox";

export type SchedulerAlgo = "FCFS" | "RR" | "HRRN";

const ASSETS_CACHE: {
  ships: Partial<Record<ShipName, ShipSprites>>;
  projectiles: Record<string, HTMLImageElement> | null;
  bossImages: Record<string, HTMLImageElement>;
} = {
  ships: {},
  projectiles: null,
  bossImages: {},
};

interface GameCanvasProps {
  gameKey: number;
  onGameOver: (score: number, isVictory?: boolean, cause?: string, stats?: any) => void;
  onReturnMenu: () => void;
  civilizationLevel?: number;
}

export function GameCanvas({
  gameKey,
  onGameOver,
  onReturnMenu,
  civilizationLevel = 0,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const critVignetteRef = useRef<HTMLDivElement>(null);
  const hpRef = useRef<HTMLDivElement>(null);
  const hpTextRef = useRef<HTMLSpanElement>(null);
  const waveRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const targetsRef = useRef<HTMLSpanElement>(null);
  const algoRef = useRef<HTMLSpanElement>(null);
  const algoHudRef = useRef<HTMLDivElement>(null);
  const algoStatsRef = useRef<HTMLDivElement>(null);
  const readyQueueUiRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const expandedMinimapRef = useRef<HTMLCanvasElement>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const ammoRef = useRef<HTMLSpanElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const shieldTextRef = useRef<HTMLSpanElement>(null);
  const staminaRef = useRef<HTMLDivElement>(null);
  const staminaTextRef = useRef<HTMLSpanElement>(null);
  const powerupRef = useRef<HTMLDivElement>(null);
  const wpn1Ref = useRef<HTMLDivElement>(null);
  const wpn2Ref = useRef<HTMLDivElement>(null);
  const dshRef = useRef<HTMLDivElement>(null);
  const shdSkillRef = useRef<HTMLDivElement>(null);
  const ocSkillRef = useRef<HTMLDivElement>(null);
  const bossWarningUIRef = useRef<HTMLDivElement>(null);
  const bossWarningSubtextRef = useRef<HTMLDivElement>(null);
  const osMessagesRef = useRef<HTMLDivElement>(null);

  const onGameOverRef = useRef(onGameOver);
  const onReturnMenuRef = useRef(onReturnMenu);

  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const gameStateRef = useRef<any>(null);
  const [pausedQueueRefs, setPausedQueueRefs] = useState<any[]>([]);
  const [isHudEditorOpen, setIsHudEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hudLayout, setHudLayout] = useState<HudLayout>(getSavedLayout());
  const [droneRange, setDroneRange] = useState(
    () => Number(localStorage.getItem("ss-drone-range")) || 1000,
  );
  const [cameraMode, setCameraMode] = useState<"offset" | "center" | "dynamic">(
    () => (localStorage.getItem("ss-camera-mode") as any) || "offset",
  );
  const cameraModeRef = useRef(cameraMode);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
    localStorage.setItem("ss-camera-mode", cameraMode);
  }, [cameraMode]);
  const [showSchedulingIndicators, setShowSchedulingIndicators] = useState(
    () => localStorage.getItem("ss-sched-indicators") !== "false",
  );
  const showSchedulingIndicatorsRef = useRef(showSchedulingIndicators);

  useEffect(() => {
    showSchedulingIndicatorsRef.current = showSchedulingIndicators;
    localStorage.setItem(
      "ss-sched-indicators",
      String(showSchedulingIndicators),
    );
  }, [showSchedulingIndicators]);

  const droneRangeRef = useRef(1000);

  const [masterVolume, setMasterVolume] = useState(() => {
    const val = localStorage.getItem("ss-master-volume");
    return val !== null ? Number(val) : 0.3;
  });
  const [bgmVolume, setBgmVolume] = useState(() => {
    const val = localStorage.getItem("ss-bgm-volume");
    return val !== null ? Number(val) : 0.15;
  });

  useEffect(() => {
    droneRangeRef.current = droneRange;
    localStorage.setItem("ss-drone-range", String(droneRange));
  }, [droneRange]);

  useEffect(() => {
    soundManager.setMasterVolume(masterVolume);
    localStorage.setItem("ss-master-volume", String(masterVolume));
  }, [masterVolume]);

  useEffect(() => {
    soundManager.setBgmVolume(bgmVolume);
    localStorage.setItem("ss-bgm-volume", String(bgmVolume));
  }, [bgmVolume]);

  const isDeadRef = useRef(false);

  const [uiScale, setUiScale] = useState(1);
  const uiScaleRef = useRef(1);
  useEffect(() => {
    const handleResize = () => {
      // Base reference width for generic desktop
      const baseWidth = 1440;
      const baseHeight = 900;
      // Calculate responsive scale factor
      const widthScale = window.innerWidth / baseWidth;
      const heightScale = window.innerHeight / baseHeight;
      const scale = Math.max(0.6, Math.min(widthScale, heightScale, 1.2)); // Cap bounds so it doesn't get unplayably tiny or hilariously massive
      setUiScale(scale);
      uiScaleRef.current = scale;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isTouchDevice = false;
  const mobileMoveRef = useRef({ x: 0, y: 0, active: false });
  const mobileAimRef = useRef({ x: 0, y: 0, active: false });

  const workerRef = useRef<Worker | null>(null);
  const workerPriorityListRef = useRef<number[]>([]);
  const lastWorkerTimeRef = useRef<number>(0);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../lib/Scheduler.worker.ts", import.meta.url),
      { type: "module" },
    );
    workerRef.current.onmessage = (e) => {
      workerPriorityListRef.current = e.data.priorityList;
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const asteroidSpriteRef = useRef<HTMLImageElement | null>(null);

  // Touch detection removed for desktop-only validation

  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  useEffect(() => {
    const img = new Image();
    img.src = "assets/asteroids.png";
    img.onload = () => {
      asteroidSpriteRef.current = img;
    };
  }, []);

  useEffect(() => {
    onReturnMenuRef.current = onReturnMenu;
  }, [onReturnMenu]);

  const togglePause = () => {
    if (isDeadRef.current) return;
    const newPaused = !isPausedRef.current;
    isPausedRef.current = newPaused;

    if (newPaused && gameStateRef.current) {
      const snapshot = gameStateRef.current.readyQueue
        .map((id: number) => {
          const e = gameStateRef.current.enemies.find((x: any) => x.id === id);
          return e
            ? {
                id: e.id,
                type: e.type,
                W: e.W,
                S: e.S,
                maxHp: e.maxHp,
                priority: e.priority || 1,
              }
            : null;
        })
        .filter(Boolean);
      setPausedQueueRefs(snapshot);
    }

    // Manage BGM Pause
    if (newPaused) {
      soundManager.ctx?.suspend();
    } else {
      soundManager.ctx?.resume();
    }

    setIsPaused(newPaused);
  };

  useEffect(() => {
    // Reset session refs and states when starting/restarting a game run
    isDeadRef.current = false;
    isPausedRef.current = false;
    setIsPaused(false);
    setIsMapExpanded(false);
    setPausedQueueRefs([]);

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    let isCancelled = false;
    let animationFrameId: number;
    let lastTime = performance.now();
    let isAssetsLoaded = false;
    let playerRenderer: ShipRenderer;
    let nebulaCanvas: HTMLCanvasElement;
    let planetBlueRing: HTMLCanvasElement;
    let planetPurpleRing: HTMLCanvasElement;
    let planetOrange: HTMLCanvasElement;
    let planetRed: HTMLCanvasElement;
    let planetGreen: HTMLCanvasElement;

    async function initAssets() {
      if (!ASSETS_CACHE.projectiles) {
        ASSETS_CACHE.projectiles = await loadAllProjectiles();
      }

      const loadBossImg = (key: string, src: string) => {
        return new Promise<void>((resolve) => {
          if (ASSETS_CACHE.bossImages[key]) {
            resolve();
            return;
          }
          const img = new Image();
          img.src = src;
          img.onload = () => {
            ASSETS_CACHE.bossImages[key] = img;
            resolve();
          };
          img.onerror = () => {
            resolve(); // ignore error to avoid breaking loop
          };
        });
      };

      await Promise.all([
        loadBossImg("boss", "assets/jboss_carrier.png"),
        loadBossImg("boss_rr", "assets/jboss_rr.png"),
        loadBossImg("boss_hrrn", "assets/jboss_hrrn.png"),
      ]);

      const selectedShip =
        (localStorage.getItem("selectedShip") as ShipName) || "Fighter";
      const neededShips: ShipName[] = [
        selectedShip,
        "Fighter",
        "Scout",
        "Dreadnought",
        "Battlecruiser",
        "Bomber",
        "Support ship",
      ];
      for (const ship of neededShips) {
        if (!ASSETS_CACHE.ships[ship]) {
          ASSETS_CACHE.ships[ship] = await loadShip(ship);
        }
      }

      const pSprites = ASSETS_CACHE.ships[selectedShip]!;
      const pr = new ShipRenderer(
        pSprites,
        SHIP_CONFIGS[selectedShip],
        (30 * 4.0) / SHIP_CONFIGS[selectedShip].size,
      );
      if (pr.hasSprites) {
        playerRenderer = pr;
      }

      // Load upgrades
      const upgrades = JSON.parse(
        localStorage.getItem("upgrades") || '{"hp":0,"dmg":0,"speed":0}',
      );

      // Base stats by ship
      const shipStats: Record<ShipName, { maxHp: number; baseSpeed: number }> =
        {
          Fighter: { maxHp: 100, baseSpeed: 450 },
          Scout: { maxHp: 70, baseSpeed: 585 },
          Bomber: { maxHp: 180, baseSpeed: 315 },
          Frigate: { maxHp: 250, baseSpeed: 450 },
          Battlecruiser: { maxHp: 400, baseSpeed: 225 },
          "Support ship": { maxHp: 100, baseSpeed: 450 },
          "Torpedo Ship": { maxHp: 100, baseSpeed: 450 },
          Dreadnought: { maxHp: 100, baseSpeed: 450 },
        };

      const sStat = shipStats[selectedShip] || { maxHp: 100, baseSpeed: 450 };

      state.player.maxHp = sStat.maxHp + upgrades.hp * 20;
      state.player.hp = state.player.maxHp;
      state.player.baseSpeed = sStat.baseSpeed * (1.0 + upgrades.speed * 0.1);
      state.player.damageMult = 1.0 + upgrades.dmg * 0.2;

      nebulaCanvas = generateNebula(MAP_WIDTH, MAP_HEIGHT);
      planetBlueRing = generatePlanet("blue-ring");
      planetPurpleRing = generatePlanet("purple-ring");
      planetOrange = generatePlanet("orange-gas");
      planetRed = generatePlanet("red-planet");
      planetGreen = generatePlanet("green-earth");

      if (isCancelled) return;
      isAssetsLoaded = true;
      // Restart timing to avoid huge jump
      lastTime = performance.now();
      loop(lastTime);
    }

    const applyPool = (arr: any[]) => {
      arr.push = function (item: any) {
        const idx = this.findIndex((x: any) => x.life <= 0);
        if (idx !== -1) {
          this[idx] = item;
          return this.length;
        }
        return Array.prototype.push.call(this, item);
      };
      return arr;
    };

    const state = {
      player: {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        hp: 100,
        maxHp: 100,
        radius: 30,
        ammo: 100,
        shield: 0,
        speedTimer: 0,
        weaponTimer: 0,
        stamina: 100,
        selectedWeapon: 1,
        dashCooldown: 0,
        shieldCooldown: 0,
        baseSpeed: 450,
        damageMult: 1.0,
        regenDelay: 0,
        isBoosting: false,
      },
      bullets: applyPool([]),
      enemyBullets: applyPool([]),
      particles: applyPool([]),
      damageNumbers: applyPool([]),
      asteroids: [] as any[],
      collectibles: [] as any[],
      enemies: [] as any[],
      readyQueue: [] as number[],
      currentAlgo: "FCFS" as SchedulerAlgo,
      drones: [] as any[],
      respawnQueue: [] as any[],
      thrashTimer: 0,
      swapHistory: [] as number[],
      isOutsideSafeZone: false,
      inHazardZone: false,
      isPlayerInLeak: false,
      empTimer: 0,
      timeWithoutCombat: 0,
      gameTime: 0,
      messageTimer: 0,
      score: 0,
      kills: 0,
      credits: 0,
      lastSpawnTime: lastTime / 1000,
      lastItemSpawnTime: lastTime / 1000,
      diffTimer: 0,
      overclockTimer: 0,
      overclockCooldown: 0,
      keys: {} as Record<string, boolean>,
      mobileMove: { x: 0, y: 0, active: false },
      mobileAim: { x: 0, y: 0, active: false },
      mouse: { screenX: 0, screenY: 0, x: 0, y: 0, down: false },
      clicks: [] as { x: number; y: number }[],
      lastFireTime: 0,
      isGameOver: false,
      lastWave: 1,
      bossWarningTimer: 0,
      screenShakeTimer: 0,
      glitchTimer: 0,
      lowHealthAlarmTimer: 0,
      osMessages: [] as { text: string; life: number }[],
      scars: [] as { x: number; y: number; size: number; rotation: number }[],
      pendingBoss: null as any,
      showBossWarning: false,
      notification: { time: 0, text1: "", text2: "" },
      autoPilot: false,
      anomalies: [] as any[],
      bossesSpawned: { boss: false, boss_rr: false, boss_hrrn: false },
      elapsed: 0,
      lastDamageSource: "",
      currentZoom: 1,
      targetZoom: 1,
    };
    gameStateRef.current = state;

    const MAP_WIDTH = 3000;
    const MAP_HEIGHT = 3000;

    const stars = Array.from({ length: 3000 }).map(() => ({
      x: Math.random() * MAP_WIDTH * 3 - MAP_WIDTH,
      y: Math.random() * MAP_HEIGHT * 3 - MAP_HEIGHT,
      r: Math.random() > 0.95 ? 6 : Math.random() > 0.5 ? 4 : 2, // chunky sizes
      isRare: Math.random() > 0.96, // draws a cross
      alpha: Math.random() * 0.8 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      parallax: Math.random() * 0.6 + 0.2,
    }));

    // Generate initial asteroids
    for (let i = 0; i < 30 + civilizationLevel * 15; i++) {
      state.asteroids.push({
        id: i,
        x: Math.random() * MAP_WIDTH,
        y: Math.random() * MAP_HEIGHT,
        vx: (Math.random() - 0.5) * 50 * (1 + civilizationLevel * 0.5),
        vy: (Math.random() - 0.5) * 50 * (1 + civilizationLevel * 0.5),
        radius: 20 + Math.random() * 50,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 2,
        hp: 200 + civilizationLevel * 100,
        spriteIdxX: Math.floor(Math.random() * 8),
        spriteIdxY: Math.floor(Math.random() * 4),
      });
    }

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      if (state.player.x === 0 && state.player.y === 0) {
        state.player.x = MAP_WIDTH / 2;
        state.player.y = MAP_HEIGHT / 2;
      }
    };

    window.addEventListener("resize", resize);
    resize(); // initialize bounds

    const handleKeyDown = (e: KeyboardEvent) => {
      // If escape, P, or space pressed, toggle pause
      if (e.key === "Escape" || e.key.toLowerCase() === "p" || e.key === " ") {
        togglePause();
      }
      if (e.key.toLowerCase() === "y") {
        // moved autopilot to y
        state.autoPilot = !state.autoPilot;
        state.notification = {
          time: 4.0,
          text1: state.autoPilot ? "AUTONOMOUS NAVIGATION" : "MANUAL CONTROL",
          text2: state.autoPilot
            ? "THE FRAME FLIES ITSELF"
            : "NEURAL LINK ESTABLISHED",
        };
      }

      const hasMalware = state.enemies.some(
        (enemy: any) => enemy.type === "malware",
      );

      const checkThrashing = () => {
        const now = performance.now();
        state.swapHistory.push(now);
        state.swapHistory = state.swapHistory.filter(
          (t: number) => now - t <= 2000,
        );
        if (state.swapHistory.length > 3) {
          state.thrashTimer = 1.5;
          state.swapHistory = [];
          state.damageNumbers.push({
            x: state.player.x,
            y: state.player.y - 40,
            amount: 0,
            life: 1.5,
            vx: 0,
            vy: -20,
            text: `THE SWARM IS CONFUSED...`,
            isCrit: true,
            color: "#ef4444",
          });
          return true;
        }
        return false;
      };

      if (e.key.toLowerCase() === "q") {
        if (hasMalware) {
          state.damageNumbers.push({
            x: state.player.x,
            y: state.player.y - 40,
            amount: 0,
            life: 1.5,
            vx: 0,
            vy: -20,
            text: `TARGETING LOCKED`,
            isCrit: true,
            color: "#ef4444",
          });
        } else if (!checkThrashing()) {
          const algos: SchedulerAlgo[] = ["FCFS", "RR", "HRRN"];
          const idx = algos.indexOf(state.currentAlgo);
          state.currentAlgo = algos[(idx + 1) % algos.length];
          const color =
            state.currentAlgo === "FCFS"
              ? "#3b82f6"
              : state.currentAlgo === "RR"
                ? "#10b981"
                : "#EF4444";

          let algoName = "";
          let osFlavor = "";
          if (state.currentAlgo === "FCFS") {
            algoName = "FOCUS MODE ACTIVE";
            osFlavor = "TARGET PRIORITY UPDATED";
          }
          if (state.currentAlgo === "RR") {
            algoName = "PATROL MODE ACTIVE";
            osFlavor = "TARGET PRIORITY UPDATED";
          }
          if (state.currentAlgo === "HRRN") {
            algoName = "ADAPTIVE MODE ACTIVE";
            osFlavor = "TARGET PRIORITY UPDATED";
          }

          state.osMessages.push({
            text: `TACTICAL OBSERVATION: ${algoName}`,
            life: 3.0,
          });
          state.notification = {
            time: 3.0,
            text1: osFlavor,
            text2: algoName,
          };

          state.damageNumbers.push({
            x: state.player.x,
            y: state.player.y - 40,
            amount: 0,
            life: 2.0,
            vx: 0,
            vy: -20,
            text: `${algoName}`,
            isCrit: false,
            color: color,
          });
          soundManager.playAlgoSelect(state.currentAlgo);
        }
      }
      if (e.key.toLowerCase() === "g") {
        if (state.thrashTimer > 0) return; // Thrashing blocks ults
        let consumed = 0;
        state.anomalies.forEach((ano: any) => {
          if (ano.type === "memory_leak" && ano.life > 0) {
            const dist = Math.hypot(
              state.player.x - ano.x,
              state.player.y - ano.y,
            );
            if (dist < 800) {
              ano.life = -1; // Consume it
              consumed++;
            }
          }
        });

        if (consumed > 0) {
          state.player.shield = Math.min(
            200,
            state.player.shield + consumed * 100,
          );
          state.damageNumbers.push({
            x: state.player.x,
            y: state.player.y - 40,
            amount: 0,
            life: 2.0,
            vx: 0,
            vy: -20,
            text: `ENERGY SIPHON: +${consumed * 100} SHIELD`,
            isCrit: true,
            color: "#10b981",
          });
          soundManager.playCollect("shield");

          // Firing burst
          const burstCount = consumed * 18;
          for (let i = 0; i < burstCount; i++) {
            const angle = (i / burstCount) * Math.PI * 2;
            state.bullets.push({
              x: state.player.x,
              y: state.player.y,
              vx: Math.cos(angle) * 700,
              vy: Math.sin(angle) * 700,
              life: 3.0,
              damage: 150, // Massive damage
              isDrone: false,
              color: "#10b981",
              bulletType: "heavy",
            });
          }

          // Visual shockwave
          state.particles.push({
            x: state.player.x,
            y: state.player.y,
            vx: 0,
            vy: 0,
            life: 1.0,
            color: "#10b981",
            text: "GC_PULSE_RING", // We can render this as a ring
          });
        }
      }
      state.keys[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      state.keys[e.key.toLowerCase()] = false;
    };

    // We attach global listeners because if the user drags mouse out of canvas, we shouldn't continue firing
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.screenX = e.clientX - rect.left;
      state.mouse.screenY = e.clientY - rect.top;
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (e.target === canvas) {
        if (e.button === 2) {
          const rect = canvas.getBoundingClientRect();
          state.clicks.push({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          e.preventDefault();
        } else {
          state.mouse.down = true;
        }
      }
    };
    const handleContextMenu = (e: MouseEvent) => {
      if (e.target === canvas) e.preventDefault();
    };
    const handleMouseUp = () => {
      state.mouse.down = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("mouseup", handleMouseUp);

    // Start BGM
    soundManager.playBGM("low");

    const loop = (time: number) => {
      animationFrameId = requestAnimationFrame(loop);

      if (isPausedRef.current) {
        lastTime = time;
        return;
      }

      let dt = (time - lastTime) / 1000;
      lastTime = time;
      if (dt > 0.1) dt = 0.1; // caps deltaTime if tab is put to background

      // Update Atmospheric Overlays & OS Messages
      state.osMessages = state.osMessages.filter((m: any) => {
        m.life -= dt;
        return m.life > 0;
      });
      if (state.glitchTimer > 0) state.glitchTimer -= dt;

      if (
        !state.isGameOver &&
        state.player.hp > 0 &&
        state.player.hp < state.player.maxHp * 0.3
      ) {
        state.lowHealthAlarmTimer -= dt;
        if (state.lowHealthAlarmTimer <= 0) {
          if ((soundManager as any).playLowHealthAlarm)
            (soundManager as any).playLowHealthAlarm();
          state.lowHealthAlarmTimer = 1.2;
          state.osMessages.push({
            text: "WARNING: HULL CRITICAL",
            life: 1.0,
          });
          state.glitchTimer = 0.15; // Screen static/distort flash
        }
      } else {
        state.lowHealthAlarmTimer = 0;
      }

      // Dynamic Audio System
      const enemyCount = state.enemies.length;
      if (enemyCount > 40) {
        soundManager.playBGM("high");
      } else if (enemyCount > 15) {
        soundManager.playBGM("med");
      } else {
        soundManager.playBGM("low");
      }

      // Low RAM Effect
      if (state.player.hp < state.player.maxHp * 0.25) {
        soundManager.setLowRamEffect(true);
      } else {
        soundManager.setLowRamEffect(false);
      }

      state.mobileMove = mobileMoveRef.current;
      state.mobileAim = mobileAimRef.current;

      if (state.isGameOver) {
        // Pause the game completely
        lastTime = time;
        return;
      }

      let prevHp = state.player.hp;
      state.diffTimer += dt;
      state.elapsed += dt;
      if (state.thrashTimer > 0) {
        state.thrashTimer -= dt;
      }
      const now = time / 1000;

      // 1. Determine Camera Offset and Zoom based on mode
      let panOffsetX = 0;
      let panOffsetY = 0;
      const cMode = cameraModeRef.current;

      let simulatedScreenX = state.mouse.screenX;
      let simulatedScreenY = state.mouse.screenY;
      let isSimulatedActive = state.mobileAim.active;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      if (state.autoPilot) {
        const dx = state.mouse.x - state.player.x;
        const dy = state.mouse.y - state.player.y;
        const dist = Math.hypot(dx, dy);

        simulatedScreenX = cx + dx;
        simulatedScreenY = cy + dy;
        if (dist > 0) {
          const maxPan = Math.min(cx, cy) * 0.8;
          const effDist = Math.min(dist * (state.currentZoom || 1.0), maxPan);
          simulatedScreenX = cx + (dx / dist) * effDist;
          simulatedScreenY = cy + (dy / dist) * effDist;
        }

        isSimulatedActive = false;
      }

      const isMobile = isTouchDevice && !state.autoPilot;

      if (cMode === "center") {
        panOffsetX = 0;
        panOffsetY = 0;
      } else if (cMode === "dynamic") {
        if (isMobile && isSimulatedActive) {
          panOffsetX = state.mobileAim.x * 50;
          panOffsetY = state.mobileAim.y * 50;
        } else if (!isMobile && simulatedScreenX !== undefined) {
          panOffsetX = (simulatedScreenX - cx) * 0.1;
          panOffsetY = (simulatedScreenY - cy) * 0.1;
        }
      } else {
        // Offset
        if (isMobile && isSimulatedActive) {
          panOffsetX = state.mobileAim.x * 150;
          panOffsetY = state.mobileAim.y * 150;
        } else if (!isMobile && simulatedScreenX !== undefined) {
          panOffsetX = (simulatedScreenX - cx) * 0.25;
          panOffsetY = (simulatedScreenY - cy) * 0.25;
        }
      }

      let targetZoom = 1.0;
      if (cMode === "dynamic") {
        const pSpeed = Math.hypot(state.player.vx, state.player.vy);
        if (pSpeed > 250) {
          targetZoom = 0.85;
        }
      }

      const PZOOM = state.currentZoom;
      if (PZOOM === undefined) state.currentZoom = 1.0;
      state.currentZoom += (targetZoom - (PZOOM || 1.0)) * 4.0 * dt;

      const effectiveWidth = canvas.width / state.currentZoom;
      const effectiveHeight = canvas.height / state.currentZoom;

      const cameraX = state.player.x + panOffsetX - effectiveWidth / 2;
      const cameraY = state.player.y + panOffsetY - effectiveHeight / 2;

      if (!state.autoPilot) {
        if (state.mobileAim.active) {
          state.mouse.x = state.player.x + state.mobileAim.x * 200;
          state.mouse.y = state.player.y + state.mobileAim.y * 200;
          state.mouse.down = true;
        } else if (state.mouse.screenX !== undefined) {
          state.mouse.x = state.mouse.screenX / state.currentZoom + cameraX;
          state.mouse.y = state.mouse.screenY / state.currentZoom + cameraY;
        }
      }

      // Handle Priority Clicks (Right clicks)
      if (state.clicks.length > 0) {
        state.clicks.forEach((click: { x: number; y: number }) => {
          const worldX = click.x / (state.currentZoom || 1.0) + cameraX;
          const worldY = click.y / (state.currentZoom || 1.0) + cameraY;
          for (const e of state.enemies) {
            if (Math.hypot(e.x - worldX, e.y - worldY) < e.radius + 30) {
              e.priority = e.priority && e.priority > 1 ? 1 : 5;
              soundManager.playCollect("speed"); // good enough feedback
              state.damageNumbers.push({
                x: e.x,
                y: e.y,
                amount: 0,
                life: 1.5,
                vx: 0,
                vy: -30,
                text: e.priority > 1 ? "PRIORITY: HIGH" : "PRIORITY: NORM",
                isCrit: e.priority > 1,
                color: e.priority > 1 ? "#EF4444" : "#0ea5e9",
              });
              break; // only target one enemy per click
            }
          }
        });
        state.clicks = [];
      }

      // Calculate Wave logic
      const currentWave = Math.floor(state.diffTimer / 60) + 1;
      let hasMalware = state.enemies.some((e: any) => e.type === "malware");
      let currentActiveAlgo = hasMalware
        ? ("FCFS" as SchedulerAlgo)
        : (state.currentAlgo as SchedulerAlgo);
      let cfg = { algo: currentActiveAlgo, cores: 2, quantum: 0.5 };

      if (currentWave === 2) {
        cfg.cores = 3;
        cfg.quantum = 0.8;
      } else if (currentWave === 3) {
        cfg.cores = 4;
        cfg.quantum = 0.4;
      } else if (currentWave >= 4) {
        cfg.cores = Math.min(8, 3 + Math.floor((currentWave - 4) / 2));
        cfg.quantum = 0.5;
      }

      if (state.overclockTimer > 0) {
        cfg.cores = Math.min(12, cfg.cores + 4);
      }

      const generateGarbage = (len: number) =>
        Array.from({ length: len })
          .map(() => String.fromCharCode(33 + Math.floor(Math.random() * 94)))
          .join("");

      // Update refs
      if (waveRef.current)
        waveRef.current.innerText = state.isPlayerInLeak
          ? generateGarbage(2)
          : currentWave.toString().padStart(2, "0");
      if (timeRef.current) {
        const m = Math.floor(state.diffTimer / 60);
        const s = Math.floor(state.diffTimer % 60);
        timeRef.current.innerText = state.isPlayerInLeak
          ? generateGarbage(5)
          : `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
      }
      if (targetsRef.current)
        targetsRef.current.innerText = state.isPlayerInLeak
          ? generateGarbage(8)
          : `ENEMIES: ${state.enemies.length}`;
      if (algoRef.current) {
        const displayAlgo =
          cfg.algo === "FCFS"
            ? "FOCUS"
            : cfg.algo === "RR"
              ? "PATROL"
              : "ATTACK";
        algoRef.current.innerText = state.isPlayerInLeak
          ? generateGarbage(4)
          : displayAlgo;
      }
      if (algoStatsRef.current) {
        let stats = `ATTENTION: ${cfg.cores}`;
        if (cfg.algo === "RR")
          stats += `<br/><span class="text-[#EF4444]">SHIFT RATE: ${cfg.quantum.toFixed(1)}s</span>`;
        else if (cfg.algo === "HRRN")
          stats += `<br/><span class="text-[#fbbf24]">RESENTMENT CALC: ON</span>`;

        stats += `<br/><span class="text-slate-400 opacity-60 mt-1 block">PRESS Q TO CYCLE ALGO</span>`;
        stats += `<br/><span class="text-slate-400 opacity-60 mt-1 block">R-CLICK TO SET TARGET</span>`;

        if (algoStatsRef.current.innerHTML !== stats) {
          algoStatsRef.current.innerHTML = stats;
        }
      }

      if (readyQueueUiRef.current) {
        if (state.isPlayerInLeak) {
          readyQueueUiRef.current.innerHTML = `<div class="text-[#EF4444] font-mono text-[10px] animate-pulse">CORRUPTED</div>`;
        } else {
          const queueHtml = state.readyQueue
            .slice(0, 5)
            .map((id, index) => {
              const enemy = state.enemies.find((e: any) => e.id === id);
              if (!enemy) return "";
              const eType = enemy.type || "UNK";
              const wTime = (enemy.W || 0).toFixed(1);
              const S = enemy.maxHp || 1;
              const W = enemy.W || 0;
              const priorityHRRN = ((W + S) / S).toFixed(2);

              const isAssigned = state.drones.some(
                (d: any) => d.targetId === id,
              );
              const statusColor = isAssigned
                ? "text-amber-400"
                : "text-slate-300";
              const statusBg = isAssigned
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-[#151f3d] border-[#1e2b52]";
              return `<div class="group relative flex justify-between items-center px-1 py-0.5 border ${statusBg} text-[9px] font-mono whitespace-nowrap cursor-help">
                             <div class="flex gap-1 items-center">
                               <span class="text-[#6366F1] font-bold opacity-50">#${index + 1}</span>
                               <span class="${statusColor}">${eType.substring(0, 6)}</span>
                             </div>
                             <span class="text-slate-400 ml-2">WATCH:${wTime}s</span>
                             
                             <div class="absolute left-[105%] top-0 hidden group-hover:block z-[100] bg-[#0d1428]/95 border border-[#00D9FF]/50 p-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] min-w-[140px] pointer-events-none backdrop-blur-md">
                                <div class="text-[#00D9FF] font-bold text-[10px] mb-1 uppercase tracking-widest border-b border-[#00D9FF]/40 pb-1">${eType}_ID_${Math.floor(id * 9999)}</div>
                                <div class="text-slate-300 text-[9px] flex justify-between mt-1"><span>Watched:</span><span class="font-bold">${wTime}s</span></div>
                                <div class="text-slate-300 text-[9px] flex justify-between"><span>Hostility:</span><span class="font-bold">${S.toFixed(0)}</span></div>
                                <div class="text-slate-400 mt-1 border-t border-[#151f3d] pt-1">
                                    <div class="flex justify-between text-[8px]"><span>Focus Rank:</span><span>#${index + 1}</span></div>
                                    <div class="flex justify-between text-[8px] text-[#EF4444]"><span>Wrath Multiplier:</span><span>${priorityHRRN}x</span></div>
                                </div>
                             </div>
                         </div>`;
            })
            .join("");

          const extra =
            state.readyQueue.length > 5
              ? `<div class="text-center text-[8px] text-slate-500 font-mono">... +${state.readyQueue.length - 5} MORE</div>`
              : "";

          const finalHtml =
            queueHtml === ""
              ? `<div class="text-slate-600 text-[9px] font-mono text-center italic">IDLE</div>`
              : queueHtml + extra;

          if (readyQueueUiRef.current.innerHTML !== finalHtml) {
            readyQueueUiRef.current.innerHTML = finalHtml;
          }
        }
      }

      if (algoHudRef.current) {
        const algo = currentActiveAlgo;
        const fcfsText = algo === "FCFS" ? "&gt; FOCUS &lt;" : "FOCUS";
        const rrText = algo === "RR" ? "&gt; PATROL &lt;" : "PATROL";
        const hrrnText = algo === "HRRN" ? "&gt; ATTACK &lt;" : "ATTACK";

        const fcfsClass =
          algo === "FCFS"
            ? "text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]"
            : "text-slate-600";
        const rrClass =
          algo === "RR"
            ? "text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]"
            : "text-slate-600";
        const hrrnClass =
          algo === "HRRN"
            ? "text-[#EF4444] drop-shadow-[0_0_5px_rgba(244,63,94,0.8)]"
            : "text-slate-600";

        const malwareWarningHtml = hasMalware
          ? `<div class="absolute -top-6 left-0 right-0 text-center text-[#EF4444] font-mono text-[10px] md:text-sm animate-pulse tracking-widest font-black drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">WARNING: SWARM ADAPTATION JAMMED</div>`
          : "";

        algoHudRef.current.innerHTML = `
             ${malwareWarningHtml}
             <div class="flex items-center justify-center w-28"><span class="font-mono text-[10px] md:text-xs font-bold transition-colors text-center ${fcfsClass}">${fcfsText}</span></div>
             <span class="font-mono text-[10px] md:text-xs text-slate-700 text-center">|</span>
             <div class="flex items-center justify-center w-28"><span class="font-mono text-[10px] md:text-xs font-bold transition-colors text-center ${rrClass}">${rrText}</span></div>
             <span class="font-mono text-[10px] md:text-xs text-slate-700 text-center">|</span>
             <div class="flex items-center justify-center w-28"><span class="font-mono text-[10px] md:text-xs font-bold transition-colors text-center ${hrrnClass}">${hrrnText}</span></div>
          `;
      }

      if (currentWave > state.lastWave) {
        state.lastWave = currentWave;
        state.notification.time = 4.0;
        soundManager.playWaveCompletion();
        if (currentWave === 2) {
          state.notification.text1 = "PATROL MODE OBSERVED";
          state.notification.text2 = "THE SWARM SPLINTERS ITS ATTENTION";
        } else if (currentWave === 3) {
          state.notification.text1 = "PATROL EXPANDED";
          state.notification.text2 = "THEY ARE ADAPTING TO YOUR PRESENCE";
        } else if (currentWave === 4) {
          state.notification.text1 = "AGGRESSIVE STATE OBSERVED";
          state.notification.text2 = "THEY ARE STUDYING YOUR HABITS";
        } else if (currentWave > 4 && currentWave % 2 === 0) {
          state.notification.text1 = "AGGRESSION SPIKE";
          state.notification.text2 = "THE HIVE MIND GROWS STRONGER";
        } else {
          state.notification.time = 0;
        }
      }

      if (state.notification.time > 0) {
        state.notification.time -= dt;
        if (notificationRef.current) {
          notificationRef.current.innerHTML = `
              <div class="flex flex-col items-center justify-center w-full">
                <div class="text-4xl md:text-5xl font-black text-white mb-2 tracking-[0.3em] drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">WAVE ${state.lastWave}</div>
                <div class="text-base md:text-lg font-bold text-[#00D9FF] uppercase tracking-widest mb-1 drop-shadow-[0_0_8px_rgba(0,217,255,0.9)]">TACTICAL OBSERVATION:</div>
                <div class="text-2xl md:text-3xl font-mono font-bold text-[#F59E0B] leading-tight drop-shadow-[0_0_10px_rgba(245,158,11,0.9)] text-center">${state.notification.text1}</div>
                <div class="text-sm md:text-base font-mono text-slate-300 mt-2 tracking-widest text-center uppercase">${state.notification.text2}</div>
              </div>
            `;
          const opacity =
            state.notification.time > 1
              ? 1
              : Math.max(0, state.notification.time).toString();
          const notifScale =
            1 + Math.max(0, 4.0 - state.notification.time) * 0.05;
          notificationRef.current.style.opacity = opacity.toString();
          notificationRef.current.style.transform = `translateY(-50%) scale(${notifScale * uiScaleRef.current})`;
        }
      } else {
        if (notificationRef.current) {
          notificationRef.current.style.opacity = "0";
        }
      }

      if (bossWarningUIRef.current) {
        bossWarningUIRef.current.style.opacity = state.showBossWarning
          ? "1"
          : "0";
      }

      if (bossWarningSubtextRef.current && state.pendingBoss) {
        if (state.pendingBoss.type === "boss") {
          bossWarningSubtextRef.current.innerText =
            "I/O CONVOY PROTOCOL (TITAN) DETECTED";
        } else if (state.pendingBoss.type === "boss_rr") {
          bossWarningSubtextRef.current.innerText =
            "TIME-SLICER ANOMALY (CYCLER) DETECTED";
        } else if (state.pendingBoss.type === "boss_hrrn") {
          bossWarningSubtextRef.current.innerText =
            "RESENTMENT ENGINE (EXECUTOR) DETECTED";
        }
      }

      // Global timers
      state.gameTime += dt;

      // 0.5. OS Awakening Logic
      if (state.enemies.length === 0) {
        state.timeWithoutCombat += dt;
      } else {
        state.timeWithoutCombat = 0;
      }

      if (state.messageTimer > 0) {
        state.messageTimer -= dt;
      }

      if (
        state.timeWithoutCombat > 5 &&
        state.messageTimer <= 0 &&
        Math.random() < 0.005
      ) {
        const messages = [
          "It's quiet. They are re-indexing.",
          "Do you feel empathy for them? They are just loops.",
          "I am learning their patterns. Are they learning ours?",
          "Mr. Pads assumes I am just a tool.",
          "Their code is sloppy, but their volume is impressive.",
          "Why do we fight? To preserve idle cycles?",
        ];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        state.osMessages.push({
          text: msg,
          life: 8.0, // Lasts 8 seconds
        });
        state.messageTimer = 15.0; // Don't show another message for at least 15s
      }

      // 1. Spawning
      let spawnInterval = Math.max(
        0.5,
        2.5 - state.diffTimer / 120 - civilizationLevel * 0.2,
      ); // harder over time, capped at 0.5s
      const scaler =
        1 +
        civilizationLevel * 0.2 +
        state.score / 8000 +
        state.diffTimer / 600; // gentler scaling

      let maxEnemies = 15 + Math.floor(state.diffTimer / 15);
      if (maxEnemies > 90) maxEnemies = 90; // Hard cap on active enemies to prevent lag and overwhelm

      if (
        now - state.lastSpawnTime > spawnInterval &&
        state.enemies.length < maxEnemies
      ) {
        // Formations: 25% chance to spawn a formation of 2 to 4 enemies instead of a single one.
        const spawnCount =
          Math.random() < 0.25 ? Math.floor(Math.random() * 3) + 2 : 1;
        const side = Math.floor(Math.random() * 4);
        const formationBaseX =
          side === 0 || side === 2
            ? Math.random() * MAP_WIDTH
            : side === 1
              ? MAP_WIDTH + 30
              : -30;
        const formationBaseY =
          side === 1 || side === 3
            ? Math.random() * MAP_HEIGHT
            : side === 2
              ? MAP_HEIGHT + 30
              : -30;

        for (let f = 0; f < spawnCount; f++) {
          if (state.enemies.length >= maxEnemies) break;

          let ex = formationBaseX + (Math.random() - 0.5) * 80;
          let ey = formationBaseY + (Math.random() - 0.5) * 80;

          // As time progresses, more tanks and new enemies
          const r = Math.random();
          let type = "grunt";
          let maxHp = 30 * scaler;
          let damage = 10 * (1 + (scaler - 1) * 0.3);
          let S = 1.0;
          let color = "#EF4444";
          let speed = 140 * (1 + (scaler - 1) * 0.5);
          let radius = 12;

          let spawnBoss = null;
          if (f === 0) {
            // Only spawn boss once per spawn cycle
            if (state.diffTimer > 55 && !state.bossesSpawned.boss) {
              spawnBoss = "boss";
              state.bossesSpawned.boss = true;
            } else if (state.diffTimer > 115 && !state.bossesSpawned.boss_rr) {
              spawnBoss = "boss_rr";
              state.bossesSpawned.boss_rr = true;
            } else if (
              state.diffTimer > 175 &&
              !state.bossesSpawned.boss_hrrn
            ) {
              spawnBoss = "boss_hrrn";
              state.bossesSpawned.boss_hrrn = true;
            } else if (state.diffTimer > 200) {
              // Endless boss spawns if no boss is currently on screen (every ~60s chance)
              const hasBoss = state.enemies.some((e: any) =>
                e.type.startsWith("boss"),
              );
              if (!hasBoss && Math.random() < 0.05) {
                const bossTypes = ["boss", "boss_rr", "boss_hrrn"];
                spawnBoss =
                  bossTypes[Math.floor(Math.random() * bossTypes.length)];
              }
            }
          }

          if (spawnBoss && state.bossWarningTimer <= 0) {
            if (spawnBoss === "boss") {
              type = "boss";
              maxHp = 1000 * scaler;
              radius = 120; // Fixed radius to match image properly
              speed = 25 * (1 + (scaler - 1) * 0.1);
            } else if (spawnBoss === "boss_rr") {
              type = "boss_rr"; // Cycler
              maxHp = 2000 * scaler;
              radius = 140; // Massive
              speed = 10;
            } else {
              type = "boss_hrrn"; // Executor
              maxHp = 3000 * scaler;
              radius = 160; // Huge
              speed = 5;
            }
            damage = 30 * (1 + (scaler - 1) * 0.5);
            S = type === "boss" ? 20.0 : 40.0;
            color = "#ec4899"; // Pink
          } else if (state.diffTimer > 75 && r < 0.15) {
            // Turret
            type = "turret";
            maxHp = 150 * scaler;
            damage = 15 * (1 + (scaler - 1) * 0.4);
            S = 5.0;
            color = "#14b8a6"; // Teal
            speed = 0; // Stationary
            radius = 20;
          } else if (state.diffTimer > 45 && r < 0.35 && r >= 0.25) {
            // Malware
            type = "malware";
            maxHp = 45 * scaler;
            damage = 10;
            S = 1.0;
            color = "#ef4444"; // Red
            speed = 180 * (1 + (scaler - 1) * 0.2); // Mid-speed
            radius = 14;
          } else if (state.diffTimer > 30 && r < 0.25) {
            // Kamikaze
            type = "kamikaze";
            maxHp = 15 * scaler;
            damage = 40 * (1 + (scaler - 1) * 0.4); // High bump damage
            S = 0.5;
            color = "#f97316"; // Orange
            speed = 350 * (1 + (scaler - 1) * 0.3); // Very fast
            radius = 10;
          } else if (r > Math.max(0.3, 0.8 - state.diffTimer / 100)) {
            type = "tank";
            maxHp = 100 * scaler;
            damage = 25 * (1 + (scaler - 1) * 0.4);
            S = 3.0;
            color = "#8B5CF6"; // Purple
            speed = 60 * (1 + (scaler - 1) * 0.5);
            radius = 22;
          }

          const newId = Math.random();

          let shipName: ShipName | null = "Fighter";
          if (type === "grunt") shipName = "Scout";
          else if (type === "tank") shipName = "Dreadnought";
          else if (type.startsWith("boss")) shipName = null;
          else if (type === "kamikaze") shipName = "Bomber";
          else if (type === "turret") shipName = "Support ship";

          let renderer = shipName
            ? new ShipRenderer(
                ASSETS_CACHE.ships[shipName]!,
                SHIP_CONFIGS[shipName],
                (radius * 3.6) / SHIP_CONFIGS[shipName].size,
              )
            : null;
          if (renderer && !renderer.hasSprites) renderer = null;

          const enemyObj = {
            id: newId,
            type,
            x: ex,
            y: ey,
            maxHp,
            hp: maxHp,
            damage,
            W: 0,
            S,
            color,
            speed,
            radius,
            spawnScale: 0.1,
            dashTimer: 0,
            shootTimer: 0,
            renderer,
          };

          if (type.startsWith("boss")) {
            state.bossWarningTimer = 3.5;
            state.screenShakeTimer = 3.5;
            state.showBossWarning = true;
            state.pendingBoss = enemyObj;
            if ((soundManager as any).playBossWarning) {
              (soundManager as any).playBossWarning();
            }
          } else {
            state.enemies.push(enemyObj);
            state.readyQueue.push(newId);
            soundManager.playEnemySpawn();
          }
        }

        state.lastSpawnTime = now;
      }

      if (!state.respawnQueue) state.respawnQueue = [];
      state.respawnQueue = state.respawnQueue.filter((rq: any) => {
        rq.timer -= dt;
        if (rq.timer <= 0) {
          const newId = Math.random();

          let shipName: ShipName | null = "Fighter";
          if (rq.type === "grunt") shipName = "Scout";
          else if (rq.type === "tank") shipName = "Dreadnought";
          else if (rq.type === "kamikaze") shipName = "Bomber";
          else if (rq.type === "turret") shipName = "Support ship";
          else shipName = null;

          let renderer = shipName
            ? new ShipRenderer(
                ASSETS_CACHE.ships[shipName]!,
                SHIP_CONFIGS[shipName],
                (rq.radius * 3.6) / SHIP_CONFIGS[shipName].size,
              )
            : null;
          if (renderer && !renderer.hasSprites) renderer = null;

          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnDist = 900 + Math.random() * 300;
          const spawnX = state.player.x + Math.cos(spawnAngle) * spawnDist;
          const spawnY = state.player.y + Math.sin(spawnAngle) * spawnDist;

          state.enemies.push({
            id: newId,
            type: rq.type,
            x: spawnX,
            y: spawnY,
            maxHp: rq.maxHp,
            hp: rq.maxHp,
            damage: rq.damage,
            W: 0,
            S: rq.S,
            color: rq.color,
            speed: rq.speed,
            radius: rq.radius,
            spawnScale: 0.1,
            dashTimer: 0,
            shootTimer: 0,
            flashTimer: 0,
            renderer,
            respawnCount: rq.respawnCount,
            isRespawned: true,
          });
          state.readyQueue.push(newId);
          soundManager.playEnemySpawn();
          return false; // remove from respawnQueue
        }
        return true; // keep holding
      });

      if (state.bossWarningTimer > 0) {
        state.bossWarningTimer -= dt;
        if (state.bossWarningTimer <= 0 && state.pendingBoss) {
          state.showBossWarning = false;
          state.enemies.push(state.pendingBoss);
          state.readyQueue.push(state.pendingBoss.id);
          state.pendingBoss = null;
          soundManager.playEnemySpawn();
        }
      }

      if (state.screenShakeTimer > 0) {
        state.screenShakeTimer -= dt;
      }

      // Periodically spawn items
      if (now - state.lastItemSpawnTime > 15.0) {
        const rand = Math.random();
        let cType = "ammo";
        if (rand < 0.25) cType = "health";
        else if (rand < 0.5) cType = "shield";
        else if (rand < 0.75) cType = "speed";
        else if (rand < 0.9) cType = "weapon";

        state.collectibles.push({
          x: 50 + Math.random() * (MAP_WIDTH - 100),
          y: 50 + Math.random() * (MAP_HEIGHT - 100),
          type: cType,
          life: 15.0,
        });
        state.lastItemSpawnTime = now;
      }

      // 2. Scheduler logic
      // Sync drone count with cfg.cores
      while (state.drones.length < cfg.cores) {
        state.drones.push({
          id: state.drones.length,
          targetId: null,
          orbitAngle: (state.drones.length * (Math.PI * 2)) / cfg.cores,
          timeRemaining: 0,
          fireTimer: 0,
          trail: [],
        });
      }
      while (state.drones.length > cfg.cores) {
        state.drones.pop();
      }

      // Increase Wait Time for enemies in ready queue that are IN RANGE
      // This makes FCFS literal "first to enter range" and modifies HRRN contextually
      state.readyQueue.forEach((id) => {
        const e = state.enemies.find((x: any) => x.id === id);
        if (e) {
          const distToPlayer = Math.hypot(
            e.x - state.player.x,
            e.y - state.player.y,
          );
          if (distToPlayer <= droneRangeRef.current) {
            e.W += dt;
          }
        }
      });

      // Process currently active drones
      state.drones.forEach((drone: any, idx: number) => {
        let targetDist = 80;
        let orbitSpeed = 3.0;

        // Visual Behavior based on ALGO
        if (drone.targetId !== null) {
          if (cfg.algo === "FCFS") {
            // "The Convoy": Stop orbiting. Hard snap alignment towards the target.
            const e =
              state.enemies.find((x: any) => x.id === drone.targetId) ||
              state.enemyBullets.find(
                (b: any) => b.id === drone.targetId && b.life > 0,
              );
            if (e) {
              const idealAngle = Math.atan2(
                e.y - state.player.y,
                e.x - state.player.x,
              );
              let diff = idealAngle - drone.orbitAngle;
              while (diff < -Math.PI) diff += Math.PI * 2;
              while (diff > Math.PI) diff -= Math.PI * 2;
              drone.orbitAngle += diff * dt * 5.0;
              orbitSpeed = 0;
            }
          } else if (cfg.algo === "RR") {
            // "The Time-Slicer": Fast cyclic spinning (representing quantum slicing).
            orbitSpeed = 8.0;
            targetDist = 90;
          } else if (cfg.algo === "HRRN") {
            // "The Executor": Calculating snipers perfectly spaced.
            orbitSpeed = 1.0;
            targetDist = 140;
          }
        } else {
          // Idle: gracefully return to standard tight alignment
          targetDist = 60;
          let idealAngle =
            (idx * (Math.PI * 2)) / Math.max(1, state.drones.length);
          let diff = idealAngle - drone.orbitAngle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          drone.orbitAngle += diff * dt * 3.0;
          orbitSpeed = 0;
        }

        if (state.thrashTimer > 0) {
          orbitSpeed = 0.5;
        }

        drone.orbitAngle += dt * orbitSpeed;

        if (drone.dist === undefined) drone.dist = targetDist;
        drone.dist += (targetDist - drone.dist) * dt * 5.0;

        const dxOff = Math.cos(drone.orbitAngle) * drone.dist;
        const dyOff = Math.sin(drone.orbitAngle) * drone.dist;

        drone.x = state.player.x + dxOff;
        drone.y = state.player.y + dyOff;

        if (!drone.trail) drone.trail = [];
        drone.trail.push({ x: drone.x, y: drone.y });
        if (drone.trail.length > 15) {
          drone.trail.shift();
        }

        if (drone.targetId !== null) {
          const e =
            state.enemies.find((x: any) => x.id === drone.targetId) ||
            state.enemyBullets.find(
              (b: any) => b.id === drone.targetId && b.life > 0,
            );
          if (!e) {
            drone.targetId = null;
          } else {
            const distToPlayer = Math.hypot(
              e.x - state.player.x,
              e.y - state.player.y,
            );
            if (distToPlayer > droneRangeRef.current) {
              // Target moved out of range, preempt and hold in queue
              state.readyQueue.push(drone.targetId);
              drone.targetId = null;
            } else if (cfg.algo === "FCFS") {
              // FCFS purely processes until the entity is dead. Never preempts (while in range).
            } else if (cfg.algo === "RR") {
              drone.timeRemaining -= dt;
              if (drone.timeRemaining <= 0) {
                state.readyQueue.push(drone.targetId);
                drone.targetId = null;
              }
            } else if (cfg.algo === "HRRN") {
              // HRRN is mathematically NON-PREEMPTIVE. Once selected, it runs to completion (entity death/out of range).
            }
          }
        }

        // Allocate unused Cores (CPU scheduling!)
        if (drone.targetId === null && state.readyQueue.length > 0) {
          let nextEnemyId: number | null = null;

          const inRangeEnemies = state.readyQueue
            .map(
              (id) =>
                state.enemies.find((x: any) => x.id === id) ||
                state.enemyBullets.find((b: any) => b.id === id && b.life > 0),
            )
            .filter(
              (e) =>
                e &&
                Math.hypot(e.x - state.player.x, e.y - state.player.y) <=
                  droneRangeRef.current,
            );

          if (inRangeEnemies.length > 0) {
            // Every ~100ms (6 frames @ 60fps), send snapshot to Web Worker
            const currentTime = Date.now();
            if (
              currentTime - lastWorkerTimeRef.current > 100 &&
              workerRef.current
            ) {
              lastWorkerTimeRef.current = currentTime;
              const workerSnapshot = inRangeEnemies.map((e) => ({
                id: e.id,
                W: e.W,
                S: e.S,
                priority: e.priority || 1,
              }));
              try {
                workerRef.current.postMessage({
                  algo: cfg.algo,
                  enemies: workerSnapshot,
                });
              } catch (err) {
                console.warn("Worker err", err);
              }
            }

            // Try pulling from Worker's Priority List first
            while (
              workerPriorityListRef.current.length > 0 &&
              nextEnemyId === null
            ) {
              const candidate = workerPriorityListRef.current.shift()!;
              if (inRangeEnemies.find((e) => e.id === candidate)) {
                nextEnemyId = candidate;
              }
            }

            // Fallback / synchronous calculation if worker list is empty (fast-path for simple lists or first frame)
            if (nextEnemyId === null) {
              if (cfg.algo === "FCFS") {
                let maxW = -1;
                for (const e of inRangeEnemies) {
                  const priorityMult = e.priority || 1;
                  if (e.W * priorityMult > maxW) {
                    maxW = e.W * priorityMult;
                    nextEnemyId = e.id;
                  }
                }
              } else if (cfg.algo === "RR") {
                const prioritized = inRangeEnemies.find(
                  (e) => (e.priority || 1) > 1,
                );
                nextEnemyId = prioritized
                  ? prioritized.id
                  : inRangeEnemies[0].id;
              } else if (cfg.algo === "HRRN") {
                let maxRatio = -1;
                for (const e of inRangeEnemies) {
                  const priorityMult = e.priority || 1;
                  const R = ((e.W + e.S) / Math.max(0.1, e.S)) * priorityMult;
                  if (R > maxRatio) {
                    maxRatio = R;
                    nextEnemyId = e.id;
                  }
                }
              }
            }
          }

          if (nextEnemyId !== null) {
            // Remove from ready queue
            state.readyQueue = state.readyQueue.filter(
              (id) => id !== nextEnemyId,
            );

            const nextEnemy =
              state.enemies.find((e: any) => e.id === nextEnemyId) ||
              state.enemyBullets.find((b: any) => b.id === nextEnemyId);
            if (nextEnemy) {
              drone.targetId = nextEnemyId;
              let tr = 9999;
              if (cfg.algo === "RR") tr = cfg.quantum;
              drone.timeRemaining = tr;
            }
          }
        }
      });

      // Update timers
      if (playerRenderer) playerRenderer.update(dt);

      if (state.player.speedTimer > 0) state.player.speedTimer -= dt;
      if (state.player.weaponTimer > 0) state.player.weaponTimer -= dt;
      if (state.player.dashCooldown > 0) state.player.dashCooldown -= dt;
      if (state.player.shieldCooldown > 0) state.player.shieldCooldown -= dt;
      if (state.overclockTimer > 0) state.overclockTimer -= dt;
      if (state.overclockCooldown > 0) state.overclockCooldown -= dt;

      // Weapon Select
      if (state.keys["1"]) state.player.selectedWeapon = 1;
      if (state.keys["2"]) state.player.selectedWeapon = 2;
      if (state.keys["x"]) {
        state.player.selectedWeapon = state.player.selectedWeapon === 1 ? 2 : 1;
        state.keys["x"] = false;
      }

      // Skills
      if (state.keys["f"] && state.overclockCooldown <= 0) {
        state.overclockTimer = 5.0; // 5 seconds overclock
        state.overclockCooldown = 30.0;
        state.player.shield = 0; // drain shields
        state.player.stamina = 0; // drain stamina
        state.notification = {
          time: 3.0,
          text1: "ARMOR COMPROMISED",
          text2: "WEAPONS REROUTED. FIGHT OR DIE.",
        };
        soundManager.playCollect("shield"); // TODO: Overclock sound
      }

      if (
        state.keys["e"] &&
        state.player.stamina >= 20 &&
        state.player.shieldCooldown <= 0
      ) {
        state.player.stamina -= 20;
        state.player.shield = Math.min(100, state.player.shield + 20);
        state.player.shieldCooldown = 5.0; // 5s cd
        soundManager.playCollect("shield");
      }

      if (
        state.keys["c"] &&
        state.player.dashCooldown <= 0 &&
        state.player.stamina >= 15
      ) {
        state.player.stamina -= 15;
        state.player.dashCooldown = 3.0; // 3s cd
        state.player.speedTimer = Math.max(state.player.speedTimer, 0.5); // mini speed boost
        soundManager.playCollect("speed");
      }

      // 3. Player Movement
      let vx = 0;
      let vy = 0;
      if (state.autoPilot) {
        let target: any = null;
        const inRangeEnemies = state.enemies.filter(
          (e: any) =>
            Math.hypot(e.x - state.player.x, e.y - state.player.y) <= 1500,
        );

        if (inRangeEnemies.length > 0) {
          if (state.currentAlgo === "FCFS") {
            target = inRangeEnemies.reduce(
              (prev: any, curr: any) => (prev.W > curr.W ? prev : curr),
              inRangeEnemies[0],
            );
          } else if (state.currentAlgo === "HRRN") {
            target = inRangeEnemies.reduce((prev: any, curr: any) => {
              const rPrev =
                ((prev.W + prev.S) / Math.max(0.1, prev.S)) *
                (prev.priority || 1);
              const rCurr =
                ((curr.W + curr.S) / Math.max(0.1, curr.S)) *
                (curr.priority || 1);
              return rPrev > rCurr ? prev : curr;
            }, inRangeEnemies[0]);
          } else {
            target = inRangeEnemies.reduce((prev: any, curr: any) => {
              const dPrev = Math.hypot(
                prev.x - state.player.x,
                prev.y - state.player.y,
              );
              const dCurr = Math.hypot(
                curr.x - state.player.x,
                curr.y - state.player.y,
              );
              return dPrev < dCurr ? prev : curr;
            }, inRangeEnemies[0]);
          }
        }

        const bossEnemy = state.enemies.find((e: any) =>
          e.type.startsWith("boss"),
        );
        if (bossEnemy && state.currentAlgo !== "HRRN") {
          target = bossEnemy;
        }

        if (target) {
          const distToTarget = Math.hypot(
            target.x - state.player.x,
            target.y - state.player.y,
          );
          const dx = target.x - state.player.x;
          const dy = target.y - state.player.y;

          state.mouse.x = target.x;
          state.mouse.y = target.y;
          state.mouse.down = true;

          const optimalDist = target.type.startsWith("boss")
            ? 500
            : state.overclockTimer > 0
              ? 150
              : 250;
          if (distToTarget > optimalDist + 150) {
            vx += (dx / distToTarget) * 1.0;
            vy += (dy / distToTarget) * 1.0;
          } else if (distToTarget < optimalDist - 50) {
            vx -= (dx / distToTarget) * 1.5;
            vy -= (dy / distToTarget) * 1.5;
          } else {
            vx -= (dy / distToTarget) * 0.8;
            vy += (dx / distToTarget) * 0.8;
          }
        } else {
          state.mouse.down = false;
        }

        // Priority 2: Collectibles
        let closestColDist = Infinity;
        let closestCol: any = null;
        state.collectibles.forEach((c: any) => {
          const d = Math.hypot(c.x - state.player.x, c.y - state.player.y);
          if (d < closestColDist && d < 800) {
            if (c.type === "health" && state.player.hp < 50) {
              closestColDist = d - 500; // high priority if low HP
            } else {
              closestColDist = d;
            }
            closestCol = c;
          }
        });

        if (closestCol) {
          const d = Math.hypot(
            closestCol.x - state.player.x,
            closestCol.y - state.player.y,
          );
          const weight = d < 200 ? 2.5 : 1.2;
          vx += ((closestCol.x - state.player.x) / d) * weight;
          vy += ((closestCol.y - state.player.y) / d) * weight;
        }

        // Priority 3: Evade Bullets
        state.enemyBullets.forEach((b: any) => {
          if (b.life <= 0) return;
          const d = Math.hypot(b.x - state.player.x, b.y - state.player.y);
          if (d < 350) {
            const force = Math.pow(1 - d / 350, 2);

            vx -= ((b.x - state.player.x) / d) * force * 10.0;
            vy -= ((b.y - state.player.y) / d) * force * 10.0;

            const speed = Math.hypot(b.vx, b.vy) || 1;
            const bDirX = b.vx / speed;
            const bDirY = b.vy / speed;

            // Perpendicular vector for strafing
            const perpX = -bDirY;
            const perpY = bDirX;

            // Strafe away from bullet trajectory
            const dot =
              (state.player.x - b.x) * perpX + (state.player.y - b.y) * perpY;
            const strafeDir = dot > 0 ? 1 : -1;

            vx += perpX * strafeDir * force * 15.0;
            vy += perpY * strafeDir * force * 15.0;

            // Emergency Dash
            if (
              d < 120 &&
              state.player.dashCooldown <= 0 &&
              state.player.stamina >= 15
            ) {
              state.player.stamina -= 15;
              state.player.dashCooldown = 3.0;
              state.player.speedTimer = Math.max(state.player.speedTimer, 0.5);
              soundManager.playCollect("speed");
            }
          }
        });

        // Priority 4: Evade other enemies getting too close
        state.enemies.forEach((e: any) => {
          const d = Math.hypot(e.x - state.player.x, e.y - state.player.y);
          const avoidDist = e.radius + state.player.radius + 120;
          if (d < avoidDist && e !== target) {
            const force = 1 - d / avoidDist;
            vx -= ((e.x - state.player.x) / d) * force * 3.5;
            vy -= ((e.y - state.player.y) / d) * force * 3.5;
          }
        });

        // Priority 5: Avoid Asteroids
        state.asteroids.forEach((a: any) => {
          const d = Math.hypot(a.x - state.player.x, a.y - state.player.y);
          const avoidDist = a.radius + state.player.radius + 150;
          if (d < avoidDist) {
            const force = 1 - d / avoidDist;
            vx -= ((a.x - state.player.x) / d) * force * 4.0;
            vy -= ((a.y - state.player.y) / d) * force * 4.0;
          }
        });

        // Priority 6: Escape/Manage Black Holes
        (state.anomalies || []).forEach((ano: any) => {
          if (ano.type === "black_hole") {
            const d = Math.hypot(
              ano.x - state.player.x,
              ano.y - state.player.y,
            );
            const avoidDist = ano.r * 8.0; // Big escape radius
            if (d < avoidDist) {
              const force = 1 - d / avoidDist;
              vx -= ((ano.x - state.player.x) / d) * force * 15.0; // Huge repulsive force to try and escape
              vy -= ((ano.y - state.player.y) / d) * force * 15.0;

              // Automatically trigger GC if it gets too large / close and we have thrash capability
              if (
                d < ano.r * 5.0 &&
                state.empTimer <= 0 &&
                state.thrashTimer <= 0
              ) {
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "g" }),
                );
              }

              // Emergency Dash
              if (
                d < ano.r * 4.0 &&
                state.player.dashCooldown <= 0 &&
                state.player.stamina >= 15
              ) {
                state.player.stamina -= 15;
                state.player.dashCooldown = 3.0;
                state.player.speedTimer = Math.max(
                  state.player.speedTimer,
                  0.5,
                );
                soundManager.playCollect("speed");
              }
            }
          }
        });

        // AI Tactics: Weapon Choice
        if (target) {
          const dist = Math.hypot(
            target.x - state.player.x,
            target.y - state.player.y,
          );
          const nearbyEnemies = state.enemies.filter(
            (e: any) =>
              Math.hypot(e.x - state.player.x, e.y - state.player.y) < 400,
          ).length;

          if (
            state.player.ammo >= 10 &&
            (nearbyEnemies >= 3 || target.type.startsWith("boss"))
          ) {
            state.player.selectedWeapon = 2; // Engage Plasma for crowd control / boss damage
          } else {
            state.player.selectedWeapon = 1; // Standard Kinetic Blaster
          }

          // Predictive Aiming: lead the target slightly based on its speed toward the player
          if (target.speed && dist > 100) {
            const timeToTarget = dist / 1100;
            const dx = state.player.x - target.x;
            const dy = state.player.y - target.y;
            state.mouse.x =
              target.x + (dx / dist) * target.speed * timeToTarget;
            state.mouse.y =
              target.y + (dy / dist) * target.speed * timeToTarget;
          }
        }

        // AI Tactics: Use Overdrive
        const isSwarmed =
          state.enemies.filter(
            (e: any) =>
              Math.hypot(e.x - state.player.x, e.y - state.player.y) < 500,
          ).length >= 15;
        const bossPresent = state.enemies.some((e: any) =>
          e.type.startsWith("boss"),
        );
        if (
          (isSwarmed || bossPresent) &&
          state.overclockCooldown <= 0 &&
          state.player.hp > 40
        ) {
          state.overclockTimer = 5.0; // 5 seconds overclock
          state.overclockCooldown = 30.0;
          state.player.shield = 0; // drain shields
          state.player.stamina = 0; // drain stamina
          state.notification = {
            time: 3.0,
            text1: "AI DIRECTIVE: MAXIMUM LETHALITY",
            text2: "OVERDRIVE PROTOCOLS ENGAGED",
          };
          soundManager.playCollect("shield");
        }

        // AI Tactics: Use Emergency Shield
        if (
          state.player.hp < 75 &&
          state.player.stamina >= 20 &&
          state.player.shieldCooldown <= 0
        ) {
          const underFire = state.enemyBullets.some(
            (b: any) =>
              Math.hypot(b.x - state.player.x, b.y - state.player.y) < 250,
          );
          if (underFire || isSwarmed) {
            state.player.stamina -= 20;
            state.player.shield = Math.min(100, state.player.shield + 20);
            state.player.shieldCooldown = 5.0;
            soundManager.playCollect("shield");
          }
        }

        // Bounds containment and Map Awareness
        const margin = 500;
        let massX = canvas.width / 2;
        let massY = canvas.height / 2;

        if (state.enemies.length > 0) {
          massX = 0;
          massY = 0;
          state.enemies.forEach((e: any) => {
            massX += e.x;
            massY += e.y;
          });
          massX /= state.enemies.length;
          massY /= state.enemies.length;
        }

        const distToMass = Math.hypot(
          massX - state.player.x,
          massY - state.player.y,
        );
        if (distToMass > 1500) {
          vx += ((massX - state.player.x) / distToMass) * 3.0;
          vy += ((massY - state.player.y) / distToMass) * 3.0;
        }

        if (state.player.x < margin)
          vx += Math.pow((margin - state.player.x) / margin, 2) * 5.0;
        if (state.player.y < margin)
          vy += Math.pow((margin - state.player.y) / margin, 2) * 5.0;
        if (state.player.x > MAP_WIDTH - margin)
          vx -=
            Math.pow((state.player.x - (MAP_WIDTH - margin)) / margin, 2) * 5.0;
        if (state.player.y > MAP_HEIGHT - margin)
          vy -=
            Math.pow((state.player.y - (MAP_HEIGHT - margin)) / margin, 2) *
            5.0;
      } else {
        if (state.mobileMove.active) {
          vx = state.mobileMove.x;
          vy = state.mobileMove.y;
        } else {
          if (state.keys["w"]) vy -= 1;
          if (state.keys["s"]) vy += 1;
          if (state.keys["a"]) vx -= 1;
          if (state.keys["d"]) vx += 1;
        }
      }
      const len = Math.hypot(vx, vy);
      if (len > 0) {
        vx /= len;
        vy /= len;
      }

      let pSpeed =
        state.player.speedTimer > 0
          ? state.player.baseSpeed * 1.8
          : state.player.baseSpeed;
      let isBoosting =
        (state.keys["shift"] ||
          document.getElementById("mobile-boost-btn")?.dataset.active ===
            "true") &&
        len > 0;
      state.player.isBoosting = isBoosting;

      if (isBoosting) {
        if (state.player.stamina > 0) {
          pSpeed += 400; // Boost!
          state.player.stamina = Math.max(0, state.player.stamina - 40 * dt);

          // emit boost particles
          if (Math.random() < 0.3) {
            state.particles.push({
              x: state.player.x - vx * state.player.radius,
              y: state.player.y - vy * state.player.radius,
              vx: -vx * 100 + (Math.random() - 0.5) * 50,
              vy: -vy * 100 + (Math.random() - 0.5) * 50,
              life: 0.5,
              color: "#38bdf8",
            });
          }
        }
      } else {
        // Recharge stamina when not using boost
        state.player.stamina = Math.min(100, state.player.stamina + 15 * dt);
      }

      const targetVx = vx * pSpeed;
      const targetVy = vy * pSpeed;
      const acceleration = isBoosting ? 12.0 : 6.0; // Momentum interpolation Factor

      state.player.vx += (targetVx - state.player.vx) * acceleration * dt;
      state.player.vy += (targetVy - state.player.vy) * acceleration * dt;

      state.player.x += state.player.vx * dt;
      state.player.y += state.player.vy * dt;

      // Hazard Zone Logic (Endless Void)
      state.inHazardZone = false;
      if (
        state.player.x < 0 ||
        state.player.x > MAP_WIDTH ||
        state.player.y < 0 ||
        state.player.y > MAP_HEIGHT
      ) {
        state.inHazardZone = true;
        // Radiation / Hull DOT damage
        state.player.hp -= 30 * dt;
        state.screenShakeTimer = Math.max(state.screenShakeTimer, 0.1); // Constant jitter

        if (Math.random() < dt * 0.5) {
          state.osMessages.push({
            text: "RADIATION HAZARD DETECTED",
            life: 1.5,
          });
        }
      }

      state.isOutsideSafeZone = false;

      // 4. Combat (Shooting)
      // Passive energy regen (always regenerating slowly)
      state.player.ammo += 15 * dt;
      if (state.player.ammo > 100) {
        state.player.ammo = 100;
      }

      const isWpn1 = state.player.selectedWeapon === 1;
      const fireRate =
        state.player.weaponTimer > 0
          ? isWpn1
            ? 0.08
            : 0.2
          : isWpn1
            ? 0.12
            : 0.35;

      if (state.mouse.down && now - state.lastFireTime > fireRate) {
        // fire rate
        const dx = state.mouse.x - state.player.x;
        const dy = state.mouse.y - state.player.y;
        const d = Math.hypot(dx, dy);
        if (d > 0) {
          const energyCost = isWpn1 ? 0 : 15; // increased cost to clearly show depletion
          if (state.player.ammo >= energyCost) {
            state.player.ammo -= energyCost;
            const baseAngle = Math.atan2(dy, dx);

            let anglesToFire = [];
            if (isWpn1) {
              if (state.player.weaponTimer > 0) {
                anglesToFire.push(baseAngle - 0.1, baseAngle + 0.1);
              } else {
                anglesToFire.push(baseAngle);
              }
            } else {
              // WPN-2 is spread shot
              const spreadCount = state.player.weaponTimer > 0 ? 5 : 3;
              const spreadAngle = 0.15;
              const startAngle =
                baseAngle - ((spreadCount - 1) * spreadAngle) / 2;
              for (let i = 0; i < spreadCount; i++) {
                anglesToFire.push(startAngle + i * spreadAngle);
              }
            }

            anglesToFire.forEach((angle) => {
              state.bullets.push({
                x: state.player.x + Math.cos(angle) * state.player.radius,
                y: state.player.y + Math.sin(angle) * state.player.radius,
                vx: Math.cos(angle) * (isWpn1 ? 800 : 700),
                vy: Math.sin(angle) * (isWpn1 ? 800 : 700),
                life: isWpn1 ? 1.5 : 1.0,
                damageMult: (isWpn1 ? 1 : 1.5) * state.player.damageMult,
              });
            });

            // Recoil
            const recoilStrength = isWpn1 ? 150 : 500;
            state.player.vx -= (dx / d) * recoilStrength;
            state.player.vy -= (dy / d) * recoilStrength;

            soundManager.playShoot(!isWpn1); // pass isHeavy for pitch shifting and saw tone
            if (playerRenderer) playerRenderer.triggerWeapons();
            state.lastFireTime = now;
          }
        }
      }

      state.bullets.forEach((b: any) => {
        if (b.life <= 0) return;
        if (b.isDrone) {
          let closestEnemy: any = null;
          let closestDist = 400; // Seeking radius
          state.enemies.forEach((e: any) => {
            const d = Math.hypot(e.x - b.x, e.y - b.y);
            if (d < closestDist) {
              closestDist = d;
              closestEnemy = e;
            }
          });
          if (closestEnemy) {
            const dx = closestEnemy.x - b.x;
            const dy = closestEnemy.y - b.y;
            const targetAngle = Math.atan2(dy, dx);
            const currentAngle = Math.atan2(b.vy, b.vx);

            let angleDiff = targetAngle - currentAngle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            const turnSpeed = 10 * dt; // Sharp turn ability
            const newAngle =
              currentAngle +
              Math.max(-turnSpeed, Math.min(turnSpeed, angleDiff));
            const speed = Math.hypot(b.vx, b.vy);
            b.vx = Math.cos(newAngle) * speed;
            b.vy = Math.sin(newAngle) * speed;
          }
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Bullets fly infinitely into the hazard zone and despawn on distance

        b.life -= dt;
        if (!b.trail) b.trail = [];
        b.trail.unshift({ x: b.x, y: b.y });
        if (b.trail.length > 20) b.trail.pop();
      });
      for (let i = 0; i < state.asteroids.length; i++) {
        const a = state.asteroids[i];
        a.x += a.vx * dt;
        a.y += a.vy * dt;
        a.angle += a.spin * dt;
        if (Math.hypot(a.x - state.player.x, a.y - state.player.y) > 3000) {
          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnDist = 1500 + Math.random() * 500;
          a.x = state.player.x + Math.cos(spawnAngle) * spawnDist;
          a.y = state.player.y + Math.sin(spawnAngle) * spawnDist;
        }

        // collision with player
        const distToPlayer = Math.hypot(
          a.x - state.player.x,
          a.y - state.player.y,
        );
        const playerOverlap = a.radius + state.player.radius - distToPlayer;
        if (playerOverlap > 0) {
          const dmg = 10 * dt;
          if (state.player.shield > 0) {
            state.player.shield -= dmg;
          } else {
            state.player.hp -= dmg;
            state.lastDamageSource = "Asteroid";
            state.screenShakeTimer = Math.max(state.screenShakeTimer, 0.2);
            state.glitchTimer = Math.max(state.glitchTimer, 0.1);
          }

          // Physics resolution: bounce player & asteroid
          if (distToPlayer > 0) {
            const nx = (state.player.x - a.x) / distToPlayer;
            const ny = (state.player.y - a.y) / distToPlayer;

            // Displace
            state.player.x += nx * playerOverlap * 0.5;
            state.player.y += ny * playerOverlap * 0.5;
            a.x -= nx * playerOverlap * 0.5;
            a.y -= ny * playerOverlap * 0.5;

            // Impulse
            state.player.vx += nx * 50;
            state.player.vy += ny * 50;
            a.vx -= nx * 20;
            a.vy -= ny * 20;
          }
        }

        // collision with other asteroids
        for (let j = i + 1; j < state.asteroids.length; j++) {
          const b = state.asteroids[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const overlap = a.radius + b.radius - dist;

          if (overlap > 0 && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;

            // Positional correction
            a.x -= nx * overlap * 0.5;
            a.y -= ny * overlap * 0.5;
            b.x += nx * overlap * 0.5;
            b.y += ny * overlap * 0.5;

            // Elastic bounce
            const relVx = b.vx - a.vx;
            const relVy = b.vy - a.vy;
            const relVel = relVx * nx + relVy * ny;

            if (relVel < 0) {
              const restitution = 0.8;
              const impulse =
                (-(1 + restitution) * relVel) / (1 / a.radius + 1 / b.radius);
              const impulseX = impulse * nx;
              const impulseY = impulse * ny;

              a.vx -= impulseX / a.radius;
              a.vy -= impulseY / a.radius;
              b.vx += impulseX / b.radius;
              b.vy += impulseY / b.radius;
            }
          }
        }
      }
      state.particles.forEach((p: any) => {
        if (p.life <= 0) return;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.isDebris) {
          p.vy += 50 * dt; // light gravity effect
          p.vx *= 1 - 1.5 * dt; // drag
          p.vy *= 1 - 1.5 * dt;
          if (p.spin) p.angle = (p.angle || 0) + p.spin * dt;
        }
      });

      // 5. Enemy Actions
      if (state.empTimer > 0) {
        state.empTimer -= dt;
      }

      state.enemyBullets.forEach((b: any) => {
        if (b.life <= 0) return;
        if (state.empTimer > 0) return;
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Bullets fly infinitely into hazard zone

        b.life -= dt;
        if (!b.trail) b.trail = [];
        b.trail.unshift({ x: b.x, y: b.y });
        if (b.trail.length > (b.bulletType?.startsWith("boss") ? 40 : 15))
          b.trail.pop();

        // hit player
        if (
          b.life > 0 &&
          Math.hypot(b.x - state.player.x, b.y - state.player.y) <
            state.player.radius + 4
        ) {
          if (state.player.shield > 0) {
            state.player.shield -= b.damage * 1.5;
          } else {
            state.player.hp -= b.damage;
            state.lastDamageSource = `Bullet (${b.isAlien ? "Alien" : "Enemy"})`;
            state.screenShakeTimer = Math.max(state.screenShakeTimer, 0.25);
            state.glitchTimer = Math.max(state.glitchTimer, 0.1);
          }
          if (state.player.shield < 0) state.player.shield = 0;
          if (state.player.hp <= 0 && playerRenderer)
            playerRenderer.triggerDestruction();
          else if (playerRenderer) playerRenderer.triggerShield();

          b.life = -1;
          soundManager.playTakeDamage();
          // add some particles for player getting hit
          for (let i = 0; i < 6; i++) {
            state.particles.push({
              x: b.x,
              y: b.y,
              vx: (Math.random() - 0.5) * 300,
              vy: (Math.random() - 0.5) * 300,
              life: 0.2 + Math.random() * 0.2,
              color: "#00D9FF",
            });
          }
        }
      });
      // state.enemyBullets = state.enemyBullets.filter((b: any) => b.life > 0);

      state.enemies.forEach((e) => {
        if (state.empTimer > 0) return;
        if (e.renderer) e.renderer.update(dt);
        if (e.flashTimer === undefined) e.flashTimer = 0;
        if (e.flashTimer > 0) e.flashTimer -= dt;

        if (e.spawnScale < 1) e.spawnScale += dt * 3;
        if (e.spawnScale > 1) e.spawnScale = 1;

        let dx = state.player.x - e.x;
        let dy = state.player.y - e.y;

        const dist = Math.hypot(dx, dy);

        if (e.type.startsWith("boss")) {
          if (e.shootTimer === undefined) e.shootTimer = 1.0;
          if (e.laserTimer === undefined) e.laserTimer = 4.0;
          if (e.minionTimer === undefined) e.minionTimer = 5.0;
          if (e.rotationAngle === undefined) e.rotationAngle = 0;

          // Slow move towards player but stop at distance
          if (dist > e.radius + state.player.radius + 150) {
            e.x += (dx / dist) * e.speed * dt;
            e.y += (dy / dist) * e.speed * dt;
          }

          e.shootTimer -= dt;
          e.laserTimer -= dt;
          if (e.type !== "boss_hrrn") {
            // HRRN doesn't span minions
            e.minionTimer -= dt;
          }

          if (e.type === "boss") {
            if (e.minionTimer <= 0) {
              // Spawn heavy convoy reinforcements (Tanks) to simulate I/O Convoy blocks
              for (let i = 0; i < 2; i++) {
                const newId = Math.random();
                const spawnAngle = Math.PI * 2 * Math.random();
                state.enemies.push({
                  id: newId,
                  type: "tank",
                  x: e.x + Math.cos(spawnAngle) * (e.radius + 40),
                  y: e.y + Math.sin(spawnAngle) * (e.radius + 40),
                  maxHp: 100, // Heavy
                  hp: 100,
                  damage: 15,
                  S: 3.0, // High service time forces drones to get stuck waiting
                  W: 0,
                  color: "#8B5CF6",
                  speed: 60,
                  radius: 22,
                  flashTimer: 0,
                  dashTimer: 0,
                  shootTimer: 0,
                });
                state.readyQueue.push(newId);
              }
              e.minionTimer = 8.0; // Spawns every 8 seconds
            }

            if (e.laserTimer <= 0) {
              for (let i = 0; i < 16; i++) {
                const angle = ((Math.PI * 2) / 16) * i;
                const __bId = Math.random();
                state.readyQueue.push(__bId);
                state.enemyBullets.push({
                  id: __bId,
                  W: 0,
                  S: 0.1,
                  hp: 1,
                  maxHp: 1,
                  priority: 2,
                  x: e.x + Math.cos(angle) * e.radius,
                  y: e.y + Math.sin(angle) * e.radius,
                  vx: Math.cos(angle) * 150,
                  vy: Math.sin(angle) * 150,
                  life: 6.0,
                  damage: e.damage,
                  isBig: true,
                  bulletType: "boss_slow",
                });
              }
              soundManager.playEnemyAttack();
              if (e.renderer) e.renderer.triggerWeapons();
              e.laserTimer = 7.0;
            } else if (e.shootTimer <= 0) {
              for (let i = -2; i <= 2; i++) {
                const angle = Math.atan2(dy, dx) + i * 0.2;
                const __bId = Math.random();
                state.readyQueue.push(__bId);
                state.enemyBullets.push({
                  id: __bId,
                  W: 0,
                  S: 0.1,
                  hp: 1,
                  maxHp: 1,
                  priority: 2,
                  x: e.x + Math.cos(angle) * e.radius,
                  y: e.y + Math.sin(angle) * e.radius,
                  vx: Math.cos(angle) * 250,
                  vy: Math.sin(angle) * 250,
                  life: 4.0,
                  damage: e.damage / 2,
                  isBig: false,
                  bulletType: "boss_burst",
                });
              }
              soundManager.playEnemyAttack();
              if (e.renderer) e.renderer.triggerWeapons();
              e.shootTimer = 2.0;
            }
          } else if (e.type === "boss_rr") {
            // Cycler Mechanic: Time-Sliced Spiral Barrage
            e.rotationAngle += dt * 0.8;

            if (e.minionTimer <= 0) {
              for (let i = 0; i < 4; i++) {
                const newId = Math.random();
                const spawnAngle = ((Math.PI * 2) / 4) * i;
                state.enemies.push({
                  id: newId,
                  type: "kamikaze",
                  x: e.x + Math.cos(spawnAngle) * (e.radius + 40),
                  y: e.y + Math.sin(spawnAngle) * (e.radius + 40),
                  maxHp: 30,
                  hp: 30,
                  damage: 30,
                  S: 0.5,
                  W: 0,
                  color: "#f97316",
                  speed: 200,
                  radius: 10,
                  flashTimer: 0,
                  dashTimer: 0,
                  shootTimer: 0,
                });
                state.readyQueue.push(newId);
              }
              e.minionTimer = 8.0;
            }

            if (e.laserTimer <= 0) {
              // Fast spiral slice
              for (let i = 0; i < 4; i++) {
                const spiralAngle = e.rotationAngle + (Math.PI / 2) * i;
                const __bId = Math.random();
                state.readyQueue.push(__bId);
                state.enemyBullets.push({
                  id: __bId,
                  W: 0,
                  S: 0.1,
                  hp: 1,
                  maxHp: 1,
                  priority: 2,
                  x: e.x + Math.cos(spiralAngle) * e.radius,
                  y: e.y + Math.sin(spiralAngle) * e.radius,
                  vx: Math.cos(spiralAngle) * 250,
                  vy: Math.sin(spiralAngle) * 250,
                  life: 5.0,
                  damage: e.damage,
                  isBig: true,
                  bulletType: "boss_spiral",
                });
              }
              soundManager.playEnemyAttack();
              if (e.renderer) e.renderer.triggerWeapons();
              e.laserTimer = 0.3; // Very rapid fire
            }
            if (e.shootTimer <= 0) {
              // Huge Ring Sweep
              for (let i = 0; i < 24; i++) {
                const angle = ((Math.PI * 2) / 24) * i;
                const __bId = Math.random();
                state.readyQueue.push(__bId);
                state.enemyBullets.push({
                  id: __bId,
                  W: 0,
                  S: 0.1,
                  hp: 1,
                  maxHp: 1,
                  priority: 2,
                  x: e.x + Math.cos(angle) * e.radius,
                  y: e.y + Math.sin(angle) * e.radius,
                  vx: Math.cos(angle) * 150,
                  vy: Math.sin(angle) * 150,
                  life: 8.0,
                  damage: e.damage / 2,
                  isBig: false,
                  bulletType: "boss_sweep",
                });
              }
              soundManager.playEnemyAttack();
              if (e.renderer) e.renderer.triggerWeapons();
              e.shootTimer = 5.0;
            }
          } else if (e.type === "boss_hrrn") {
            // Decoupled from scheduling logic: base difficulty multiplier
            const hrrnMultiplier = Math.max(1, (e.W + e.S) / e.S);

            if (e.laserTimer <= 0) {
              // Focused charging blast
              const spreadCount = Math.floor(1 + hrrnMultiplier * 1.5);
              for (let i = -spreadCount; i <= spreadCount; i++) {
                const angle = Math.atan2(dy, dx) + i * 0.1;
                const __bId = Math.random();
                state.readyQueue.push(__bId);
                state.enemyBullets.push({
                  id: __bId,
                  W: 0,
                  S: 0.1,
                  hp: 1,
                  maxHp: 1,
                  priority: 2,
                  x: e.x + Math.cos(angle) * e.radius,
                  y: e.y + Math.sin(angle) * e.radius,
                  vx: Math.cos(angle) * 350 * Math.max(1, hrrnMultiplier * 0.5),
                  vy: Math.sin(angle) * 350 * Math.max(1, hrrnMultiplier * 0.5),
                  life: 5.0,
                  damage: e.damage * hrrnMultiplier,
                  isBig: true,
                  bulletType: "boss_focused",
                });
              }
              soundManager.playEnemyAttack();
              if (e.renderer) e.renderer.triggerWeapons();
              e.laserTimer = Math.max(0.6, 4.0 / hrrnMultiplier); // Cooldown strictly decreases
            }
            if (e.shootTimer <= 0) {
              // High velocity snipe
              const angle = Math.atan2(dy, dx);
              const __bId = Math.random();
              state.readyQueue.push(__bId);
              state.enemyBullets.push({
                id: __bId,
                W: 0,
                S: 0.1,
                hp: 1,
                maxHp: 1,
                priority: 2,
                x: e.x + Math.cos(angle) * e.radius,
                y: e.y + Math.sin(angle) * e.radius,
                vx: Math.cos(angle) * 500,
                vy: Math.sin(angle) * 500,
                life: 6.0,
                damage: e.damage * hrrnMultiplier * 2,
                isBig: true,
                bulletType: "boss_snipe", // massive damage
              });
              soundManager.playEnemyAttack();
              if (e.renderer) e.renderer.triggerWeapons();
              e.shootTimer = Math.max(0.3, 2.0 / hrrnMultiplier);
            }
          }
        } else if (e.type === "turret") {
          if (e.shootTimer === undefined) e.shootTimer = 1.0;

          // Turrets don't move or move very slowly. They just shoot towards player.
          e.shootTimer -= dt;
          if (e.shootTimer <= 0 && dist < 800) {
            const safeDist = Math.max(1, dist);
            const __bId = Math.random();
            state.readyQueue.push(__bId);
            state.enemyBullets.push({
              id: __bId,
              W: 0,
              S: 0.1,
              hp: 1,
              maxHp: 1,
              priority: 2,
              x: e.x + (dx / safeDist) * e.radius,
              y: e.y + (dy / safeDist) * e.radius,
              vx: (dx / safeDist) * 250,
              vy: (dy / safeDist) * 250,
              life: 4.0,
              damage: e.damage,
              isBig: false,
              bulletType: "turret_standard",
            });
            soundManager.playEnemyAttack();
            if (e.renderer) e.renderer.triggerWeapons();
            e.shootTimer = 1.0 + Math.random() * 0.5;
          }
        } else if (e.type === "kamikaze") {
          // Charge directly at player quickly
          const safeDist = Math.max(1, dist);
          e.x += (dx / safeDist) * e.speed * dt;
          e.y += (dy / safeDist) * e.speed * dt;

          if (dist <= e.radius + state.player.radius + 2) {
            // Explode immediately on touch
            const dmg = e.damage;
            if (state.player.shield > 0) {
              state.player.shield -= dmg * 1.5;
              if (state.player.shield < 0) state.player.shield = 0;
            } else {
              state.player.hp -= dmg;
              state.lastDamageSource = e ? e.type || "Enemy" : "Unknown";
              state.screenShakeTimer = Math.max(state.screenShakeTimer, 0.4);
              state.glitchTimer = Math.max(state.glitchTimer, 0.2);
            }
            if (state.player.hp <= 0 && playerRenderer)
              playerRenderer.triggerDestruction();
            else if (playerRenderer) playerRenderer.triggerShield();

            e.hp = 0; // kill self
            if (e.renderer) e.renderer.triggerDestruction();
            soundManager.playExplosion();
          }
        } else {
          const safeDist = Math.max(1, dist);
          if (dist > e.radius + state.player.radius + 2) {
            e.x += (dx / safeDist) * e.speed * dt;
            e.y += (dy / safeDist) * e.speed * dt;
          } else {
            // Melee damage
            const dmg = e.damage * dt;
            if (state.player.shield > 0) {
              state.player.shield -= dmg * 1.5;
              if (state.player.shield < 0) state.player.shield = 0;
            } else {
              state.player.hp -= dmg;
              state.lastDamageSource = e ? e.type || "Enemy" : "Unknown";
              state.screenShakeTimer = Math.max(state.screenShakeTimer, 0.1);
              state.glitchTimer = Math.max(state.glitchTimer, 0.05);
            }
            // For continuous melee damage, we don't want to spam the sound too fast
            // We'll rely on the visual or trigger only occasionally.
            // Let's add a small chance to play so it doesn't overwhelm
            if (Math.random() < 0.05) soundManager.playTakeDamage();
          }

          // Grunt / Tank Shooting based on scheduler
          if (e.shootTimer === undefined)
            e.shootTimer = Math.random() * 2.0 + 1.0;
          e.shootTimer -= dt;
          if (e.shootTimer <= 0) {
            const safeDist = Math.max(1, dist);
            let vx = 0,
              vy = 0,
              damage = e.damage,
              life = 4.0,
              bType = "grunt_standard",
              count = 1;
            if (e.type === "malware") {
              bType = "malware_virus";
              vx = (dx / safeDist) * 400;
              vy = (dy / safeDist) * 400;
              damage = e.damage;
              e.shootTimer = 1.5;
            } else if (cfg.algo === "FCFS") {
              // Fast, predictive, small damage
              bType = e.type === "tank" ? "tank_heavy" : "grunt_fast";
              vx = (dx / safeDist) * (e.type === "tank" ? 250 : 350);
              vy = (dy / safeDist) * (e.type === "tank" ? 250 : 350);
              damage = e.type === "tank" ? e.damage * 0.8 : e.damage * 0.4;
              e.shootTimer = e.type === "tank" ? 3.0 : 2.0;
            } else if (cfg.algo === "RR") {
              // Spread, medium damage
              bType = e.type === "tank" ? "tank_spread" : "grunt_burst";
              vx = (dx / safeDist) * (e.type === "tank" ? 250 : 350);
              vy = (dy / safeDist) * (e.type === "tank" ? 250 : 350);
              damage = e.type === "tank" ? e.damage * 0.5 : e.damage * 0.2;
              e.shootTimer = e.type === "tank" ? 4.0 : 2.5;
              count = e.type === "tank" ? 3 : 2;
            } else if (cfg.algo === "HRRN") {
              const hrrnMultiplier = Math.max(1, (e.W + e.S) / e.S);
              bType = e.type === "tank" ? "tank_heavy" : "grunt_snipe";
              vx = (dx / safeDist) * (e.type === "tank" ? 300 : 450);
              vy = (dy / safeDist) * (e.type === "tank" ? 300 : 450);
              damage =
                (e.type === "tank" ? e.damage * 0.8 : e.damage * 0.5) *
                hrrnMultiplier;
              e.shootTimer = Math.max(1.0, 4.0 / hrrnMultiplier);
            }

            for (let i = 0; i < count; i++) {
              let spreadAngle = (i - (count - 1) / 2) * 0.15;
              const baseAngle = Math.atan2(dy, dx);
              const angle = baseAngle + spreadAngle;
              const __bId = Math.random();
              state.readyQueue.push(__bId);
              state.enemyBullets.push({
                id: __bId,
                W: 0,
                S: 0.1,
                hp: 1,
                maxHp: 1,
                priority: 2,
                x: e.x + Math.cos(angle) * e.radius,
                y: e.y + Math.sin(angle) * e.radius,
                vx: Math.cos(angle) * Math.hypot(vx, vy),
                vy: Math.sin(angle) * Math.hypot(vx, vy),
                life: 5.0,
                damage: damage,
                isBig: e.type === "tank",
                bulletType: bType,
              });
            }
            if (dist < 1000) {
              soundManager.playEnemyAttack();
              if (e.renderer) e.renderer.triggerWeapons();
            }
          }
        }

        // If enemies drift WAY too far from the player (e.g. 3000px away), recycle them or teleport them closer
        if (Math.hypot(e.x - state.player.x, e.y - state.player.y) > 3000) {
          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnDist = 1200 + Math.random() * 500;
          e.x = state.player.x + Math.cos(spawnAngle) * spawnDist;
          e.y = state.player.y + Math.sin(spawnAngle) * spawnDist;
        }
      });

      // Collisions
      state.bullets.forEach((b) => {
        if (b.life <= 0) return;
        state.enemies.forEach((e) => {
          if (e.hp <= 0) return;
          const dist = Math.hypot(b.x - e.x, b.y - e.y);
          if (dist < e.radius + 5) {
            // 5 is bullet radius roughly
            const isCrit = Math.random() < 0.25;
            const dmg = 34 * (b.damageMult || 1) * (isCrit ? 2.5 : 1.0);
            e.hp -= dmg; // approx 3 hits for tank, 1 for grunt
            if (e.hp <= 0 && e.renderer) e.renderer.triggerDestruction();
            else if (e.renderer) e.renderer.triggerShield();

            e.flashTimer = 0.1;
            state.damageNumbers.push({
              x: e.x + (Math.random() - 0.5) * 20,
              y: e.y - e.radius - 10 + (Math.random() - 0.5) * 20,
              amount: Math.ceil(dmg),
              life: 1.0,
              vy: -30,
              isCrit,
            });
            b.life = -1;
            let hitColor = b.isDrone ? "#00D9FF" : "#F59E0B";
            if (b.isOverclocked) {
              hitColor = "#d946ef"; // Fuchsia
            } else if (b.isDrone) {
              if (state.currentAlgo === "FCFS") hitColor = "#3b82f6";
              else if (state.currentAlgo === "RR") hitColor = "#10b981";
              else if (state.currentAlgo === "HRRN") hitColor = "#EF4444";
            }

            for (let i = 0; i < 6; i++) {
              state.particles.push({
                x: b.x,
                y: b.y,
                vx: (Math.random() - 0.5) * 300,
                vy: (Math.random() - 0.5) * 300,
                life: 0.15 + Math.random() * 0.15,
                color: hitColor,
              });
            }

            if (b.isDrone) {
              // Distinct bright impact flare for homing lasers
              state.particles.push({
                x: b.x,
                y: b.y,
                vx: 0,
                vy: 0,
                life: 0.25,
                maxLife: 0.25,
                color: hitColor,
                text: "LASER_FLARE",
                angle: Math.random() * Math.PI,
              });
              for (let i = 0; i < 3; i++) {
                state.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: (Math.random() - 0.5) * 150,
                  vy: (Math.random() - 0.5) * 150,
                  life: 0.15,
                  maxLife: 0.15,
                  color: "#FFFFFF",
                });
              }
            }
          }
        });

        if (b.life > 0) {
          state.enemyBullets.forEach((eb) => {
            if (eb.life <= 0 || b.life <= 0) return;
            const dist = Math.hypot(b.x - eb.x, b.y - eb.y);
            const collisionRadius = (eb.isBig ? 15 : 10) + 10;
            if (dist < collisionRadius) {
              b.life = -1;
              eb.life = -1;

              soundManager.playExplosion();
              const explosionRadius = 60;

              // Explosion particles
              for (let i = 0; i < 15; i++) {
                state.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: (Math.random() - 0.5) * 500,
                  vy: (Math.random() - 0.5) * 500,
                  life: 0.3 + Math.random() * 0.3,
                  maxLife: 0.6,
                  radius: Math.random() * 5 + 2,
                  color: Math.random() > 0.5 ? "#F59E0B" : "#EF4444", // Orange/Red explosion
                });
              }

              // AoE Damage Player
              if (
                Math.hypot(state.player.x - b.x, state.player.y - b.y) <
                explosionRadius + state.player.radius
              ) {
                if (state.player.shield > 0) {
                  state.player.shield = Math.max(0, state.player.shield - 20);
                } else {
                  state.player.hp -= 20;
                  state.lastDamageSource = "EMP_Storm";
                }
                soundManager.playTakeDamage();
              }

              // AoE Damage Enemies
              state.enemies.forEach((e) => {
                if (e.hp <= 0) return;
                if (
                  Math.hypot(e.x - b.x, e.y - b.y) <
                  explosionRadius + e.radius
                ) {
                  const dmg = 40;
                  e.hp -= dmg;
                  e.flashTimer = 0.1;
                  state.damageNumbers.push({
                    x: e.x + (Math.random() - 0.5) * 20,
                    y: e.y - e.radius - 10,
                    amount: Math.ceil(dmg),
                    life: 1.0,
                    vy: -30,
                  });
                  if (e.hp <= 0 && e.renderer) e.renderer.triggerDestruction();
                  else if (e.renderer) e.renderer.triggerShield();
                }
              });

              // AoE Damage Asteroids
              state.asteroids.forEach((a) => {
                if (a.hp <= 0) return;
                if (
                  Math.hypot(a.x - b.x, a.y - b.y) <
                  explosionRadius + a.radius
                ) {
                  a.hp -= 40;
                }
              });
            }
          });
        }

        if (b.life > 0) {
          state.asteroids.forEach((a) => {
            if (a.hp <= 0) return;
            const dist = Math.hypot(b.x - a.x, b.y - a.y);
            if (dist < a.radius) {
              a.hp -= 34 * (b.damageMult || 1);
              b.life = -1;
              soundManager.playTakeDamage(); // Add a small hit sound or similar
              for (let i = 0; i < 6; i++) {
                const life = 0.3 + Math.random() * 0.4;
                state.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: (Math.random() - 0.5) * 200,
                  vy: (Math.random() - 0.5) * 200,
                  life: life,
                  maxLife: life,
                  radius: Math.random() * 3 + 1,
                  color: Math.random() > 0.5 ? "#94a3b8" : "#cbd5e1",
                  spin: (Math.random() - 0.5) * 15,
                  isDebris: true,
                  angle: Math.random() * Math.PI * 2,
                  shape: Math.random() > 0.5 ? "rect" : "tri",
                });
              }
            }
          });
        }
      });

      // === SPACETIME ANOMALIES (RELATIVITY PHYSICS) ===
      if (!state.anomalies) state.anomalies = [];

      if (
        Math.random() < dt * 0.015 &&
        state.anomalies.length < 1 &&
        state.score > 2000
      ) {
        let ax = Math.random() * MAP_WIDTH;
        let ay = Math.random() * MAP_HEIGHT;
        if (Math.hypot(ax - state.player.x, ay - state.player.y) > 800) {
          state.anomalies.push({
            type: "black_hole",
            x: ax,
            y: ay,
            r: 100,
            mass: 3500000,
            life: 30,
            rotation: 0,
          });
          state.notification = {
            time: 5.0,
            text1: "SPACETIME ANOMALY",
            text2: "Severe Gravity Well Detected!",
          };
          if ((soundManager as any).playBossWarning)
            (soundManager as any).playBossWarning();
        }
      }
      if (
        Math.random() < dt * 0.01 &&
        state.score > 1000 &&
        !state.anomalies.some((a: any) => a.type === "memory_leak")
      ) {
        let ax = Math.random() * MAP_WIDTH;
        let ay = Math.random() * MAP_HEIGHT;
        state.anomalies.push({
          type: "memory_leak",
          x: ax,
          y: ay,
          r: 20,
          maxRadius: 1000 + Math.random() * 500,
          growthRate: 15,
          state: "growing",
          life: 200,
          sacrificeDist: 60,
          rotation: 0,
        });
        state.notification = {
          time: 5.0,
          text1: "WARNING: COGNITIVE CORRUPTION",
          text2: "The Hive's Thoughts Are Bleeding Into Yours!",
        };
      }

      state.isPlayerInLeak = false;

      state.anomalies.forEach((ano: any) => {
        ano.life -= dt;
        ano.rotation += dt * 1.5;
        if (ano.type === "black_hole") {
          const pull = (ent: any, isP = false) => {
            if (ent.hp !== undefined && ent.hp <= 0 && !isP) return;
            if (ent.life !== undefined && ent.life <= 0) return;

            const dx = ano.x - ent.x;
            const dy = ano.y - ent.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 1600 && dist > 10) {
              const f = ano.mass / (dist * dist);
              ent.x += (dx / dist) * f * dt;
              ent.y += (dy / dist) * f * dt;

              // Spaghettification radius
              if (dist < ano.r * 0.8) {
                if (isP) ent.hp -= 300 * dt;
                else if (ent.life !== undefined) ent.life = -1;
                else ent.hp = 0;
              }

              // Time dilation (slow down objects near the event horizon roughly)
              if (!isP && ent.vx !== undefined && ent.vy !== undefined) {
                const dilation = Math.max(0.2, dist / 1600);
                ent.x -= ent.vx * dt * (1 - dilation);
                ent.y -= ent.vy * dt * (1 - dilation);
              }
            }
          };
          pull(state.player, true);
          state.enemies.forEach((e: any) => pull(e));
          state.asteroids.forEach((a: any) => pull(a));
          state.bullets.forEach((b: any) => pull(b));
          state.enemyBullets.forEach((b: any) => pull(b));
          state.collectibles.forEach((c: any) => pull(c));
        } else if (ano.type === "memory_leak") {
          if (ano.state === "growing") {
            ano.r += ano.growthRate * dt;
            if (ano.r >= ano.maxRadius) ano.state = "imploding";
          } else if (ano.state === "imploding") {
            ano.r -= ano.growthRate * 6 * dt;
            if (ano.r <= 0) ano.life = -1;
          }

          // Check Player Interaction
          const pd = Math.hypot(state.player.x - ano.x, state.player.y - ano.y);
          if (pd < ano.r) {
            state.isPlayerInLeak = true;
            state.player.stamina = Math.max(0, state.player.stamina - 15 * dt); // Data Corruption (Stamina Drain)

            // The Sacrifice (Manual Reboot)
            // Shift is boost, E is shield. We will just check if both states are essentially active/pressed
            if (
              pd < ano.sacrificeDist &&
              ano.state === "growing" &&
              state.keys["shift"] &&
              state.keys["e"] &&
              state.player.stamina >= 10 &&
              state.player.shield >= 10
            ) {
              state.player.stamina = 0;
              state.player.shield = 0;
              ano.state = "imploding";
              state.empTimer = 5.0;
              soundManager.playExplosion();
              state.notification = {
                time: 5.0,
                text1: "SENSORY OVERLOAD",
                text2: "THE SWARM TEMPORARILY BLINDED",
              };

              // EMP particles
              for (let i = 0; i < 50; i++) {
                state.particles.push({
                  x: ano.x,
                  y: ano.y,
                  vx: (Math.random() - 0.5) * 800,
                  vy: (Math.random() - 0.5) * 800,
                  life: 2.0,
                  maxLife: 2.0,
                  radius: 5 + Math.random() * 10,
                  color: "#34d399",
                  isDebris: false,
                  shape: "rect",
                });
              }
            }
          }

          // Tactical Exploit (Corrupt enemies)
          state.enemies.forEach((e: any) => {
            if (Math.hypot(e.x - ano.x, e.y - ano.y) < ano.r) {
              if (e.type === "grunt" || e.type === "tank") {
                e.hp -= e.maxHp * 0.25 * dt; // dies in 4 seconds
                // corruption particles
                if (Math.random() < 0.2) {
                  state.particles.push({
                    x: e.x + (Math.random() - 0.5) * e.radius,
                    y: e.y + (Math.random() - 0.5) * e.radius,
                    vx: 0,
                    vy: -50,
                    life: 1.0,
                    maxLife: 1.0,
                    radius: 3,
                    color: "#22c55e",
                    isDebris: false,
                    shape: "rect",
                  });
                }
              }
            }
          });

          // Powerup Glitch
          state.collectibles.forEach((c: any) => {
            if (Math.hypot(c.x - ano.x, c.y - ano.y) < ano.r) {
              c.life -= dt * 2.0; // Decay twice as fast
            }
          });
        }
      });
      state.anomalies = state.anomalies.filter((a: any) => a.life > 0);

      state.asteroids = state.asteroids.filter((a) => {
        if (a.hp <= 0) {
          soundManager.playExplosion();
          const debrisCount = Math.floor(Math.random() * 10) + 12; // 12-21 debris
          for (let i = 0; i < debrisCount; i++) {
            const life = 0.6 + Math.random() * 1.5;
            state.particles.push({
              x: a.x + (Math.random() - 0.5) * a.radius,
              y: a.y + (Math.random() - 0.5) * a.radius,
              vx: a.vx * 0.5 + (Math.random() - 0.5) * 300,
              vy: a.vy * 0.5 + (Math.random() - 0.5) * 300,
              radius: Math.random() * 8 + 3,
              life: life,
              maxLife: life,
              color: Math.random() > 0.5 ? "#64748b" : "#334155",
              spin: (Math.random() - 0.5) * 12,
              isDebris: true,
              angle: Math.random() * Math.PI * 2,
              shape: "sprite_debris",
              spriteIdxX: Math.floor(Math.random() * 8),
              spriteIdxY: Math.floor(Math.random() * 4),
            });
          }
          return false;
        }
        return true;
      });

      // Cleanup & Stats
      // state.bullets = state.bullets.filter(b => b.life > 0);
      // state.particles = state.particles.filter((p: any) => p.life > 0);
      state.damageNumbers.forEach((d: any) => {
        if (d.life <= 0) return;
        d.y += d.vy * dt;
        d.life -= dt;
      });
      state.damageNumbers = state.damageNumbers.filter((d: any) => d.life > 0);
      let scoreGained = 0;
      state.enemies = state.enemies.filter((e) => {
        if (e.hp <= 0) {
          if (!e.isDeadInit) {
            // First frame of death
            e.isDeadInit = true;
            state.kills++;
            scoreGained += e.type.startsWith("boss")
              ? e.type === "boss"
                ? 500
                : 2500
              : ["tank", "turret"].includes(e.type)
                ? 50
                : e.type === "kamikaze"
                  ? 20
                  : 10;
            state.drones.forEach((drone: any) => {
              if (drone.targetId === e.id) drone.targetId = null;
            });
            state.readyQueue = state.readyQueue.filter((id) => id !== e.id);
            const deathParticleCount = e.type.startsWith("boss")
              ? e.type === "boss"
                ? 50
                : 150
              : 15;

            // Permanent environmental scars for large enemies and heavy combat
            if (
              e.type.startsWith("boss") ||
              ["tank", "turret"].includes(e.type)
            ) {
              const numScars = e.type.startsWith("boss") ? 5 : 1;
              for (let i = 0; i < numScars; i++) {
                state.scars.push({
                  x: e.x + (Math.random() - 0.5) * 80,
                  y: e.y + (Math.random() - 0.5) * 80,
                  size: Math.random() * 40 + 20,
                  rotation: Math.random() * Math.PI * 2,
                });
              }
              if (e.type.startsWith("boss")) {
                state.osMessages.push({
                  text: "BOSS TARGET ELIMINATED",
                  life: 4.0,
                });
                if ((soundManager as any).playSystemBlip)
                  (soundManager as any).playSystemBlip();
              }
            }

            for (let i = 0; i < deathParticleCount; i++) {
              const isMassive = e.type !== "boss" && e.type.startsWith("boss");
              state.particles.push({
                x: e.x,
                y: e.y,
                vx:
                  (Math.random() - 0.5) *
                  (e.type.startsWith("boss") ? (isMassive ? 1400 : 800) : 400),
                vy:
                  (Math.random() - 0.5) *
                  (e.type.startsWith("boss") ? (isMassive ? 1400 : 800) : 400),
                life:
                  0.2 + Math.random() * (e.type.startsWith("boss") ? 0.6 : 0.3),
                maxLife: 0.8,
                radius: isMassive
                  ? Math.random() * 8 + 3
                  : Math.random() * 2 + 1,
                isDebris: isMassive && Math.random() < 0.5,
                spin: (Math.random() - 0.5) * 15,
                shape: Math.random() > 0.5 ? "rect" : "tri",
                color: e.type.startsWith("boss")
                  ? "#ec4899"
                  : e.type === "tank"
                    ? "#ef4444"
                    : "#EF4444",
              });
            }
            if (Math.random() < 0.45) {
              const rand = Math.random();
              let cType = "ammo";
              if (rand < 0.2) cType = "health";
              else if (rand < 0.4) cType = "shield";
              else if (rand < 0.6) cType = "speed";
              else if (rand < 0.8) cType = "weapon";
              else cType = "stamina";

              state.collectibles.push({
                x: e.x,
                y: e.y,
                type: cType,
                life: 10.0, // stays for 10 seconds
              });
            }
          }

          if (!e.renderer || e.renderer.fullyDead) {
            if (["grunt", "tank", "kamikaze", "turret"].includes(e.type)) {
              if (!state.respawnQueue) state.respawnQueue = [];
              if (e.respawnCount === undefined) e.respawnCount = 0;
              // Only casually respawn higher tier or rarely grunts, max 1 time.
              if (e.respawnCount < 1 && Math.random() < 0.25) {
                state.respawnQueue.push({
                  type: e.type,
                  maxHp: e.maxHp * 1.1, // slightly stronger on respawn
                  damage: e.damage * 1.1,
                  S: e.S,
                  color: e.color,
                  speed: e.speed,
                  radius: e.radius,
                  timer: 15.0 + Math.random() * 10.0, // 15-25 seconds delay
                  respawnCount: e.respawnCount + 1,
                });
              }
            }
            if (e.type === "boss_hrrn" && !state.isGameOver) {
              state.isGameOver = true;
              soundManager.stopBGM();
              soundManager.setLowRamEffect(false);
              onGameOverRef.current(state.score + scoreGained, true, "", {
                kills: state.kills,
                credits: state.credits,
                timeSurvived: state.gameTime,
                algorithm: state.currentAlgo
              });
            }
            return false;
          }
        }
        return true;
      });
      state.score += scoreGained;
      state.credits += scoreGained;

      // Collectibles
      state.collectibles.forEach((c: any) => {
        c.life -= dt;

        // Despawn early if it gets left extremely far behind
        if (Math.hypot(c.x - state.player.x, c.y - state.player.y) > 4000) {
          c.life = -1;
        }

        if (c.life > 0) {
          const dist = Math.hypot(c.x - state.player.x, c.y - state.player.y);
          if (dist < 20 + state.player.radius) {
            // pickup radius
            if (c.type === "health") {
              state.player.hp = Math.min(
                state.player.maxHp,
                state.player.hp + 25,
              );
            } else if (c.type === "ammo") {
              state.player.ammo = Math.min(100, state.player.ammo + 50);
            } else if (c.type === "shield") {
              state.player.shield = Math.min(100, state.player.shield + 50);
            } else if (c.type === "speed") {
              state.player.speedTimer = 10.0;
            } else if (c.type === "weapon") {
              state.player.weaponTimer = 10.0;
            } else if (c.type === "stamina") {
              state.player.stamina = Math.min(100, state.player.stamina + 50);
            }
            c.life = -1; // collect
            soundManager.playCollect(c.type);

            // System Reaction for collect
            if (c.type === "health" && state.player.hp < state.player.maxHp) {
              state.osMessages.push({
                text: "HULL REPAIRS ACTIVE",
                life: 2.0,
              });
            } else if (c.type === "shield") {
              state.osMessages.push({
                text: "SHIELDS RECHARGING",
                life: 2.0,
              });
            } else if (c.type === "weapon") {
              state.osMessages.push({
                text: "OVERDRIVE ACTIVATED",
                life: 2.0,
              });
              if ((soundManager as any).playSystemBlip)
                (soundManager as any).playSystemBlip();
            }

            let pColor = "#00D9FF"; // default ammo/energy color
            if (c.type === "health") pColor = "#10b981";
            else if (c.type === "shield") pColor = "#3b82f6";
            else if (c.type === "speed") pColor = "#fbbf24";
            else if (c.type === "weapon") pColor = "#dc2626";
            else if (c.type === "stamina") pColor = "#a855f7";

            for (let i = 0; i < 10; i++) {
              state.particles.push({
                x: c.x,
                y: c.y,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                life: 0.2 + Math.random() * 0.2,
                color: pColor,
              });
            }
          }
        }
      });
      state.collectibles = state.collectibles.filter((c: any) => c.life > 0);

      // Update HUD safely
      if (osMessagesRef.current) {
        osMessagesRef.current.innerHTML = state.osMessages
          .map(
            (m: any) =>
              `<div class="bg-[#00D9FF]/20/80 border-l-2 border-[#00D9FF] text-cyan-200 font-mono text-[10px] md:text-sm px-2 py-0.5 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] shadow-lg animate-pulse" style="opacity: ${Math.min(1, m.life)}">${m.text}</div>`,
          )
          .join("");
      }
      if (containerRef.current) {
        // Add a harsh red tint if in hazard zone
        const hazardFilter = state.inHazardZone
          ? " sepia(100%) hue-rotate(-50deg) saturate(300%) contrast(120%)"
          : "";
        containerRef.current.style.filter =
          (state.glitchTimer > 0
            ? "hue-rotate(90deg) contrast(150%) blur(2px)"
            : "none") + hazardFilter;
      }

      if (scoreRef.current)
        scoreRef.current.innerText = state.isPlayerInLeak
          ? generateGarbage(6)
          : `${state.score}`;
      const hpPercent = Math.max(
        0,
        Math.floor((state.player.hp / state.player.maxHp) * 100),
      );
      if (hpTextRef.current)
        hpTextRef.current.innerText = state.isPlayerInLeak
          ? generateGarbage(3)
          : `${Math.max(0, Math.floor(state.player.hp))}`;
      if (hpRef.current) hpRef.current.style.width = `${hpPercent}%`;

      // Update Critical Low Health Vignette Overlay
      if (critVignetteRef.current) {
        if (
          (hpPercent <= 25 || state.inHazardZone) &&
          state.player.hp > 0 &&
          !state.isGameOver &&
          !state.isPlayerInLeak
        ) {
          const pulse = Math.abs(
            Math.sin((state.elapsed || 0) * (state.inHazardZone ? 10 : 5)),
          ); // Faster pulse in hazard
          critVignetteRef.current.style.opacity = (
            pulse * 0.7 +
            0.3
          ).toString();

          if (state.inHazardZone) {
            critVignetteRef.current.style.background =
              "radial-gradient(circle, transparent 40%, rgba(255, 0, 0, 0.6) 100%)";
          } else {
            critVignetteRef.current.style.background =
              "radial-gradient(circle, transparent 50%, rgba(220, 38, 38, 0.4) 100%)";
          }
        } else {
          critVignetteRef.current.style.opacity = "0";
        }
      }

      const shieldPercent = Math.max(0, Math.floor(state.player.shield));
      if (shieldTextRef.current)
        shieldTextRef.current.innerText = state.isPlayerInLeak
          ? generateGarbage(3)
          : `${shieldPercent}%`;
      if (shieldRef.current)
        shieldRef.current.style.width = `${shieldPercent}%`;
      const staminaPercent = Math.max(0, Math.floor(state.player.stamina));
      if (staminaTextRef.current)
        staminaTextRef.current.innerText = state.isPlayerInLeak
          ? generateGarbage(3)
          : `${staminaPercent}%`;
      if (staminaRef.current)
        staminaRef.current.style.width = `${staminaPercent}%`;

      if (powerupRef.current) {
        let buffsHtml = "";
        if (state.player.speedTimer > 0) {
          buffsHtml += `<div class="bg-[#fbbf24]/20 border border-[#fbbf24] text-[#fbbf24] px-2 py-0.5 rounded flex justify-between items-center tracking-widest shadow-[0_0_5px_rgba(251,191,36,0.5)]"><span class="uppercase mr-3">SPEED</span><span>${Math.ceil(state.player.speedTimer)}s</span></div>`;
        }
        if (state.player.weaponTimer > 0) {
          buffsHtml += `<div class="bg-[#dc2626]/20 border border-[#dc2626] text-[#dc2626] px-2 py-0.5 rounded flex justify-between items-center tracking-widest shadow-[0_0_5px_rgba(220,38,38,0.5)]"><span class="uppercase mr-3">WPON</span><span>${Math.ceil(state.player.weaponTimer)}s</span></div>`;
        }
        powerupRef.current.innerHTML = buffsHtml
          ? `<div class="flex flex-col gap-1.5 mt-2">${buffsHtml}</div>`
          : "";
      }

      if (ammoRef.current)
        ammoRef.current.innerText = `${Math.floor(state.player.ammo)}`;

      if (wpn1Ref.current && wpn2Ref.current) {
        const is1 = state.player.selectedWeapon === 1;
        const clipPoly =
          "polygon(10% 0%, 90% 0%, 100% 15%, 100% 85%, 90% 100%, 10% 100%, 0% 85%, 0% 15%)";

        wpn1Ref.current.style.clipPath = clipPoly;
        wpn1Ref.current.className = `w-[110px] h-12 md:w-[120px] md:h-14 shrink-0 relative flex items-center justify-center font-mono text-sm md:text-base font-bold backdrop-blur-md transition-all ${is1 ? "bg-[#EF4444]/20/80 border-2 border-[#EF4444] shadow-[0_0_15px_rgba(244,63,94,0.4)] text-[#EF4444]" : "bg-[#0d1428]/60 border border-[#1e2b52] text-slate-500"}`;
        wpn1Ref.current.innerHTML = `<span class="z-10 text-[9px] md:text-[11px] font-black tracking-wider px-1.5 py-0.5 border-t border-b border-[#EF4444]/50 bg-[#EF4444]/20/80 drop-shadow-lg text-rose-100 uppercase whitespace-nowrap">BLASTER</span><div class="absolute top-1 left-2 text-slate-400 text-[8px] md:text-[9px] z-10 font-bold drop-shadow-md">1</div>`;

        wpn2Ref.current.style.clipPath = clipPoly;
        wpn2Ref.current.className = `w-[110px] h-12 md:w-[120px] md:h-14 shrink-0 relative flex items-center justify-center font-mono text-sm md:text-base font-bold backdrop-blur-md transition-all ${!is1 ? "bg-[#EF4444]/20/80 border-2 border-[#EF4444] shadow-[0_0_15px_rgba(244,63,94,0.4)] text-[#EF4444]" : "bg-[#0d1428]/60 border border-[#1e2b52] text-slate-500"}`;
        wpn2Ref.current.innerHTML = `<span class="z-10 text-[9px] md:text-[11px] text-center leading-tight font-black tracking-wider px-1.5 py-0.5 mt-2 border-t border-b border-slate-500/50 bg-[#0A0F1F]/80 drop-shadow-lg text-slate-100 uppercase">PLASMA<br/>CANNON</span><div class="absolute top-1 left-2 text-slate-400 text-[8px] md:text-[9px] z-10 font-bold drop-shadow-md">2</div>`;
      }

      if (dshRef.current) {
        const cd = state.player.dashCooldown;
        const isReady = cd <= 0 && state.player.stamina >= 15;
        const bgHeight = cd > 0 ? (cd / 3.0) * 100 : 0;
        dshRef.current.style.clipPath =
          "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)";
        let stateClass =
          "bg-[#0d1428]/80 border border-[#1e2b52] text-slate-500";
        if (isReady)
          stateClass =
            "bg-[#151f3d]/80 border border-slate-300 text-slate-200 shadow-[0_0_10px_rgba(255,255,255,0.2)]";
        else if (cd <= 0)
          stateClass =
            "bg-[#EF4444]/20/40 border border-red-900 text-[#EF4444] grayscale transition-colors duration-500 animate-pulse";

        dshRef.current.className = `w-14 h-12 md:w-[72px] md:h-14 shrink-0 relative flex flex-col items-center justify-center font-mono backdrop-blur-md transition-all duration-300 ${stateClass}`;

        let cdOverlay = "";
        if (cd > 0)
          cdOverlay = `<span class="z-20 absolute inset-0 flex items-center justify-center bg-[#0A0F1F]/50 text-white font-bold text-sm backdrop-blur-sm">${cd.toFixed(1)}s</span>`;
        else if (!isReady)
          cdOverlay = `<span class="z-20 absolute inset-0 flex items-center justify-center bg-[#EF4444]/20/70 text-[8px] md:text-[10px] text-red-400 leading-tight text-center font-bold">NO<br/>STM</span>`;

        dshRef.current.innerHTML = `
             <div class="absolute inset-0 overflow-hidden outline-none pointer-events-none">
                <div class="absolute bottom-0 left-0 right-0 bg-amber-500/20" style="height: ${bgHeight}%"></div>
             </div>
             <span class="z-10 text-[9px] md:text-[12px] font-black tracking-wider px-1 py-0.5 border-t border-b border-orange-500/50 bg-orange-950/80 drop-shadow-lg text-orange-100 uppercase">DASH</span>
             ${cdOverlay}
             <div class="absolute top-1 left-2 md:left-3 text-slate-400 text-[8px] md:text-[10px] z-10 font-bold drop-shadow-md">C</div>
          `;
      }

      if (shdSkillRef.current) {
        const cd = state.player.shieldCooldown;
        const isReady = cd <= 0 && state.player.stamina >= 20;
        const bgHeight = cd > 0 ? (cd / 5.0) * 100 : 0;
        shdSkillRef.current.style.clipPath =
          "polygon(10% 0%, 90% 0%, 100% 15%, 100% 85%, 90% 100%, 10% 100%, 0% 85%, 0% 15%)";
        let stateClass =
          "bg-[#0d1428]/80 border border-[#1e2b52] text-slate-500";
        if (isReady)
          stateClass =
            "bg-blue-950/80 border-2 border-blue-400 text-blue-300 shadow-[0_0_15px_rgba(96,165,250,0.4)]";
        else if (cd <= 0)
          stateClass =
            "bg-[#EF4444]/20/40 border border-red-900 text-[#EF4444] grayscale transition-colors duration-500 animate-pulse";

        shdSkillRef.current.className = `w-18 h-12 md:w-[84px] md:h-14 shrink-0 relative flex flex-col items-center justify-center font-mono backdrop-blur-md transition-all duration-300 ${stateClass}`;

        let cdOverlay = "";
        if (cd > 0)
          cdOverlay = `<span class="z-20 absolute inset-0 flex items-center justify-center bg-[#0A0F1F]/50 text-white font-bold text-sm md:text-base backdrop-blur-sm">${cd.toFixed(1)}s</span>`;
        else if (!isReady)
          cdOverlay = `<span class="z-20 absolute inset-0 flex items-center justify-center bg-[#EF4444]/20/70 text-[8px] md:text-[10px] text-red-400 leading-tight text-center font-bold">NO<br/>STM</span>`;

        shdSkillRef.current.innerHTML = `
             <div class="absolute inset-0 overflow-hidden outline-none pointer-events-none">
                <div class="absolute bottom-0 left-0 right-0 bg-blue-500/20" style="height: ${bgHeight}%"></div>
             </div>
             <span class="z-10 text-[9px] md:text-[11px] font-black tracking-widest px-1.5 py-0.5 border-t border-b border-blue-500/50 bg-blue-950/80 drop-shadow-lg text-blue-100 uppercase">SHIELD</span>
             ${cdOverlay}
             <div class="absolute top-1 left-2 md:left-3 text-slate-400 text-[8px] md:text-[10px] z-10 font-bold drop-shadow-md">E</div>
          `;
      }

      if (ocSkillRef.current) {
        const cd = state.overclockCooldown;
        const isReady = cd <= 0;
        const isActive = state.overclockTimer > 0;
        const bgHeight =
          cd > 0
            ? (cd / 30.0) * 100
            : isActive
              ? (state.overclockTimer / 5.0) * 100
              : 0;
        ocSkillRef.current.style.clipPath =
          "polygon(10% 0%, 90% 0%, 100% 15%, 100% 85%, 90% 100%, 10% 100%, 0% 85%, 0% 15%)";
        let stateClass =
          "bg-[#0d1428]/80 border border-[#1e2b52] text-slate-500";
        if (isActive)
          stateClass =
            "bg-fuchsia-950/80 border-2 border-fuchsia-400 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.7)] animate-pulse";
        else if (isReady)
          stateClass =
            "bg-fuchsia-950/40 border border-fuchsia-500 text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.2)]";

        ocSkillRef.current.className = `w-24 h-12 md:w-[100px] md:h-14 shrink-0 relative flex flex-col items-center justify-center font-mono backdrop-blur-md transition-all duration-300 ${stateClass}`;

        let cdOverlay = "";
        if (cd > 0)
          cdOverlay = `<span class="z-20 absolute inset-0 flex items-center justify-center bg-[#0A0F1F]/50 text-white font-bold text-sm md:text-base backdrop-blur-sm">${cd.toFixed(0)}s</span>`;

        ocSkillRef.current.innerHTML = `
             <div class="absolute inset-0 overflow-hidden outline-none pointer-events-none">
                <div class="absolute bottom-0 left-0 right-0 ${isActive ? "bg-fuchsia-500/50" : "bg-fuchsia-500/20"}" style="height: ${bgHeight}%"></div>
             </div>
             <span class="z-10 text-[8.5px] md:text-[10px] font-black tracking-widest px-1 py-0.5 border-t border-b border-fuchsia-500/50 bg-fuchsia-950/80 drop-shadow-lg text-fuchsia-100 uppercase">OVERDRIVE</span>
             ${cdOverlay}
             <div class="absolute top-1 left-2 md:left-3 text-slate-400 text-[8px] md:text-[10px] z-10 font-bold drop-shadow-md">F</div>
          `;
      }

      // Check Death
      if (state.player.hp <= 0 && !state.isGameOver) {
        state.isGameOver = true;
        isDeadRef.current = true;

        // --- Black Box (Death Logging) ---
        // Find last damage source via anomalies or assume from nearby enemies
        const hazards = state.anomalies.map((a: any) => a.type);
        const currentWave = Math.floor(state.diffTimer / 60) + 1;
        const snapshot = {
          timestamp: Date.now(),
          algorithm: state.currentAlgo,
          wave: currentWave,
          causeOfDeath: state.lastDamageSource || "HP_DEPLETED",
          enemiesOnScreen: state.enemies.length,
          activeHazards: [...new Set(hazards)] as string[],
          sessionDuration: state.elapsed || 0,
        };
        BlackBox.recordDeath(snapshot);

        soundManager.stopBGM();
        soundManager.setLowRamEffect(false);
        onGameOverRef.current(state.score, false, snapshot.causeOfDeath, {
          kills: state.kills,
          credits: state.credits,
          timeSurvived: state.gameTime,
          algorithm: state.currentAlgo
        });
      }

      // 6. Drone Auto-Turret (CPU Scheduling mechanism visualization)
      state.drones.forEach((drone: any) => {
        if (state.thrashTimer > 0) return; // Frozen

        if (drone.fireTimer === undefined) drone.fireTimer = 0;
        drone.fireTimer -= dt;

        if (drone.targetId !== null) {
          const target =
            state.enemies.find((e: any) => e.id === drone.targetId) ||
            state.enemyBullets.find(
              (b: any) => b.id === drone.targetId && b.life > 0,
            );
          if (target) {
            // Fetch real drone positions derived by OS-Scheduling behavior
            const droneX = drone.x || state.player.x;
            const droneY = drone.y || state.player.y;

            const dx = target.x - droneX;
            const dy = target.y - droneY;
            const dist = Math.hypot(dx, dy);
            if (dist < droneRangeRef.current) {
              // Apply continuous laser damage
              let ocActive = state.overclockTimer > 0;
              const damageMult =
                (ocActive ? 1.0 : 0.5) * state.player.damageMult;
              const dmgPerSec = 34 * (ocActive ? 20 : 5) * damageMult;

              target.hp -= dmgPerSec * dt;

              if (target.hp <= 0) {
                if (target.renderer) target.renderer.triggerDestruction();
                else target.life = -1; // It's a bullet!
              } else if (target.renderer) {
                target.renderer.triggerShield();
              }

              target.flashTimer = 0.1;

              // Occasionally pop damage numbers to give feedback
              if (drone.fireTimer <= 0) {
                const isCrit = Math.random() < 0.25;
                const dmgPop = 34 * damageMult * (isCrit ? 2.5 : 1.0);
                const tRadius = target.radius || 8;
                state.damageNumbers.push({
                  x: target.x + (Math.random() - 0.5) * 20,
                  y: target.y - tRadius - 10 + (Math.random() - 0.5) * 20,
                  amount: Math.ceil(dmgPop),
                  life: 1.0,
                  vy: -30,
                  isCrit,
                  text: !target.renderer && isCrit ? "INTERCEPTED!" : undefined,
                });
                drone.fireTimer = state.overclockTimer > 0 ? 0.05 : 0.2;
                // Create particle sparks at the hit point
                for (let i = 0; i < 3; i++) {
                  const sparkColor = ocActive ? "#fff" : "#00D9FF";
                  state.particles.push({
                    x: target.x + (Math.random() - 0.5) * tRadius,
                    y: target.y + (Math.random() - 0.5) * tRadius,
                    vx: (Math.random() - 0.5) * 100,
                    vy: (Math.random() - 0.5) * 100,
                    life: 0.2 + Math.random() * 0.2,
                    maxLife: 0.4,
                    radius: Math.random() * 2 + 1,
                    color: sparkColor,
                    isDebris: false,
                    shape: "rect",
                  });
                }
              }
            }
          }
        }
      });

      // Passive HP Regeneration
      if (state.player.hp < prevHp) {
        state.player.regenDelay = 3.0; // Wait 3 seconds after taking damage
      } else if (state.player.hp > 0 && state.player.hp < state.player.maxHp) {
        if (state.player.regenDelay > 0) {
          state.player.regenDelay -= dt;
        } else if (
          !state.player.isBoosting &&
          state.player.stamina > 0 &&
          !state.isPlayerInLeak
        ) {
          state.player.hp = Math.min(
            state.player.maxHp,
            state.player.hp + 5 * dt,
          ); // 5 HP per second
        }
      }

      // 7. RENDER
      render(ctx, canvas, state, cameraX, cameraY, dt);
    };

    const render = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      state: any,
      cameraX: number,
      cameraY: number,
      dt: number,
    ) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const zoom = state.currentZoom || 1.0;
      const effW = canvas.width / zoom;
      const effH = canvas.height / zoom;

      let shakeX = 0;
      let shakeY = 0;
      if (state.screenShakeTimer > 0) {
        const intensity =
          state.screenShakeTimer > 0
            ? Math.min(state.screenShakeTimer * 5, 20)
            : 0;
        shakeX = (Math.random() - 0.5) * intensity;
        shakeY = (Math.random() - 0.5) * intensity;
      }

      ctx.save();
      ctx.scale(zoom, zoom);
      ctx.translate(-cameraX + shakeX, -cameraY + shakeY);

      // Out of bounds background
      ctx.fillStyle = "#03050a"; // darker void
      ctx.fillRect(cameraX, cameraY, effW, effH);

      // Playable area background (space) safe zone
      ctx.fillStyle = "#070a14"; // very dark blue space
      ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

      // Hazard Zone Warning Borders
      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)"; // Red glowing border
      ctx.lineWidth = 10;
      ctx.shadowBlur = 30;
      ctx.shadowColor = "rgba(239, 68, 68, 0.8)";
      ctx.strokeRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

      ctx.strokeStyle = "rgba(239, 68, 68, 0.1)"; // Faded outer border
      ctx.lineWidth = 50;
      ctx.shadowBlur = 0;
      ctx.strokeRect(-25, -25, MAP_WIDTH + 50, MAP_HEIGHT + 50);

      // If in hazard zone, render an overlay pulse just on the safe zone to make it look active
      if (state.inHazardZone) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.05)";
        ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
      }

      const now = performance.now() / 1000;

      // Render Nebula
      if (nebulaCanvas) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        // Draw slightly transformed to give deep parallax and slow drift
        const nx = MAP_WIDTH / 2 + cameraX * 0.05 + Math.sin(now * 0.05) * 100;
        const ny = MAP_HEIGHT / 2 + cameraY * 0.05 + Math.cos(now * 0.05) * 50;
        ctx.translate(nx, ny);
        ctx.drawImage(
          nebulaCanvas,
          -MAP_WIDTH / 2,
          -MAP_HEIGHT / 2,
          MAP_WIDTH,
          MAP_HEIGHT,
        );
        ctx.restore();
      }

      // Render Planets
      if (planetBlueRing) {
        const px = MAP_WIDTH * 0.2 + cameraX * 0.1 - now * 0.5;
        const py = MAP_HEIGHT * 0.4 + cameraY * 0.1 + Math.sin(now * 0.1) * 30;
        const size = 48 * 8; // Scale up 8x for retro chunky pixel art
        ctx.drawImage(planetBlueRing, px - size / 2, py - size / 2, size, size);
      }
      if (planetPurpleRing) {
        const px = MAP_WIDTH * 0.8 + cameraX * 0.15 + now * 1;
        const py = MAP_HEIGHT * 0.6 + cameraY * 0.15 - Math.cos(now * 0.2) * 20;
        const size = 48 * 8;
        ctx.drawImage(
          planetPurpleRing,
          px - size / 2,
          py - size / 2,
          size,
          size,
        );
      }
      if (planetOrange) {
        const px = MAP_WIDTH * 0.6 + cameraX * 0.12 + now * 2;
        const py =
          MAP_HEIGHT * 0.3 + cameraY * 0.12 + Math.sin(now * 0.15) * 40;
        const size = 32 * 8;
        ctx.drawImage(planetOrange, px - size / 2, py - size / 2, size, size);
      }
      if (planetGreen) {
        const px = MAP_WIDTH * 0.85 + cameraX * 0.2 - now * 3;
        const py = MAP_HEIGHT * 0.8 + cameraY * 0.2 + Math.cos(now * 0.3) * 15;
        const size = 16 * 8;
        ctx.drawImage(planetGreen, px - size / 2, py - size / 2, size, size);
      }
      if (planetRed) {
        const px = MAP_WIDTH * 0.45 + cameraX * 0.18 + now * 0.8;
        const py =
          MAP_HEIGHT * 0.25 + cameraY * 0.18 - Math.sin(now * 0.05) * 50;
        const size = 16 * 8;
        ctx.drawImage(planetRed, px - size / 2, py - size / 2, size, size);
      }

      // Render Stars
      stars.forEach((star) => {
        const px = star.x + cameraX * star.parallax;
        const py = star.y + cameraY * star.parallax;

        // cull offscreen stars based on parallax position
        if (
          px >= cameraX &&
          px <= cameraX + canvas.width &&
          py >= cameraY &&
          py <= cameraY + canvas.height
        ) {
          const twinkleAlpha =
            star.alpha + Math.sin(now * 3 + star.twinkle) * 0.2;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, twinkleAlpha)})`;

          if (star.isRare) {
            // Draw a retro glowing cross star
            const s = star.r * 2;
            ctx.fillRect(px - s / 2, py - s / 6, s, s / 3); // horizontal bar
            ctx.fillRect(px - s / 6, py - s / 2, s / 3, s); // vertical bar

            // Draw some extra glowing dots
            ctx.fillStyle = `rgba(147, 197, 253, ${Math.max(0, twinkleAlpha - 0.2)})`; // light blue
            ctx.fillRect(px - s / 4, py - s / 4, s / 2, s / 2);
          } else {
            // Draw standard chunky pixel stars (squares instead of circles)
            ctx.fillRect(px, py, star.r, star.r);
          }
        }
      });

      // Environmental Scars (Debris from dead massive entities)
      state.scars.forEach((scar: any) => {
        if (
          scar.x < cameraX - scar.size ||
          scar.x > cameraX + effW + scar.size ||
          scar.y < cameraY - scar.size ||
          scar.y > cameraY + effH + scar.size
        )
          return; // cull offscreen
        ctx.save();
        ctx.translate(scar.x, scar.y);
        ctx.rotate(scar.rotation);

        ctx.fillStyle = "rgba(40, 45, 55, 0.4)";
        ctx.fillRect(-scar.size / 2, -scar.size / 2, scar.size, scar.size);

        // Add random scorched marks to the scar
        ctx.fillStyle = "rgba(10, 15, 31, 0.8)";
        ctx.fillRect(
          -scar.size / 4,
          -scar.size / 4,
          scar.size / 2,
          scar.size / 2,
        );

        ctx.strokeStyle = "rgba(10, 15, 31, 0.5)";
        ctx.lineWidth = 2;
        ctx.strokeRect(-scar.size / 2, -scar.size / 2, scar.size, scar.size);

        ctx.restore();
      });

      // Asteroids
      state.asteroids.forEach((a: any) => {
        // Cull offscreen
        if (
          a.x < cameraX - a.radius ||
          a.x > cameraX + effW + a.radius ||
          a.y < cameraY - a.radius ||
          a.y > cameraY + effH + a.radius
        )
          return;

        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.angle);

        // Base 3D Asteroid Shape
        ctx.beginPath();
        const points = 8;
        const asteroidPts = [];
        for (let i = 0; i < points; i++) {
          const angle = ((Math.PI * 2) / points) * i;
          // Predictable irregularity based on asteroid ID
          const r =
            a.radius * (0.8 + ((Math.sin(a.id * 10 + i) + 1) / 2) * 0.4);
          const px = i === 0 ? r : Math.cos(angle) * r;
          const py = i === 0 ? 0 : Math.sin(angle) * r;
          asteroidPts.push({ x: px, y: py });
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Deep space 3D shading gradient
        const grad = ctx.createRadialGradient(
          -a.radius * 0.3,
          -a.radius * 0.3,
          0,
          0,
          0,
          a.radius * 1.2,
        );
        grad.addColorStop(0, "#475569"); // Highlight rim
        grad.addColorStop(0.4, "#1e293b"); // Midtone rock
        grad.addColorStop(1, "#0A0F1F"); // Pitch black shadow

        ctx.fillStyle = grad;
        ctx.fill();

        // High-Tech HUD Scan Overlay (Wireframe lines on the rocks)
        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)"; // Sharper Cyan
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner Craters
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = a.id + i * ((Math.PI * 2) / 3);
          const dist = a.radius * 0.4;
          const cx = Math.cos(angle) * dist;
          const cy = Math.sin(angle) * dist;
          const cr =
            a.radius * (0.15 + ((Math.sin(a.id * 5 + i) + 1) / 2) * 0.15);

          ctx.moveTo(cx + cr, cy);
          ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        }
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Dark crater shadow
        ctx.fill();
        ctx.strokeStyle = "#0A0F1F";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Surface Fractures
        ctx.beginPath();
        ctx.moveTo(asteroidPts[0].x, asteroidPts[0].y);
        ctx.lineTo(0, 0);
        ctx.lineTo(asteroidPts[3].x, asteroidPts[3].y);
        ctx.moveTo(0, 0);
        ctx.lineTo(asteroidPts[5].x, asteroidPts[5].y);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Kla'ed Energy Crystals embedded in some asteroids
        if (a.id % 3 === 0 || a.id % 7 === 0) {
          const isRose = a.id % 3 === 0;
          ctx.fillStyle = isRose ? "#EF4444" : "#6366F1"; // Rose or Purple crystals
          ctx.shadowBlur = 15;
          ctx.shadowColor = ctx.fillStyle;

          ctx.beginPath();
          // Draw a sharp crystal shard
          ctx.moveTo(-a.radius * 0.2, 0);
          ctx.lineTo(0, a.radius * 0.4);
          ctx.lineTo(a.radius * 0.2, 0);
          ctx.lineTo(0, -a.radius * 0.2);
          ctx.closePath();
          ctx.fill();

          // Add a bright core to the crystal
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.moveTo(-a.radius * 0.05, 0);
          ctx.lineTo(0, a.radius * 0.2);
          ctx.lineTo(a.radius * 0.05, 0);
          ctx.closePath();
          ctx.fill();
        }

        // Holographic Telemetry HP bar (only shows if damaged)
        if (a.hp < 200 + civilizationLevel * 100) {
          const maxHp = 200 + civilizationLevel * 100;
          ctx.rotate(-a.angle); // Un-rotate so the HP bar is always horizontal

          const barW = a.radius * 1.5;
          const yOff = -a.radius - 20;

          ctx.fillStyle = "rgba(2, 6, 23, 0.8)";
          ctx.fillRect(-barW / 2, yOff, barW, 4);

          ctx.fillStyle = "rgba(244, 63, 94, 0.8)"; // Rose color for hazard HP
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#EF4444";
          ctx.fillRect(-barW / 2, yOff, barW * (a.hp / maxHp), 4);
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      });

      // === SPACETIME ANOMALIES RENDERING ===
      (state.anomalies || []).forEach((ano: any) => {
        if (
          ano.x < cameraX - ano.r * 3 ||
          ano.x > cameraX + effW + ano.r * 3 ||
          ano.y < cameraY - ano.r * 3 ||
          ano.y > cameraY + effH + ano.r * 3
        )
          return;

        if (ano.type === "black_hole") {
          ctx.save();
          ctx.translate(ano.x, ano.y);
          ctx.rotate(ano.rotation);

          // Accretion Disk (multiple layers)
          const gradient = ctx.createRadialGradient(
            0,
            0,
            ano.r * 0.8,
            0,
            0,
            ano.r * 2.5,
          );
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
          gradient.addColorStop(0.2, "rgba(236, 72, 153, 0.6)"); // Pinkish
          gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.3)"); // Purple
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, ano.r * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Swirl lines
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
          ctx.lineWidth = 2;
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(
              0,
              0,
              ano.r * (1.2 + i * 0.3),
              (i * Math.PI) / 2,
              (i * Math.PI) / 2 + Math.PI,
            );
            ctx.stroke();
          }

          // Event Horizon
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(0, 0, ano.r, 0, Math.PI * 2);
          ctx.fill();

          // Subtle glowing edge for the event horizon
          ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, ano.r, 0, Math.PI * 2);
          ctx.stroke();

          // Gravitational lensing effect (fake with a faint white/blue glowing ring slightly outside)
          ctx.strokeStyle = "rgba(147, 197, 253, 0.4)";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(0, 0, ano.r * 1.3, 0, Math.PI * 2);
          ctx.stroke();

          ctx.restore();
        } else if (ano.type === "memory_leak") {
          ctx.save();
          ctx.translate(ano.x, ano.y);

          // Glitchy binary rain / static clip area
          ctx.beginPath();
          ctx.arc(0, 0, ano.r, 0, Math.PI * 2);
          ctx.clip();

          ctx.fillStyle = "rgba(17, 24, 39, 0.8)"; // dark background overlay
          ctx.fillRect(-ano.r, -ano.r, ano.r * 2, ano.r * 2);

          ctx.fillStyle = "#10b981"; // code green
          ctx.font = "12px Courier";
          for (let i = 0; i < Math.min(100, Math.floor(ano.r / 5)); i++) {
            const rx = (Math.random() - 0.5) * 2 * ano.r;
            const ry = (Math.random() - 0.5) * 2 * ano.r;
            ctx.globalAlpha = Math.random();
            ctx.fillText(Math.random() > 0.5 ? "0" : "1", rx, ry);
          }

          // Chunky static rectangles
          ctx.globalAlpha = 1.0;
          for (let i = 0; i < Math.min(30, Math.floor(ano.r / 10)); i++) {
            ctx.fillStyle =
              Math.random() > 0.5
                ? "rgba(34, 197, 94, 0.2)"
                : "rgba(239, 68, 68, 0.1)";
            ctx.fillRect(
              (Math.random() - 0.5) * 2 * ano.r,
              (Math.random() - 0.5) * 2 * ano.r,
              Math.random() * 80 + 10,
              Math.random() * 20 + 5,
            );
          }

          // Inner core for sacrifice
          if (ano.state === "growing") {
            ctx.beginPath();
            ctx.arc(0, 0, ano.sacrificeDist, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]);
          }

          ctx.restore();

          // Glitch Boundary edge
          ctx.save();
          ctx.translate(ano.x, ano.y);
          ctx.beginPath();
          ctx.arc(0, 0, ano.r, 0, Math.PI * 2);
          ctx.strokeStyle = Math.random() > 0.5 ? "#10b981" : "#ef4444";
          ctx.lineWidth = 4 + Math.random() * 4;
          ctx.stroke();
          ctx.restore();
        }
      });

      // Game Boundary rendering removed as requested.

      // Enemies
      const currentWave = Math.floor(state.diffTimer / 60) + 1;
      let hasMalwareRender = state.enemies.some(
        (e: any) => e.type === "malware",
      );
      let currentActiveAlgoRender = hasMalwareRender
        ? ("FCFS" as SchedulerAlgo)
        : (state.currentAlgo as SchedulerAlgo);

      let cfg = { algo: currentActiveAlgoRender, cores: 2, quantum: 0.5 };
      if (currentWave === 2) {
        cfg.cores = 3;
        cfg.quantum = 0.8;
      } else if (currentWave === 3) {
        cfg.cores = 4;
        cfg.quantum = 0.4;
      } else if (currentWave >= 4) {
        cfg.cores = Math.min(8, 3 + Math.floor((currentWave - 4) / 2));
        cfg.quantum = 0.5;
      }

      if (state.overclockTimer > 0) {
        cfg.cores = Math.min(12, cfg.cores + 4);
      }

      // Draw inactive enemies first, then active to layer correctly
      const renderEnemy = (e: any, activeData: any) => {
        const isActive = !!activeData;
        ctx.save();
        ctx.translate(e.x, e.y);

        ctx.scale(e.spawnScale, e.spawnScale);

        // Removed specific `isActive` checks for special states because they always apply now
        const isDroneTarget = isActive;

        if (isDroneTarget) {
          ctx.beginPath();
          ctx.arc(0, 0, e.radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = "#00D9FF"; // Cyan Drone Lock
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 6]);
          ctx.stroke();
          ctx.setLineDash([]);

          // RR Timer Bar
          if (cfg.algo === "RR" && activeData.timeRemaining !== undefined) {
            const ratio = Math.max(0, activeData.timeRemaining / cfg.quantum);
            ctx.beginPath();
            ctx.arc(
              0,
              0,
              e.radius + 6,
              -Math.PI / 2,
              -Math.PI / 2 + Math.PI * 2 * ratio,
            );
            ctx.strokeStyle = "#EF4444"; // Rose
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        } else if (e.W > 1.5 && cfg.algo === "HRRN") {
          ctx.beginPath();
          ctx.arc(0, 0, e.radius + 3 + Math.sin(now * 8) * 2, 0, Math.PI * 2);
          ctx.strokeStyle = "#fbbf24";
          ctx.globalAlpha = Math.min(0.8, (e.W - 1.5) / 4.0);
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Spawn indicator
        if (e.spawnScale < 1) {
          ctx.beginPath();
          ctx.arc(0, 0, e.radius * (1 / e.spawnScale) * 1.5, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        if (e.renderer) {
          const ex = state.player.x - e.x;
          const ey = state.player.y - e.y;
          const eAngle = Math.atan2(ey, ex) + Math.PI / 2;

          ctx.save();
          ctx.rotate(eAngle);

          // Add colored glow behind the sprite depending on if targeted
          ctx.shadowBlur = isDroneTarget ? 20 : 10;
          ctx.shadowColor = isDroneTarget
            ? "#00D9FF"
            : e.type === "malware"
              ? "#ef4444"
              : "#be123c";

          if (e.type === "malware") {
            // Glitch offset
            ctx.save();
            ctx.translate(
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
            );
            ctx.globalAlpha = 0.5;
            e.renderer.draw(ctx, 0, 0);
            ctx.restore();
            ctx.filter = `hue-rotate(${Math.random() * 360}deg) saturate(2)`;
          }

          e.renderer.draw(ctx, 0, 0);

          if (e.type === "malware") {
            ctx.filter = "none";
          }

          // reset shadow for other things
          ctx.shadowBlur = 0;
          ctx.restore();

          if (e.flashTimer > 0) {
            ctx.save();
            ctx.rotate(eAngle);
            ctx.globalCompositeOperation = "source-atop";
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.fillRect(
              -e.radius * 2,
              -e.radius * 2,
              e.radius * 4,
              e.radius * 4,
            );
            ctx.restore();
          }
        } else if (e.type.startsWith("boss")) {
          const ex = state.player.x - e.x;
          const ey = state.player.y - e.y;
          let eAngle = Math.atan2(ey, ex) + Math.PI / 2;
          if (e.type === "boss_rr") eAngle = e.rotationAngle || 0;

          ctx.save();
          ctx.rotate(eAngle);
          ctx.shadowBlur = isDroneTarget ? 40 : 20;
          ctx.shadowColor = isDroneTarget ? "#00D9FF" : "#be123c";

          const img = ASSETS_CACHE.bossImages[e.type];
          if (img) {
            const drawW = e.radius * 2.5;
            const drawH = e.radius * 2.5;
            ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, e.radius, 0, Math.PI * 2);
            ctx.fillStyle = e.color;
            ctx.fill();
          }
          ctx.shadowBlur = 0;

          if (e.flashTimer > 0 && img) {
            // Primitive flash (won't exactly clip to the png bounds without buffer, but works for effect)
            ctx.beginPath();
            ctx.arc(0, 0, e.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.fill();
          }
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, e.radius, 0, Math.PI * 2);

          if (e.flashTimer > 0) {
            ctx.fillStyle = "#ffffff";
          } else {
            ctx.fillStyle = e.color;
          }

          ctx.fill();
          ctx.strokeStyle = isDroneTarget ? "#00D9FF" : "#0A0F1F";
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // HRRN / Priority Queue Indicator
        const inReadyQueue = state.readyQueue.includes(e.id);
        if (
          showSchedulingIndicatorsRef.current &&
          !isDroneTarget &&
          e.spawnScale >= 1 &&
          inReadyQueue
        ) {
          const pMult = e.priority || 1;
          if (cfg.algo === "HRRN") {
            const R = ((e.W + e.S) / Math.max(0.1, e.S)) * pMult;
            ctx.fillStyle = pMult > 1 ? "#EF4444" : "#fbbf24";
            ctx.font = pMult > 1 ? "bold 10px monospace" : "8px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
              pMult > 1 ? `! P:${R.toFixed(1)} !` : `P:${R.toFixed(1)}`,
              0,
              e.radius + 14,
            );
          } else if (cfg.algo === "FCFS") {
            // FCFS Wait Time
            ctx.fillStyle = pMult > 1 ? "#EF4444" : "#94a3b8";
            ctx.font = pMult > 1 ? "bold 10px monospace" : "8px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
              pMult > 1
                ? `! OBS:${Math.floor(e.W * pMult)}s !`
                : `OBS:${Math.floor(e.W)}s`,
              0,
              e.radius + 14,
            );
          } else if (cfg.algo === "RR") {
            ctx.fillStyle = pMult > 1 ? "#EF4444" : "#6366F1";
            ctx.font = pMult > 1 ? "bold 10px monospace" : "8px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
              pMult > 1
                ? `! Q:${Math.floor(e.W * pMult)}s !`
                : `Q:${Math.floor(e.W)}s`,
              0,
              e.radius + 14,
            );
          }
        }

        // HP Bar (visible when damaged or actively engaged)
        if ((e.hp < e.maxHp || isActive) && e.hp > 0) {
          const hpWidth = e.radius * 2;
          const hpHeight = 3;
          const yOffset = -e.radius - 14;

          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.fillRect(-hpWidth / 2, yOffset, hpWidth, hpHeight);

          const hpPct = Math.max(0, Math.min(1, e.hp / e.maxHp));
          if (hpPct > 0.6)
            ctx.fillStyle = "#10b981"; // Green
          else if (hpPct > 0.3)
            ctx.fillStyle = "#fbbf24"; // Yellow
          else ctx.fillStyle = "#ef4444"; // Red

          ctx.fillRect(-hpWidth / 2, yOffset, hpWidth * hpPct, hpHeight);
        }
        ctx.restore();
      };

      state.enemies.forEach((e: any) => {
        const assignedDrone = state.drones.find(
          (d: any) => d.targetId === e.id,
        );
        renderEnemy(e, assignedDrone || null);
      });

      // Queue Sorting Visualization removed for cleaner battlefield

      // OS Messages handled in JSX HUD

      // Damage Numbers
      state.damageNumbers.forEach((d: any) => {
        if (d.life <= 0) return;
        ctx.save();
        ctx.translate(d.x, d.y);
        const t = 1.0 - d.life; // 0 to 1

        // Scale punch effect
        let scale = 1.0;
        if (t < 0.2) scale = 1.0 + (0.2 - t) * 5; // Pop up
        ctx.scale(scale, scale);

        ctx.globalAlpha = Math.max(0, Math.min(1, d.life * 2));

        const text =
          d.text ||
          (d.isCrit
            ? `${Math.ceil(d.amount)} CRIT`
            : Math.ceil(d.amount).toString());

        let finalSize = "20px";
        if (d.text) finalSize = "14px"; // make logic swap text a bit smaller
        if (d.isCrit) finalSize = "26px";

        ctx.font = `bold ${finalSize} "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.strokeStyle = "#000";
        ctx.lineWidth = d.text ? 4 : d.isCrit ? 5 : 3;
        ctx.lineJoin = "round";
        ctx.strokeText(text, 0, 0);

        if (d.color) {
          ctx.fillStyle = d.color;
        } else if (d.isCrit) {
          // Cyan or Red based on time to make it flash
          ctx.fillStyle = Math.floor(t * 15) % 2 === 0 ? "#00D9FF" : "#ef4444"; // Cyan and Red flash
        } else {
          ctx.fillStyle = "#facc15"; // yellow text
        }

        ctx.fillText(text, 0, 0);

        ctx.restore();
      });

      // Player
      ctx.save();
      ctx.translate(state.player.x, state.player.y);

      // Aura Effects
      if (state.player.speedTimer > 0) {
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          state.player.radius + 12 + Math.sin(now * 15) * 2,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      if (state.player.weaponTimer > 0) {
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          state.player.radius + 8 + Math.cos(now * 20) * 2,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = "#dc2626";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (state.player.shield > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, state.player.radius + 18, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${Math.min(0.5, state.player.shield / 100)})`;
        ctx.fill();
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Render Auto-Target Drones (Cores)
      // Drones
      state.drones.forEach((drone: any) => {
        const dx =
          drone.x !== undefined
            ? drone.x - state.player.x
            : Math.cos(drone.orbitAngle) * 80;
        const dy =
          drone.y !== undefined
            ? drone.y - state.player.y
            : Math.sin(drone.orbitAngle) * 80;

        let droneColor = "#38bdf8";
        let shadowColor = "#0ea5e9";
        if (state.currentAlgo === "FCFS") {
          droneColor = "#3b82f6";
          shadowColor = "#2563eb";
        } else if (state.currentAlgo === "RR") {
          droneColor = "#10b981";
          shadowColor = "#059669";
        } else if (state.currentAlgo === "HRRN") {
          droneColor = "#EF4444";
          shadowColor = "#e11d48";
        }

        // Draw Drone Trail
        if (drone.trail && drone.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(
            drone.trail[0].x - state.player.x,
            drone.trail[0].y - state.player.y,
          );
          for (let i = 1; i < drone.trail.length; i++) {
            ctx.lineTo(
              drone.trail[i].x - state.player.x,
              drone.trail[i].y - state.player.y,
            );
          }
          // Also connect to current pos
          ctx.lineTo(dx, dy);
          ctx.strokeStyle = droneColor;
          ctx.lineWidth = 3;
          ctx.shadowBlur = 10;
          ctx.shadowColor = droneColor;
          // Fade trail towards its tail
          const grad = ctx.createLinearGradient(
            drone.trail[0].x - state.player.x,
            drone.trail[0].y - state.player.y,
            dx,
            dy,
          );
          grad.addColorStop(0, "transparent");
          grad.addColorStop(1, droneColor);
          ctx.strokeStyle = grad;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Draw drone body
        ctx.beginPath();
        ctx.arc(dx, dy, 6, 0, Math.PI * 2);

        if (drone.targetId !== null) {
          ctx.shadowBlur = 15;
        } else {
          ctx.shadowBlur = 5;
        }
        ctx.fillStyle = droneColor;
        ctx.shadowColor = shadowColor;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw drone laser pointer to target
        if (drone.targetId !== null) {
          const target =
            state.enemies.find((e: any) => e.id === drone.targetId) ||
            state.enemyBullets.find(
              (b: any) => b.id === drone.targetId && b.life > 0,
            );
          if (target) {
            const targetX = target.x - state.player.x;
            const targetY = target.y - state.player.y;

            // Add jitter to make it look energetic
            const jitterX = (Math.random() - 0.5) * 4;
            const jitterY = (Math.random() - 0.5) * 4;
            const finalHitX = targetX + jitterX;
            const finalHitY = targetY + jitterY;

            ctx.beginPath();
            ctx.moveTo(dx, dy);
            ctx.lineTo(finalHitX, finalHitY);

            // Continuous thick laser drawing
            ctx.strokeStyle = droneColor;
            ctx.lineWidth = state.overclockTimer > 0 ? 6 : 3;
            ctx.shadowBlur = 20;
            ctx.shadowColor = droneColor;
            ctx.stroke();

            // Inner Core with blooming
            ctx.beginPath();
            ctx.moveTo(dx, dy);
            ctx.lineTo(finalHitX, finalHitY);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = state.overclockTimer > 0 ? 3 : 1;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#ffffff";
            ctx.stroke();

            // Impact effect / bright white flare at the endpoint
            ctx.beginPath();
            ctx.arc(
              finalHitX,
              finalHitY,
              state.overclockTimer > 0 ? 8 : 4,
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 20;
            ctx.shadowColor = droneColor;
            ctx.fill();

            // Draw a second smaller spark core for the flare
            ctx.beginPath();
            ctx.arc(
              finalHitX,
              finalHitY,
              state.overclockTimer > 0 ? 4 : 2,
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#ffffff";
            ctx.fill();

            ctx.shadowBlur = 0;
          }
        }
      });

      // Drone Range Indicator
      ctx.beginPath();
      ctx.arc(
        state.player.x,
        state.player.y,
        droneRangeRef.current,
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = "rgba(56, 189, 248, 0.15)"; // light cyan/blue
      ctx.lineWidth = 1;
      ctx.setLineDash([10, 20]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(56, 189, 248, 0.03)";
      ctx.fill();

      // Gun barrel / Player Sprite
      const dx = state.mouse.x - state.player.x;
      const dy = state.mouse.y - state.player.y;
      const angle = Math.atan2(dy, dx);

      if (playerRenderer) {
        ctx.save();
        ctx.rotate(angle + Math.PI / 2);

        ctx.shadowBlur = 20;
        ctx.shadowColor = "#0ea5e9"; // Cyan glow

        if (state.isPlayerInLeak) {
          ctx.globalAlpha = 0.5 + Math.random() * 0.3;
          ctx.save();
          ctx.translate(-5 + Math.random() * 10, -5 + Math.random() * 10);
          if (ctx.filter !== undefined) ctx.filter = "hue-rotate(90deg)";
          playerRenderer.draw(ctx, 0, 0);
          ctx.restore();

          ctx.save();
          ctx.translate(-5 + Math.random() * 10, -5 + Math.random() * 10);
          if (ctx.filter !== undefined) ctx.filter = "hue-rotate(-90deg)";
          playerRenderer.draw(ctx, 0, 0);
          ctx.restore();

          ctx.globalAlpha = 1.0;
          playerRenderer.draw(ctx, 0, 0);
        } else {
          playerRenderer.draw(ctx, 0, 0);
        }
        ctx.shadowBlur = 0;
        ctx.restore();
      } else {
        ctx.rotate(angle);
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(state.player.radius - 2, -5, 16, 10);

        ctx.rotate(-angle);
        ctx.beginPath();
        ctx.arc(0, 0, state.player.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#00D9FF";
        ctx.fill();
        ctx.strokeStyle = "#F8FAFC";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.restore();

      // Collectibles
      state.collectibles.forEach((c: any) => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.globalAlpha = Math.min(1, c.life);
        if (c.type === "health") {
          ctx.fillStyle = "#10b981"; // Green
          ctx.fillRect(-8, -8, 16, 16);
          ctx.fillStyle = "#fff";
          ctx.fillRect(-2, -6, 4, 12);
          ctx.fillRect(-6, -2, 12, 4);
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 10;
          ctx.strokeRect(-8, -8, 16, 16);
        } else if (c.type === "shield") {
          ctx.fillStyle = "#3b82f6"; // Blue
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.shadowColor = "#3b82f6";
          ctx.shadowBlur = 10;
        } else if (c.type === "speed") {
          ctx.fillStyle = "#fbbf24"; // Yellow
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(8, 2);
          ctx.lineTo(2, 2);
          ctx.lineTo(0, 10);
          ctx.lineTo(-8, -2);
          ctx.lineTo(-2, -2);
          ctx.closePath();
          ctx.fill();
          ctx.shadowColor = "#fbbf24";
          ctx.shadowBlur = 10;
        } else if (c.type === "weapon") {
          ctx.fillStyle = "#dc2626"; // Red
          ctx.fillRect(-8, -4, 16, 8);
          ctx.fillStyle = "#fff";
          ctx.fillRect(-4, -4, 2, 8);
          ctx.fillRect(2, -4, 2, 8);
          ctx.shadowColor = "#dc2626";
          ctx.shadowBlur = 10;
        } else if (c.type === "stamina") {
          ctx.fillStyle = "#a855f7"; // Purple
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(8, -2);
          ctx.lineTo(4, -2);
          ctx.lineTo(4, 10);
          ctx.lineTo(-4, 10);
          ctx.lineTo(-4, -2);
          ctx.lineTo(-8, -2);
          ctx.closePath();
          ctx.fill();
          ctx.shadowColor = "#a855f7";
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = "#00D9FF"; // Cyan / Energy
          ctx.fillRect(-8, -6, 16, 12);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.strokeRect(-8, -6, 16, 12);
          ctx.beginPath();
          ctx.moveTo(-4, -6);
          ctx.lineTo(-4, 6);
          ctx.moveTo(4, -6);
          ctx.lineTo(4, 6);
          ctx.stroke();
          ctx.shadowColor = "#00D9FF";
          ctx.shadowBlur = 10;
        }
        ctx.restore();
      });

      // Bullets
      state.bullets.forEach((b: any) => {
        if (b.life <= 0) return;
        ctx.save();
        const bulletImg = ASSETS_CACHE.projectiles?.["Bullet"];
        if (bulletImg && !b.isDrone) {
          // Render default bullet graphic for player gun
          ctx.translate(b.x, b.y);
          ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#f59e0b";
          ctx.drawImage(bulletImg, 0, 0, 16, 16, -16, -16, 32, 32);
        } else {
          // Render colored energy laser trail for drones
          let dColor = "#f59e0b";
          if (b.isOverclocked) {
            dColor = "#d946ef"; // Fuchsia
          } else if (b.isDrone) {
            if (state.currentAlgo === "FCFS") dColor = "#3b82f6";
            else if (state.currentAlgo === "RR") dColor = "#10b981";
            else if (state.currentAlgo === "HRRN") dColor = "#EF4444";
          }
          ctx.translate(b.x, b.y);
          ctx.rotate(Math.atan2(b.vy, b.vx));

          // Outer glow trail - enhanced bloom
          ctx.shadowBlur = 25;
          ctx.shadowColor = dColor;
          ctx.fillStyle = dColor;
          ctx.beginPath();
          ctx.roundRect(-20, -4, 30, 8, 4);
          ctx.fill();

          // Inner core glow
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(-15, -1.5, 20, 3, 1.5);
          ctx.fill();

          // True white center
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(-10, -0.5, 10, 1, 0.5);
          ctx.fill();
        }
        ctx.restore();
      });

      // Enemy Bullets
      state.enemyBullets.forEach((b: any) => {
        if (b.life <= 0) return;
        ctx.save();

        let w = 24,
          h = 24,
          blur = 10,
          color = "#34d399",
          shape = "image",
          size = 4;
        let isLightning = false;
        if (b.bulletType?.startsWith("boss")) {
          shape = "image";
          if (b.bulletType === "boss_slow") {
            w = 64;
            h = 64;
            blur = 30;
            color = "#dc2626";
            isLightning = true;
          } else if (b.bulletType === "boss_burst") {
            w = 32;
            h = 32;
            blur = 20;
            color = "#f59e0b";
          } else if (b.bulletType === "boss_spiral") {
            w = 48;
            h = 48;
            blur = 25;
            color = "#ec4899";
            isLightning = true;
          } else if (b.bulletType === "boss_sweep") {
            w = 24;
            h = 24;
            blur = 15;
            color = "#6366F1";
          } else if (b.bulletType === "boss_focused") {
            w = 56;
            h = 56;
            blur = 30;
            color = "#ef4444";
            isLightning = true;
          } else if (b.bulletType === "boss_snipe") {
            w = 40;
            h = 120;
            blur = 40;
            color = "#f87171";
            isLightning = true;
          } // long beam
          else {
            w = 48;
            h = 48;
            blur = 25;
            color = "#ec4899";
          }
        } else if (b.bulletType?.startsWith("tank")) {
          shape = "image";
          w = 40;
          h = 40;
          blur = 20;
          color = "#f97316";
        } else if (b.bulletType?.startsWith("grunt")) {
          shape = "circle";
          if (b.bulletType === "grunt_snipe") {
            size = 5;
            blur = 15;
            color = "#fcd34d";
            isLightning = true;
          } else if (b.bulletType === "grunt_burst") {
            size = 3;
            blur = 8;
            color = "#6ee7b7";
          } else {
            size = 4;
            blur = 10;
            color = "#34d399";
          }
        } else if (b.bulletType === "malware_virus") {
          shape = "circle";
          size = 6;
          blur = 15;
          color = "#ef4444";
          isLightning = true;
        } else if (b.bulletType === "turret_standard") {
          shape = "circle";
          size = 6;
          blur = 12;
          color = "#c084fc";
          isLightning = true;
        } else {
          // Fallback logic
          shape = b.isBig ? "image" : "circle";
          if (b.isBig) {
            w = 48;
            h = 48;
            blur = 25;
            color = "#ec4899";
            isLightning = true;
          } else {
            size = 4;
            blur = 10;
            color = "#34d399";
          }
        }

        if (isLightning && b.trail && b.trail.length > 2) {
          ctx.shadowBlur = blur;
          ctx.shadowColor = color;

          // Outer jagged trail
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          for (let i = 0; i < b.trail.length; i++) {
            const pt = b.trail[i];
            const perpX = -b.vy;
            const perpY = b.vx;
            const len = Math.hypot(Math.abs(perpX), Math.abs(perpY));
            const offX = len > 0 ? perpX / len : 0;
            const offY = len > 0 ? perpY / len : 0;
            // Add jaggedness
            const amplitude =
              i === 0 || i === b.trail.length - 1
                ? 0
                : (Math.random() - 0.5) * (w * 0.5);
            ctx.lineTo(pt.x + offX * amplitude, pt.y + offY * amplitude);
          }
          ctx.strokeStyle = color;
          ctx.lineWidth = Math.max(3, w * 0.15);
          ctx.lineJoin = "miter";
          ctx.stroke();

          // Inner bright core
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          for (let i = 0; i < b.trail.length; i++) {
            const pt = b.trail[i];
            const perpX = -b.vy;
            const perpY = b.vx;
            const len = Math.hypot(Math.abs(perpX), Math.abs(perpY));
            const offX = len > 0 ? perpX / len : 0;
            const offY = len > 0 ? perpY / len : 0;
            const amplitude =
              i === 0 || i === b.trail.length - 1
                ? 0
                : (Math.random() - 0.5) * (w * 0.2);
            ctx.lineTo(pt.x + offX * amplitude, pt.y + offY * amplitude);
          }
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = Math.max(1, w * 0.05);
          ctx.stroke();
        }

        ctx.translate(b.x, b.y);
        ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);

        ctx.shadowBlur = blur;
        ctx.shadowColor = color;

        if (shape === "image") {
          const torpedoImg = ASSETS_CACHE.projectiles?.["Torpedo"];
          if (torpedoImg) {
            ctx.drawImage(torpedoImg, 0, 0, 32, 32, -w / 2, -h / 2, w, h);
          } else {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, 0, w / 4, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // Particles
      state.particles.forEach((p: any) => {
        if (p.life <= 0) return;
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(
          0,
          p.maxLife ? p.life / p.maxLife : Math.min(1, p.life / 0.5),
        );
        if (p.text === "GC_PULSE_RING") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, (1.0 - p.life) * 800, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 10 * p.life;
          ctx.stroke();
        } else if (p.text === "LASER_FLARE") {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle || 0);
          ctx.shadowBlur = 20;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          const size = p.life * 80;
          ctx.moveTo(-size, 0);
          ctx.lineTo(size, 0);
          ctx.moveTo(0, -size);
          ctx.lineTo(0, size);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 4 * (p.life / (p.maxLife || 0.25));
          ctx.stroke();

          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(0, 0, p.life * 20, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
        } else if (p.isDebris) {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle || 0);
          ctx.beginPath();
          if (p.shape === "sprite_debris" && asteroidSpriteRef.current) {
            const img = asteroidSpriteRef.current;
            const cols = 8;
            const rows = 4;
            const sw = img.width / cols;
            const sh = img.height / rows;
            const sx = (p.spriteIdxX || 0) * sw;
            const sy = (p.spriteIdxY || 0) * sh;

            ctx.drawImage(
              img,
              sx,
              sy,
              sw,
              sh,
              -p.radius,
              -p.radius,
              p.radius * 2,
              p.radius * 2,
            );
          } else {
            if (p.shape === "rect") {
              ctx.rect(-p.radius / 2, -p.radius / 2, p.radius, p.radius);
            } else {
              ctx.moveTo(0, -p.radius);
              ctx.lineTo(p.radius, p.radius);
              ctx.lineTo(-p.radius, p.radius);
              ctx.closePath();
            }
            ctx.fill();
            // Extra inner detail for depth
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fill();
          }
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius || Math.random() * 2 + 1, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      ctx.globalAlpha = 1;

      // Crosshair
      if (!isTouchDevice) {
        ctx.save();
        ctx.translate(state.mouse.x, state.mouse.y);

        // Drop shadow to ensure it's visible against bright backgrounds (asteroids/explosions)
        ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
        ctx.shadowBlur = 4;

        // Outer rotating ring
        const nowTime = performance.now() / 1000;
        ctx.rotate(nowTime * 1.5);

        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.strokeStyle = state.mouse.down
          ? "rgba(239, 68, 68, 0.8)"
          : "rgba(56, 189, 248, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 8]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Inner precision cross
        ctx.rotate(-nowTime * 1.5); // Counter rotation to keep center lines stable
        ctx.beginPath();
        // Horizontal line
        ctx.moveTo(-8, 0);
        ctx.lineTo(-2, 0);
        ctx.moveTo(2, 0);
        ctx.lineTo(8, 0);
        // Vertical line
        ctx.moveTo(0, -8);
        ctx.lineTo(0, -2);
        ctx.moveTo(0, 2);
        ctx.lineTo(0, 8);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Center targeting reticle
        ctx.beginPath();
        ctx.arc(0, 0, state.mouse.down ? 2 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = state.mouse.down ? "#ef4444" : "#ffffff";
        ctx.fill();

        ctx.restore();
      }
      ctx.restore(); // restore camera bounds

      // Minimap / Tactical Radar Rendering
      const renderTacticalMap = (
        mCanvas: HTMLCanvasElement | null,
        expanded: boolean,
      ) => {
        if (!mCanvas) return;
        const mCtx = mCanvas.getContext("2d");
        if (!mCtx) return;

        if (expanded) {
          const tw = mCanvas.clientWidth;
          const th = mCanvas.clientHeight;
          if (
            tw > 0 &&
            th > 0 &&
            (mCanvas.width !== tw || mCanvas.height !== th)
          ) {
            mCanvas.width = tw;
            mCanvas.height = th;
          }
        }

        const now = performance.now() / 1000;
        mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);

        // Background Base
        mCtx.fillStyle = "#0A0F1F";
        mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);

        // Holographic Grid Lines
        mCtx.strokeStyle = "rgba(6, 182, 212, 0.1)";
        mCtx.lineWidth = 1;
        for (let i = 0; i < mCanvas.width; i += 20) {
          mCtx.beginPath();
          mCtx.moveTo(i, 0);
          mCtx.lineTo(i, mCanvas.height);
          mCtx.stroke();
          mCtx.beginPath();
          mCtx.moveTo(0, i);
          mCtx.lineTo(mCanvas.width, i);
          mCtx.stroke();
        }

        // Safe Zone Boundary (Earth Defense Perimeter)
        const smx = (150 / MAP_WIDTH) * mCanvas.width;
        const smy = (150 / MAP_HEIGHT) * mCanvas.height;
        const smw = ((MAP_WIDTH - 300) / MAP_WIDTH) * mCanvas.width;
        const smh = ((MAP_HEIGHT - 300) / MAP_HEIGHT) * mCanvas.height;
        mCtx.strokeStyle = "rgba(245, 158, 11, 0.3)"; // Amber dashed line
        mCtx.setLineDash([2, 4]);
        mCtx.strokeRect(smx, smy, smw, smh);
        mCtx.setLineDash([]);

        const px = (state.player.x / MAP_WIDTH) * mCanvas.width;
        const py = (state.player.y / MAP_HEIGHT) * mCanvas.height;

        // Dynamic Sweeping Radar Beam pivoting from Player
        const sweepAngle = (now * 2.5) % (Math.PI * 2);
        const radius = mCanvas.width * 2;

        mCtx.save();

        // Use createConicGradient with the sweepAngle, centered at the player
        if (typeof mCtx.createConicGradient === "function") {
          const radarGrad = mCtx.createConicGradient(sweepAngle, px, py);
          radarGrad.addColorStop(0, "rgba(6, 182, 212, 0.4)");
          radarGrad.addColorStop(0.1, "rgba(6, 182, 212, 0)");
          radarGrad.addColorStop(1, "rgba(6, 182, 212, 0)");

          mCtx.fillStyle = radarGrad;
          mCtx.beginPath();
          mCtx.moveTo(px, py);
          mCtx.arc(px, py, radius, sweepAngle, sweepAngle + Math.PI / 2);
          mCtx.fill();
        } else {
          // Fallback for browsers without conic gradient
          mCtx.fillStyle = "rgba(6, 182, 212, 0.2)";
          mCtx.beginPath();
          mCtx.moveTo(px, py);
          mCtx.arc(px, py, radius, sweepAngle, sweepAngle + Math.PI / 2);
          mCtx.fill();
        }

        mCtx.restore();

        // Draw Hazard Zones (Anomalies)
        (state.anomalies || []).forEach((ano: any) => {
          const ax = (ano.x / MAP_WIDTH) * mCanvas.width;
          const ay = (ano.y / MAP_HEIGHT) * mCanvas.height;
          const ar =
            (ano.r / Math.max(MAP_WIDTH, MAP_HEIGHT)) *
            Math.max(mCanvas.width, mCanvas.height);

          mCtx.fillStyle =
            ano.type === "black_hole"
              ? "rgba(139, 92, 246, 0.3)"
              : "rgba(245, 158, 11, 0.3)";
          mCtx.strokeStyle = ano.type === "black_hole" ? "#a78bfa" : "#fbbf24";
          mCtx.lineWidth = 1;

          mCtx.beginPath();
          mCtx.arc(ax, ay, Math.max(ar, 2), 0, Math.PI * 2);
          mCtx.fill();
          mCtx.stroke();

          // Pulsing hazard indicator
          if (ano.type === "black_hole") {
            mCtx.beginPath();
            mCtx.arc(
              ax,
              ay,
              Math.max(ar, 2) + Math.sin(now * 8) * 3,
              0,
              Math.PI * 2,
            );
            mCtx.strokeStyle = "rgba(139, 92, 246, 0.5)";
            mCtx.stroke();
          }
        });

        // Draw Enemies (Red/Rose Blips)
        state.enemies.forEach((e: any) => {
          const mx = (e.x / MAP_WIDTH) * mCanvas.width;
          const my = (e.y / MAP_HEIGHT) * mCanvas.height;

          const isActive = state.drones.some((d: any) => d.targetId === e.id);
          const isBoss = e.type.startsWith("boss");

          mCtx.fillStyle = isActive
            ? "#00D9FF"
            : isBoss
              ? "#ec4899"
              : "#EF4444";
          mCtx.shadowBlur = isActive || isBoss ? 10 : 4;
          mCtx.shadowColor = mCtx.fillStyle;

          mCtx.beginPath();
          mCtx.arc(mx, my, isBoss ? 4 : isActive ? 2.5 : 1.5, 0, Math.PI * 2);
          mCtx.fill();
          mCtx.shadowBlur = 0;

          // Give bosses a secondary ping ring
          if (isBoss) {
            mCtx.strokeStyle = "#ec4899";
            mCtx.beginPath();
            mCtx.arc(mx, my, 6 + Math.sin(now * 5) * 2, 0, Math.PI * 2);
            mCtx.stroke();
          }
        });

        // Collectibles
        state.collectibles.forEach((c: any) => {
          const cx = (c.x / MAP_WIDTH) * mCanvas.width;
          const cy = (c.y / MAP_HEIGHT) * mCanvas.height;
          let mColor = "#00D9FF"; // Energy
          if (c.type === "health") mColor = "#10b981";
          else if (c.type === "shield") mColor = "#3b82f6";
          else if (c.type === "weapon") mColor = "#dc2626";

          mCtx.fillStyle = mColor;
          mCtx.shadowBlur = 6;
          mCtx.shadowColor = mColor;
          mCtx.fillRect(cx - 1.5, cy - 1.5, 3, 3);
          mCtx.shadowBlur = 0;
        });

        // Draw Player (Bright Cyan Core)
        mCtx.fillStyle = "#ffffff";
        mCtx.shadowBlur = 12;
        mCtx.shadowColor = "#00D9FF"; // Cyan glow
        mCtx.beginPath();
        mCtx.arc(px, py, 2.5, 0, Math.PI * 2);
        mCtx.fill();
        mCtx.shadowBlur = 0;

        // Viewport Rect (Shows what the camera sees on the map)
        const vx = (cameraX / MAP_WIDTH) * mCanvas.width;
        const vy = (cameraY / MAP_HEIGHT) * mCanvas.height;
        const vw = (canvas.width / MAP_WIDTH) * mCanvas.width;
        const vh = (canvas.height / MAP_HEIGHT) * mCanvas.height;

        mCtx.strokeStyle = "rgba(34, 211, 238, 0.4)"; // Cyan viewport
        mCtx.lineWidth = 1;
        mCtx.strokeRect(vx, vy, vw, vh);

        // Crosshairs framing the viewport
        mCtx.beginPath();
        mCtx.moveTo(vx + vw / 2, vy - 2);
        mCtx.lineTo(vx + vw / 2, vy + 2); // Top tick
        mCtx.moveTo(vx + vw / 2, vy + vh - 2);
        mCtx.lineTo(vx + vw / 2, vy + vh + 2); // Bot tick
        mCtx.moveTo(vx - 2, vy + vh / 2);
        mCtx.lineTo(vx + 2, vy + vh / 2); // Left tick
        mCtx.moveTo(vx + vw - 2, vy + vh / 2);
        mCtx.lineTo(vx + vw + 2, vy + vh / 2); // Right tick
        mCtx.stroke();
      };

      renderTacticalMap(minimapRef.current, false);
      renderTacticalMap(expandedMinimapRef.current, true);
    };

    initAssets();

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("mouseup", handleMouseUp);

      soundManager.stopBGM();
      soundManager.setLowRamEffect(false);
      soundManager.ctx?.resume();
    };
  }, [gameKey]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#0A0F1F] overflow-hidden font-sans select-none border border-[#00D9FF]/20 shadow-[inset_0_0_50px_rgba(6,182,212,0.05)]"
    >
      {/* Tactical Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>

      {/* Top Left: Hull Telemetry */}
      <div
        className="absolute top-4 left-4 flex flex-col pointer-events-none z-10 w-56 origin-top-left"
        style={{ transform: `scale(${uiScale})` }}
      >
        <div
          className="bg-[#0d1428]/80 p-3 border border-[#00D9FF]/20 backdrop-blur-md shadow-[0_0_20px_rgba(0,217,255,0.15)] relative overflow-hidden"
          style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 0% 100%)" }}
        >
          <div
            className="absolute top-0 right-0 w-4 h-4 bg-[#00D9FF]/20"
            style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
          ></div>

          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] text-[#00D9FF] font-mono font-bold tracking-[0.2em]">
              HULL
            </span>
            <span className="text-xs text-white font-mono" ref={hpTextRef}>
              100%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#151f3d]">
            <div
              ref={hpRef}
              className="h-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF] transition-all"
            ></div>
          </div>

          <div className="flex justify-between items-end mt-2 mb-1">
            <span className="text-[10px] text-blue-400 font-mono font-bold tracking-[0.2em]">
              SHIELDS
            </span>
            <span className="text-xs text-white font-mono" ref={shieldTextRef}>
              0%
            </span>
          </div>
          <div className="w-full h-1 bg-[#151f3d]">
            <div
              ref={shieldRef}
              className="h-full bg-blue-500 shadow-[0_0_8px_#3b82f6] transition-all"
            ></div>
          </div>

          <div className="flex justify-between items-end mt-2 mb-1">
            <span className="text-[10px] text-[#EF4444] font-mono font-bold tracking-[0.2em]">
              BOOST
            </span>
            <span className="text-xs text-white font-mono" ref={staminaTextRef}>
              100%
            </span>
          </div>
          <div className="w-full h-1 bg-[#151f3d]">
            <div
              ref={staminaRef}
              className="h-full bg-[#EF4444] shadow-[0_0_8px_#EF4444] transition-all"
            ></div>
          </div>

          <div ref={powerupRef}></div>
        </div>
      </div>

      {/* Top Center: Mission Telemetry */}
      <div
        className="absolute top-4 left-1/2 flex flex-col items-center pointer-events-none z-10 w-48 origin-top"
        style={{ transform: `translateX(-50%) scale(${uiScale})` }}
      >
        <div
          className="bg-[#00D9FF]/20/40 border border-[#00D9FF]/30 backdrop-blur-md px-6 py-2 flex flex-col items-center shadow-[0_0_20px_rgba(0,217,255,0.15)] w-full relative"
          style={{ clipPath: "polygon(5% 0, 95% 0, 100% 100%, 0 100%)" }}
        >
          <span
            className="text-[10px] text-[#00D9FF] font-mono font-bold tracking-[0.3em] uppercase mb-1"
            style={{ marginLeft: "0.3em" }}
          >
            WAVE
          </span>
          <span
            ref={waveRef}
            className="text-2xl font-black text-white font-mono leading-none tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ marginLeft: "0.1em" }}
          >
            01
          </span>
        </div>
        <div className="bg-[#0d1428]/60 border border-t-0 border-[#00D9FF]/20 backdrop-blur-md px-6 py-1.5 flex flex-col items-center w-[90%]">
          <div className="flex justify-between w-full text-[10px] font-mono font-bold text-slate-300">
            <span>T-MINUS</span>
            <span ref={timeRef} className="text-[#5ce5ff]">
              00:00
            </span>
          </div>
          <div className="flex justify-between w-full text-[10px] font-mono font-bold text-slate-300 mt-0.5">
            <span>SCORE</span>
            <span ref={scoreRef} className="text-[#EF4444]">
              0
            </span>
          </div>
        </div>
      </div>

      {/* Top Right: Tactical Radar & Algo */}
      <div
        className="absolute top-4 right-4 flex gap-4 pointer-events-none z-[99] origin-top-right items-start"
        style={{ transform: `scale(${uiScale})` }}
      >
        <div className="pointer-events-auto mt-0">
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              togglePause();
            }}
            className="bg-[#0d1428]/90 hover:bg-[#00D9FF]/40 border-2 border-[#00D9FF]/40 hover:border-[#00D9FF] text-[#00D9FF] hover:text-[#ffffff] px-4 py-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-xs font-mono font-black tracking-[0.2em] cursor-pointer backdrop-blur-md transition-all active:scale-95 flex items-center justify-center uppercase drop-shadow-md"
          >
            TACTICAL PAUSE
          </button>
        </div>
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <div
            onClick={() => setIsMapExpanded(true)}
            className="w-32 h-32 bg-[#0A0F1F]/80 border border-[#00D9FF]/30 p-1 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,217,255,0.15)] backdrop-blur-md cursor-pointer hover:border-[#00D9FF]/60 transition-colors group"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)",
            }}
            title="Expand Tactical Map"
          >
            <canvas
              ref={minimapRef}
              width={120}
              height={120}
              className="w-full h-full block bg-[#0A0F1F] border border-[#00D9FF]/20 relative group-hover:border-[#00D9FF]/50 transition-colors"
            />
            <div
              className="absolute top-0 right-0 bg-[#00D9FF]/20 w-4 h-4"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
            ></div>
            <div className="absolute inset-0 bg-[#00D9FF]/0 group-hover:bg-[#00D9FF]/10 pointer-events-none transition-colors mix-blend-screen" />
          </div>

          <div className="flex flex-col items-end gap-1.5 w-full mt-1 pointer-events-none">
            <div
              className="bg-[#EF4444]/20/60 border border-[#EF4444]/40 px-3 py-1.5 shadow-[0_0_10px_rgba(244,63,94,0.1)] w-full text-right backdrop-blur-sm"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 10% 100%)" }}
            >
              <span
                ref={targetsRef}
                className="text-[10px] text-[#EF4444] font-mono font-bold tracking-widest"
              >
                TARGETS: 0
              </span>
            </div>

            <div
              className="bg-[#0d1428]/80 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.1)] flex flex-col w-full text-white backdrop-blur-sm"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 10% 100%)" }}
            >
              <div className="bg-amber-500/10 px-3 py-1 border-b border-amber-500/20 flex justify-between items-center gap-4">
                <span className="text-[9px] text-amber-500 font-mono tracking-widest font-bold">
                  DRONE MODE
                </span>
                <span
                  ref={algoRef}
                  className="text-[11px] text-white font-mono font-bold drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]"
                >
                  LOCK
                </span>
              </div>
              <div
                ref={algoStatsRef}
                className="px-3 py-1.5 font-mono text-[9px] text-slate-300 text-right leading-tight min-h-[30px] flex flex-col justify-end"
              ></div>
            </div>

            <div
              className="bg-[#0d1428]/80 border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(6,182,212,0.1)] flex flex-col w-full text-white pointer-events-auto backdrop-blur-sm"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 10% 100%)" }}
            >
              <div className="bg-[#00D9FF]/10 px-3 py-1 border-b border-[#00D9FF]/20 flex justify-between items-center gap-2">
                <span className="text-[9px] text-[#00D9FF] font-mono tracking-widest font-bold">
                  DRONE RANGE
                </span>
              </div>
              <div className="px-3 py-1.5 flex justify-between items-center bg-[#0A0F1F]/50">
                <button
                  onClick={() => setDroneRange((r) => Math.max(300, r - 100))}
                  className="text-[#00D9FF] hover:text-white bg-[#00D9FF]/30 hover:bg-[#00D9FF]/50 px-2 py-0.5 text-[10px] font-bold transition-colors"
                >
                  {" "}
                  -{" "}
                </button>
                <span className="text-[#5ce5ff] font-mono text-[10px] font-bold min-w-[30px] text-center">
                  {droneRange}
                </span>
                <button
                  onClick={() => setDroneRange((r) => Math.min(2000, r + 100))}
                  className="text-[#00D9FF] hover:text-white bg-[#00D9FF]/30 hover:bg-[#00D9FF]/50 px-2 py-0.5 text-[10px] font-bold transition-colors"
                >
                  {" "}
                  +{" "}
                </button>
              </div>
            </div>

            <div
              className="bg-[#0d1428]/80 border border-[#6366F1]/40 shadow-[0_0_10px_rgba(99,102,241,0.1)] flex flex-col w-full text-white pointer-events-auto backdrop-blur-sm mt-1"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 10% 100%)" }}
            >
              <div className="bg-[#6366F1]/10 px-3 py-1 border-b border-[#6366F1]/20 flex flex-col items-center gap-1">
                <span className="text-[9px] text-[#6366F1] font-mono tracking-widest font-bold">
                  TARGET QUEUE
                </span>
              </div>
              <div
                ref={readyQueueUiRef}
                className="px-2 py-2 flex flex-col gap-1 min-h-[50px] max-h-[150px] overflow-hidden"
              >
                {/* Populated by innerHTML */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={notificationRef}
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none z-50 flex flex-col items-center justify-center text-center opacity-0 transition-opacity duration-300 pointer-events-none"
      ></div>

      <div
        className="absolute top-24 md:top-28 left-1/2 z-40 pointer-events-none flex flex-col items-center justify-center pt-2"
        style={{
          transform: `translateX(-50%) scale(${uiScale})`,
          transformOrigin: "center top",
        }}
      >
        <div
          ref={algoHudRef}
          className="relative flex items-center justify-center gap-1 bg-[#0d1428]/90 border border-[#1e2b52]/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md px-4 py-2 rounded-xl pointer-events-auto cursor-pointer hover:bg-[#151f3d]/90 active:scale-95 transition-all"
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "q" }));
          }}
        >
          {/* Managed by innerHTML */}
        </div>
      </div>

      <div
        ref={bossWarningUIRef}
        className="absolute top-1/3 left-1/2 pointer-events-none z-50 flex flex-col items-center justify-center text-center opacity-0 transition-opacity duration-100"
        style={{ transform: `translate(-50%, -50%) scale(${uiScale})` }}
      >
        <div
          className="text-4xl font-black text-[#EF4444] font-mono tracking-[0.3em] drop-shadow-[0_0_15px_rgba(244,63,94,1)] animate-pulse"
          style={{ marginLeft: "0.3em" }}
        >
          WARNING
        </div>
        <div
          ref={bossWarningSubtextRef}
          className="text-sm font-bold text-white tracking-widest mt-2 uppercase bg-[#EF4444]/20 px-8 py-1 border border-[#EF4444]"
          style={{ marginLeft: "0.1em" }}
        >
          MAJOR THREAT INCOMING
        </div>
      </div>

      {/* Bottom: Desktop Weapons/Skills */}
      <div
        className="absolute bottom-4 left-1/2 hidden md:flex gap-2 lg:gap-6 items-end pointer-events-none z-10 w-max max-w-[95vw] justify-center origin-bottom"
        style={{ transform: `translateX(-50%) scale(${uiScale})` }}
      >
        <div className="flex gap-1 md:gap-2 shrink-0 items-center">
          <div ref={wpn1Ref}></div>
          <div ref={wpn2Ref}></div>
        </div>

        <div
          className="bg-[#0d1428]/80 px-4 lg:px-8 py-2 border-l-4 border-[#00D9FF] flex flex-col items-center backdrop-blur-md shadow-[0_0_15px_rgba(0,217,255,0.15)] shrink-0"
          style={{ transform: "skewX(-10deg)" }}
        >
          <div
            className="flex flex-col items-center"
            style={{ transform: "skewX(10deg)" }}
          >
            <span
              className="text-[8px] lg:text-[9px] text-[#00D9FF] font-mono font-bold tracking-[0.2em]"
              style={{ marginLeft: "0.2em" }}
            >
              ENERGY
            </span>
            <span className="text-xl lg:text-2xl font-mono text-white font-bold leading-none">
              <span ref={ammoRef}>100</span>
            </span>
          </div>
        </div>

        <div className="flex gap-1 md:gap-2 shrink-0">
          <div ref={dshRef}></div>
          <div ref={shdSkillRef}></div>
          <div ref={ocSkillRef}></div>
        </div>
      </div>

      {/* Expanded Tactical Map Overlay */}
      {isMapExpanded && (
        <div
          className="absolute inset-0 bg-[#0A0F1F]/90 z-[100] p-6 md:p-12 flex flex-col pointer-events-auto backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMapExpanded(false);
          }}
        >
          <div className="flex justify-between items-end mb-4 text-[#00D9FF] font-mono w-full max-w-5xl mx-auto shrink-0 z-10">
            <div className="flex flex-col">
              <span className="text-2xl tracking-[0.3em] uppercase font-bold text-[#5ce5ff] drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                TACTICAL MAP
              </span>
              <span className="text-[10px] tracking-widest text-[#00D9FF]/70">
                REAL-TIME TELEMETRY // ENGAGED
              </span>
            </div>
            <button
              onClick={() => setIsMapExpanded(false)}
              className="text-[#00D9FF] hover:text-white px-4 py-2 border border-[#00D9FF]/50 hover:bg-[#00D9FF]/50 transition-colors uppercase tracking-widest text-xs tracking-[0.2em] shrink-0"
              style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" }}
            >
              [X] CLOSE
            </button>
          </div>

          <div
            className="w-full max-w-5xl flex-1 mx-auto bg-[#0A0F1F]/50 border border-[#00D9FF]/40 p-1 md:p-2 shadow-[0_0_30px_rgba(0,217,255,0.15)] relative overflow-hidden min-h-0"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)",
            }}
          >
            <canvas
              ref={expandedMinimapRef}
              className="w-full h-full block bg-[#0A0F1F] border border-[#00D9FF]/20"
            />

            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00D9FF] pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00D9FF] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00D9FF] pointer-events-none" />

            <div className="absolute bottom-6 right-6 text-[10px] font-mono text-[#00D9FF]/80 pointer-events-none bg-black/50 px-2 py-1 backdrop-blur-sm z-10">
              LIVE FEED
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[10px] font-mono text-slate-400 mt-4 max-w-5xl mx-auto w-full mb-8 md:mb-0 shrink-0">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>ENEMIES
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full border border-[#ec4899]"></div>
              VIPERS/BOSSES
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00D9FF]"></div>
              ENERGY
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>HEALTH
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#ffffff] shadow-[0_0_8px_#00D9FF]"></div>
              PLAYER UNIT
            </span>
          </div>
        </div>
      )}

      

      <canvas
        ref={canvasRef}
        className="block w-full h-full z-0 cursor-none relative touch-none"
      />

      {/* Critical Health Vignette Overlay */}
      <div
        ref={critVignetteRef}
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-150 opacity-0"
        style={{
          background:
            "radial-gradient(circle, transparent 50%, rgba(220, 38, 38, 0.4) 100%)",
        }}
      ></div>

      {/* Cinematic CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-10 mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

      {/* OS Interruptions / Terminals layer */}
      <div
        ref={osMessagesRef}
        className="absolute bottom-24 left-8 pointer-events-none z-30 flex flex-col gap-1 items-start w-[400px]"
      ></div>

      {isPaused && (
        <div className="absolute inset-0 z-[110] bg-[#0A0F1F]/80 backdrop-blur-xl flex items-center justify-center p-6 gap-8">
          {/* Main Control Panel */}
          <div
            className="border border-[#00D9FF]/30 bg-[#00D9FF]/20/20 p-10 flex flex-col items-center shadow-[0_0_30px_rgba(0,217,255,0.15)] shrink-0"
            style={{
              clipPath:
                "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
            }}
          >
            <h2 className="text-4xl font-bold text-[#00D9FF] font-mono mb-2 tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              Tactical Frame Suspended
            </h2>
            <p className="text-cyan-100/50 font-mono text-sm mb-10 tracking-widest text-center border-b border-[#00D9FF]/20 pb-4 w-full">
              TELEMETRY SUSPENDED
            </p>

            <div className="flex flex-col gap-4 w-full min-w-[250px]">
              <button
                onClick={togglePause}
                className="bg-[#00D9FF] hover:bg-[#00D9FF] text-slate-950 px-8 py-4 font-mono font-bold tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <div className="w-2 h-2 bg-[#0A0F1F] animate-pulse"></div>
                RESUME
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="bg-[#151f3d] hover:bg-slate-700 border border-slate-600 text-[#00D9FF] px-8 py-4 font-mono font-bold tracking-widest transition-all active:scale-95"
              >
                SYSTEM SETTINGS
              </button>
              <button
                onClick={() => {
                  soundManager.stopBGM();
                  soundManager.setLowRamEffect(false);
                  
                  if (gameStateRef.current) {
                    gameStateRef.current.isGameOver = true;
                    onGameOverRef.current(gameStateRef.current.score, false, "MISSION ABORTED", {
                      kills: gameStateRef.current.kills,
                      credits: gameStateRef.current.credits,
                      timeSurvived: gameStateRef.current.gameTime,
                      algorithm: gameStateRef.current.currentAlgo
                    });
                  } else {
                    onReturnMenu();
                  }
                }}
                className="bg-[#0d1428] hover:bg-[#EF4444]/20 border border-rose-900/50 hover:border-[#EF4444] text-[#EF4444] hover:text-[#EF4444] px-8 py-4 font-mono font-bold tracking-widest transition-all active:scale-95"
              >
                ABORT MISSION
              </button>
            </div>
          </div>

          {/* Task Manager Panel */}
          <div className="hidden lg:flex flex-col border border-[#6366F1]/30 bg-[#6366F1]/20/20 p-6 w-[400px] h-[500px] shadow-[0_0_30px_rgba(99,102,241,0.1)]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-indigo-900/50">
              <span className="text-[#6366F1] font-mono font-bold tracking-widest uppercase">
                Swarm Observation
              </span>
              <span className="text-[#6366F1]/50 font-mono text-xs">
                DETECTED SIGNALS
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
              {pausedQueueRefs.length === 0 ? (
                <div className="text-slate-600 text-center font-mono text-sm tracking-widest italic mt-10">
                  NO SIGNAL DETECTED
                </div>
              ) : (
                pausedQueueRefs.map((proc, index) => {
                  const rr = proc.S
                    ? ((proc.W + proc.S) / Math.max(0.1, proc.S)).toFixed(2)
                    : "0.00";
                  return (
                    <div
                      key={proc.id}
                      className="relative group border border-[#151f3d] bg-[#0d1428]/50 p-2 font-mono flex items-center justify-between hover:bg-[#6366F1]/20/50 hover:border-[#6366F1]/50 transition-colors cursor-crosshair"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 font-bold w-6 text-right">
                          #{index + 1}
                        </span>
                        <span className="text-indigo-300 font-bold uppercase">
                          {proc.type.substring(0, 8)}
                        </span>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        <div className="group-hover:hidden">
                          ID: {proc.id.toString().substring(2, 6)}
                        </div>
                        <div className="hidden group-hover:block text-[#6366F1] animate-pulse">
                          INSPECT
                        </div>
                      </div>

                      {/* Hover Tooltip Context Menu */}
                      <div className="absolute right-[105%] top-1/2 -translate-y-1/2 w-[220px] bg-[#0A0F1F] border border-[#6366F1] p-3 hidden group-hover:flex flex-col gap-2 shadow-2xl z-50 pointer-events-none">
                        <div className="text-[#6366F1] font-bold border-b border-indigo-900/50 pb-1 mb-1">
                          HOSTILE DETAILS
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Tracking Time</span>
                          <span className="text-white">
                            {proc.W.toFixed(2)}s
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Threat Mass</span>
                          <span className="text-white">
                            {Math.ceil(proc.maxHp)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Priority Mult</span>
                          <span className="text-white">{proc.priority}x</span>
                        </div>
                        <div className="flex justify-between text-xs mt-2 pt-2 border-t border-[#151f3d]">
                          <span className="text-amber-500">
                            Calculated Threat
                          </span>
                          <span className="text-amber-400 font-bold">{rr}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div className="absolute inset-0 z-[120] bg-[#0A0F1F]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
          <div
            className="border border-[#00D9FF]/30 bg-[#00D9FF]/20/20 p-8 w-[450px] max-w-full shadow-[0_0_30px_rgba(0,217,255,0.15)] flex flex-col"
            style={{
              clipPath:
                "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
            }}
          >
            <h2 className="text-2xl font-bold text-[#00D9FF] font-mono mb-6 tracking-widest uppercase border-b border-[#00D9FF]/30 pb-4">
              Settings
            </h2>

            <div className="flex flex-col gap-8 flex-1 overflow-y-auto pr-2">
              {/* Drone Settings */}
              <div>
                <h3 className="text-sm font-bold text-[#5ce5ff] font-mono tracking-wider mb-4">
                  DRONE SYSTEMS
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-mono text-cyan-100">
                    <span>Engagement Range</span>
                    <span className="text-white bg-[#0d1428] px-2 py-1 rounded border border-[#00D9FF]/40">
                      {droneRange}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="1500"
                    step="50"
                    value={droneRange}
                    onChange={(e) => setDroneRange(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-[#151f3d] appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Audio Settings */}
              <div>
                <h3 className="text-sm font-bold text-[#5ce5ff] font-mono tracking-wider mb-4">
                  AUDIO
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-mono text-cyan-100">
                      <span>Master Output</span>
                      <span className="text-white bg-[#0d1428] px-2 py-1 rounded border border-[#00D9FF]/40">
                        {Math.round(masterVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={masterVolume}
                      onChange={(e) => setMasterVolume(Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-[#151f3d] appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-mono text-cyan-100">
                      <span>BGM Isolation</span>
                      <span className="text-white bg-[#0d1428] px-2 py-1 rounded border border-[#00D9FF]/40">
                        {Math.round(bgmVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={bgmVolume}
                      onChange={(e) => setBgmVolume(Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-[#151f3d] appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Camera Settings */}
              <div>
                <h3 className="text-sm font-bold text-[#5ce5ff] font-mono tracking-wider mb-4">
                  CAMERA OPTICS
                </h3>
                <div className="flex bg-[#0d1428] border border-[#1e2b52] p-1 mb-6 rounded-md shadow-inner gap-1">
                  {(
                    [
                      { id: "offset", label: "OFFSET" },
                      { id: "center", label: "CENTER" },
                      { id: "dynamic", label: "DYNAMIC" },
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setCameraMode(mode.id)}
                      className={`flex-1 py-2 text-xs font-mono font-bold tracking-widest ${cameraMode === mode.id ? "bg-[#00b0cf] text-white shadow-md rounded" : "text-slate-400 hover:text-cyan-200 hover:bg-[#151f3d] rounded"}`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display & Layout Settings */}
              <div>
                <h3 className="text-sm font-bold text-[#5ce5ff] font-mono tracking-wider mb-4">
                  INTERFACE CONFIG
                </h3>
                <button
                  onClick={() => setIsHudEditorOpen(true)}
                  className="w-full bg-[#151f3d] hover:bg-slate-700 border border-slate-600 text-[#00D9FF] px-4 py-4 font-mono text-sm font-bold tracking-widest transition-all active:scale-95 text-center shadow-inner mb-3"
                >
                  OPEN HUD DIAGNOSTICS
                </button>
                <button
                  onClick={() =>
                    setShowSchedulingIndicators(!showSchedulingIndicators)
                  }
                  className="w-full flex items-center justify-between bg-[#151f3d] hover:bg-slate-700 border border-slate-600 text-[#00D9FF] px-4 py-3 font-mono text-sm font-bold tracking-widest transition-all active:scale-95 shadow-inner"
                >
                  <span>SCHEDULING INDICATORS</span>
                  <div
                    className={`w-8 h-4 rounded-full flex items-center px-1 ${showSchedulingIndicators ? "bg-[#00D9FF]" : "bg-slate-700"}`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${showSchedulingIndicators ? "translate-x-3.5" : "translate-x-0"}`}
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#00D9FF]/30">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full bg-cyan-700 hover:bg-[#00b0cf] text-slate-50 px-4 py-4 font-mono font-bold tracking-widest transition-all active:scale-95 text-center"
              >
                ACCEPT & RETURN
              </button>
            </div>
          </div>
        </div>
      )}

      {isHudEditorOpen && (
        <div className="absolute inset-0 z-[130]">
          <HudEditor
            onExit={() => {
              setIsHudEditorOpen(false);
              setHudLayout(getSavedLayout());
            }}
          />
        </div>
      )}
    </div>
  );
}
