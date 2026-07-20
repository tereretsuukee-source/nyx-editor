'use client';

import React, { useRef } from 'react';
import { FolderOpen, File, ChevronRight, ChevronDown, AlertTriangle } from 'lucide-react';
import type { FileNode } from '../types';

interface SidebarProps {
  root: FileNode | null;
  currentFile: FileNode | null;
  error: string | null;
  onOpenDirectory: () => void;
  onOpenDirectoryFallback: (files: FileList | null) => void;
  onSelectFile: (node: FileNode) => void;
}

export default function Sidebar({ root, currentFile, error, onOpenDirectory, onOpenDirectoryFallback, onSelectFile }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-64 h-full bg-[#0d0d0d] border-r border-[#00ff41]/20 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#00ff41]/20">
        <span className="text-[#00ff41] font-mono text-xs font-bold tracking-widest">EXPLORER</span>
        <button
          onClick={onOpenDirectory}
          className="p-1 hover:bg-[#00ff41]/10 rounded text-[#00ff41]/60 hover:text-[#00ff41] transition-colors"
          title="Open Folder"
        >
          <FolderOpen className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden fallback file input */}
      <input
        ref={fileInputRef}
        type="file"
        // @ts-ignore
        webkitdirectory="true"
        directory="true"
        multiple
        className="hidden"
        onChange={(e) => {
          onOpenDirectoryFallback(e.target.files);
          e.target.value = '';
        }}
      />
      
      <div className="flex-1 overflow-auto py-2">
        {error && (
          <div className="mx-2 mb-2 p-2 border border-yellow-400/30 rounded bg-yellow-400/5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-yellow-400/80 font-mono text-[10px] leading-relaxed">{error}</p>
                {'showDirectoryPicker' in (typeof window !== 'undefined' ? window : {}) === false && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-[#00ff41] font-mono text-[10px] underline hover:text-[#00ff41]/80"
                  >
                    Click here to upload a folder instead
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {root ? (
          <FileTree node={root} currentFile={currentFile} onSelectFile={onSelectFile} depth={0} />
        ) : (
          <div className="px-4 py-8 text-center">
            <p className="text-[#00ff41]/30 font-mono text-xs mb-4">No folder opened</p>
            <button
              onClick={onOpenDirectory}
              className="px-3 py-1.5 border border-[#00ff41]/30 text-[#00ff41] font-mono text-xs rounded hover:bg-[#00ff41]/10 transition-colors block w-full mb-2"
            >
              Open Folder (Native)
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 border border-[#00ff41]/20 text-[#00ff41]/60 font-mono text-xs rounded hover:bg-[#00ff41]/5 hover:text-[#00ff41] transition-colors block w-full"
            >
              Upload Folder (Fallback)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FileTree({ node, currentFile, onSelectFile, depth }: {
  node: FileNode;
  currentFile: FileNode | null;
  onSelectFile: (node: FileNode) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = React.useState(true);
  const isSelected = currentFile?.name === node.name && currentFile?.kind === node.kind;

  if (node.kind === 'file') {
    return (
      <div
        className={`flex items-center gap-2 px-4 py-1 cursor-pointer font-mono text-xs ${
          isSelected
            ? 'bg-[#00ff41]/10 text-[#00ff41]'
            : 'text-[#00ff41]/60 hover:bg-[#00ff41]/5 hover:text-[#00ff41]/80'
        }`}
        style={{ paddingLeft: 16 + depth * 12 }}
        onClick={() => onSelectFile(node)}
      >
        <File className="w-3 h-3 opacity-60" />
        <span className="truncate">{node.name}</span>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-1 px-4 py-1 cursor-pointer font-mono text-xs text-[#00ff41]/80 hover:bg-[#00ff41]/5"
        style={{ paddingLeft: 16 + depth * 12 }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <span className="truncate font-bold">{node.name}</span>
      </div>
      {expanded && node.children?.map((child, i) => (
        <FileTree key={i} node={child} currentFile={currentFile} onSelectFile={onSelectFile} depth={depth + 1} />
      ))}
    </div>
  );
}
