'use client';

import React, { useState } from 'react';
import { GitBranch, Network, Activity, Sparkles } from 'lucide-react';
import ASTViewer from './LogicVisualizer/ASTViewer';
import CFGViewer from './LogicVisualizer/CFGViewer';
import DataFlowViewer from './LogicVisualizer/DataFlowViewer';
import JuliaViewer from './LogicVisualizer/JuliaViewer';

type ViewMode = 'ast' | 'cfg' | 'dataflow' | 'julia';

interface LogicVisualizerProps {
  code: string;
  language: string;
}

export default function LogicVisualizer({ code, language }: LogicVisualizerProps) {
  const [activeView, setActiveView] = useState<ViewMode>('ast');

  const tabs: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'ast', label: 'AST', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'cfg', label: 'Control Flow', icon: <Network className="w-4 h-4" /> },
    { id: 'dataflow', label: 'Data Flow', icon: <Activity className="w-4 h-4" /> },
    { id: 'julia', label: 'Julia', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] border-l border-[#00ff41]/20">
      <div className="flex border-b border-[#00ff41]/20">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 font-mono text-[10px] transition-colors ${
              activeView === tab.id
                ? 'bg-[#00ff41]/10 text-[#00ff41] border-b-2 border-[#00ff41]'
                : 'text-[#00ff41]/50 hover:text-[#00ff41]/80 hover:bg-[#00ff41]/5'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-4">
        {activeView === 'ast' && <ASTViewer code={code} language={language} />}
        {activeView === 'cfg' && <CFGViewer code={code} language={language} />}
        {activeView === 'dataflow' && <DataFlowViewer code={code} language={language} />}
        {activeView === 'julia' && <JuliaViewer code={code} />}
      </div>
    </div>
  );
}
