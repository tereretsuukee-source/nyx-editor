'use client';

import React, { useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '../hooks/useTheme';
import { hackerDarkTheme, hackerLightTheme } from '../lib/themes/hackerTheme';
import { validateCodeInput } from '../lib/security/inputGuard';

// Dynamically import Monaco with no SSR
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { ssr: false, loading: () => null }
);

interface EditorProps {
  value: string;
  language?: string;
  onChange: (value: string) => void;
  onSave?: () => void;
}

export default function Editor({ value, language = 'javascript', onChange, onSave }: EditorProps) {
  const { theme } = useTheme();
  const [monacoFailed, setMonacoFailed] = useState(false);

  // If Monaco doesn't mount within 8s, assume CDN blocked/failed
  useEffect(() => {
    const timer = setTimeout(() => setMonacoFailed(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleMount = useCallback((editor: any, monaco: any) => {
    monaco.editor.defineTheme('hacker-dark', hackerDarkTheme);
    monaco.editor.defineTheme('hacker-light', hackerLightTheme);

    monaco.languages.register({ id: 'brainfuck' });
    monaco.languages.setMonarchTokensProvider('brainfuck', {
      tokenizer: {
        root: [
          [/[<>]/, 'keyword'],
          [/[+\-]/, 'number'],
          [/[.,]/, 'string'],
          [/\[/, 'delimiter.bracket'],
          [/\]/, 'delimiter.bracket'],
          [/[^<>+\-\[\],.]/, 'comment'],
        ],
      },
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });

    // Monaco loaded successfully — cancel fallback
    setMonacoFailed(false);
    setTimeout(() => editor.focus(), 100);
  }, [onSave]);

  const handleChange = useCallback((newValue: string | undefined) => {
    if (newValue === undefined) return;
    try {
      validateCodeInput(newValue);
      onChange(newValue);
    } catch (err) {
      console.warn('Input validation failed:', err);
    }
  }, [onChange]);

  // FALLBACK: Secure textarea when Monaco CDN is blocked
  if (monacoFailed) {
    const isDark = theme === 'dark';
    return (
      <div className={`flex-1 h-full flex flex-col ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f5f0e1]'}`}>
        <div className={`px-3 py-1.5 border-b font-mono text-[10px] ${isDark ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400' : 'bg-yellow-600/10 border-yellow-600/20 text-yellow-700'}`}>
          ⚠️ Monaco Editor blocked (CSP/Network). Using secure fallback.
        </div>
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
              onSave?.();
            }
          }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className={`flex-1 w-full h-full font-mono text-sm p-4 resize-none outline-none border-none ${isDark ? 'bg-[#0a0a0a] text-[#00ff41]' : 'bg-[#f5f0e1] text-[#3d2b1f]'}`}
          style={{
            caretColor: isDark ? '#00ff41' : '#b45f06',
            lineHeight: '1.6',
            tabSize: 2,
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full">
      <MonacoEditor
        height="100%"
        defaultLanguage={language}
        value={value}
        theme={theme === 'dark' ? 'hacker-dark' : 'hacker-light'}
        onChange={handleChange}
        onMount={handleMount}
        options={{
          fontFamily: 'JetBrains Mono, Fira Code, monospace',
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          minimap: { enabled: true },
          automaticLayout: true,
          padding: { top: 16 },
          cursorStyle: 'line',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          contextmenu: true,
          multiCursorModifier: 'ctrlCmd',
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true, indentation: true },
          fixedOverflowWidgets: true,
        }}
        loading={
          <div className="flex flex-col items-center justify-center h-full text-[#00ff41] font-mono text-sm gap-2">
            <div className="animate-pulse">Initializing secure editor...</div>
            <div className="text-[10px] opacity-50">Loading from CDN (fallback in 8s if blocked)</div>
          </div>
        }
      />
    </div>
  );
}
