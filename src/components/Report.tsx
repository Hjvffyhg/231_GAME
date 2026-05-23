import React from "react";
import { ArrowLeft, Target, Award, Clock, Database, Zap, Cpu } from "lucide-react";

export function Report({ onBack, stats }: { onBack: () => void; stats?: any }) {
  if (!stats) {
    return (
      <div className="absolute inset-0 bg-[#0A0F1F] font-sans text-slate-300 flex flex-col items-center justify-center p-8">
        <Database className="w-16 h-16 text-[#00D9FF]/30 mb-6" />
        <h2 className="text-2xl font-mono text-[#00D9FF] uppercase tracking-widest mb-2">No Telemetry Available</h2>
        <p className="text-center max-w-md text-slate-400 mb-8 font-light">
          No combat data found for this session. A Tactical Frame must complete or abort a mission to record telemetry.
        </p>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 border border-[#00D9FF]/50 hover:bg-[#00D9FF]/10 text-[#00D9FF] font-mono tracking-widest uppercase transition-all"
          style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}
        >
          <ArrowLeft size={16} /> Return to Menu
        </button>
      </div>
    );
  }

  const { score, kills, credits, timeSurvived, algorithm = "FCFS" } = stats;
  const minutes = Math.floor(timeSurvived / 60);
  const seconds = Math.floor(timeSurvived % 60);
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="absolute inset-0 bg-[#0A0F1F] font-sans text-slate-300 flex flex-col overflow-hidden">
      {/* Background Styling */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,145,178,0.1)_0%,rgba(2,6,23,1)_80%)] pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between border-b border-[#00D9FF]/40/50 bg-[#0A0F1F]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <Database className="w-8 h-8 text-[#00D9FF]" />
          <div>
            <h1 className="text-2xl font-mono font-bold text-white tracking-widest uppercase">
              Mission Report
            </h1>
            <p className="text-sm text-[#00D9FF]/80 uppercase tracking-widest">
              Combat Telemetry Analytics
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 border border-[#1e2b52] bg-[#0d1428]/80 hover:bg-[#151f3d] text-slate-300 px-4 py-2 font-bold text-sm tracking-widest uppercase transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">MAIN MENU</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 p-6 md:p-12 overflow-y-auto w-full max-w-5xl mx-auto flex flex-col gap-8 custom-scrollbar">
        <div className="bg-[#00D9FF]/10 border border-[#00D9FF]/30 p-8 flex flex-col items-center justify-center relative" style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}>
           <div className="absolute w-2 h-full left-0 top-0 bg-[#00D9FF] shadow-[0_0_10px_#00D9FF]"></div>
           <p className="text-sm font-mono text-[#00D9FF]/70 tracking-widest uppercase mb-2">Final Operation Score</p>
           <h2 className="text-6xl font-black font-mono text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{score}</h2>
           
           <div className="mt-4 flex items-center gap-2 bg-[#0d1428]/80 px-4 py-2 border border-[#00D9FF]/30">
              <Cpu className="w-4 h-4 text-[#00D9FF]" />
              <span className="text-sm font-mono tracking-widest uppercase text-slate-300">OS Schedule Algo: <strong className="text-[#00D9FF]">{algorithm}</strong></span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Card 1: Kills */}
          <div className="bg-[#0d1428]/80 border border-rose-500/30 p-6 flex flex-col relative" style={{ clipPath: "polygon(0 0, 90% 0, 100% 10%, 100% 100%, 0 100%)" }}>
             <Target className="w-10 h-10 text-rose-500 mb-4 opacity-50" />
             <p className="text-xs font-mono text-rose-400/70 tracking-widest uppercase mb-1">Hostiles Neutralized</p>
             <h3 className="text-3xl font-mono text-rose-100">{kills} Units</h3>
          </div>

          {/* Card 2: Time */}
          <div className="bg-[#0d1428]/80 border border-emerald-500/30 p-6 flex flex-col relative" style={{ clipPath: "polygon(0 0, 90% 0, 100% 10%, 100% 100%, 0 100%)" }}>
             <Clock className="w-10 h-10 text-emerald-500 mb-4 opacity-50" />
             <p className="text-xs font-mono text-emerald-400/70 tracking-widest uppercase mb-1">Combat Uptime</p>
             <h3 className="text-3xl font-mono text-emerald-100">{timeString}</h3>
          </div>

          {/* Card 3: Credits */}
          <div className="bg-[#0d1428]/80 border border-amber-500/30 p-6 flex flex-col relative" style={{ clipPath: "polygon(0 0, 90% 0, 100% 10%, 100% 100%, 0 100%)" }}>
             <Award className="w-10 h-10 text-amber-500 mb-4 opacity-50" />
             <p className="text-xs font-mono text-amber-400/70 tracking-widest uppercase mb-1">Harvested Credits</p>
             <h3 className="text-3xl font-mono text-amber-100">+{credits} CR</h3>
          </div>
        </div>

        <div className="mt-8 border-l border-slate-700 pl-6">
           <h4 className="text-lg font-mono font-bold text-white mb-2 uppercase tracking-widest">Post-Operation Briefing</h4>
           <p className="font-light text-slate-400 leading-relaxed font-sans max-w-3xl">
             The tactical frame recorded a combat uptime of <strong className="text-white">{timeString}</strong> against the Kla'ed swarm. A total of <strong className="text-white">{kills}</strong> entities were destroyed, converting enemy data cores into <strong className="text-white">{credits} Credits</strong> for use in the Hangar Fleet upgrades. 
             <br/><br/>
             Targeting drone OS performance utilized the <strong className="text-white">{algorithm}</strong> architecture scheduling algorithm during this run. Adjust OS scheduling queues accordingly for future deployments.
           </p>
        </div>
      </div>
    </div>
  );
}
