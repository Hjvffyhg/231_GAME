import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, BrainCircuit, Activity, Layers, Code2, BarChart2, CheckCircle2, Sliders, Target, Play, LineChart, Zap, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { Mermaid } from './Mermaid';

const TABS = [
  { id: 'summary', icon: LayoutDashboard, label: 'Executive Summary' },
  { id: 'strategies', icon: BrainCircuit, label: 'Core Algorithms' },
  { id: 'mapping', icon: Layers, label: 'Conceptual Mapping' },
  { id: 'architecture', icon: Activity, label: 'Architecture Model' },
  { id: 'implementation', icon: Code2, label: 'Implementation' },
  { id: 'balancing', icon: Sliders, label: 'Mechanics & Balancing' },
  { id: 'guidelines', icon: BarChart2, label: 'Balancing Guidelines' },
  { id: 'mixing', icon: BrainCircuit, label: 'Mixing Patterns' },
  { id: 'scenarios', icon: Play, label: 'Sample Scenarios' },
  { id: 'metrics', icon: LineChart, label: 'Playtesting Metrics' },
  { id: 'performance', icon: Zap, label: 'Optimization' },
];

export function Report({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="absolute inset-0 w-full h-full bg-[#020617] overflow-hidden flex flex-col font-sans text-slate-200 p-4 md:p-8">
      {/* Background Holographic Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #38bdf8 0%, transparent 60%), linear-gradient(rgba(56,189,248,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.1) 1px, transparent 1px)', backgroundSize: '100% 100%, 40px 40px, 40px 40px' }} />
      
      {/* Header */}
      {onBack && (
         <button 
           onClick={onBack}
           className="relative z-10 flex items-center gap-2 px-4 py-2 bg-slate-900 border border-cyan-900/50 hover:border-cyan-500 text-cyan-500 hover:text-cyan-300 transition-all font-mono text-xs tracking-widest uppercase mb-4 w-max shadow-[0_0_15px_rgba(6,182,212,0.1)]"
           style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
         >
           <ArrowLeft size={16} /> Close Terminal
         </button>
      )}

      <div className="relative z-10 flex flex-col md:flex-row h-full w-full bg-slate-950/80 border border-cyan-900/50 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.1)]" style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}>
        
        {/* Sidebar Content Menu */}
        <div className="w-full md:w-72 bg-slate-900/50 border-b md:border-b-0 md:border-r border-cyan-900/50 flex flex-col p-4 shrink-0 overflow-x-auto md:overflow-y-auto custom-scrollbar relative">
           {/* Scanline decoration */}
           <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
           
           <h2 className="hidden md:flex items-center gap-2 text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-widest mb-6 px-2">
             <div className="w-2 h-2 bg-cyan-400 animate-pulse"></div>
             System Architecture
           </h2>
           
           <nav className="flex flex-row md:flex-col gap-2 md:gap-1.5 w-max md:w-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-xs font-mono tracking-wider transition-all duration-300 relative text-left whitespace-nowrap uppercase group",
                      isActive 
                        ? "text-cyan-300 bg-cyan-950/40 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        : "text-slate-400 border border-transparent hover:border-cyan-900/50 hover:text-cyan-100 hover:bg-slate-800/50"
                    )}
                    style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>}
                    <Icon size={16} className={cn("transition-colors shrink-0", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-500/50")} />
                    <span className="flex-1 truncate drop-shadow-md">{tab.label}</span>
                  </button>
                );
              })}
           </nav>
        </div>

        {/* Main Report Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth custom-scrollbar relative">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl mx-auto"
              >
                <Content tab={activeTab} />
              </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ... Keep Content Component ...
function Content({ tab }: { tab: string }) {
  switch (tab) {
    case 'summary': return <ExecutiveSummary />;
    case 'strategies': return <Strategies />;
    case 'mapping': return <ConceptualMapping />;
    case 'architecture': return <Architecture />;
    case 'implementation': return <Implementation />;
    case 'balancing': return <Balancing />;
    case 'guidelines': return <Guidelines />;
    case 'mixing': return <MixingPatterns />;
    case 'scenarios': return <Scenarios />;
    case 'metrics': return <Metrics />;
    case 'performance': return <Performance />;
    default: return null;
  }
}

// Reusable Tech Card Component to replace standard rounded divs
function TechCard({ children, title, icon: Icon, color = 'cyan', className = '' }: any) {
    const colors = {
        cyan: 'border-cyan-500/30 bg-slate-900/60 text-cyan-400 shadow-cyan-500/10',
        rose: 'border-rose-500/30 bg-slate-900/60 text-rose-400 shadow-rose-500/10',
        emerald: 'border-emerald-500/30 bg-slate-900/60 text-emerald-400 shadow-emerald-500/10',
        indigo: 'border-indigo-500/30 bg-slate-900/60 text-indigo-400 shadow-indigo-500/10',
        amber: 'border-amber-500/30 bg-slate-900/60 text-amber-400 shadow-amber-500/10',
        sky: 'border-sky-500/30 bg-slate-900/60 text-sky-400 shadow-sky-500/10',
    };
    const activeColor = colors[color as keyof typeof colors];

    return (
        <div className={cn("relative p-6 border backdrop-blur-sm transition-all", activeColor, className)} style={{ clipPath: 'polygon(0 0, 95% 0, 100% 15%, 100% 100%, 5% 100%, 0 85%)' }}>
            {/* Corner Deco */}
            <div className={`absolute top-0 right-0 w-6 h-6 bg-${color}-500/20`} style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
            
            {title && (
                <h3 className={`text-lg font-mono font-bold flex items-center gap-3 uppercase tracking-widest mb-4 border-b border-${color}-900/50 pb-3`}>
                    {Icon && <span className={`bg-${color}-950 p-2 border border-${color}-900/50`} style={{ clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0% 100%)' }}><Icon size={18} /></span>}
                    {title}
                </h3>
            )}
            <div className="text-slate-300 font-sans font-light leading-relaxed">
                {children}
            </div>
        </div>
    );
}

