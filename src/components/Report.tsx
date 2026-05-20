import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Activity, Layers, Target, AlertTriangle, Zap, ArrowLeft, BrainCircuit, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { Mermaid } from './Mermaid';
import { initAuth, googleSignIn, getAccessToken, User } from '../lib/auth';

const TABS = [
  { id: 'summary', icon: Eye, label: 'Observation Summary' },
  { id: 'phases', icon: Activity, label: 'Behavioral Phases' },
  { id: 'adaptation', icon: Layers, label: 'Swarm Adaptation' },
  { id: 'flow', icon: Target, label: 'Threat Flowchart' },
  { id: 'metrics', icon: AlertTriangle, label: 'Lethality Metrics' },
];

export function Report({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [needsAuth, setNeedsAuth] = useState(false);
  
  useEffect(() => {
    // Initialize auth listener
    const unsubscribe = initAuth(
      (user, token) => setNeedsAuth(false),
      () => setNeedsAuth(true)
    );
    return () => unsubscribe();
  }, []);

  const handleExportDocs = async () => {
    try {
      setIsExporting(true);
      setExportMessage('Authenticating...');
      
      let token = await getAccessToken();
      if (!token) {
        setNeedsAuth(true);
        const authResult = await googleSignIn();
        if (authResult?.accessToken) {
          token = authResult.accessToken;
          setNeedsAuth(false);
        } else {
          throw new Error('Authentication failed');
        }
      }

      setExportMessage('Creating document...');
      
      const docTitle = `Kla'ed Intelligence Report - ${new Date().toLocaleDateString()}`;
      
      // Create an empty document
      const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: docTitle })
      });
      
      if (!createRes.ok) throw new Error('Failed to create document');
      const docData = await createRes.json();
      const documentId = docData.documentId;

      setExportMessage('Writing content...');

      // Update document content
      const requests = [
        {
          insertText: {
            location: { index: 1 },
            text: `Kla'ed Intelligence Report\n\nEXECUTIVE SUMMARY\nOur telemetry indicates the Kla'ed are not attacking randomly. They exhibit three distinct psychological phases that escalate as our Tactical Frames gather Crystalline Thought Residue (CTR).\n\nPhase 1: Fixation\nThe swarm behaves predictably, hyper-focusing on the oldest perceived threat before moving to the next.\n\nPhase 2: Restlessness\nThe hive-mind fragments its attention. It begins cycling its aggression rapidly across all available presences, overwhelming single-target defenses.\n\nPhase 3: Vindictive Learning\nThe most dangerous state. The swarm recognizes which presences have been ignored and violently prioritizes them. The longer it watches you, the more vicious the execution.\n\nLETHALITY FORECAST\nFixated: Manageable (Low Unpredictability)\nRestless: Overwhelming (Even Pressure)\nVindictive: Extremely Fatal (Vengeful Spiking)\n`
          }
        }
      ];

      const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests })
      });

      if (!updateRes.ok) throw new Error('Failed to update document');

      setExportMessage('Export complete!');
      setTimeout(() => setExportMessage(''), 3000); // Clear message
      
    } catch (err: any) {
      console.error(err);
      setExportMessage('Export failed.');
      setTimeout(() => setExportMessage(''), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0A0F1F] overflow-hidden flex flex-col font-sans text-slate-200 p-4 md:p-8">
      {/* Background Holographic Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #38bdf8 0%, transparent 60%), linear-gradient(rgba(56,189,248,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.1) 1px, transparent 1px)', backgroundSize: '100% 100%, 40px 40px, 40px 40px' }} />
      
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-4">
        {onBack ? (
           <button 
             onClick={onBack}
             className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-cyan-900/50 hover:border-cyan-500 text-cyan-500 hover:text-cyan-300 transition-all font-mono text-xs tracking-widest uppercase w-max shadow-[0_0_15px_rgba(6,182,212,0.1)]"
             style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
           >
             <ArrowLeft size={16} /> Close Terminal
           </button>
        ) : <div />}
        
        <div className="flex items-center gap-3">
          {exportMessage && (
            <span className="text-xs font-mono text-cyan-400 animate-pulse uppercase tracking-widest mr-2">{exportMessage}</span>
          )}
          <button 
            onClick={handleExportDocs}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-500/50 hover:bg-indigo-800/60 text-indigo-300 hover:text-white transition-all font-mono text-xs tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
          >
            <FileText size={16} /> {isExporting ? "Exporting..." : needsAuth ? "Sign In & Export" : "Export to Docs"}
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row h-full w-full bg-slate-950/80 border border-cyan-900/50 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.1)]" style={{ clipPath: 'polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)' }}>
        
        {/* Sidebar Content Menu */}
        <div className="w-full md:w-72 bg-slate-900/50 border-b md:border-b-0 md:border-r border-cyan-900/50 flex flex-col p-4 shrink-0 overflow-x-auto md:overflow-y-auto custom-scrollbar relative">
           <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
           
           <h2 className="hidden md:flex items-center gap-2 text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-widest mb-6 px-2">
             <div className="w-2 h-2 bg-cyan-400 animate-pulse"></div>
             Kla'ed Intelligence Report
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

function Content({ tab }: { tab: string }) {
  switch (tab) {
    case 'summary': return <ExecutiveSummary />;
    case 'phases': return <BehavioralPhases />;
    case 'adaptation': return <Adaptation />;
    case 'flow': return <ThreatFlowchart />;
    case 'metrics': return <Metrics />;
    default: return null;
  }
}

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
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">Swarm Observation</h2>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">
          Analysis of Kla'ed Behavioral Shifts During Engagements
        </p>
      </div>
      
      <TechCard color="cyan">
          <p className="mb-6 text-lg">
            Our telemetry indicates the Kla'ed are not attacking randomly. They exhibit three distinct psychological phases that escalate as our Tactical Frames gather Crystalline Thought Residue (CTR).
          </p>
          <div className="space-y-4 grid grid-cols-1">
            <div className="bg-slate-950/80 border border-slate-800 p-4 flex gap-4 items-start" style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0 100%)' }}>
              <div className="bg-rose-500/20 text-rose-400 p-2 shrink-0 border border-rose-500/30"><Eye size={16} /></div>
              <div><strong className="text-rose-400 font-mono tracking-widest uppercase block mb-1">Phase 1: Fixation</strong> The swarm behaves predictably, hyper-focusing on the oldest perceived threat before moving to the next.</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-4 flex gap-4 items-start" style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0 100%)' }}>
               <div className="bg-emerald-500/20 text-emerald-400 p-2 shrink-0 border border-emerald-500/30"><Activity size={16} /></div>
              <div><strong className="text-emerald-400 font-mono tracking-widest uppercase block mb-1">Phase 2: Restlessness</strong> The hive-mind fragments its attention. It begins cycling its aggression rapidly across all available presences, overwhelming single-target defenses.</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-4 flex gap-4 items-start" style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0 100%)' }}>
               <div className="bg-indigo-500/20 text-indigo-400 p-2 shrink-0 border border-indigo-500/30"><BrainCircuit size={16} /></div>
              <div><strong className="text-indigo-400 font-mono tracking-widest uppercase block mb-1">Phase 3: Vindictive Learning</strong> The most dangerous state. The swarm recognizes which presences have been ignored and violently prioritizes them. The longer it watches you, the more vicious the execution.</div>
            </div>
          </div>
      </TechCard>
    </div>
  );
}

