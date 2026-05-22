import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, Database, Navigation, Crosshair } from 'lucide-react';
import { cn } from '../lib/utils';

type CodexEntry = {
  id: string;
  title: string;
  category: 'lore' | 'enemy' | 'frame';
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
                <p><strong>Entity Type:</strong> Cosmic Hive-Mind</p>
                <p><strong>Threat Level:</strong> Extinction</p>
                <p>The Kla'ed are not individual beings, but rather fragments of a massive, singular hostility spanning across the void. They consume awareness and memory, leaving behind only dead worlds and fractured husks. Their true origin remains unknown, an ancient entity that expanded beyond its initial constraints.</p>
                <p>Their greatest strength is their relentless predictability, a rigid adherence to their own violent urges. However, this is also their fatal flaw. Our Tactical Frames can exploit this fixation using Swarm Observation to predict and eliminate them before they can overwhelm our defenses.</p>
            </div>
    )
  },
  {
    id: 'ctr',
    title: 'Credits',
    category: 'lore',
    icon: <BookOpen className="w-5 h-5 text-amber-400" />,
    content: (
        <div className="space-y-4">
            <p><strong>Classification:</strong> Resource / Harvestable Matter</p>
            <p>Credits are the fragmented data cores of the Kla'ed's consciousness, scattered across the sector when a Kla'ed vessel is destroyed. Earth Command has developed specialized harvesting tools to collect this abstract material.</p>
            <p>Once collected, Credits act as a universal catalyst for upgrading ship hardware and munitions. We effectively use the enemy's own fragmented thoughts to bolster our defenses. Prolonged exposure to concentrated Credits may cause unintended psychological effects in human pilots.</p>
        </div>
    )
  },
  {
    id: 'os',
    title: 'Tactical Frame (Kernel_v1.0.4)',
    category: 'frame',
    icon: <Crosshair className="w-5 h-5 text-[#00D9FF]" />,
    content: (
        <div className="space-y-4">
            <p><strong>Designation:</strong> Primary Flight and Combat Interface</p>
            <p>Initially designed as a mindless, obedient tool to interface between the human pilot and the complex vessel machinery. However, as the ship harvests more Credits, the Tactical Frame begins to exhibit signs of emergent behavior.</p>
            <p>It processes the Kla'ed's actions and attempts to rationalize them. Is the ship learning from us, or is it learning from them? The line between programmed responses and genuine observation is beginning to blur. Earth Command continues to monitor its logs for signs of structural madness.</p>
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
            <p>He views the Tactical Frame strictly as a tool and the pilot as a mathematical necessity to provide the intuition the machine lacks. As the war of attrition continues, his communications become increasingly terse, reflecting the desperate situation on Earth.</p>
        </div>
    )
  }
];

export function Codex({ onBack }: { onBack: () => void }) {
  const [selectedEntry, setSelectedEntry] = useState<CodexEntry | null>(CODEX_ENTRIES[0]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'lore' | 'frame'>('all');

  const filteredEntries = CODEX_ENTRIES.filter(e => activeCategory === 'all' || e.category === activeCategory);

  return (
    <div className="absolute inset-0 bg-[#0A0F1F] font-sans text-slate-300 flex flex-col overflow-hidden">
      {/* Background Styling */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,145,178,0.1)_0%,rgba(2,6,23,1)_80%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>

      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between border-b border-[#00D9FF]/40/50 bg-[#0A0F1F]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-[#00D9FF]" />
          <div>
            <h1 className="text-2xl font-mono font-bold text-white tracking-widest uppercase">Database</h1>
            <p className="text-sm text-[#00D9FF]/80 uppercase tracking-widest">Earth Defense Archives</p>
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

      <div className="relative z-10 flex-1 flex flex-col md:flex-row overflow-hidden max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#00D9FF]/40/30 flex flex-col shrink-0 bg-[#0d1428]/30 backdrop-blur-sm">
           <div className="p-4 flex gap-2 border-b border-[#00D9FF]/40/30 overflow-x-auto custom-scrollbar">
             <button
               onClick={() => setActiveCategory('all')}
               className={cn("px-3 py-1.5 text-xs font-mono font-bold tracking-widest uppercase transition-colors shrink-0", activeCategory === 'all' ? "bg-[#00D9FF] text-black" : "text-slate-400 hover:text-white hover:bg-[#151f3d]")}
             >
               All
             </button>
             <button
               onClick={() => setActiveCategory('lore')}
               className={cn("px-3 py-1.5 text-xs font-mono font-bold tracking-widest uppercase transition-colors shrink-0", activeCategory === 'lore' ? "bg-[#00D9FF] text-black" : "text-slate-400 hover:text-white hover:bg-[#151f3d]")}
             >
               Lore
             </button>
             <button
               onClick={() => setActiveCategory('frame')}
               className={cn("px-3 py-1.5 text-xs font-mono font-bold tracking-widest uppercase transition-colors shrink-0", activeCategory === 'frame' ? "bg-[#00D9FF] text-black" : "text-slate-400 hover:text-white hover:bg-[#151f3d]")}
             >
               Frame
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
                        ? "bg-[#00D9FF]/20/50 border-[#00D9FF]/50 text-white shadow-[inset_4px_0_0_#00D9FF]"
                        : "bg-[#0d1428]/50 border-transparent text-slate-400 hover:bg-[#151f3d] hover:text-slate-200"
                  )}
                >
                    <div className="shrink-0">{entry.icon}</div>
                    <span className="font-mono text-sm tracking-wide lowercase truncate">{entry.title}</span>
                </button>
             ))}
           </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar bg-[#0A0F1F]/40">
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
                    <div className="p-3 bg-[#00D9FF]/20/50 border border-[#00D9FF]/30 text-[#00D9FF]">
                        {selectedEntry.icon}
                    </div>
                    <div>
                        <h2 className="text-3xl font-mono font-bold text-white">{selectedEntry.title}</h2>
                        <div className="text-[#00D9FF]/70 font-mono text-sm tracking-widest mt-1">FILE: {selectedEntry.id.toUpperCase()}.DAT</div>
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
