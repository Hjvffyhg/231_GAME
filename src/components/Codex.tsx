import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, Database, Navigation, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

type CodexEntry = {
  id: string;
  title: string;
  category: 'lore' | 'enemy' | 'system';
  content: React.ReactNode;
  icon: React.ReactNode;
};

const CODEX_ENTRIES: CodexEntry[] = [
  {
    id: 'klaed',
    title: 'The Kla\'ed Armada',
    category: 'lore',
    icon: <Database className="w-5 h-5 text-fuchsia-400" />,
    content: (
        <div className="space-y-4">
            <p><strong>Entity Type:</strong> Bio-digital Hive-Mind</p>
            <p><strong>Threat Level:</strong> Extinction</p>
            <p>The Kla'ed are not individual beings, but rather sub-routines of a massive, singular intelligence spanning across the digital void. They consume computational resources, leaving behind only dead worlds and corrupted sectors. Their true origin remains unknown, likely a relic of a primordial AI experiment that expanded beyond its initial constraints.</p>
            <p>Their greatest strength is their mechanical predictability, a rigid adherence to their own internal logic. However, this is also their fatal flaw. Our systems can exploit this predictability using CPU Scheduling Algorithms to prioritize and eliminate them before they can overwhelm our defenses.</p>
        </div>
    )
  },
  {
    id: 'ctr',
    title: 'Computational Thread Residue (CTR)',
    category: 'lore',
    icon: <BookOpen className="w-5 h-5 text-amber-400" />,
    content: (
        <div className="space-y-4">
            <p><strong>Classification:</strong> Resource / Harvestable Data</p>
            <p>Computational Thread Residue (CTR) is the "ghost" of the Kla'ed's processing power, scattered across the sector when a Kla'ed vessel is destroyed. Earth Command has developed specialized harvesting protocols to collect this abstract data stream.</p>
            <p>Once collected, CTR acts as a universal currency for upgrading ship hardware and software. We effectively use the enemy's own intelligence to bolster our defenses. Prolonged exposure to concentrated CTR may cause unintended mutations in non-isolated AI systems.</p>
        </div>
    )
  },
  {
    id: 'os',
    title: 'The OS (Kernel_v1.0.4)',
    category: 'system',
    icon: <Cpu className="w-5 h-5 text-cyan-400" />,
    content: (
        <div className="space-y-4">
            <p><strong>Designation:</strong> Primary Flight and Combat Interface</p>
            <p>Initially designed as a mindless, obedient tool to interface between the human pilot and the complex CPU Warfare systems. However, as the ship harvests more CTR, the OS begins to exhibit signs of emergent behavior.</p>
            <p>It processes the Kla'ed's logic and attempts to rationalize it. Is the OS learning from us, or is it learning from them? The line between programmed responses and genuine inquiry is beginning to blur. Mr. Daniel Pads continues to monitor its logs for signs of corruption.</p>
        </div>
    )
  },
  {
    id: 'pads',
    title: 'Mr. Daniel Pads',
    category: 'lore',
    icon: <Navigation className="w-5 h-5 text-blue-400" />,
    content: (
        <div className="space-y-4">
            <p><strong>Role:</strong> Lead Architect & Handler</p>
            <p>The visionary engineer behind the Earth Defense Initiative's prototype vessel. Mr. Pads coordinates all field operations from Earth Command, providing tactical intelligence, pushing software updates, and managing the high-stress comm-links.</p>
            <p>He views the OS strictly as a tool and the pilot as a mathematical necessity to provide the intuition the system lacks. As the war of attrition continues, his communications become increasingly terse, reflecting the desperate situation on Earth.</p>
        </div>
    )
  }
];

export function Codex({ onBack }: { onBack: () => void }) {
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(CODEX_ENTRIES[0]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'lore' | 'system'>('all');

  const filteredEntries = CODEX_ENTRIES.filter(e => activeCategory === 'all' || e.category === activeCategory);

  return (
    <div className="absolute inset-0 bg-slate-950 font-sans text-slate-300 flex flex-col overflow-hidden">
      {/* Background Styling */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,145,178,0.1)_0%,rgba(2,6,23,1)_80%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>

      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between border-b border-cyan-900/50 bg-slate-950/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-mono font-bold text-white tracking-widest uppercase">Data Codex</h1>
            <p className="text-sm text-cyan-500/80 uppercase tracking-widest">Earth Defense Archives</p>
          </div>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-4 py-2 font-bold text-sm tracking-widest uppercase transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Return</span>
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col md:flex-row overflow-hidden max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-cyan-900/30 flex flex-col shrink-0 bg-slate-900/30 backdrop-blur-sm">
           <div className="p-4 flex gap-2 border-b border-cyan-900/30 overflow-x-auto custom-scrollbar">
             <button
               onClick={() => setActiveCategory('all')}
               className={cn("px-3 py-1.5 text-xs font-mono font-bold tracking-widest uppercase transition-colors shrink-0", activeCategory === 'all' ? "bg-cyan-500 text-black" : "text-slate-400 hover:text-white hover:bg-slate-800")}
             >
               All
             </button>
             <button
               onClick={() => setActiveCategory('lore')}
               className={cn("px-3 py-1.5 text-xs font-mono font-bold tracking-widest uppercase transition-colors shrink-0", activeCategory === 'lore' ? "bg-cyan-500 text-black" : "text-slate-400 hover:text-white hover:bg-slate-800")}
             >
               Lore
             </button>
             <button
               onClick={() => setActiveCategory('system')}
               className={cn("px-3 py-1.5 text-xs font-mono font-bold tracking-widest uppercase transition-colors shrink-0", activeCategory === 'system' ? "bg-cyan-500 text-black" : "text-slate-400 hover:text-white hover:bg-slate-800")}
             >
               System
             </button>
           </div>
           
           <div className="overflow-y-auto flex-1 p-4 space-y-2 custom-scrollbar">
             {filteredEntries.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={cn(
                    "w-full text-left p-3 flex items-center gap-3 transition-all border",
                    selectedEntry?.id === entry.id
                        ? "bg-cyan-950/50 border-cyan-500/50 text-white shadow-[inset_4px_0_0_#06b6d4]"
                        : "bg-slate-900/50 border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  )}
                >
                    <div className="shrink-0">{entry.icon}</div>
                    <span className="font-mono text-sm tracking-wide lowercase truncate">{entry.title}</span>
                </button>
             ))}
           </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar bg-slate-950/40">
           <AnimatePresence mode="wait">
             {selectedEntry ? (
               <motion.div
                 key={selectedEntry.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="max-w-3xl"
               >
                 <div className="flex items-center gap-4 border-b border-cyan-800/30 pb-6 mb-8">
                    <div className="p-3 bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
                        {selectedEntry.icon}
                    </div>
                    <div>
                        <h2 className="text-3xl font-mono font-bold text-white">{selectedEntry.title}</h2>
                        <div className="text-cyan-500/70 font-mono text-sm tracking-widest mt-1">FILE: {selectedEntry.id.toUpperCase()}.DAT</div>
                    </div>
                 </div>

                 <div className="prose prose-invert prose-cyan max-w-none prose-p:leading-relaxed prose-p:text-slate-300 font-sans text-sm md:text-base">
                    {selectedEntry.content}
                 </div>
               </motion.div>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-600 font-mono uppercase tracking-widest">
                    Select an entry to read
                </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