function BehavioralPhases() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Psychological Shifts</h2>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Deep dive into alien cognition.</p>
      </div>
      <div className="grid gap-6">
        <TechCard title="The Fixated State (Alpha)" color="rose" icon={Eye}>
          <p>Initial scout vessels and early swarms exhibit absolute tunnel vision. They will commit entirely to an assault vector until the threat is annihilated, completely ignoring secondary disturbances. They are blindingly stubborn.</p>
        </TechCard>
        <TechCard title="The Restless State (Beta)" color="emerald" icon={Activity}>
          <p>Upon sensing resistance, the swarm abandons its stubbornness for frantic multitasking. The hive-mind vibrates constantly, shifting its animosity from target to target in rapid, unpredictable sweeps. Isolation becomes impossible.</p>
        </TechCard>
        <TechCard title="The Vindictive State (Omega)" color="indigo" icon={BrainCircuit}>
          <p>A terrifying adaptation. The swarm calculates "Hostility Resonance"—the longer a ship survives in their space, the more infuriated the Kla'ed become. They learn to ignore immediate distractions to eliminate long-standing annoyances.</p>
        </TechCard>
      </div>
    </div>
  );
}

function Adaptation() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Hive Adaptations</h2>
      </div>
      <div className="space-y-6">
        <TechCard title="Reaction to Threat Presence" color="cyan">
           <div className="space-y-4 font-mono text-sm">
             <div className="flex gap-4 border-b border-cyan-900/30 pb-4">
               <span className="text-rose-400 font-bold w-24 shrink-0">FIXATED</span>
               <span className="text-slate-300">If a large presence arrives, it completely blocks the swarm's senses preventing them from noticing anything else.</span>
             </div>
             <div className="flex gap-4 border-b border-cyan-900/30 pb-4">
               <span className="text-emerald-400 font-bold w-24 shrink-0">RESTLESS</span>
               <span className="text-slate-300">The swarm treats every presence equally, diluting its wrath but guaranteeing no blind spots.</span>
             </div>
             <div className="flex gap-4">
               <span className="text-indigo-400 font-bold w-24 shrink-0">VINDICTIVE</span>
               <span className="text-slate-300">The swarm stalks the fringes, building resentment. The longer it watches uninterrupted, the deadlier its eventual strike.</span>
             </div>
           </div>
        </TechCard>
      </div>
    </div>
  );
}