function ExecutiveSummary() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">Executive Summary</h2>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">
          Applying CPU scheduling paradigms to 2D survival AI architecture.
        </p>
      </div>
      
      <TechCard color="cyan">
          <p className="mb-6 text-lg">
            In a 2D survival game, enemy behavior can be driven by classic CPU scheduling strategies. 
            By treating enemy actions (spawn, pathfinding, attack) as processes, we can map 
            <strong className="text-white font-mono tracking-wider"> FCFS</strong>, <strong className="text-white font-mono tracking-wider"> RR</strong>, and <strong className="text-white font-mono tracking-wider"> HRRN</strong> to dictate enemy order and cadence.
          </p>
          <div className="space-y-4 grid grid-cols-1">
            <div className="bg-slate-950/80 border border-slate-800 p-4 flex gap-4 items-start" style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0 100%)' }}>
              <div className="bg-amber-500/20 text-amber-400 p-2 shrink-0 border border-amber-500/30"><CheckCircle2 size={16} /></div>
              <div><strong className="text-amber-400 font-mono tracking-widest uppercase block mb-1">FCFS</strong> Spawns and executes behaviors in strict arrival order. Simple but can lead to convoys blocking action.</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-4 flex gap-4 items-start" style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0 100%)' }}>
               <div className="bg-emerald-500/20 text-emerald-400 p-2 shrink-0 border border-emerald-500/30"><CheckCircle2 size={16} /></div>
              <div><strong className="text-emerald-400 font-mono tracking-widest uppercase block mb-1">Round-Robin (RR)</strong> Assigns a strict time-slice. Ensures fair distribution and high responsiveness.</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-4 flex gap-4 items-start" style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0 100%)' }}>
               <div className="bg-indigo-500/20 text-indigo-400 p-2 shrink-0 border border-indigo-500/30"><CheckCircle2 size={16} /></div>
              <div><strong className="text-indigo-400 font-mono tracking-widest uppercase block mb-1">HRRN</strong> Balances starvation and threat by dynamic prioritization. Yields smart tactical AI.</div>
            </div>
          </div>
      </TechCard>
    </div>
  );
}

