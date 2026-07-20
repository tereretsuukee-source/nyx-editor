export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-[#00ff41] font-mono">
      <div className="text-center">
        <div className="text-2xl mb-2 tracking-widest">NYX EDITOR</div>
        <div className="text-xs opacity-60">Initializing secure environment...</div>
      </div>
    </div>
  );
}
