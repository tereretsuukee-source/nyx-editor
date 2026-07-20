'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-red-400 font-mono p-8">
      <div className="text-center max-w-lg">
        <h2 className="text-xl mb-4">⚠️ SECURITY EXCEPTION</h2>
        <p className="text-sm opacity-80 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 border border-red-400/30 text-red-400 hover:bg-red-400/10 rounded text-sm transition-colors"
        >
          Attempt Recovery
        </button>
      </div>
    </div>
  );
}
