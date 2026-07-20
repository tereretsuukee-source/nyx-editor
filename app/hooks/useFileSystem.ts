'use client';

import { useState, useCallback, useRef } from 'react';
import { sanitizeFileName } from '../lib/security/inputGuard';
import type { FileNode } from '../types';

export function useFileSystem() {
  const [root, setRoot] = useState<FileNode | null>(null);
  const [currentFile, setCurrentFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const buildFileTreeFromHandles = useCallback(async (
    handle: FileSystemDirectoryHandle,
    parent?: FileNode
  ): Promise<FileNode> => {
    const node: FileNode = {
      name: sanitizeFileName(handle.name),
      kind: 'directory',
      handle,
      children: [],
      parent,
    };

    // @ts-ignore
    for await (const entry of handle.values()) {
      if (entry.kind === 'directory') {
        const child = await buildFileTreeFromHandles(entry,node);
        node.children!.push(child);
      } else {
        node.children!.push({
          name: sanitizeFileName(entry.name),
          kind: 'file',
          handle: entry,
          parent: node,
        });
      }
    }

    return node;
  }, []);

  const buildFileTreeFromFiles = useCallback((
    files: FileList,
    dirName: string = 'uploaded-folder'
  ): FileNode => {
    const root: FileNode = {
      name: dirName,
      kind: 'directory',
      handle: null as any,
      children: [],
    };

    const pathMap = new Map<string, FileNode>();
    pathMap.set('', root);

    Array.from(files).forEach((file) => {
      const pathParts = file.webkitRelativePath.split('/');
      let current = root;
      let currentPath = '';

      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!pathMap.has(currentPath)) {
          const newDir: FileNode = {
            name: part,
            kind: 'directory',
            handle: null as any,
            children: [],
            parent: current,
          };
          pathMap.set(currentPath, newDir);
          current.children!.push(newDir);
        }
        current = pathMap.get(currentPath)!;
      }

      current.children!.push({
        name: sanitizeFileName(pathParts[pathParts.length - 1]),
        kind: 'file',
        handle: null as any,
        fileObject: file,
        parent: current,
      });
    });

    return root;
  }, []);

  const openDirectory = useCallback(async () => {
    setError(null);
    
    // Try modern File System Access API first
    if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
      try {
        // @ts-ignore
        const handle = await window.showDirectoryPicker();
        const node = await buildFileTreeFromHandles(handle);
        setRoot(node);
        return null;
      } catch (err: any) {
        setError(`Failed to open directory: ${err.message}`);
        return null;
      }
    } else {
      setError(`Your browser does not support File System Access API. Use the fallback upload below.`);
      return null;
    }
  }, [buildFileTreeFromHandles]);

  const openDirectoryFallback = useCallback((files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) return;
    const node = buildFileTreeFromFiles(files);
    setRoot(node);
  }, [buildFileTreeFromFiles]);

  const openFile = useCallback(async (node: FileNode) => {
    if (node.kind !== 'file') return null;
    setError(null);
    
    try {
      // If it has a fileObject (fallback mode), read that
      if ((node as any).fileObject) {
        const content = await (node as any).fileObject.text();
        setCurrentFile(node);
        setFileContent(content);
        return content;
      }
      
      // Native File System Access API mode
      const fileHandle = node.handle as FileSystemFileHandle;
      const file = await fileHandle.getFile();
      const content = await file.text();
      setCurrentFile(node);
      setFileContent(content);
      return content;
    } catch (err: any) {
      setError(`Failed to read file: ${err.message}`);
      return null;
    }
  }, []);

  const saveFile = useCallback(async (content: string) => {
    if (!currentFile || currentFile.kind !== 'file') {
      setError(`No file is currently open.`);
      return false;
    }
    
    // Fallback mode: can't save back to disk easily, just update state
    if ((currentFile as any).fileObject) {
      setFileContent(content);
      setError(`Save to disk not available in fallback mode. Use Ctrl+A, Ctrl+C to copy content.`);
      return true;
    }

    try {
      const fileHandle = currentFile.handle as FileSystemFileHandle;
      // @ts-ignore
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      setFileContent(content);
      return true;
    } catch (err: any) {
      setError(`Failed to save file: ${err.message}`);
      return false;
    }
  }, [currentFile]);

  return {
    root,
    currentFile,
    fileContent,
    error,
    openDirectory,
    openDirectoryFallback,
    openFile,
    saveFile,
    setFileContent,
    fileInputRef,
  };
}
