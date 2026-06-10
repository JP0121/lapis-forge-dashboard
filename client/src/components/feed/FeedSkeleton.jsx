export default function FeedSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 space-y-3 animate-pulse border-l-2 border-l-border-subtle">
          <div className="flex items-center gap-2">
            <div className="w-12 h-4 bg-bg-elevated rounded" />
            <div className="w-20 h-3 bg-bg-elevated rounded" />
            <div className="w-12 h-3 bg-bg-elevated rounded ml-auto" />
          </div>
          <div className="space-y-1.5">
            <div className="w-full h-3.5 bg-bg-elevated rounded" />
            <div className="w-4/5 h-3.5 bg-bg-elevated rounded" />
          </div>
          <div className="w-full h-3 bg-bg-elevated rounded" />
          <div className="w-3/4 h-3 bg-bg-elevated rounded" />
        </div>
      ))}
    </div>
  );
}
