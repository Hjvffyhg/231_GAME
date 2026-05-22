import React, { useState, useEffect } from "react";
import { ArrowLeft, Shield, Zap, Wind, Hexagon } from "lucide-react";
import { ShipName } from "../lib/voidFleet";
import { soundManager } from "../lib/audio";

const SHIPS: {
  id: ShipName;
  name: string;
  cost: number;
  desc: string;
  stats: { hp: number; speed: string; type: string };
}[] = [
  {
    id: "Fighter",
    name: "Fighter",
    cost: 0,
    desc: "Standard issue all-rounder. Balanced blend of mobility and firepower. Reliable in dogfights.",
    stats: { hp: 100, speed: "Normal", type: "Balanced" },
  },
  {
    id: "Scout",
    name: "Scout",
    cost: 2000,
    desc: "High speed, fragile hull. Excels at hit and run tactics. Perfect for intercepting fast targets.",
    stats: { hp: 70, speed: "Very Fast", type: "Agility" },
  },
  {
    id: "Bomber",
    name: "Bomber",
    cost: 5000,
    desc: "Heavy armor, low speed. Payload specialist designed to punch through dense asteroid fields.",
    stats: { hp: 180, speed: "Slow", type: "Tank" },
  },
  {
    id: "Frigate",
    name: "Frigate",
    cost: 12000,
    desc: "Advanced military vessel. Superior shields and sustained firing capabilities make it a formidable unit.",
    stats: { hp: 250, speed: "Normal", type: "Balanced" },
  },
  {
    id: "Battlecruiser",
    name: "Battlecruiser",
    cost: 30000,
    desc: "Massive capital ship. Slow but devastating. Equipped to obliterate anything caught in its primary fire.",
    stats: { hp: 400, speed: "Very Slow", type: "Juggernaut" },
  },
];

const UPGRADES = [
  {
    id: "hp",
    name: "Hull Reinforcement",
    icon: Shield,
    desc: "Reinforces the outer chassis of all fleet ships, increasing maximum survivability against deep space hazards and enemy fire.",
    maxLevel: 10,
    baseCost: 500,
    costMult: 1.5,
  },
  {
    id: "dmg",
    name: "Weapon Overdrive",
    icon: Zap,
    desc: "Overclocks the plasma coils in primary weapon systems, yielding a substantial increase in destructive output.",
    maxLevel: 10,
    baseCost: 1000,
    costMult: 1.8,
  },
  {
    id: "speed",
    name: "Advanced Thrusters",
    icon: Wind,
    desc: "Upgrades the main propulsion engine blocks across all ship classes, increasing base maneuvering speed.",
    maxLevel: 5,
    baseCost: 800,
    costMult: 1.4,
  },
];

type Selection =
  | { type: "ship"; id: ShipName }
  | { type: "upgrade"; id: string };

