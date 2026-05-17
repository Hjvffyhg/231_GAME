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
                    "absolute inset-0 z-50 flex items-center justify-center p-6 font-mono overflow-hidden",
                    isVictory ? "bg-emerald-950/90 text-emerald-100" : "bg-blue-900/90 text-blue-100"
                  )}>
                    {isVictory && (
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.2)_0%,transparent_100%)] pointer-events-none"></div>
                    )}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="max-w-2xl w-full flex flex-col items-start justify-center overflow-y-auto z-10"
                    >
                      {isVictory ? (
                        <>
                          <div className="bg-emerald-500 text-black px-2 py-1 mb-4 text-xl font-bold uppercase shadow-[0_0_15px_rgba(16,185,129,0.5)]">SYSTEM OVERRIDE SUCCESSFUL</div>
                          <p className="mb-2">The Kla'ed flagship root process has been terminated.</p>
                          <p className="mb-6 opacity-80">Earth Defense Initiative command acknowledges your victory.</p>
                        </>
                      ) : (
                        <>
                          <div className="bg-white text-blue-900 px-2 py-1 mb-4 text-xl font-bold uppercase shadow-[0_0_15px_rgba(255,255,255,0.5)]">FATAL EXCEPTION: THREAD TERMINATED</div>
                          <p className="mb-2">A fatal exception 0E has occurred at <span className="text-white">0028:C0011E36</span> in UXD OS.</p>
                          <p className="mb-4 text-rose-300">The current process will be terminated.</p>
                          <ul className="list-disc pl-5 mb-6 space-y-1 text-sm text-blue-200">
                            <li>Insufficient Cores detected in Sector 7G.</li>
                            <li>Heap memory overflow caused by Kla'ed sub-routines.</li>
                            <li>Recommend upgrading RAM at the nearest Hangar bay before next deployment.</li>
                          </ul>
                        </>
                      )}
                      
                      <div className={cn(
                        "mb-8 w-full border p-4",
                        isVictory ? "border-emerald-500/50 bg-emerald-900/30" : "border-blue-400/50 bg-blue-900/30"
                      )}>
                        <div className={cn(
                          "text-sm uppercase tracking-widest mb-1",
                          isVictory ? "text-emerald-300" : "text-blue-300"
                        )}>Final Process Score</div>
                        <div className="text-3xl font-bold text-white">{finalScore}</div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button 
                          onClick={restart}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-4 py-3 font-bold text-sm tracking-widest uppercase transition-all shadow-md focus:outline-none active:scale-95",
                            isVictory ? "bg-emerald-100 text-emerald-900 hover:bg-white" : "bg-blue-100 text-blue-900 hover:bg-white"
                          )}
                        >
                          <RefreshCw className="w-4 h-4" /> Press to Reboot (Deploy Again)
                        </button>
                        <button 
                          onClick={backToMenu}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 border px-4 py-3 font-bold text-sm tracking-widest uppercase transition-all shadow-md focus:outline-none active:scale-95",
                            isVictory ? "border-emerald-100 hover:bg-emerald-800 text-emerald-100" : "border-blue-100 hover:bg-blue-800 text-blue-100"
                          )}
                        >
                          <ArrowLeft className="w-4 h-4" /> Shut Down (Abort)
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full w-full relative bg-[#020617]">
                <Report onBack={backToMenu} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