function Strategies() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Core Algorithms</h2>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Deep dive into CPU scheduling translates.</p>
      </div>
      <div className="grid gap-6">
        <TechCard title="FCFS (First-Come, First-Served)" color="rose" icon={BrainCircuit}>
          <p>Enemies are placed in a FIFO queue. The entity at the front finishes its entire attack cycle before yielding. Simple, but prone to blockage if animations are long.</p>
        </TechCard>
        <TechCard title="Round-Robin (RR)" color="emerald" icon={BrainCircuit}>
          <p>Every enemy receives a small time 'quantum'. Ensures fair flow and simultaneous swarm advancement, but adds state-switching overhead.</p>
        </TechCard>
        <TechCard title="Highest-Response-Ratio-Next (HRRN)" color="indigo" icon={BrainCircuit}>
          <p>Sorts execution by dynamic priority: <code className="bg-slate-950 text-indigo-300 px-2 py-1 border border-indigo-900/50 font-mono text-xs">R = (Wait Time + Service Time) / Service Time</code>. Solves starvation while respecting enemy threat values.</p>
        </TechCard>
      </div>
    </div>
  );
}

function ConceptualMapping() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Conceptual Mapping</h2>
      </div>
      <div className="space-y-6">
        <FeatureCard 
          title="Enemy Spawn Scheduling"
          fcfs="Handles triggers in exact order occurring. Bosses delay next spawns."
          rr="Cyclical distribution across multiple spawn points."
          hrrn="Spawns prioritized by urgency and wait time."
        />
        <FeatureCard 
          title="Targeting & Attack Order"
          fcfs="First spawned attacks first. Relegates others."
          rr="Swarm takes turns attacking. Extremely fair to player."
          hrrn="Emulates aggro by favoring waiting enemies."
        />
        <FeatureCard 
          title="Action Time-Slicing"
          fcfs="One enemy updates at a time, halting others."
          rr="Cycles 16ms fixed slices across swarm."
          hrrn="Updates lagging AI components dynamically."
        />
      </div>
    </div>
  );
}

function FeatureCard({title, fcfs, rr, hrrn}: any) {
  return (
    <TechCard title={title} color="cyan">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="bg-slate-950/50 p-4 border border-rose-900/30">
            <strong className="text-rose-400 font-mono uppercase tracking-widest block mb-2 border-b border-rose-900/50 pb-1">FCFS</strong>
            <span className="text-slate-400">{fcfs}</span>
        </div>
        <div className="bg-slate-950/50 p-4 border border-emerald-900/30">
            <strong className="text-emerald-400 font-mono uppercase tracking-widest block mb-2 border-b border-emerald-900/50 pb-1">RR</strong>
            <span className="text-slate-400">{rr}</span>
        </div>
        <div className="bg-slate-950/50 p-4 border border-indigo-900/30">
            <strong className="text-indigo-400 font-mono uppercase tracking-widest block mb-2 border-b border-indigo-900/50 pb-1">HRRN</strong>
            <span className="text-slate-400">{hrrn}</span>
        </div>
      </div>
    </TechCard>
  );
}

function Architecture() {
  const chart = `
  flowchart TD
      classDef default fill:#020617,stroke:#22d3ee,stroke-width:1px,color:#e2e8f0,font-family:monospace;
      classDef active fill:#082f49,stroke:#38bdf8,stroke-width:2px,color:#bae6fd,font-family:monospace;
      classDef action fill:#4c1d95,stroke:#8b5cf6,stroke-width:2px,color:#ddd6fe,font-family:monospace;
      S[Enemy Spawn Event] --> Q[(AI Scheduler Queue)]
      Q --> Eval{Evaluate Strategy}
      Eval -- FCFS --> P_FCFS[Pop Front Enemy]
      Eval -- Round-Robin --> P_RR[Time-Slice]
      Eval -- HRRN --> P_HRRN[Compute Priority]
      P_FCFS --> Execute[Execute Action]:::active
      P_RR --> Execute
      P_HRRN --> Execute
      Execute --> Check{Is Action complete?}
      Check -- Yes --> End[Finish]:::action
      Check -- No --> Q_Update[Update Waiting Times]
      Q_Update --> Q
  `;
  return (
    <div className="space-y-6">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Scheduler Flowchart</h2>
      </div>
      <TechCard color="cyan">
        <div className="bg-slate-950/80 border border-cyan-900/50 p-6 overflow-hidden flex justify-center">
          <Mermaid chart={chart} />
        </div>
      </TechCard>
    </div>
  );
}

