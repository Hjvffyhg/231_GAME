const fs = require('fs');
let code = fs.readFileSync('src/components/BootSequence.tsx', 'utf8');
code = code.replace(/bg-slate-950/g, 'bg-[#0A0F1F]');
code = code.replace(/text-cyan-500/g, 'text-[#00D9FF]');
code = code.replace(/text-cyan-400/g, 'text-[#00D9FF]');
code = code.replace(/text-cyan-300/g, 'text-[#00D9FF]');
fs.writeFileSync('src/components/BootSequence.tsx', code);
