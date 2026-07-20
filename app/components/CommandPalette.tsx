'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Command } from 'lucide-react';
import { searchCommands, type Command as CommandType } from '../lib/commands/registry';
import { validateCommandInput } from '../lib/security/inputGuard';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (command: CommandType) => void;
}

export default function CommandPalette({ isOpen, onClose, onExecute }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<CommandType[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setFiltered(searchCommands(''));
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    try {
      validateCommandInput(query);
      setFiltered(searchCommands(query));
      setSelectedIndex(0);
    } catch {
      setFiltered([]);
    }
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % Math.max(filtered.length, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onExecute(filtered[selectedIndex]);
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [filtered, selectedIndex, onExecute, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm"
         onClick={onClose}>
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-[#00ff41]/30 rounded-lg shadow-2xl overflow-hidden"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3 border-b border-[#00ff41]/20">
          <Search className="w-5 h-5 text-[#00ff41]/60 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-[#00ff41] placeholder-[#00ff41]/30 outline-none font-mono"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex items-center gap-1 text-[#00ff41]/40 text-xs font-mono">
            <kbd className="px-1.5 py-0.5 border border-[#00ff41]/20 rounded">ESC</kbd>
            <span>to close</span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-[#00ff41]/40 font-mono">No commands found</div>
          ) : (
            filtered.map((cmd, index) => (
              <div
                key={cmd.id}
                className={`flex items-center px-4 py-2.5 cursor-pointer font-mono text-sm ${
                  index === selectedIndex
                    ? 'bg-[#00ff41]/10 text-[#00ff41]'
                    : 'text-[#00ff41]/70 hover:bg-[#00ff41]/5'
                }`}
                onClick={() => { onExecute(cmd); onClose(); }}
              >
                <Command className="w-4 h-4 mr-3 opacity-60" />
                <span className="flex-1">{cmd.label}</span>
                <span className="text-xs opacity-40 mr-4">{cmd.category}</span>
                {cmd.keybinding && (
                  <kbd className="px-1.5 py-0.5 border border-[#00ff41]/20 rounded text-xs opacity-60">
                    {cmd.keybinding}
                  </kbd>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