function Balancing() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Concrete Mechanics</h2>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Example parameters and formulas for live deployment.</p>
      </div>

      <div className="space-y-6">
        <TechCard title="Spawn Rates" color="sky" icon={Activity}>
          <p>
            Set a base spawn interval or wave delay <code className="bg-slate-950 px-2 py-1 border border-slate-800 text-sky-400 font-mono text-xs">T</code>. FCFS mode (easy) <code className="bg-slate-950 px-2 py-1 border border-slate-800 text-sky-400 font-mono text-xs">T=4s</code>, RR mode (normal) <code className="bg-slate-950 px-2 py-1 border border-slate-800 text-sky-400 font-mono text-xs">T=3s</code>, HRRN mode (hard) <code className="bg-slate-950 px-2 py-1 border border-slate-800 text-sky-400 font-mono text-xs">T=2s</code>.
          </p>
        </TechCard>

        <TechCard title="Time Quantum (RR)" color="emerald" icon={Activity}>
          <p>
            If using Round-Robin, pick a quantum. E.g. <code className="bg-slate-950 px-2 py-1 border border-slate-800 text-emerald-400 font-mono text-xs">0.5s</code> per enemy turn. A larger quantum makes enemies finish attacks uninterrupted; a very small quantum (0.1s) means highly interleaved and chaotic.
          </p>
        </TechCard>

        <TechCard title="HRRN Priority & Threat Score" color="indigo" icon={Activity}>
          <p className="mb-3">
            ResponseRatio = <code className="bg-slate-950 px-2 py-1 border border-indigo-900/50 text-amber-400 font-mono text-xs">(W + S) / S</code>. Where W is Wait Time, and S is Service Time / Threat Measure.
          </p>
          <p className="mb-4">
            Assign base threat to enemy types: Fast weak enemy <code className="bg-slate-950 px-2 py-1 border border-slate-800 text-amber-400 font-mono text-xs">S=1</code>, slow tough enemy <code className="bg-slate-950 px-2 py-1 border border-slate-800 text-amber-400 font-mono text-xs">S=5</code>. The formula favors weaker enemies that waited interrupting occasionally.
          </p>
          <div className="text-xs font-mono text-indigo-300 bg-indigo-950/40 p-4 border border-indigo-500/30 border-l-4 border-l-indigo-500">
            <strong>EXAMPLE_LOG:</strong> Enemy A [W=10s, S=2s] → R=6.0. Enemy B [W=2s, S=1s] → R=3.0. System schedules Enemy A.
          </div>
        </TechCard>
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-mono font-bold tracking-[0.2em] text-white uppercase mb-4 border-b border-slate-800 pb-2">Prototype Parameters Table</h3>
        <div className="bg-slate-900/60 border border-slate-700 overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 95%, 98% 100%, 0 100%)' }}>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950/80 text-cyan-500 font-mono uppercase tracking-widest text-[10px] border-b border-cyan-900/50">
              <tr>
                <th className="px-6 py-4">Parameter</th>
                <th className="px-6 py-4 text-rose-500">FCFS (EASY)</th>
                <th className="px-6 py-4 text-emerald-500">RR (NORMAL)</th>
                <th className="px-6 py-4 text-indigo-500">HRRN (HARD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300 font-mono text-xs">
              <tr className="hover:bg-cyan-950/20 transition-colors">
                <td className="px-6 py-4 font-bold text-white">Spawn Interval</td>
                <td className="px-6 py-4">4.0 s</td>
                <td className="px-6 py-4">3.0 s</td>
                <td className="px-6 py-4">2.0 s</td>
              </tr>
              <tr className="hover:bg-cyan-950/20 transition-colors">
                <td className="px-6 py-4 font-bold text-white">RR Quantum</td>
                <td className="px-6 py-4 text-slate-600">NULL</td>
                <td className="px-6 py-4">0.5 s</td>
                <td className="px-6 py-4 text-slate-600">NULL</td>
              </tr>
              <tr className="hover:bg-cyan-950/20 transition-colors">
                <td className="px-6 py-4 font-bold text-white">Threat Factor</td>
                <td className="px-6 py-4">Uniform 1.0</td>
                <td className="px-6 py-4">Uniform 1.0</td>
                <td className="px-6 py-4 leading-relaxed">Goblin=1.0<br/>Ogre=3.0<br/>Boss=5.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Implementation() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Implementation Specs</h2>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Queue mechanics and execution time-slicing.</p>
      </div>

      <div className="space-y-6">
        <TechCard title="Spawning Mechanics" color="cyan" icon={Activity}>
          <p className="mb-4">
            Use a queue for new spawn events. When a spawn is ready, it is added to the queue with a timestamp.
          </p>
          <div className="bg-slate-950 p-4 border border-slate-800 font-mono text-xs space-y-3">
             <div className="flex gap-4">
               <span className="text-cyan-500 font-bold w-12">{'FCFS>'}</span>
               <span className="text-slate-400">Always dequeue the oldest spawn. Simple timestamp resolution.</span>
             </div>
             <div className="flex gap-4">
               <span className="text-cyan-500 font-bold w-12">{'RR/HRRN>'}</span>
               <span className="text-slate-400">Cycle through valid spawn points or apply HRRN logic to pick which spawn location activates next.</span>
             </div>
          </div>
        </TechCard>

        <TechCard title="Targeting & Action Slicing" color="rose" icon={Target}>
          <p className="mb-4">
            Each enemy operates as a State Machine. The CPU scheduler dictates which enemy state machine advances per tick:
          </p>
          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-950/80 border-l-2 border-rose-500 p-3 flex gap-4">
               <span className="text-rose-500 font-bold">01</span>
               <p className="text-slate-400">Gather all active entities within proximity bounds.</p>
            </div>
            <div className="bg-slate-950/80 border-l-2 border-rose-500 p-3 flex gap-4">
               <span className="text-rose-500 font-bold">02</span>
               <p className="text-slate-400">Scheduler picks entities to "update" this frame based on active strategy (FCFS, RR, HRRN).</p>
            </div>
            <div className="bg-slate-950/80 border-l-2 border-rose-500 p-3 flex gap-4">
               <span className="text-rose-500 font-bold">03</span>
               <p className="text-slate-400">Selected enemies execute action for fixed interval. Unselected simulate idle time-slicing.</p>
            </div>
          </div>
        </TechCard>
      </div>
    </div>
  );
}

