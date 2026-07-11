import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, LayoutDashboard, MessageSquare, FileText, ClipboardList,
  BookOpen, Code2, Timer, Trophy, BarChart3, Users, Shield,
  Settings, LogOut, ChevronLeft, ChevronRight, Sparkles,
  Briefcase, FileSearch, Presentation, Target, Flame, Coins,
  GraduationCap, Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
  color?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: MessageSquare, label: 'AI Chat', path: '/chat', badge: 'AI', color: 'text-primary-400' },
      { icon: FileText, label: 'Notes', path: '/notes' },
      { icon: ClipboardList, label: 'Quizzes', path: '/quiz' },
    ],
  },
  {
    title: 'Study Tools',
    items: [
      { icon: FileSearch, label: 'PDF Reader', path: '/pdf' },
      { icon: Code2, label: 'Coding', path: '/coding', color: 'text-accent-400' },
      { icon: BookOpen, label: 'Research', path: '/research' },
      { icon: Presentation, label: 'Presentations', path: '/presentations' },
    ],
  },
  {
    title: 'Career',
    items: [
      { icon: Briefcase, label: 'Interview Coach', path: '/interview' },
      { icon: Target, label: 'Career Coach', path: '/career' },
      { icon: FileText, label: 'Resume Builder', path: '/resume' },
    ],
  },
  {
    title: 'Productivity',
    items: [
      { icon: Timer, label: 'Focus Mode', path: '/productivity' },
      { icon: Trophy, label: 'Achievements', path: '/achievements' },
      { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    ],
  },
];

const adminItems: NavItem[] = [
  { icon: Users, label: 'Teacher Portal', path: '/teacher' },
  { icon: Shield, label: 'Admin Panel', path: '/admin' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const xpToNextLevel = (profile?.level ?? 1) * 1000;
  const xpProgress = Math.min(((profile?.xp ?? 0) % xpToNextLevel) / xpToNextLevel * 100, 100);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-surface-900/80 backdrop-blur-xl border-r border-white/8 flex-shrink-0 z-20"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-6 z-30 w-7 h-7 rounded-full bg-surface-800 border border-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-colors shadow-lg"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 p-5 border-b border-white/8 ${collapsed ? 'justify-center' : ''}`}>
        <div className="p-2 bg-primary-600 rounded-xl shadow-glow-sm flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-bold text-white text-lg">StudyMate</span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary-400" />
                <span className="text-xs text-primary-400 font-medium">AI Powered</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-2">
            {!collapsed && (
              <span className="block px-2 mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">{group.title}</span>
            )}
            <div>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    isActive
                      ? `sidebar-item-active ${collapsed ? 'justify-center px-0' : ''}`
                      : `sidebar-item ${collapsed ? 'justify-center px-0' : ''}`
                  }
                >
                  <item.icon className={`flex-shrink-0 ${item.color ?? ''}`} style={{ width: 18, height: 18 }} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="flex items-center justify-between flex-1 min-w-0"
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-blue-600/30 text-blue-300 rounded-md border border-blue-500/30">
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* Admin/Teacher Items */}
        {(profile?.role === 'teacher' || profile?.role === 'admin') && (
          <div className="pt-2 border-t border-white/8">
            {!collapsed && (
              <span className="block px-2 mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">Management</span>
            )}
            {adminItems
              .filter(item => profile.role === 'admin' || item.path !== '/admin')
              .map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    isActive
                      ? `sidebar-item-active ${collapsed ? 'justify-center px-0' : ''}`
                      : `sidebar-item ${collapsed ? 'justify-center px-0' : ''}`
                  }
                >
                  <item.icon style={{ width: 18, height: 18 }} className="flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))
            }
          </div>
        )}
      </nav>

      {/* Profile Footer */}
      <div className="border-t border-white/8 p-3 space-y-3">
        {!collapsed && profile && (
          <div className="px-2 space-y-2">
            {/* XP Bar */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs">
                <Star className="w-3 h-3 text-warning-400" />
                <span className="text-warning-400 font-medium">Lv.{profile.level}</span>
              </div>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-xs text-slate-500">{profile.xp}xp</span>
            </div>
            {/* Stats row */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-orange-400">
                <Flame className="w-3 h-3" />
                <span>{profile.streak_days}d</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                <Coins className="w-3 h-3" />
                <span>{profile.coins}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <GraduationCap className="w-3 h-3" />
                <span className="capitalize">{profile.role}</span>
              </div>
            </div>
          </div>
        )}

        <div className={`flex items-center gap-2 ${collapsed ? 'flex-col' : ''}`}>
          <NavLink
            to="/settings"
            title={collapsed ? 'Settings' : undefined}
            className={({ isActive }) =>
              `flex items-center gap-2.5 p-2 rounded-xl transition-all flex-1 ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/8'} ${collapsed ? 'justify-center' : ''}`
            }
          >
            <Settings style={{ width: 16, height: 16 }} className="flex-shrink-0" />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-white truncate">{profile?.display_name ?? 'User'}</div>
                <div className="text-xs text-slate-500 truncate">{profile?.role}</div>
              </div>
            )}
          </NavLink>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="p-2 rounded-xl text-slate-500 hover:text-error-400 hover:bg-error-500/10 transition-all"
          >
            <LogOut style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
