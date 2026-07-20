'use client';

import React, { useEffect, useState } from 'react';
import { validateCodeInput, validateParenthesisDepth } from '../../lib/security/inputGuard';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface ASTNode {
  type: string;
  children: ASTNode[];
  value?: string;
}

interface ASTViewerProps {
  code: string;
  language: string;
}

export default function ASTViewer({ code }: ASTViewerProps) {
  const [ast, setAst] = useState<ASTNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      validateCodeInput(code);
      validateParenthesisDepth(code);
      const parsed = parseSimpleAST(code);
      setAst(parsed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Parse error');
      setAst(null);
    }
  }, [code]);

  if (error) {
    return (
      <div className="text-red-400 font-mono text-xs p-3 border border-red-400/20 rounded bg-red-400/5">
        ⚠️ {error}
      </div>
    );
  }

  if (!ast) {
    return <div className="text-[#00ff41]/30 font-mono text-xs p-4">Enter code to visualize AST...</div>;
  }

  return <ASTNodeView node={ast} depth={0} />;
}

function ASTNodeView({ node, depth }: { node: ASTNode; depth: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div className="font-mono text-xs" style={{ marginLeft: depth * 12 }}>
      <div
        className="flex items-center gap-1 py-0.5 cursor-pointer hover:bg-[#00ff41]/5 rounded"
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (expanded
          ? <ChevronDown className="w-3 h-3 text-[#00ff41]/60" />
          : <ChevronRight className="w-3 h-3 text-[#00ff41]/60" />
        )}
        <span className="text-[#00ff88]">{node.type}</span>
        {node.value && <span className="text-[#55ff55] ml-2 truncate max-w-[200px]">= {node.value}</span>}
      </div>
      {expanded && node.children.map((child, i) => (
        <ASTNodeView key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

// SECURITY: Structural parser only. No eval. No Function().
function parseSimpleAST(code: string): ASTNode {
  const root: ASTNode = { type: 'Program', children: [] };
  const lines = code.split('\n');

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      root.children.push({ type: 'Empty', children: [] });
      return;
    }
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*')) {
      root.children.push({ type: 'Comment', children: [], value: trimmed.slice(0, 50) });
      return;
    }

    let type = 'Statement';
    if (/^\s*(function|def|fn|func)\s/.test(trimmed)) type = 'FunctionDeclaration';
    else if (/^\s*(if|else|elif|match)\b/.test(trimmed)) type = 'Conditional';
    else if (/^\s*(for|while|loop)\b/.test(trimmed)) type = 'Loop';
    else if (/^\s*return\b/.test(trimmed)) type = 'Return';
    else if (/^\s*(struct|class|type|interface)\b/.test(trimmed)) type = 'TypeDeclaration';
    else if (/=/.test(trimmed) && !/==/.test(trimmed)) type = 'Assignment';

    root.children.push({
      type,
      children: [],
      value: trimmed.length > 50 ? trimmed.slice(0, 50) + '...' : trimmed,
    });
  });

  return root;
}
