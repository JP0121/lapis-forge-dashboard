import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Bell,
  Bookmark,
  BarChart2,
  LogOut,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/feed', label: 'Feed Hub', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: Layers },
  { to: '/watchlist', label: 'Watchlist', icon: Bell },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
];

export default function Sidebar() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out');
    } catch {
      navigate('/login');
    }
  };

  return (
    <aside className="w-60 flex-shrink-0 bg-bg-surface border-r border-border-subtle flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-purple-subtle border border-purple/40 flex items-center justify-center flex-shrink-0">
            <Cpu size={16} className="text-purple-glow" />
          </div>
          <div>
            <h1 className="text-text-primary font-semibold text-sm leading-none">Lapis Forge</h1>
            <p className="text-text-muted text-xs font-mono mt-0.5">Intelligence Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-text-muted text-xs font-mono uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-purple-subtle text-purple-glow border-l-2 border-purple pl-[10px] shadow-purple-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated border-l-2 border-transparent pl-[10px]'
              }`
            }
          >
            <Icon size={16} className="flex-shrink-0" />
            <span>{label}</span>
            <ChevronRight
              size={12}
              className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity"
            />
          </NavLink>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-border-subtle">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-purple-subtle border border-purple/30 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-bright text-xs font-mono font-bold uppercase">
              {user?.username?.[0] || 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-text-primary text-sm font-medium truncate">{user?.username}</p>
            <p className="text-text-muted text-xs font-mono">Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-status-red hover:bg-red-950/30 text-sm transition-all duration-200"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
