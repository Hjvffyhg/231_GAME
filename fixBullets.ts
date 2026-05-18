import fs from 'fs';

let code = fs.readFileSync('src/components/GameCanvas.tsx', 'utf8');

// 1. Update push logic
code = code.replace(/state\.enemyBullets\.push\(\{/g, `const __bId = Math.random();
              state.readyQueue.push(__bId);
              state.enemyBullets.push({
                id: __bId,
                W: 0,
                S: 0.1,
                hp: 1,
                maxHp: 1,
                priority: 2,`);

// 2. Drone Targeting lookup 1
code = code.replace(
  /\.map\(\(id\) => state\.enemies\.find\(\(x: any\) => x\.id === id\)\)/g,
  `.map((id) => state.enemies.find((x: any) => x.id === id) || state.enemyBullets.find((b: any) => b.id === id && b.life > 0))`
);

// 3. Drone Target Execution Lookup
code = code.replace(
  /const target = state\.enemies\.find\(\n?\s*\(e: any\) => e\.id === drone\.targetId,\n?\s*\);/g,
  `const target = state.enemies.find((e: any) => e.id === drone.targetId) || state.enemyBullets.find((b: any) => b.id === drone.targetId && b.life > 0);`
);

// 4. Drone Target Cleanup Lookup (death)
code = code.replace(
  /const nextEnemy = state\.enemies\.find\(\n?\s*\(e: any\) => e\.id === nextEnemyId,\n?\s*\);/g,
  `const nextEnemy = state.enemies.find((e: any) => e.id === nextEnemyId) || state.enemyBullets.find((b: any) => b.id === nextEnemyId);`
);

// 5. Drawing Drone Laser Lookup
code = code.replace(
  /const target = state\.enemies\.find\(\(e: any\) => e\.id === drone\.targetId\);/g,
  `const target = state.enemies.find((e: any) => e.id === drone.targetId) || state.enemyBullets.find((b: any) => b.id === drone.targetId && b.life > 0);`
);

fs.writeFileSync('src/components/GameCanvas.tsx', code);
console.log('Replaced custom strings!');
