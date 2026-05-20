import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Target, Clock, ShieldAlert, Settings, Info, Play, RefreshCw, BookOpen, Gamepad2, ArrowLeft, Trophy } from 'lucide-react';
import { cn } from './lib/utils';
import { GameCanvas, SchedulerAlgo } from './components/GameCanvas';
import { Report } from './components/Report';
import { MainMenu } from './components/MainMenu';
import { GalaxyModeSelect } from './components/GalaxyModeSelect';
import { ShopScreen } from './components/Shop';
import { soundManager } from './lib/audio';

import { Codex } from './components/Codex';
import { BootSequence } from './components/BootSequence';

export default function App() {
  const [view, setView] = useState<'boot' | 'menu' | 'game' | 'report' | 'modes' | 'shop' | 'codex'>('boot');
  const [gameKey, setGameKey] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [civilizationLevel, setCivilizationLevel] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handleGameOver = (score: number, victory: boolean = false) => {
    setFinalScore(score);
    setIsGameOver(true);
    setIsVictory(victory);
    if (victory) {
        soundManager.playWaveCompletion();
    } else {
        soundManager.playGameOver();
    }
    
    // Save high score
    const saved = localStorage.getItem('maxScore');
    if (!saved || score > parseInt(saved, 10)) {
        localStorage.setItem('maxScore', score.toString());
    }

    // Save credits
    const currentCredits = parseInt(localStorage.getItem('credits') || '0', 10);
    localStorage.setItem('credits', (currentCredits + score).toString());
  };

  const restart = () => {
    soundManager.init();
    setIsGameOver(false);
    setGameKey(k => k + 1);
  };

  const backToMenu = () => {
    setView('menu');
    setIsGameOver(false);
  };

  const startGame = () => {
    soundManager.init();
    setView('game');
  };

  const handleSelectMode = (level: number) => {
    setCivilizationLevel(level);
    startGame();
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 overflow-hidden h-[100dvh] relative">
      <AnimatePresence mode="wait">
        {view === 'boot' ? (
          <motion.div key="boot" className="absolute inset-0 z-50">
            <BootSequence onComplete={() => setView('menu')} />
          </motion.div>
        ) : view === 'menu' ? (
          <motion.div 
            key="menu" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
            transition={{ duration: 0.8 }}
            exit={{ 
                opacity: 0, 
                scaleY: 0.01, 
                scaleX: 1.2, 
                filter: 'brightness(3) blur(10px)',
                transition: { duration: 0.4, ease: "anticipate" } 
            }}
            className="absolute inset-0 z-50 bg-slate-950 origin-center"
          >
            <MainMenu 
              onStartGame={() => {
                setCivilizationLevel(0); // Type 0 default
                startGame();
              }}
              onShowReport={() => setView('report')} 
              onShowModes={() => setView('modes')}
              onShowShop={() => setView('shop')}
              onShowCodex={() => setView('codex')}
            />
          </motion.div>
        ) : view === 'modes' ? (
          <motion.div 
            key="modes"
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -50 }}
            className="absolute inset-0 z-50"
          >
             <GalaxyModeSelect 
                onBack={backToMenu} 
                onSelectMode={handleSelectMode} 
             />
          </motion.div>
        ) : view === 'shop' ? (
          <motion.div 
            key="shop"
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 bg-slate-950"
          >
             <ShopScreen onBack={backToMenu} />
          </motion.div>
        ) : view === 'codex' ? (
          <motion.div 
            key="codex"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950"
          >
             <Codex onBack={backToMenu} />
          </motion.div>
        ) : (
          <motion.div 
            key="app" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="w-full h-full"
          >
            {view === 'game' ? (
              <div className="h-full w-full relative bg-slate-900">
                <GameCanvas 
                  gameKey={gameKey}
                  onGameOver={handleGameOver}
                  onReturnMenu={backToMenu}
                  civilizationLevel={civilizationLevel}
                />

                {isGameOver && (
                  <div className={cn(
                    "absolute inset-0 z-[200] flex items-center justify-center p-6 font-mono overflow-hidden backdrop-blur-sm",
                    isVictory ? "bg-emerald-950/90 text-emerald-100" : "bg-slate-950/90 text-slate-100"
                  )}>
                    {isVictory && (
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.2)_0%,transparent_100%)] pointer-events-none"></div>
                    )}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="max-w-2xl w-full flex flex-col items-start justify-center overflow-y-auto z-10 p-8 shadow-2xl relative group"
                      style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)' }}
                    >
                      {/* Glassmorphism Background for Modal */}
                      <div className={cn("absolute inset-0 border backdrop-blur-sm transition-all", isVictory ? "bg-emerald-950/30 border-emerald-500/30" : "bg-rose-950/30 border-rose-500/30")}></div>
                      
                      {/* Glowing left edge indicator */}
                      <div className={cn("absolute left-0 top-0 bottom-0 w-2 shadow-[0_0_15px]", isVictory ? "bg-emerald-400 shadow-emerald-400" : "bg-rose-400 shadow-rose-400")}></div>

                      {/* Scanline overlay effect */}
                      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30"></div>

                      <div className="relative z-10 w-full flex flex-col items-center text-center">
                        {isVictory ? (
                          <>
                            <div className="inline-block bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-2 mb-6 text-xl font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.3)]">HIVE NETWORK INFILTRATION SUCCESSFUL</div>
                            <p className="mb-2 text-emerald-100 font-mono tracking-wide">The Kla'ed flagship central hive has been purged.</p>
                            <p className="mb-8 opacity-70 font-mono text-sm">Earth Defense Initiative command acknowledges your victory.</p>
                          </>
                        ) : (
                          <>
                            <div className="inline-block bg-rose-500/20 border border-rose-500/50 text-rose-400 px-4 py-2 mb-6 text-xl font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.3)]">MISSION FAILED</div>
                            <p className="mb-6 text-slate-300 font-mono tracking-wide">Your ship was destroyed in <span className="text-rose-400 font-bold">Sector-7G</span>.</p>
                            <div className="inline-block text-left mb-8">
                              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400 font-mono">
                                <li>Overwhelmed by enemy swarms.</li>
                                <li>Shields failed.</li>
                                <li><span className="text-rose-400 font-bold uppercase tracking-wider text-xs">Tip:</span> Upgrade your armor in the Hangar before trying again.</li>
                              </ul>
                            </div>
                          </>
                        )}
                        
                        <div className={cn(
                          "mb-10 w-full p-6 relative border overflow-hidden flex flex-col items-center",
                          isVictory ? "border-emerald-500/40 bg-emerald-950/50" : "border-rose-900/50 bg-rose-950/20"
                        )}>
                          <div className={cn(
                            "text-sm uppercase tracking-[0.3em] mb-2 font-mono drop-shadow-md text-center",
                            isVictory ? "text-emerald-400" : "text-rose-400/80"
                          )}>Final Combat Score</div>
                          <div className={cn("text-5xl font-black tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] text-center", isVictory ? "text-emerald-100" : "text-white")}>{finalScore}</div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-6 w-full">
                          <button 
                            onClick={restart}
                            className={cn(
                              "relative group/btn w-full overflow-hidden border min-h-[55px] flex items-center justify-center p-4 transition-all duration-300",
                              isVictory ? "border-emerald-500/50 bg-emerald-900/50 hover:bg-emerald-800/80" : "border-rose-500/50 bg-rose-900/40 hover:bg-rose-800/80"
                            )}
                            style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 70%, 92% 100%, 0 100%, 0 30%)' }}
                          >
                            <div className={cn("absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000", isVictory ? "bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0" : "bg-gradient-to-r from-rose-500/0 via-rose-500/20 to-rose-500/0")}></div>
                            <div className={cn("absolute left-0 top-0 w-1 h-full transition-colors", isVictory ? "bg-emerald-700 group-hover/btn:bg-emerald-400" : "bg-rose-700 group-hover/btn:bg-rose-400")}></div>
                            <span className={cn("relative z-10 font-mono text-sm md:text-base font-bold tracking-[0.2em] transition-colors uppercase drop-shadow-lg flex items-center gap-3", isVictory ? "text-emerald-100 group-hover/btn:text-white" : "text-rose-100 group-hover/btn:text-white")}>
                              <RefreshCw className="w-5 h-5" /> {isVictory ? "NEXT DEPLOYMENT" : "TRY AGAIN"}
                            </span>
                          </button>
                          
                          <button 
                            onClick={backToMenu}
                            className={cn(
                              "relative group/btn w-full overflow-hidden border min-h-[55px] flex items-center justify-center p-4 transition-all duration-300",
                              "border-slate-600/50 bg-slate-900/50 hover:bg-slate-800/80 hover:border-slate-400/50"
                            )}
                            style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 70%, 92% 100%, 0 100%, 0 30%)' }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-500/0 via-slate-500/20 to-slate-500/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                            <div className="absolute left-0 top-0 w-1 h-full bg-slate-700 group-hover/btn:bg-slate-300 transition-colors"></div>
                            <span className="relative z-10 font-mono text-sm md:text-base font-bold tracking-[0.2em] text-slate-300 group-hover/btn:text-white transition-colors uppercase drop-shadow-lg flex items-center gap-3">
                              <ArrowLeft className="w-5 h-5" /> MAIN MENU
                            </span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full w-full relative bg-[#0A0F1F]">
                <Report onBack={backToMenu} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