export function ShopScreen({ onBack }: { onBack: () => void }) {
  const [credits, setCredits] = useState(0);
  const [unlocked, setUnlocked] = useState<string[]>(["Fighter"]);
  const [selected, setSelected] = useState<ShipName>("Fighter");
  const [upgrades, setUpgrades] = useState<Record<string, number>>({
    hp: 0,
    dmg: 0,
    speed: 0,
  });
  const [selection, setSelection] = useState<Selection>({
    type: "ship",
    id: "Fighter",
  });

  useEffect(() => {
    setCredits(parseInt(localStorage.getItem("credits") || "0", 10));
    const loadedUnlocked = JSON.parse(
      localStorage.getItem("unlockedShips") || '["Fighter"]',
    );
    setUnlocked(loadedUnlocked);
    const loadedSelected =
      (localStorage.getItem("selectedShip") as ShipName) || "Fighter";
    setSelected(loadedSelected);
    setUpgrades(
      JSON.parse(
        localStorage.getItem("upgrades") || '{"hp":0,"dmg":0,"speed":0}',
      ),
    );
    setSelection({ type: "ship", id: loadedSelected });
  }, []);

  const saveState = (
    c: number,
    u: string[],
    s: ShipName,
    up: Record<string, number>,
  ) => {
    localStorage.setItem("credits", c.toString());
    localStorage.setItem("unlockedShips", JSON.stringify(u));
    localStorage.setItem("selectedShip", s);
    localStorage.setItem("upgrades", JSON.stringify(up));
    setCredits(c);
    setUnlocked(u);
    setSelected(s);
    setUpgrades(up);
  };

  const handleBuyShip = (ship: (typeof SHIPS)[0]) => {
    if (unlocked.includes(ship.id)) {
      saveState(credits, unlocked, ship.id, upgrades);
      soundManager.playUISelect();
    } else if (credits >= ship.cost) {
      const newU = [...unlocked, ship.id];
      saveState(credits - ship.cost, newU, ship.id, upgrades);
      soundManager.playPowerup();
    } else {
      (soundManager as any).playError?.() || soundManager.playTakeDamage();
    }
  };

  const handleBuyUpgrade = (upg: (typeof UPGRADES)[0]) => {
    const lvl = upgrades[upg.id] || 0;
    if (lvl >= upg.maxLevel) return;
    const cost = Math.floor(upg.baseCost * Math.pow(upg.costMult, lvl));
    if (credits >= cost) {
      const newUp = { ...upgrades, [upg.id]: lvl + 1 };
      saveState(credits - cost, unlocked, selected, newUp);
      soundManager.playCollect("weapon");
    } else {
      (soundManager as any).playError?.() || soundManager.playTakeDamage();
    }
  };

  const UPGRADES_ENHANCED = UPGRADES.map((u) => ({
    ...u,
    bonusFn: (lvl: number) => {
      if (u.id === "hp") return `+${lvl * 20} Max HP`;
      if (u.id === "dmg") return `+${lvl * 20}% Damage`;
      if (u.id === "speed") return `+${lvl * 10}% Speed`;
      return "";
    },
  }));

  const displayShipId = selection.type === "ship" ? selection.id : selected;
  const displayShip = SHIPS.find((s) => s.id === displayShipId)!;

  return (
    <div
      className="absolute inset-0 w-full h-full bg-[#0A0F1F] text-[#ffffff] font-sans flex flex-col p-5 md:p-10 select-none overflow-hidden pb-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* Container to restrict max width like the mock */}
      <div className="flex flex-col h-full w-full max-w-[1400px] mx-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-[30px] shrink-0">
          <button
            onClick={onBack}
            className="bg-transparent border border-[#1e2645] text-[#00D9FF] px-4 py-2 rounded font-semibold text-sm cursor-pointer flex items-center gap-2 uppercase tracking-[1px] transition-all duration-200 hover:bg-[#00D9FF]/10"
          >
            <span>&larr;</span> MAIN MENU
          </button>

          <div className="text-right flex flex-col items-end">
            <div className="text-[#EF4444] text-[11px] tracking-[1.5px] uppercase">
              UPGRADE POINTS AVAILABLE
            </div>
            <div className="text-[28px] font-bold flex items-baseline gap-2">
              {credits.toLocaleString()}{" "}
              <span className="text-[#EF4444] text-sm font-semibold">
                CREDITS
              </span>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT GRID */}
        <main className="grid grid-cols-[280px_1fr_450px] gap-10 flex-grow h-full overflow-hidden pb-10">
          {/* LEFT SIDEBAR (Lists) */}
          <aside className="flex flex-col gap-[30px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex flex-col">
              <h3 className="text-sm text-white tracking-[2px] uppercase mb-3">
                HANGAR FLEET
              </h3>
              {SHIPS.map((ship) => {
                const isUnlocked = unlocked.includes(ship.id);
                const isSelectedForGame = selected === ship.id;
                const isHighlight =
                  selection.type === "ship" && selection.id === ship.id;

                return (
                  <div
                    key={ship.id}
                    onClick={() => setSelection({ type: "ship", id: ship.id })}
                    className={`flex items-center bg-[#0d1428] border rounded-md p-3 mb-2 cursor-pointer transition-all duration-200 ${
                      isHighlight
                        ? "border-l-4 border-l-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/5"
                        : "border-[#1e2645] hover:bg-[#18213b]"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded shrink-0 flex justify-center items-center mr-3 border ${isHighlight ? "border-[#EF4444] text-[#EF4444]" : "border-white/10 bg-white/5 text-white/80"}`}
                    >
                      <Hexagon size={16} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="textbase font-semibold leading-tight mb-0.5">
                        {ship.name}
                      </h4>
                      <p
                        className={`text-[11px] uppercase tracking-[0.5px] ${isHighlight ? "text-[#00D9FF]" : "text-[#94a3b8]"}`}
                      >
                        {!isUnlocked
                          ? `▤ ${ship.cost.toLocaleString()}`
                          : isSelectedForGame
                            ? "ACTIVE"
                            : "OWNED"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col">
              <h3 className="text-sm text-white tracking-[2px] uppercase mb-3">
                SYSTEM UPGRADES
              </h3>
              {UPGRADES_ENHANCED.map((upg) => {
                const isHighlight =
                  selection.type === "upgrade" && selection.id === upg.id;
                const currentLvl = upgrades[upg.id] || 0;

                return (
                  <div
                    key={upg.id}
                    onClick={() =>
                      setSelection({ type: "upgrade", id: upg.id })
                    }
                    className={`flex items-center bg-[#0d1428] border rounded-md p-3 mb-2 cursor-pointer transition-all duration-200 ${
                      isHighlight
                        ? "border-l-4 border-l-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/5"
                        : "border-[#1e2645] hover:bg-[#18213b]"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded shrink-0 flex justify-center items-center mr-3 border ${isHighlight ? "border-[#EF4444] text-[#EF4444]" : "border-white/10 bg-white/5 text-white/80"}`}
                    >
                      <upg.icon size={16} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="textbase font-semibold leading-tight mb-0.5">
                        {upg.name}
                      </h4>
                      <p
                        className={`text-[11px] uppercase tracking-[0.5px] ${isHighlight ? "text-[#00D9FF]" : "text-[#94a3b8]"}`}
                      >
                        LVL {currentLvl} / {upg.maxLevel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* CENTER DETAILS PANEL */}
          <section className="bg-[#0d1428] border border-[#1e2645] rounded-xl p-[30px] flex flex-col relative h-full shrink-0">
            {selection.type === "ship"
              ? (() => {
                  const ship = SHIPS.find((s) => s.id === selection.id)!;
                  const isUnlocked = unlocked.includes(ship.id);
                  const isSelectedForGame = selected === ship.id;

                  return (
                    <>
                      <div className="flex items-center gap-[15px] mb-5">
                        <h1 className="text-[32px] tracking-[4px] uppercase whitespace-nowrap">
                          {ship.name}
                        </h1>
                        <span className="border border-[#1e2645] py-1 px-2.5 rounded-[20px] text-[11px] text-[#6366F1] uppercase tracking-[1px]">
                          CHASSIS
                        </span>
                      </div>

                      <p className="text-[#94a3b8] text-[14px] leading-[1.6] mb-10 max-w-[90%]">
                        {ship.desc}
                      </p>

                      <div className="text-[12px] text-[#94a3b8] tracking-[2px] uppercase mb-[15px] border-b border-[#1e2645] pb-2">
                        BASE SPECIFICATION SPECS
                      </div>

                      <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-md mb-2.5">
                        <span className="text-[13px] text-[#94a3b8] uppercase tracking-[1px]">
                          HULL INTEGRITY
                        </span>
                        <span className="text-[18px] font-bold">
                          {ship.stats.hp}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-md mb-2.5">
                        <span className="text-[13px] text-[#94a3b8] uppercase tracking-[1px]">
                          SPEED CLASS
                        </span>
                        <span className="text-[18px] font-bold">
                          {ship.stats.speed}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-md mb-2.5">
                        <span className="text-[13px] text-[#94a3b8] uppercase tracking-[1px]">
                          COMBAT ROLE
                        </span>
                        <span className="text-[18px] font-bold">
                          {ship.stats.type}
                        </span>
                      </div>

                      <button
                        onClick={() => handleBuyShip(ship)}
                        disabled={isSelectedForGame}
                        className={`mt-auto bg-transparent border p-4 rounded-md font-sans text-[16px] font-semibold tracking-[2px] uppercase cursor-pointer transition-all duration-300 ${
                          isSelectedForGame
                            ? "border-[#00D9FF] text-[#00D9FF] bg-[#00D9FF]/10 shadow-[0_0_15px_rgba(0,208,255,0.2)]"
                            : isUnlocked
                              ? "border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/10 hover:border-[#00D9FF] hover:shadow-[0_0_15px_rgba(0,208,255,0.2)]"
                              : credits >= ship.cost
                                ? "border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 hover:border-[#EF4444] hover:shadow-[0_0_15px_rgba(255,145,0,0.2)]"
                                : "border-[#1e2645] text-[#94a3b8] cursor-not-allowed"
                        }`}
                      >
                        {isSelectedForGame
                          ? "SYSTEM ACTIVE"
                          : isUnlocked
                            ? "ENGAGE CHASSIS"
                            : `AUTHORIZE BUILD - ${ship.cost}`}
                      </button>
                    </>
                  );
                })()
              : (() => {
                  const upg = UPGRADES_ENHANCED.find(
                    (u) => u.id === selection.id,
                  )!;
                  const currentLvl = upgrades[upg.id] || 0;
                  const cost = Math.floor(
                    upg.baseCost * Math.pow(upg.costMult, currentLvl),
                  );
                  const isMax = currentLvl >= upg.maxLevel;
                  const canAfford = credits >= cost && !isMax;

                  return (
                    <>
                      <div className="flex items-center gap-[15px] mb-5">
                        <h1 className="text-[32px] tracking-[4px] uppercase whitespace-nowrap">
                          {upg.name}
                        </h1>
                        <span className="border border-[#1e2645] py-1 px-2.5 rounded-[20px] text-[11px] text-[#EF4444] uppercase tracking-[1px]">
                          UPGRADE
                        </span>
                      </div>

                      <p className="text-[#94a3b8] text-[14px] leading-[1.6] mb-10 max-w-[90%]">
                        {upg.desc}
                      </p>

                      <div className="text-[12px] text-[#94a3b8] tracking-[2px] uppercase mb-[15px] border-b border-[#1e2645] pb-2">
                        ENHANCEMENT OUTPUT
                      </div>

                      <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-md mb-2.5">
                        <span className="text-[13px] text-[#94a3b8] uppercase tracking-[1px]">
                          CURRENT MODULE
                        </span>
                        <span className="text-[18px] font-bold">
                          {currentLvl > 0
                            ? upg.bonusFn(currentLvl)
                            : "System Offline"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-md mb-2.5">
                        <span className="text-[13px] text-[#94a3b8] uppercase tracking-[1px]">
                          NEXT MODULE
                        </span>
                        <span className="text-[18px] font-bold">
                          {!isMax
                            ? upg.bonusFn(currentLvl + 1)
                            : "MAXIMUM CAPACITY REACHED"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleBuyUpgrade(upg)}
                        disabled={!canAfford || isMax}
                        className={`mt-auto bg-transparent border p-4 rounded-md font-sans text-[16px] font-semibold tracking-[2px] uppercase cursor-pointer transition-all duration-300 ${
                          isMax
                            ? "border-[#1e2645] text-[#94a3b8] cursor-not-allowed bg-[#18213b]/50"
                            : canAfford
                              ? "border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 hover:border-[#EF4444] hover:shadow-[0_0_15px_rgba(255,145,0,0.2)]"
                              : "border-[#1e2645] text-[#94a3b8] cursor-not-allowed"
                        }`}
                      >
                        {isMax
                          ? "MODIFICATION MAXED"
                          : `AUTHORIZE REFIT - ${cost}`}
                      </button>
                    </>
                  );
                })()}
          </section>

          {/* RIGHT VISUAL PANEL */}
          <section className="flex flex-col justify-between shrink-0">
            {/* Hologram Stage */}
            <div className="flex-grow flex justify-center items-center relative mb-6">
              <div
                className="absolute w-[450px] h-[450px] rounded-full z-10 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
                }}
              ></div>
              <div className="z-20 w-[400px] h-[400px] flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <img
                  src={`/VoidFleetPack/${displayShip.name}/Base.png`}
                  alt={displayShip.name}
                  className="max-w-[400px] max-h-[400px] w-full h-full object-contain scale-110"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>

            {/* Stat Card Overlay */}
            <div className="bg-[#0d1428] border border-[#1e2645] rounded-xl p-[25px] relative">
              {/* Decorative neon line */}
              <div className="absolute left-[-1px] top-[20px] bottom-[20px] w-[3px] bg-[#6366F1] rounded-[3px] shadow-[0_0_10px_#6366F1]"></div>

              <div className="flex justify-between items-center mb-[20px]">
                <h2 className="text-[20px] tracking-[2px] uppercase m-0 leading-none">
                  {displayShip.name}
                </h2>
                {displayShip.id === selected && (
                  <span className="bg-[#00D9FF]/10 border border-[#00D9FF] text-[#00D9FF] px-2.5 py-1 rounded-[4px] text-[10px] font-bold tracking-[1px]">
                    ACTIVE CHASSIS
                  </span>
                )}
              </div>

              <div className="mb-[15px]">
                <div className="flex justify-between mb-2 text-[11px] font-semibold text-[#94a3b8] tracking-[1px] uppercase">
                  <span>HULL INTEGRITY</span>
                  <span className="text-white">{displayShip.stats.hp}</span>
                </div>
                <div className="w-full h-[6px] bg-[#060a14] rounded-[3px] overflow-hidden">
                  <div
                    className="h-full bg-[#EF4444] rounded-[3px] transition-all"
                    style={{
                      width: `${Math.min(100, (displayShip.stats.hp / 400) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-0">
                <div className="flex justify-between mb-2 text-[11px] font-semibold text-[#94a3b8] tracking-[1px] uppercase">
                  <span>ENGINE OUTPUT</span>
                  <span className="text-white">{displayShip.stats.speed}</span>
                </div>
                <div className="w-full h-[6px] bg-[#060a14] rounded-[3px] overflow-hidden">
                  <div
                    className="h-full bg-[#EF4444] rounded-[3px] transition-all"
                    style={{
                      width:
                        displayShip.stats.speed === "Very Fast"
                          ? "100%"
                          : displayShip.stats.speed === "Fast"
                            ? "80%"
                            : displayShip.stats.speed === "Normal"
                              ? "60%"
                              : displayShip.stats.speed === "Slow"
                                ? "40%"
                                : "20%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
