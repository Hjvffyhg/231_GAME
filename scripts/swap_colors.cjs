const fs = require('fs');
let code = fs.readFileSync('src/components/Shop.tsx', 'utf8');
code = code
  .replace(/#ff9100/g, '#EF4444')
  .replace(/#00d0ff/g, '#00D9FF')
  .replace(/#9d8de2/g, '#6366F1')
  .replace(/#ff1f5a/g, '#EF4444')
  .replace(/#8e62ff/g, '#6366F1')
  .replace(/#110e1c/g, '#0d1428')
  .replace(/#231f36/g, '#1e2645')
  .replace(/#828096/g, '#94a3b8')
  .replace(/#1c182e/g, '#18213b')
  .replace(/#1a172a/g, '#060a14')
  .replace(/162, 57, 255/g, '99, 102, 241'); // RGB for Indigo 500
fs.writeFileSync('src/components/Shop.tsx', code);
console.log('Colors swapped successfully');