function Guidelines() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Balancing Guidelines</h2>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Heuristics for creating fair, tactical AI flow.</p>
      </div>

      <div className="space-y-6">
        <TechCard title="Difficulty Curve" color="sky">
          <p className="mb-4">
             Scheduling directly affects perceived difficulty. Use retention/completion as indicators: if many players quit at a spawn wave, scheduling might be too punishing.
          </p>
          <div className="bg-slate-950/80 p-4 border border-slate-800 space-y-2 font-mono text-xs">
             <p><strong className="text-white">FCFS:</strong> Tends to create bursts (one enemy hogging time), spiking difficulty unpredictably.</p>
             <p><strong className="text-white">Round-Robin:</strong> Distributes threat evenly, making a smoother and more consistent challenge.</p>
             <p><strong className="text-white">HRRN:</strong> Adapts dynamically. Low-level enemies that waited long suddenly swarm.</p>
          </div>
        </TechCard>

        <TechCard title="Fairness & Perceived Intelligence" color="emerald">
          <p className="mb-4">
             Fairness means not letting one enemy dominate unless intended. Players perceive HRRN-controlled enemies as more "intelligent" because the AI adapts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
             <div className="bg-slate-950 p-4 border-t-2 border-rose-500">
                <strong className="text-rose-400 block mb-2">FCFS</strong>
                <span className="text-slate-500">Can feel unfair if one target dominates.</span>
             </div>
             <div className="bg-slate-950 p-4 border-t-2 border-emerald-500">
                <strong className="text-emerald-400 block mb-2">RR</strong>
                <span className="text-slate-500">Innately fair. Every enemy hits in turn.</span>
             </div>
             <div className="bg-slate-950 p-4 border-t-2 border-indigo-500">
                <strong className="text-indigo-400 block mb-2">HRRN</strong>
                <span className="text-slate-500">Prevents starvation by boosting waiting units.</span>
             </div>
          </div>
        </TechCard>
      </div>
    </div>
  );
}

