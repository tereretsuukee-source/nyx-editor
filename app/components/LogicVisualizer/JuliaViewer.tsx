'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface JuliaViewerProps {
  code: string;
}

export default function JuliaViewer({ code }: JuliaViewerProps) {
  const isJulia = /(^|\n)\s*(function|macro|struct|module|using|import)\s/.test(code) ||
    /::\w+/.test(code) ||
    /\b(end)\b/.test(code);

  const functions = Array.from(code.matchAll(/function\s+([a-zA-Z_]\w*)/g)).map(m => m[1]);
  const macros = Array.from(code.matchAll(/macro\s+([a-zA-Z_]\w*)/g)).map(m => m[1]);
  const structs = Array.from(code.matchAll(/struct\s+([a-zA-Z_]\w*)/g)).map(m => m[1]);
  const abstracts = Array.from(code.matchAll(/abstract\s+type\s+([a-zA-Z_]\w*)/g)).map(m => m[1]);

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4 text-[#00ff41]/60 text-xs font-mono">
        <Sparkles className="w-4 h-4" />
        <span>Julia-Specific Analysis</span>
      </div>

      {isJulia ? (
        <div className="space-y-3">
          <JuliaFeature items={functions} label="Functions" icon="ƒ" />
          <JuliaFeature items={macros} label="Macros" icon="@" />
          <JuliaFeature items={structs} label="Structs" icon="◇" />
          <JuliaFeature items={abstracts} label="Abstract Types" icon="◈" />

          <div className="mt-4 p-3 border border-[#00ff41]/20 rounded bg-[#00ff41]/5">
            <h4 className="text-[#00ff88] font-mono text-xs mb-1">Multiple Dispatch</h4>
            <p className="text-[#00ff41]/60 text-[10px] font-mono leading-relaxed">
              Julia uses multiple dispatch. Function behavior depends on all argument types, 
              not just the first. Check method definitions for type stability.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-[#00ff41]/30 font-mono text-xs p-4 text-center">
          No Julia code detected. Switch language mode to Julia or write Julia code.
        </div>
      )}
    </div>
  );
}

function JuliaFeature({ items, label, icon }: { items: string[]; label: string; icon: string }) {
  if (items.length === 0) return null;
  return (
    <div className="border border-[#00ff41]/10 rounded p-2">
      <div className="flex items-center gap-2 text-[#00ff88] font-mono text-xs mb-1">
        <span>{icon}</span>
        <span>{label}</span>
        <span className="text-[#00ff41]/40 text-[10px]">({items.length})</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((item, i) => (
          <span key={i} className="text-[#00ff41]/60 font-mono text-[10px] bg-[#00ff41]/5 px-1.5 py-0.5 rounded">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
