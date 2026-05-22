const fs = require('fs');
let code = fs.readFileSync('src/components/MainMenu.tsx', 'utf8');

code = code.replace(/text-cyan-500/g, 'text-[#00D9FF]');
code = code.replace(/text-cyan-400/g, 'text-[#00D9FF]');
code = code.replace(/bg-cyan-400/g, 'bg-[#00D9FF]');
code = code.replace(/shadow-\[0_0_15px_#22d3ee\]/g, 'shadow-[0_0_15px_#00D9FF]');
code = code.replace(/from-cyan-400 to-blue-600/g, 'from-[#00D9FF] to-[#6366F1]');
code = code.replace(/bg-slate-950/g, 'bg-[#0A0F1F]');
code = code.replace(/bg-cyan-950\/30/g, 'bg-[#00D9FF]/10');
code = code.replace(/border-cyan-500\/30/g, 'border-[#00D9FF]/30');
code = code.replace(/group-hover:bg-cyan-900\/50/g, 'group-hover:bg-[#00D9FF]/20');
code = code.replace(/group-hover:border-cyan-400/g, 'group-hover:border-[#00D9FF]');
code = code.replace(/rgba\(6,182,212,0.5\)/g, 'rgba(0,217,255,0.5)'); // RGB of 00D9FF
// the locked text color Red 400
code = code.replace(/text-red-400/g, 'text-[#EF4444]');
code = code.replace(/bg-red-950\/80/g, 'bg-[#EF4444]/20');
code = code.replace(/border-red-500\/50/g, 'border-[#EF4444]/50');

fs.writeFileSync('src/components/MainMenu.tsx', code);
console.log('MainMenu colors swapped successfully');