function MixingPatterns() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Mixing Patterns</h2>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Combining schedulers to enrich gameplay dynamics.</p>
      </div>

      <div className="space-y-6">
        <TechCard title="Per-Enemy-Type Schedulers" color="indigo">
          <p className="mb-4">Assign different scheduling per enemy class or zone to tailor AI behavior to roles:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
             <div className="bg-slate-950 p-4 border border-rose-900/50">
                <strong className="text-rose-400 block mb-2">Melee Swarm <span className="bg-rose-950 text-rose-500 border border-rose-500/30 px-1 ml-1">FCFS</span></strong>
                <span className="text-slate-500">Charge the player in spawn order, acting one at a time.</span>
             </div>
             <div className="bg-slate-950 p-4 border border-emerald-900/50">
                <strong className="text-emerald-400 block mb-2">Ranged Units <span className="bg-emerald-950 text-emerald-500 border border-emerald-500/30 px-1 ml-1">RR</span></strong>
                <span className="text-slate-500">Take turns firing shots in a cycle, maintaining constant fire.</span>
             </div>
             <div className="bg-slate-950 p-4 border border-indigo-900/50">
                <strong className="text-indigo-400 block mb-2">Boss Elements <span className="bg-indigo-950 text-indigo-500 border border-indigo-500/30 px-1 ml-1">HRRN</span></strong>
                <span className="text-slate-500">Alternates boss attacks and mob swarming dynamically.</span>
             </div>
          </div>
        </TechCard>

        <TechCard title="Dynamic Switching (AI Director)" color="rose">
          <ul className="space-y-3 font-mono text-xs text-slate-400">
             <li className="flex gap-3"><div className="w-1 h-1 bg-rose-500 mt-1.5 shrink-0" /><div>Start wave in FCFS (pick off weak foes), mid-way switch to RR (sudden swarm pressure).</div></li>
             <li className="flex gap-3"><div className="w-1 h-1 bg-rose-500 mt-1.5 shrink-0" /><div>If an elite enemy spawns, temporarily force FCFS onto it until defeated.</div></li>
             <li className="flex gap-3"><div className="w-1 h-1 bg-rose-500 mt-1.5 shrink-0" /><div>Monitor performance: if clustered too densely, fallback to RR to calm things down.</div></li>
          </ul>
        </TechCard>
      </div>
    </div>
  );
}

function Scenarios() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Sample Scenarios</h2>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Emergent gameplay differences under each scheduler.</p>
      </div>

      <div className="space-y-4">
        <TechCard title="Three Goblins Arrive (1s attacks)" color="cyan">
          <ul className="space-y-2 font-mono text-xs text-slate-400">
             <li><strong className="text-rose-400">FCFS:</strong> Goblin 1 attacks repeatedly until dead, others idle.</li>
             <li><strong className="text-emerald-400">RR:</strong> Each goblin gets a turn every second. Constant pressure.</li>
             <li><strong className="text-indigo-400">HRRN:</strong> Initially FCFS. Surviving goblins gain priority, shifting to RR style over time.</li>
          </ul>
        </TechCard>

        <TechCard title="Boss (HP 30, 2s) & Two Minions (HP 5, 1s)" color="rose">
          <ul className="space-y-2 font-mono text-xs text-slate-400">
             <li><strong className="text-rose-400">FCFS:</strong> Boss spawns first and monopolizes attack slots. Hard block.</li>
             <li><strong className="text-emerald-400">RR:</strong> Boss attacks 2s, Minion1 1s, Boss 2s, Minion2 1s.</li>
             <li><strong className="text-indigo-400">HRRN:</strong> Minions build Wait Time due to the boss's long Service Time, eventually interrupting to get hits in.</li>
          </ul>
        </TechCard>
      </div>
    </div>
  );
}

