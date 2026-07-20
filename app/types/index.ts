export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'rust'
  | 'go'
  | 'c'
  | 'cpp'
  | 'java'
  | 'julia'
  | 'brainfuck'
  | 'markdown'
  | 'json'
  | 'css'
  | 'html'
  | 'plaintext';

export interface FileNode {
  name: string;
  kind: 'file' | 'directory';
  handle: FileSystemHandle;
  children?: FileNode[];
  parent?: FileNode;
  fileObject?: File;
}

export interface EditorState {
  content: string;
  language: SupportedLanguage;
  isDirty: boolean;
  cursorPosition: { line: number; column: number };
}
