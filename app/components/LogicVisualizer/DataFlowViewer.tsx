'use client';

import React from 'react';
import { Activity } from 'lucide-react';

interface DataFlowViewerProps {
  code: string;
  language: string;
}

export default function DataFlowViewer({ code, language }: DataFlowViewerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-[#00ff41]/40 font-mono gap-4 text-center p-4">
      <Activity className="w-12 h-12 opacity-20" />
      <p className="text-sm">Data Flow Analysis</p>
      <p className="text-[10px] opacity-60">Variable tracing and dependency graph</p>
      <div className="text-[10px] opacity-40 mt-2 p-3 border border-[#00ff41]/10 rounded w-full">
        <p className="mb-1 text-[#00ff88]">Language: {language}</p>
        <p>Variables: {(code.match(/\b(let|const|var|def|val)\s+(\w+)/g) || []).length} declarations</p>
      </div>
    </div>
  );
}
