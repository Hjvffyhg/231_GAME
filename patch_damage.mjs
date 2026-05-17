import fs from 'fs';

let content = fs.readFileSync('src/components/GameCanvas.tsx', 'utf-8');

// Replace standard damage hits
content = content.replace(/state\.player\.hp -= dmg;(.*)/g, 'state.player.hp -= dmg; state.lastDamageSource = e ? (e.type || "Enemy") : "Unknown";$1');

// Replace bullet damage limits
content = content.replace(/state\.player\.hp -= b\.damage;(.*)/g, 'state.player.hp -= b.damage; state.lastDamageSource = `Bullet (${b.isAlien ? "Alien" : "Enemy"})`;$1');

content = content.replace(/state\.player\.hp -= 20;(.*)/g, 'state.player.hp -= 20; state.lastDamageSource = "EMP_Storm";$1');

fs.writeFileSync('src/components/GameCanvas.tsx', content);
