'use client';

import { useEffect, useRef, useState } from 'react';

interface LSPMessage {
  jsonrpc: '2.0';
  id?: number;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: unknown;
}

/**
 * LSP WebSocket Client
 * 
 * SECURITY: Use wss:// (TLS) in production. The language server must
 * validate all inputs and run in an isolated process with resource quotas.
 */
export function useLSP(url: string) {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!url) return;
    const socket = new WebSocket(url);
    ws.current = socket;

    socket.onopen = () => {
      setConnected(true);
      socket.send(JSON.stringify({
        jsonrpc: '2.0',
        id: 0,
        method: 'initialize',
        params: { processId: null, rootUri: null, capabilities: {} },
      }));
    };

    socket.onclose = () => setConnected(false);

    return () => socket.close();
  }, [url]);

  const send = (msg: Omit<LSPMessage, 'jsonrpc'>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ jsonrpc: '2.0', ...msg }));
    }
  };

  return { connected, send };
}
