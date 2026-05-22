const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const colorMap = [
  // Deep Space / Midnight Blue (#0A0F1F)
  { regex: /bg-slate-950/g, replacement: 'bg-[#0A0F1F]' },
  { regex: /bg-slate-900/g, replacement: 'bg-[#0d1428]' }, // Slightly lighter than 0a0f1f
  { regex: /bg-slate-800/g, replacement: 'bg-[#151f3d]' },
  { regex: /border-slate-800/g, replacement: 'border-[#151f3d]' },
  { regex: /border-slate-700/g, replacement: 'border-[#1e2b52]' },
  
  // Neon Cyan (#00D9FF)
  { regex: /text-cyan-500/g, replacement: 'text-[#00D9FF]' },
  { regex: /text-cyan-400/g, replacement: 'text-[#00D9FF]' },
  { regex: /text-cyan-300/g, replacement: 'text-[#5ce5ff]' },
  { regex: /bg-cyan-500/g, replacement: 'bg-[#00D9FF]' },
  { regex: /bg-cyan-600/g, replacement: 'bg-[#00b0cf]' },
  { regex: /bg-cyan-400/g, replacement: 'bg-[#00D9FF]' },
  { regex: /bg-cyan-950/g, replacement: 'bg-[#00D9FF]/20' },
  { regex: /bg-cyan-900/g, replacement: 'bg-[#00D9FF]/30' },
  { regex: /border-cyan-500/g, replacement: 'border-[#00D9FF]' },
  { regex: /border-cyan-400/g, replacement: 'border-[#00D9FF]' },
  { regex: /border-cyan-900/g, replacement: 'border-[#00D9FF]/40' },
  { regex: /shadow-cyan-500/g, replacement: 'shadow-[#00D9FF]' },
  { regex: /#22d3ee/g, replacement: '#00D9FF' }, // Cyan 400
  { regex: /#06b6d4/g, replacement: '#00D9FF' }, // Cyan 500

  // Laser Red / Orange (#EF4444)
  { regex: /text-rose-500/g, replacement: 'text-[#EF4444]' },
  { regex: /text-rose-400/g, replacement: 'text-[#EF4444]' },
  { regex: /text-red-500/g, replacement: 'text-[#EF4444]' },
  { regex: /bg-rose-500/g, replacement: 'bg-[#EF4444]' },
  { regex: /bg-rose-950/g, replacement: 'bg-[#EF4444]/20' },
  { regex: /bg-red-950/g, replacement: 'bg-[#EF4444]/20' },
  { regex: /border-rose-500/g, replacement: 'border-[#EF4444]' },
  { regex: /shadow-rose-500/g, replacement: 'shadow-[#EF4444]' },
  { regex: /#f43f5e/g, replacement: '#EF4444' }, // Rose 500
  
  // Electric Indigo (#6366F1)
  { regex: /text-violet-500/g, replacement: 'text-[#6366F1]' },
  { regex: /text-violet-400/g, replacement: 'text-[#6366F1]' },
  { regex: /text-indigo-500/g, replacement: 'text-[#6366F1]' },
  { regex: /text-indigo-400/g, replacement: 'text-[#6366F1]' },
  { regex: /bg-violet-500/g, replacement: 'bg-[#6366F1]' },
  { regex: /bg-indigo-500/g, replacement: 'bg-[#6366F1]' },
  { regex: /bg-indigo-950/g, replacement: 'bg-[#6366F1]/20' },
  { regex: /border-indigo-500/g, replacement: 'border-[#6366F1]' },
  { regex: /border-violet-500/g, replacement: 'border-[#6366F1]' },
  { regex: /shadow-indigo-500/g, replacement: 'shadow-[#6366F1]' },
  { regex: /#8b5cf6/g, replacement: '#6366F1' }, // Violet 500
];

for (const file of files) {
  const p = path.join(dir, file);
  let code = fs.readFileSync(p, 'utf8');
  for (const mapping of colorMap) {
    code = code.replace(mapping.regex, mapping.replacement);
  }
  fs.writeFileSync(p, code);
  console.log('Swapped colors in', file);
}

