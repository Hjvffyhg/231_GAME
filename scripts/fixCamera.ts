import fs from 'fs';

let code = fs.readFileSync('src/components/GameCanvas.tsx', 'utf8');

// 1. Add camera mode states
code = code.replace(
  /const \[droneRange, setDroneRange\] = useState\(1000\);/g,
  `const [droneRange, setDroneRange] = useState(1000);
  const [cameraMode, setCameraMode] = useState<'offset' | 'center' | 'dynamic'>(() => (localStorage.getItem('ss-camera-mode') as any) || 'offset');
  const cameraModeRef = useRef(cameraMode);
  
  useEffect(() => {
    cameraModeRef.current = cameraMode;
    localStorage.setItem('ss-camera-mode', cameraMode);
  }, [cameraMode]);`
);


// 2. Add System Settings Menu options for Camera Mode
code = code.replace(
  /\{\/\* Display & Layout Settings \*\/\}/g,
  `{/* Camera Settings */}
              <div>
                <h3 className="text-sm font-bold text-cyan-300 font-mono tracking-wider mb-4">CAMERA OPTICS</h3>
                <div className="flex bg-slate-900 border border-slate-700 p-1 mb-6 rounded-md shadow-inner gap-1">
                   {([
                      { id: 'offset', label: 'OFFSET' },
                      { id: 'center', label: 'CENTER' },
                      { id: 'dynamic', label: 'DYNAMIC' }
                   ] as const).map(mode => (
                      <button
                         key={mode.id}
                         onClick={() => setCameraMode(mode.id)}
                         className={\`flex-1 py-2 text-xs font-mono font-bold tracking-widest \${cameraMode === mode.id ? 'bg-cyan-600 text-white shadow-md rounded' : 'text-slate-400 hover:text-cyan-200 hover:bg-slate-800 rounded'}\`}
                      >
                         {mode.label}
                      </button>
                   ))}
                </div>
              </div>

              {/* Display & Layout Settings */}`
);


// 3. Update Camera calculation in game loop
const oldCameraCalc = `      // 1. Determine Camera Offset based on aiming direction
      let panOffsetX = 0;
      let panOffsetY = 0;
      
      if (state.mobileAim.active) {
        panOffsetX = state.mobileAim.x * 150;
        panOffsetY = state.mobileAim.y * 150;
      } else if (!isTouchDevice && state.mouse.screenX !== undefined) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        panOffsetX = (state.mouse.screenX - cx) * 0.25;
        panOffsetY = (state.mouse.screenY - cy) * 0.25;
      }

      // Calculate Camera
      const cameraX = Math.max(
        0,
        Math.min(MAP_WIDTH - canvas.width, state.player.x + panOffsetX - canvas.width / 2),
      );
      const cameraY = Math.max(
        0,
        Math.min(
          MAP_HEIGHT - canvas.height,
          state.player.y + panOffsetY - canvas.height / 2,
        ),
      );

      if (state.mobileAim.active) {
        state.mouse.x = state.player.x + state.mobileAim.x * 200;
        state.mouse.y = state.player.y + state.mobileAim.y * 200;
        state.mouse.down = true;
      } else {
        state.mouse.x = state.mouse.screenX + cameraX;
        state.mouse.y = state.mouse.screenY + cameraY;
      }`;

const newCameraCalc = `      // 1. Determine Camera Offset and Zoom based on mode
      let panOffsetX = 0;
      let panOffsetY = 0;
      const cMode = cameraModeRef.current;
      
      if (cMode === 'center') {
        panOffsetX = 0;
        panOffsetY = 0;
      } else if (cMode === 'dynamic') {
        if (state.mobileAim.active) {
            panOffsetX = state.mobileAim.x * 50;
            panOffsetY = state.mobileAim.y * 50;
        } else if (!isTouchDevice && state.mouse.screenX !== undefined) {
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            panOffsetX = (state.mouse.screenX - cx) * 0.10;
            panOffsetY = (state.mouse.screenY - cy) * 0.10;
        }
      } else {
        // Offset
        if (state.mobileAim.active) {
          panOffsetX = state.mobileAim.x * 150;
          panOffsetY = state.mobileAim.y * 150;
        } else if (!isTouchDevice && state.mouse.screenX !== undefined) {
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          panOffsetX = (state.mouse.screenX - cx) * 0.25;
          panOffsetY = (state.mouse.screenY - cy) * 0.25;
        }
      }

      let targetZoom = 1.0;
      if (cMode === 'dynamic') {
        const pSpeed = Math.hypot(state.player.vx, state.player.vy);
        if (pSpeed > 250) {
            targetZoom = 0.85;
        }
      }

      const PZOOM = state.currentZoom;
      if (PZOOM === undefined) state.currentZoom = 1.0;
      state.currentZoom += (targetZoom - (PZOOM || 1.0)) * 4.0 * dt;

      const effectiveWidth = canvas.width / state.currentZoom;
      const effectiveHeight = canvas.height / state.currentZoom;

      const cameraX = Math.max(
        0,
        Math.min(MAP_WIDTH - effectiveWidth, state.player.x + panOffsetX - effectiveWidth / 2),
      );
      const cameraY = Math.max(
        0,
        Math.min(
          MAP_HEIGHT - effectiveHeight,
          state.player.y + panOffsetY - effectiveHeight / 2,
        ),
      );

      if (state.mobileAim.active) {
        state.mouse.x = state.player.x + state.mobileAim.x * 200;
        state.mouse.y = state.player.y + state.mobileAim.y * 200;
        state.mouse.down = true;
      } else {
        state.mouse.x = state.mouse.screenX / state.currentZoom + cameraX;
        state.mouse.y = state.mouse.screenY / state.currentZoom + cameraY;
      }`;
code = code.replace(oldCameraCalc, newCameraCalc);


// 4. Update the render logic
const renderBase = `    const render = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      state: any,
      cameraX: number,
      cameraY: number,
      dt: number
    ) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);`;

const renderReplaced = `    const render = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      state: any,
      cameraX: number,
      cameraY: number,
      dt: number
    ) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const zoom = state.currentZoom || 1.0;
      const effW = canvas.width / zoom;
      const effH = canvas.height / zoom;`;
code = code.replace(renderBase, renderReplaced);

code = code.replace(
  /      ctx\.save\(\);\n      ctx\.translate\(-cameraX \+ shakeX, -cameraY \+ shakeY\);/g,
  `      ctx.save();\n      ctx.scale(zoom, zoom);\n      ctx.translate(-cameraX + shakeX, -cameraY + shakeY);`
);

code = code.replace(
  `ctx.fillRect(cameraX, cameraY, canvas.width, canvas.height);`,
  `ctx.fillRect(cameraX, cameraY, effW, effH);`
);

code = code.replace(
  /a\.x > cameraX \+ canvas\.width \+ a\.radius/g,
  `a.x > cameraX + effW + a.radius`
);

code = code.replace(
  /a\.y > cameraY \+ canvas\.height \+ a\.radius/g,
  `a.y > cameraY + effH + a.radius`
);

code = code.replace(
  /ano\.x > cameraX \+ canvas\.width \+ ano\.r \* 3/g,
  `ano.x > cameraX + effW + ano.r * 3`
);

code = code.replace(
  /ano\.y > cameraY \+ canvas\.height \+ ano\.r \* 3/g,
  `ano.y > cameraY + effH + ano.r * 3`
);

fs.writeFileSync('src/components/GameCanvas.tsx', code);
console.log('Patch complete');
