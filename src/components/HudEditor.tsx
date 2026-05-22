import React, { useState, useRef } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X, Save, RotateCcw } from 'lucide-react';
import { DEFAULT_LAYOUT, getSavedLayout, saveLayout, HudLayout, HudElementId } from '../lib/hudLayout';

export function HudEditor({ onExit }: { onExit: () => void }) {
  const [layout, setLayout] = useState<HudLayout>(getSavedLayout());
  const [selectedId, setSelectedId] = useState<HudElementId | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (id: HudElementId, e: React.PointerEvent) => {
    setSelectedId(id);
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startLayoutX = layout[id].x;
    const startLayoutY = layout[id].y;
    
    const onPointerMove = (evt: PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const dx = ((evt.clientX - startX) / rect.width) * 100;
        const dy = ((evt.clientY - startY) / rect.height) * 100;
        
        setLayout(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                x: Math.max(0, Math.min(100, startLayoutX + dx)),
                y: Math.max(0, Math.min(100, startLayoutY + dy))
            }
        }));
    };
    
    const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
    };
    
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const updateSelected = (updates: Partial<HudElementState>) => {
      if (!selectedId) return;
      setLayout(prev => ({
          ...prev,
          [selectedId]: { ...prev[selectedId], ...updates }
      }));
  };

  const nudge = (dx: number, dy: number) => {
      if (!selectedId) return;
      const step = 0.5; // smaller step for precision
      setLayout(prev => ({
          ...prev,
          [selectedId]: {
              ...prev[selectedId],
              x: Math.max(0, Math.min(100, prev[selectedId].x + (dx * step))),
              y: Math.max(0, Math.min(100, prev[selectedId].y + (dy * step)))
          }
      }));
  };

  // Render elements mock
  const renderElement = (id: HudElementId, content: React.ReactNode, name: string) => {
      const state = layout[id];
      const isSelected = selectedId === id;
      return (
          <div 
             key={id}
             onPointerDown={(e) => handlePointerDown(id, e)}
             className={`absolute flex items-center justify-center cursor-move touch-none transition-all duration-75 ${isSelected ? 'z-40 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]' : 'z-30'}`}
             style={{
                 left: `${state.x}%`,
                 top: `${state.y}%`,
                 transform: `translate(-50%, -50%) scale(${state.scale})`,
                 opacity: state.opacity,
             }}
          >
              {/* Selection Bracket Hologram */}
              {isSelected && (
                <div className="absolute inset-[-10px] border border-[#00D9FF]/50 pointer-events-none rounded-sm">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00D9FF]"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00D9FF]"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00D9FF]"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00D9FF]"></div>
                </div>
              )}
              {content}
              {isSelected && (
                <div className="absolute -top-8 text-[10px] text-cyan-200 font-mono font-bold bg-[#00D9FF]/20/80 border border-[#00D9FF]/50 px-2 py-0.5 whitespace-nowrap backdrop-blur-md tracking-widest">
                    {name}
                </div>
              )}
          </div>
      );
  };

  return (
      <div className="absolute inset-0 bg-[#0A0F1F]/90 z-50 overflow-hidden select-none font-sans backdrop-blur-sm" ref={containerRef} onPointerDown={() => setSelectedId(null)}>
          {/* Tactical Cockpit Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)]"></div>
          
          <div className="absolute top-6 left-6 text-[#00D9FF]/70 text-xs font-mono pointer-events-none z-10 border-l-2 border-[#00D9FF]/70 pl-2 tracking-[0.2em] uppercase">
            Earth Defense Init<br/>
            <span className="text-white">HUD Telemetry Calibration</span>
          </div>

          {/* Canvas mockup bounds */}
          <div className="absolute inset-x-12 inset-y-12 border border-[#00D9FF]/20 pointer-events-none z-0">
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#00D9FF]/10"></div>
             <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#00D9FF]/10"></div>
          </div>

          {/* High-Tech Joysticks */}
          {renderElement('moveJoystick', 
            <div className="w-[120px] h-[120px] rounded-full border border-[#00D9FF]/40 bg-[#00D9FF]/20/20 flex items-center justify-center backdrop-blur-sm relative">
                <div className="absolute inset-1 border border-dashed border-[#00D9FF]/30 rounded-full animate-[spin_30s_linear_infinite]"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-[1px] bg-[#00D9FF]/20"></div>
                    <div className="absolute h-full w-[1px] bg-[#00D9FF]/20"></div>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-[#00D9FF] shadow-[0_0_15px_rgba(34,211,238,0.5)] bg-[#00D9FF]/20"></div>
            </div>, 
          'NAV_THRUST')}
          
          {renderElement('aimJoystick', 
            <div className="w-[120px] h-[120px] rounded-full border border-[#EF4444]/40 bg-[#EF4444]/20/20 flex items-center justify-center backdrop-blur-sm relative">
                <div className="absolute inset-1 border border-dashed border-rose-400/30 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-[1px] bg-[#EF4444]/20"></div>
                    <div className="absolute h-full w-[1px] bg-[#EF4444]/20"></div>
                </div>
                <div className="w-10 h-10 border border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)] bg-[#EF4444]/20 rotate-45"></div>
            </div>, 
          'TGT_SYSTEMS')}
          
          {/* Action Buttons (Hexagonal/Angled look via clip-path) */}
          {renderElement('wpnBtn', 
            <div className="w-16 h-16 bg-[#EF4444]/20/60 border-2 border-[#EF4444] flex items-center justify-center text-[#EF4444] font-mono font-bold text-sm shadow-[0_0_15px_rgba(244,63,94,0.4)] backdrop-blur-md" 
                 style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}>
                WPN
            </div>, 
          'PRIMARY_FIRE')}
          
          {renderElement('shdBtn', 
            <div className="w-16 h-16 bg-blue-950/60 border-2 border-blue-400 flex items-center justify-center text-blue-300 font-mono font-bold text-sm shadow-[0_0_15px_rgba(96,165,250,0.4)] backdrop-blur-md"
                 style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}>
                SHD
            </div>, 
          'DEF_SHIELD')}
          
          {renderElement('dshBtn', 
            <div className="w-14 h-14 bg-[#151f3d]/60 border border-slate-300 flex items-center justify-center text-slate-200 font-mono font-bold text-xs shadow-[0_0_10px_rgba(255,255,255,0.2)] backdrop-blur-md"
                 style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}>
                BOOST
            </div>, 
          'EVASIVE')}

          {/* Telemetry HP Bar */}
          {renderElement('hpBar', (
              <div className="flex flex-col gap-1 w-56 bg-[#0d1428]/80 p-3 border border-[#00D9FF]/40/50 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden"
                   style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}>
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-4 h-4 bg-[#00D9FF]/20" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
                  
                  <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] text-[#00D9FF] font-mono font-bold tracking-[0.2em]">HULL INTEGRITY</span>
                      <span className="text-xs text-white font-mono">100%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#151f3d]"><div className="w-full h-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]"></div></div>
                  
                  <div className="flex justify-between items-end mt-2 mb-1">
                      <span className="text-[10px] text-[#EF4444] font-mono font-bold tracking-[0.2em]">CORE ENERGY</span>
                      <span className="text-xs text-white font-mono">100%</span>
                  </div>
                  <div className="w-full h-1 bg-[#151f3d]"><div className="w-full h-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]"></div></div>
              </div>
          ), 'HULL_TELEMETRY')}

          {/* Editor Dialog Panel */}
          {selectedId && (
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] bg-[#0A0F1F]/95 border border-[#00D9FF]/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col pointer-events-auto z-50 backdrop-blur-xl"
                style={{ clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)' }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                  {/* Panel Header */}
                  <div className="bg-[#00D9FF]/20/40 px-5 py-3 flex justify-between items-center border-b border-[#00D9FF]/30">
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#00D9FF] animate-pulse"></div>
                          <span className="font-mono font-bold text-sm text-cyan-100 tracking-widest uppercase">Node Config</span>
                      </div>
                      <span className="text-[10px] text-[#00D9FF] bg-[#00D9FF]/20 px-2 py-1 font-mono border border-cyan-800/50">{selectedId}</span>
                  </div>
                  
                  <div className="p-6 flex gap-6">
                      {/* Sliders */}
                      <div className="flex-1 flex flex-col gap-6">
                          <div>
                              <div className="flex justify-between text-[10px] font-mono font-bold text-[#00D9FF] mb-2 uppercase tracking-wider">
                                  <span>Scale Mod</span>
                                  <span className="text-white">{(layout[selectedId].scale * 100).toFixed(0)}%</span>
                              </div>
                              <input type="range" min="0.5" max="2" step="0.05" value={layout[selectedId].scale} onChange={e => updateSelected({ scale: parseFloat(e.target.value) })} className="w-full accent-cyan-400 h-1 bg-[#151f3d] appearance-none cursor-pointer" />
                          </div>
                          <div>
                              <div className="flex justify-between text-[10px] font-mono font-bold text-[#00D9FF] mb-2 uppercase tracking-wider">
                                  <span>Opacity Lvl</span>
                                  <span className="text-white">{(layout[selectedId].opacity * 100).toFixed(0)}%</span>
                              </div>
                              <input type="range" min="0.1" max="1" step="0.05" value={layout[selectedId].opacity} onChange={e => updateSelected({ opacity: parseFloat(e.target.value) })} className="w-full accent-cyan-400 h-1 bg-[#151f3d] appearance-none cursor-pointer" />
                          </div>
                      </div>

                      {/* Directional Pad */}
                      <div className="w-24 grid grid-cols-3 grid-rows-3 gap-1 content-center">
                          <button onClick={() => nudge(0, -1)} className="col-start-2 bg-[#151f3d] hover:bg-[#00D9FF]/30/50 border border-[#1e2b52] hover:border-[#00D9FF] flex items-center justify-center active:scale-95 transition-all text-[#00D9FF] hover:text-[#5ce5ff]"><ArrowUp size={14}/></button>
                          <button onClick={() => nudge(-1, 0)} className="row-start-2 col-start-1 bg-[#151f3d] hover:bg-[#00D9FF]/30/50 border border-[#1e2b52] hover:border-[#00D9FF] flex items-center justify-center active:scale-95 transition-all text-[#00D9FF] hover:text-[#5ce5ff]"><ArrowLeft size={14}/></button>
                          <div className="row-start-2 col-start-2 flex items-center justify-center"><div className="w-1 h-1 bg-cyan-700 rounded-full"></div></div>
                          <button onClick={() => nudge(0, 1)} className="row-start-3 col-start-2 bg-[#151f3d] hover:bg-[#00D9FF]/30/50 border border-[#1e2b52] hover:border-[#00D9FF] flex items-center justify-center active:scale-95 transition-all text-[#00D9FF] hover:text-[#5ce5ff]"><ArrowDown size={14}/></button>
                          <button onClick={() => nudge(1, 0)} className="row-start-2 col-start-3 bg-[#151f3d] hover:bg-[#00D9FF]/30/50 border border-[#1e2b52] hover:border-[#00D9FF] flex items-center justify-center active:scale-95 transition-all text-[#00D9FF] hover:text-[#5ce5ff]"><ArrowRight size={14}/></button>
                      </div>
                  </div>

                  {/* Actions */}
                  <div className="flex border-t border-[#00D9FF]/40/50 font-mono font-bold text-xs text-center bg-[#0d1428]/50">
                      <button onClick={() => {
                          setLayout(prev => ({ ...prev, [selectedId]: DEFAULT_LAYOUT[selectedId] }));
                      }} className="flex-1 py-3 text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors flex items-center justify-center gap-2 group">
                          <RotateCcw size={14} className="group-hover:-rotate-90 transition-transform"/> Reset
                      </button>
                      
                      <button onClick={() => {
                          onExit();
                      }} className="flex-1 py-3 text-slate-400 hover:bg-[#151f3d] hover:text-white border-l border-[#00D9FF]/40/50 transition-colors flex items-center justify-center gap-2">
                          <X size={16}/> Cancel
                      </button>
                      
                      <button onClick={() => {
                          saveLayout(layout);
                          onExit();
                      }} className="flex-[1.5] py-3 text-slate-950 bg-[#00D9FF] hover:bg-[#00D9FF] transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                          <Save size={16}/> Apply
                      </button>
                  </div>
              </div>
          )}
      </div>
  );
}

interface HudElementState {
    x: number;
    y: number;
    scale: number;
    opacity: number;
}
