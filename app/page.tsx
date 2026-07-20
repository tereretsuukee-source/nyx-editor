'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from './components/Sidebar';
import LogicVisualizer from './components/LogicVisualizer';
import CommandPalette from './components/CommandPalette';
import StatusBar from './components/StatusBar';
import { useFileSystem } from './hooks/useFileSystem';
import { registerCommand } from './lib/commands/registry';
import { useTheme } from './hooks/useTheme';

const Editor = dynamic(() => import('./components/Editor'), { ssr: false });

const LANG_MAP: Record<string, string> = {
  js: 'javascript', ts: 'typescript', jsx: 'javascript', tsx: 'typescript',
  py: 'python', rs: 'rust', go: 'go', c: 'c', cpp: 'cpp', h: 'c',
  java: 'java', jl: 'julia', bf: 'brainfuck', md: 'markdown',
  json: 'json', css: 'css', html: 'html',
};

export default function Home() {
  const { theme } = useTheme();
  const { 
    root, 
    currentFile, 
    fileContent, 
    error,
    openDirectory, 
    openDirectoryFallback,
    openFile, 
    saveFile, 
    setFileContent 
  } = useFileSystem();
  const [language, setLanguage] = useState('javascript');
  const [showPalette, setShowPalette] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    registerCommand({
      id: 'file:openFolder', label: 'Open Folder', category: 'File', keybinding: 'Ctrl+K Ctrl+O',
      handler: openDirectory,
    });
    registerCommand({
      id: 'file:save', label: 'Save File', category: 'File', keybinding: 'Ctrl+S',
      handler: async () => { if (await saveFile(fileContent)) setIsDirty(false); },
    });
    registerCommand({
      id: 'view:commandPalette', label: 'Command Palette', category: 'View', keybinding: 'Ctrl+Shift+P',
      handler: () => setShowPalette(true),
    });
  }, [openDirectory, saveFile, fileContent]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'p' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        setShowPalette(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleFileSelect = useCallback(async (node: any) => {
    await openFile(node);
    setIsDirty(false);
    const ext = node.name.split('.').pop()?.toLowerCase();
    setLanguage(LANG_MAP[ext || ''] || 'plaintext');
  }, [openFile]);

  const handleChange = useCallback((value: string) => {
    setFileContent(value);
    setIsDirty(true);
  }, [setFileContent]);

  const handleSave = useCallback(async () => {
    if (await saveFile(fileContent)) setIsDirty(false);
  }, [saveFile, fileContent]);

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="h-8 bg-[#0d0d0d] border-b border-[#00ff41]/20 flex items-center px-4 select-none">
        <span className="text-[#00ff41]/60 font-mono text-xs tracking-widest">NYX EDITOR v1.0.0</span>
        <div className="flex-1" />
        <span className="text-[#00ff41]/30 font-mono text-[10px]\">SECURE MODE — NO EVAL</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          root={root} 
          currentFile={currentFile} 
          error={error}
          onOpenDirectory={openDirectory} 
          onOpenDirectoryFallback={openDirectoryFallback}
          onSelectFile={handleFileSelect} 
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex">
            <div className="flex-1 min-w-0">
              <Editor value={fileContent} language={language} onChange={handleChange} onSave={handleSave} />
            </div>
            <div className="w-80 hidden xl:block">
              <LogicVisualizer code={fileContent} language={language} />
            </div>
          </div>
          <StatusBar language={language} line={cursorPos.line} column={cursorPos.column} isDirty={isDirty} />
        </div>
      </div>

      <CommandPalette isOpen={showPalette} onClose={() => setShowPalette(false)} onExecute={(cmd) => cmd.handler()} />
    </div>
  );
}
