'use client';

import React from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface StatusBarProps {
  language: string;
  line: number;
  column: number;
  encoding?: string;
  isDirty?: boolean;
}

export default function StatusBar({ language, line, column, encoding = 'UTF-8', isDirty }: StatusBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-6 bg-[#00ff41]/5 border-t border-[#00ff41]/20 flex items-center px-2 font-mono text-[10px] text-[#00ff41]/60 select-none">
      <div className="flex items-center gap-4 flex-1">
        <span className="flex items-center gap-1">
          {isDirty ? <AlertCircle className="w-3 h-3 text-yellow-400" /> : <Check className="w-3 h-3 text-[#00ff41]" />}
          {isDirty ? 'Unsaved' : 'Saved'}
        </span>
        <span className="uppercase">{language}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Ln {line}, Col {column}</span>
        <span>{encoding}</span>
        <button onClick={toggleTheme} className="uppercase hover:text-[#00ff41] transition-colors">
          {theme}
        </button>
      </div>
    </div>
  );
}
