import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Search, Sun, Moon, Sparkles, X, Command,
  MessageSquare, FileText, ClipboardList, Code2, User,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your learning overview' },
  '/chat': { title: 'AI Chat', subtitle: 'Your personal AI tutor' },
  '/notes': { title: 'AI Notes', subtitle: 'Generate & manage notes' },
  '/quiz': { title: 'AI Quiz', subtitle: 'Test your knowledge' },
  '/pdf': { title: 'PDF Reader', subtitle: 'AI-powered document reader' },
  '/coding': { title: 'Coding Assistant', subtitle: 'AI code helper' },
  '/research': { title: 'Research Assistant', subtitle: 'Academic research tools' },
  '/presentations': { title: 'Presentation Builder', subtitle: 'AI slide generator' },
  '/interview': { title: 'Interview Coach', subtitle: 'Ace your interviews' },
  '/career': { title: 'Career Coach', subtitle: 'Plan your career path' },
  '/resume': { title: 'Resume Builder', subtitle: 'Professional ATS resume' },
  '/productivity': { title: 'Focus Mode', subtitle: 'Pomodoro & task management' },
  '/achievements': { title: 'Achievements', subtitle: 'Your badges & rewards' },
  '/analytics': { title: 'Analytics', subtitle: 'Learning insights & progress' },
  '/teacher': { title: 'Teacher Portal', subtitle: 'Manage students & content' },
  '/admin': { title: 'Admin Panel', subtitle: 'Platform management' },
  '/settings': { title: 'Settings', subtitle: 'Customize your experience' },
};

const searchSuggestions = [
  { icon: MessageSquare, label: 'Ask AI about quantum physics', path: '/chat' },
  { icon: FileText, label: 'Generate notes from PDF', path: '/notes' },
  { icon: ClipboardList, label: 'Create a math quiz', path: '/quiz' },
  { icon: Code2, label: 'Debug my Python code', path: '/coding' },
];

export default function Header() {
  const { pathname } = useLocation();
  const { profile } = useAuth();
  const [darkMode] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const page = pageTitles[pathname] ?? { title: 'AI StudyMate', subtitle: '' };

  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const notifications = [
    { id: 1, type: 'achievement', message: 'You earned the "Note Taker" badge!', time: '2m ago', unread: true },
    { id: 2, type: 'reminder', message: 'Study session starting in 15 minutes', time: '10m ago', unread: true },
    { id: 3, type: 'ai', message: 'Your quiz results are ready', time: '1h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-surface-900/60 backdrop-blur-xl sticky top-0 z-10">
        {/* Left: breadcrumb */}
        <div>
          <h1 className="text-lg font-semibold text-white">{page.title}</h1>
          <p className="text-xs text-slate-500">{page.subtitle}</p>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Search trigger */}
          <button
            onClick={() => setShowSearch(true)}
            className="hidden md:flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all text-sm min-w-52"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Search anything...</span>
            <kbd className="flex items-center gap-1 text-xs text-slate-600 bg-white/5 px-1.5 py-0.5 rounded">
              <Command className="w-3 h-3" />K
            </kbd>
          </button>

          <button onClick={() => setShowSearch(true)} className="md:hidden btn-ghost">
            <Search className="w-4 h-4" />
          </button>

          {/* AI Hint */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-primary-600/10 border border-primary-500/20 rounded-lg text-xs text-primary-300">
            <Sparkles className="w-3 h-3" />
            <span>AI Ready</span>
          </div>

          {/* Theme toggle (decorative since we're dark-only) */}
          <button className="btn-ghost">
            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="btn-ghost relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full border border-surface-900" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-80 glass-card p-4 shadow-xl z-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    <span className="badge bg-primary-600/20 text-primary-300 border border-primary-500/30">{unreadCount} new</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl transition-all ${n.unread ? 'bg-white/8 border border-white/10' : 'hover:bg-white/5'}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-primary-400' : 'bg-slate-600'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                          <p className="text-xs text-slate-600 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white text-sm font-semibold shadow-glow-sm">
              {profile?.display_name?.[0]?.toUpperCase() ?? <User className="w-4 h-4" />}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-medium text-white leading-none">{profile?.display_name ?? 'User'}</div>
              <div className="text-xs text-slate-500 mt-0.5 capitalize">{profile?.role}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={e => { if (e.target === e.currentTarget) setShowSearch(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl glass-card overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search notes, chat, quizzes, or ask AI..."
                  className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-base"
                />
                <button onClick={() => setShowSearch(false)} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Quick Actions</p>
                <div className="space-y-1">
                  {searchSuggestions.map(({ icon: Icon, label }, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/8 transition-all text-sm"
                      onClick={() => setShowSearch(false)}
                    >
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="flex-1 text-left">{label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