function Metrics() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Playtesting Metrics</h2>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Trade-offs for tuning AI scheduling.</p>
      </div>

      <TechCard color="cyan">
          <div className="bg-slate-900/60 border border-slate-700 overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 95%, 98% 100%, 0 100%)' }}>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-950/80 text-cyan-500 font-mono uppercase tracking-widest text-[10px] border-b border-cyan-900/50">
                <tr>
                  <th className="px-6 py-4">Criterion</th>
                  <th className="px-6 py-4 text-rose-500">FCFS</th>
                  <th className="px-6 py-4 text-emerald-500">RR</th>
                  <th className="px-6 py-4 text-indigo-500">HRRN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300 font-mono text-xs">
                <tr className="hover:bg-cyan-950/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">Responsiveness</td>
                  <td className="px-6 py-4">Low (stalls)</td>
                  <td className="px-6 py-4">High</td>
                  <td className="px-6 py-4">Medium</td>
                </tr>
                <tr className="hover:bg-cyan-950/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">Fairness</td>
                  <td className="px-6 py-4">Low</td>
                  <td className="px-6 py-4">High</td>
                  <td className="px-6 py-4">High</td>
                </tr>
                <tr className="hover:bg-cyan-950/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">Perceived "Smartness"</td>
                  <td className="px-6 py-4">Low</td>
                  <td className="px-6 py-4">Medium</td>
                  <td className="px-6 py-4">High</td>
                </tr>
                <tr className="hover:bg-cyan-950/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">Complexity</td>
                  <td className="px-6 py-4">Very low</td>
                  <td className="px-6 py-4">Moderate</td>
                  <td className="px-6 py-4">Higher</td>
                </tr>
              </tbody>
            </table>
          </div>
      </TechCard>
    </div>
  );
}

function Performance() {
  const chart = `
  flowchart LR
    classDef default fill:#020617,stroke:#22d3ee,stroke-width:1px,color:#e2e8f0,font-family:monospace;
    classDef action fill:#082f49,stroke:#38bdf8,stroke-width:2px,color:#bae6fd,font-family:monospace;
    subgraph Scheduler
      A[New Spawn] --> Q[(Enemy Queue)]
      Q --> S{Scheduler Chooses}
      S -->|FCFS| X1[Oldest Enemy]
      S -->|RR| X2[Next Enemy]
      S -->|HRRN| X3[Highest Ratio]
      X1 --> Act[Perform Action]:::action
      X2 --> Act
      X3 --> Act
      Act --> Q
    end
  `;

  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Optimization</h2>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Strategies to maintain frame rates under heavy loads.</p>
      </div>

      <div className="space-y-6">
        <TechCard title="Algorithm Complexity" color="amber" icon={Zap}>
           <ul className="space-y-3 font-mono text-xs">
             <li className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                 <span className="text-rose-400 font-bold">FCFS</span>
                 <code className="text-amber-400">O(1)</code>
                 <span className="text-slate-500">per step (pop queue head)</span>
             </li>
             <li className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                 <span className="text-emerald-400 font-bold">Round-Robin</span>
                 <code className="text-amber-400">O(1)</code>
                 <span className="text-slate-500">per step (move index)</span>
             </li>
             <li className="flex justify-between items-center">
                 <span className="text-indigo-400 font-bold">HRRN</span>
                 <code className="text-amber-400">O(n)</code>
                 <span className="text-slate-500">per selection (compute ratio)</span>
             </li>
          </ul>
        </TechCard>

        <TechCard color="cyan">
          <div className="bg-slate-950/80 border border-cyan-900/50 p-6 overflow-hidden flex justify-center">
            <Mermaid chart={chart} />
          </div>
        </TechCard>
      </div>
    </div>
  );
}