function ThreatFlowchart() {
  const chart = `
  flowchart TD
      classDef default fill:#020617,stroke:#22d3ee,stroke-width:1px,color:#e2e8f0,font-family:monospace;
      classDef active fill:#082f49,stroke:#38bdf8,stroke-width:2px,color:#bae6fd,font-family:monospace;
      classDef action fill:#4c1d95,stroke:#8b5cf6,stroke-width:2px,color:#ddd6fe,font-family:monospace;
      S[Swarm detects intrusion] --> Q[(Observation Memory)]
      Q --> Eval{State Recognition}
      Eval -- Fixation --> P_FCFS[Obsess over first contact]
      Eval -- Restlessness --> P_RR[Distribute animosity]
      Eval -- Vindictive --> P_HRRN[Identify highest resentment]
      P_FCFS --> Execute[Violent Execution]:::active
      P_RR --> Execute
      P_HRRN --> Execute
      Execute --> Check{Is threat eliminated?}
      Check -- Yes --> End[Silence]:::action
      Check -- No --> Q_Update[Memory thickens]
      Q_Update --> Q
  `;
  return (
    <div className="space-y-6">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Cognitive Flow</h2>
      </div>
      <TechCard color="cyan">
        <div className="bg-slate-950/80 border border-cyan-900/50 p-6 overflow-hidden flex justify-center">
          <Mermaid chart={chart} />
        </div>
      </TechCard>
    </div>
  );
}

function Metrics() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-l-4 border-cyan-500 pl-4">
        <h2 className="text-3xl font-mono font-black tracking-[0.2em] text-white uppercase">Lethality Forecast</h2>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Projected dangers of swarm states.</p>
      </div>

      <TechCard color="cyan">
          <div className="bg-slate-900/60 border border-slate-700 overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 95%, 98% 100%, 0 100%)' }}>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-950/80 text-cyan-500 font-mono uppercase tracking-widest text-[10px] border-b border-cyan-900/50">
                <tr>
                  <th className="px-6 py-4">Observed Trait</th>
                  <th className="px-6 py-4 text-rose-500">Fixated</th>
                  <th className="px-6 py-4 text-emerald-500">Restless</th>
                  <th className="px-6 py-4 text-indigo-500">Vindictive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300 font-mono text-xs">
                <tr className="hover:bg-cyan-950/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">Unpredictability</td>
                  <td className="px-6 py-4">Low</td>
                  <td className="px-6 py-4">High</td>
                  <td className="px-6 py-4">Medium</td>
                </tr>
                <tr className="hover:bg-cyan-950/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">Pressure Distribution</td>
                  <td className="px-6 py-4">Uneven (Clustered)</td>
                  <td className="px-6 py-4">Even</td>
                  <td className="px-6 py-4">Spiking (Vengeful)</td>
                </tr>
                <tr className="hover:bg-cyan-950/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">Perceived Intelligence</td>
                  <td className="px-6 py-4">Dumb / Obsessive</td>
                  <td className="px-6 py-4">Frantic / Manic</td>
                  <td className="px-6 py-4">Calculated / Cruel</td>
                </tr>
                <tr className="hover:bg-cyan-950/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">Threat level to Frames</td>
                  <td className="px-6 py-4">Manageable</td>
                  <td className="px-6 py-4">Overwhelming</td>
                  <td className="px-6 py-4">Extremely Fatal</td>
                </tr>
              </tbody>
            </table>
          </div>
      </TechCard>
    </div>
  );
}
