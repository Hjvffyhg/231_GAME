import React from 'react';
import { cn } from '../lib/utils';
import { MenuBackground } from './MenuBackground'; // We can overlay this on top of the JPG if it has cool particle effects!

const MenuButton = ({ 
  className, 
  onClick, 
  title, 
  locked = false,
}: { 
  className?: string, 
  onClick?: () => void, 
  title: string, 
  locked?: boolean,
}) => {
  return (
    <button
      onClick={!locked ? onClick : undefined}
      className={cn(
        "relative group transition-all duration-300 ease-out",
        "w-[260px] min-h-[55px] sm:w-[360px] lg:w-[420px] sm:min-h-[65px] py-3",
        "flex items-center pl-6 md:pl-8 text-left",
        locked ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:pl-10",
        className
      )}
      // High-tech angled corners using CSS clip-path
      style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 70%, 92% 100%, 0 100%, 0 30%)' }}
      title={title}
      aria-label={title}
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-cyan-950/30 border border-cyan-500/30 backdrop-blur-sm transition-all group-hover:bg-cyan-900/50 group-hover:border-cyan-400"></div>
      
      {/* Glowing left edge indicator on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-400 shadow-[0_0_15px_#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Scanline overlay effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

      {/* Button Text */}
      <span className="relative z-10 font-mono text-lg md:text-xl font-bold tracking-[0.2em] text-cyan-100 group-hover:text-white transition-colors uppercase drop-shadow-lg pr-4 break-words">
        {title}
      </span>

      {locked && (
         <div className="absolute right-4 z-10 flex items-center justify-center">
           <span className="text-xs font-mono text-red-400 tracking-widest px-2 py-1 bg-red-950/80 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
             LOCKED
           </span>
         </div>
      )}
    </button>
  );
};

export function MainMenu({ onStartGame, onShowReport, onShowModes, onShowShop, onShowCodex }: { onStartGame: () => void, onShowReport: () => void, onShowModes?: () => void, onShowShop?: () => void, onShowCodex?: () => void }) {
  const [uiScale, setUiScale] = React.useState(1);

  React.useEffect(() => {
    const handleResize = () => {
      // Base reference dimensions for Main Menu
      const baseHeight = 900;
      const baseWidth = 1440;
      
      const heightScale = window.innerHeight / baseHeight;
      const widthScale = window.innerWidth / baseWidth;
      
      // Calculate a scale that ensures the menu fits without scrolling, particularly on short vertical screens
      const scale = Math.max(0.4, Math.min(heightScale, widthScale, 1.2));
      setUiScale(scale);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden">
      
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/assets/Mainmenu.jpg)',
          // Darken the image slightly so UI pops out
          boxShadow: 'inset 0 0 200px rgba(0,0,0,0.8)'
        }}
      >
        {/* If MenuBackground has cool particle effects/stars, uncomment it to overlay them on the JPG */}
        <MenuBackground />
      </div>

      <div className="relative w-full h-full p-6 sm:p-8 md:p-12 lg:p-16 overflow-hidden">
        <div 
           className="w-full h-full flex flex-col origin-left"
           style={{ transform: `scale(${uiScale})` }}
        >
          {/* Game Title Area */}
        <div className="mt-2 sm:mt-4 md:mt-8 lg:mt-12 max-w-2xl shrink-0">
          <h2 className="text-cyan-500 font-mono tracking-[0.2em] md:tracking-[0.3em] text-[10px] sm:text-xs md:text-base font-bold mb-1 sm:mb-2 uppercase drop-shadow-md">
            Earth Defense Initiative
          </h2>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono font-black text-white tracking-widest uppercase drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] leading-tight">
            Space
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Survival
            </span>
          </h1>
        </div>
        
        {/* Buttons Layout */}
        <div className="flex flex-col mt-8 sm:mt-12 lg:mt-16 pb-2 sm:pb-8 lg:pb-10 gap-3 sm:gap-4 md:gap-5 z-10 drop-shadow-2xl shrink-0">
          
          <MenuButton 
            onClick={onStartGame} 
            title="START MISSION"
          />
          
          <MenuButton 
            onClick={onShowShop}
            title="UPGRADES"
          />

          <MenuButton 
            onClick={onShowModes}
            title="LEVEL SELECT"
          />

          <MenuButton 
            onClick={onShowCodex}
            title="STORY / LORE"
          />

          <MenuButton 
            onClick={onShowReport} 
            title="ENEMY INFO"
          />

        </div>
        </div>
      </div>
    </div>
  );
}
