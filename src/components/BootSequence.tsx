import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../lib/audio';

const BOOT_SEQUENCE = [
  { text: "INITIALIZING FRAME...", delay: 200 },
  { text: "MOUNTING TACTICAL SYS... OK", delay: 800 },
  { text: "LOADING COMMAND_CORE... Earth_Defense_Core_v1.0.4", delay: 1200 },
  { text: "CHECKING MODULES... [HULL, SHLD, ENG]", delay: 1800 },
  { text: "ESTABLISHING UPLINK TO COMMAND...", delay: 2500 },
  { text: "CONNECTION SECURED.", delay: 3200 },
  { text: "WELCOME, PILOT.", delay: 3500 },
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    // We could play a startup sound here if available
    let timeouts: NodeJS.Timeout[] = [];
    
    BOOT_SEQUENCE.forEach(({ text, delay }) => {
      const t = setTimeout(() => {
        setLines(prev => [...prev, text]);
      }, delay);
      timeouts.push(t);
    });

    const completion = setTimeout(() => {
      onComplete();
    }, BOOT_SEQUENCE[BOOT_SEQUENCE.length - 1].delay + 1000);
    timeouts.push(completion);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div className="absolute inset-0 bg-black flex flex-col justify-start items-start p-8 font-mono text-cyan-500 overflow-hidden z-50">
      <AnimatePresence>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-1 text-sm md:text-base leading-tight"
          >
            {line}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Blinking cursor */}
      <motion.div
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="w-3 h-5 bg-cyan-500 mt-2"
      />
    </div>
  );
}
