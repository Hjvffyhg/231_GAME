const fs = require('fs');
let code = fs.readFileSync('src/components/GameCanvas.tsx', 'utf8');

code = code.replace(/text-cyan-400/g, 'text-[#00D9FF]');
code = code.replace(/text-cyan-500/g, 'text-[#00D9FF]');
code = code.replace(/bg-cyan-900\/30/g, 'bg-[#00D9FF]/30');
code = code.replace(/bg-cyan-500\/50/g, 'bg-[#00D9FF]/50');
code = code.replace(/bg-cyan-900\/50/g, 'bg-[#00D9FF]/50');
code = code.replace(/border-cyan-500\/50/g, 'border-[#00D9FF]/50');
code = code.replace(/border-cyan-400\/60/g, 'border-[#00D9FF]/60');
code = code.replace(/border-cyan-500\/30/g, 'border-[#00D9FF]/30');
code = code.replace(/bg-cyan-500\/0/g, 'bg-[#00D9FF]/0');
code = code.replace(/bg-cyan-500\/10/g, 'bg-[#00D9FF]/10');
code = code.replace(/border-cyan-900\/50/g, 'border-[#00D9FF]/20');
code = code.replace(/border-cyan-400\/50/g, 'border-[#00D9FF]/50');
code = code.replace(/bg-slate-950\/80/g, 'bg-[#0A0F1F]/80');
code = code.replace(/rgba\(6,182,212,0.15\)/g, 'rgba(0,217,255,0.15)');
code = code.replace(/#22d3ee/g, '#00D9FF');

fs.writeFileSync('src/components/GameCanvas.tsx', code);
console.log('GameCanvas HTML colors swapped');
