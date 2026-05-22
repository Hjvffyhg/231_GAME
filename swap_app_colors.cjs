const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/bg-slate-950/g, 'bg-[#0A0F1F]');
code = code.replace(/bg-slate-900/g, 'bg-[#0A0F1F]');
code = code.replace(/text-cyan-400/g, 'text-[#00D9FF]');

fs.writeFileSync('src/App.tsx', code);
console.log('App HTML colors swapped');
