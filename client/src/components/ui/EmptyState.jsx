export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card p-16 flex flex-col items-center justify-center text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-xl bg-purple-subtle border border-purple/30 flex items-center justify-center mb-4">
          <Icon size={24} className="text-purple-glow" />
        </div>
      )}
      <h3 className="text-text-primary font-medium">{title}</h3>
      {description && <p className="text-text-muted text-sm mt-2 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
