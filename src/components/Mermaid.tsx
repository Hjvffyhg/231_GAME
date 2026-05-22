import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  fontFamily: 'Inter, sans-serif'
});

export const Mermaid = ({ chart }: { chart: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setHasError(false);
      mermaid.render(`mermaid-chart-${Math.random().toString(36).substring(2, 9)}`, chart).then(({ svg }) => {
        if (containerRef.current) {
            containerRef.current.innerHTML = svg;
        }
      }).catch(e => {
        console.error("Mermaid parsing error", e);
        if (e && e.message && e.message.includes("dynamically imported module")) {
          setHasError(true);
        } else if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-[#EF4444] font-mono text-xs">Failed to render Mermaid chart.</div>`;
        }
      });
    }
  }, [chart]);

  if (hasError) {
    return (
      <div className="flex justify-center items-center py-4 w-full">
        <div className="text-amber-400 border border-amber-500/30 bg-amber-950/20 p-4 rounded text-center text-sm font-mono max-w-md shadow-[0_0_15px_rgba(251,191,36,0.1)]">
          <span className="block font-bold mb-2 uppercase">Module Load Interrupted</span>
          The dynamic visualizer chunk failed to load. A visualizer dependency might have been updated. 
          <br /><br />
          Please <strong>reload the page</strong> to fetch the latest assets.
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="flex justify-center items-center py-4 w-full overflow-x-auto" />;
};
