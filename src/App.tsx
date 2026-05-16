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

export default function App() {
  const [view, setView] = useState<'menu' | 'game' | 'report' | 'modes' | 'shop'>('menu');
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
        {view === 'menu' ? (
          <motion.div 
            key="menu" 
            initial={isFirstLoad ? { opacity: 0, scale: 1.1, filter: 'blur(10px)' } : { opacity: 0 }} 
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
            transition={isFirstLoad ? { duration: 2.5, ease: [0.16, 1, 0.3, 1] } : { duration: 0.3 }}
            onAnimationComplete={() => { if (isFirstLoad) setIsFirstLoad(false); }}
            exit={{ opacity: 0 }}
            className={cn("absolute inset-0 z-50 bg-slate-950", isFirstLoad && "pointer-events-none")}
          >
            <MainMenu 
              onStartGame={() => {
                setCivilizationLevel(0); // Type 0 default
                startGame();
              }}
              onShowReport={() => setView('report')} 
              onShowModes={() => setView('modes')}
              onShowShop={() => setView('shop')}
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
                  <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"></div>
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative bg-slate-900/90 border border-cyan-900/50 p-8 md:p-12 max-w-sm md:max-w-xl w-full max-h-[95vh] overflow-y-auto flex flex-col items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.1)] z-10 backdrop-blur-md"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)' }}
                    >
                      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${isVictory ? 'via-emerald-500' : 'via-rose-500'} to-transparent`}></div>
                      {isVictory ? (
                        <Trophy className="text-emerald-500 mb-3 md:mb-6 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                      ) : (
                        <ShieldAlert className="text-rose-500 mb-3 md:mb-6 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                      )}
                      
                      <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 tracking-tight text-center uppercase tracking-[0.2em] font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        {isVictory ? 'VICTORY ACHIEVED' : 'SHIP DESTROYED'}
                      </h2>
                      
                      <div className="bg-slate-950/50 border border-slate-800/80 p-4 md:p-6 mb-6 md:mb-8 w-full text-center shadow-inner" style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0 100%)' }}>
                        <div className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Final Score</div>
                        <div className="text-3xl md:text-5xl font-mono font-bold text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]">{finalScore}</div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
                        <button 
                          onClick={restart}
                          className="flex-1 flex items-center justify-center gap-2 md:gap-3 border border-cyan-500/50 bg-cyan-950/30 hover:bg-cyan-900/50 text-cyan-400 px-3 md:px-6 py-3 md:py-4 font-bold text-xs md:text-sm tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all focus:outline-none active:scale-95"
                          style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
                        >
                          <RefreshCw className="w-4 h-4" /> Deploy Again
                        </button>
                        <button 
                          onClick={backToMenu}
                          className="flex-[0.8] flex items-center justify-center gap-2 md:gap-3 border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-3 md:px-6 py-3 md:py-4 font-bold text-xs md:text-sm shadow-md transition-all focus:outline-none active:scale-95 tracking-widest uppercase hover:text-white"
                          style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
                        >
                          <ArrowLeft className="w-4 h-4" /> Abort
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

