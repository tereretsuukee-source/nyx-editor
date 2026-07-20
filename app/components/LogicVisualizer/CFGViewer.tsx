'use client';

import React from 'react';
import { Network } from 'lucide-react';

interface CFGViewerProps {
  code: string;
  language: string;
}

export default function CFGViewer({ code, language }: CFGViewerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-[#00ff41]/40 font-mono gap-4 text-center p-4">
      <Network className="w-12 h-12 opacity-20" />
      <p className="text-sm">Control Flow Graph</p>
      <p className="text-[10px] opacity-60">Integrate Cytoscape.js + Tree-sitter for production</p>
      <div className="text-[10px] opacity-40 mt-2 p-3 border border-[#00ff41]/10 rounded w-full">
        <p className="mb-1 text-[#00ff88]">Detected language: {language}</p>
        <p>Code length: {code.length} chars</p>
      </div>
    </div>
  );
}
