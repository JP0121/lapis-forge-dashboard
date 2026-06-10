export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo mark */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-lg bg-purple/20 animate-ping" />
          <div className="relative w-12 h-12 rounded-lg bg-purple-subtle border border-purple/40 flex items-center justify-center">
            <span className="text-purple-glow font-mono font-bold text-lg">L</span>
          </div>
        </div>
        <p className="text-text-muted text-sm font-mono tracking-widest uppercase">
          Initializing...
        </p>
      </div>
    </div>
  );
}
