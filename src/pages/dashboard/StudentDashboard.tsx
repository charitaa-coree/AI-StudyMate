import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame, Zap, Trophy, Target, Brain, MessageSquare,
  FileText, ClipboardList, Code2, Timer, TrendingUp,
  BookOpen, Star, Coins, ChevronRight, Sparkles,
  Calendar, CheckCircle2, Clock, AlertCircle, Play,
  BarChart3, Award, Plus
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const weeklyData = [
  { day: 'Mon', hours: 2.5, score: 72 },
  { day: 'Tue', hours: 3.2, score: 85 },
  { day: 'Wed', hours: 1.8, score: 68 },
  { day: 'Thu', hours: 4.1, score: 91 },
  { day: 'Fri', hours: 2.9, score: 78 },
  { day: 'Sat', hours: 5.0, score: 95 },
  { day: 'Sun', hours: 1.5, score: 65 },
];

const subjectData = [
  { subject: 'Math', A: 85 },
  { subject: 'Science', A: 78 },
  { subject: 'CS', A: 92 },
  { subject: 'English', A: 70 },
  { subject: 'History', A: 65 },
  { subject: 'Physics', A: 88 },
];

const quickActions = [
  { icon: MessageSquare, label: 'Ask AI', desc: 'Chat with AI tutor', path: '/chat', color: 'from-primary-600 to-primary-700', glow: 'shadow-glow-sm' },
  { icon: FileText, label: 'New Note', desc: 'Generate AI notes', path: '/notes', color: 'from-accent-600 to-accent-700' },
  { icon: ClipboardList, label: 'Take Quiz', desc: 'Test your knowledge', path: '/quiz', color: 'from-warning-600 to-warning-500' },
  { icon: Code2, label: 'Code', desc: 'AI code assistant', path: '/coding', color: 'from-violet-600 to-violet-700' },
];

const aiSuggestions = [
  { text: 'Review your weak areas in Physics before your exam tomorrow', urgency: 'high' },
  { text: 'You\'re on a 5-day streak — keep it up with a 30-min session today!', urgency: 'medium' },
  { text: 'Generate flashcards for your Machine Learning notes', urgency: 'low' },
];

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="stat-card hover:bg-white/8 transition-all duration-300 cursor-default"
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
        {sub && <div className="text-xs text-slate-600 mt-0.5">{sub}</div>}
      </div>
    </motion.div>
  );
}

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; priority: string; due_date: string | null; status: string }>>([]);
  const [notes, setNotes] = useState<Array<{ id: string; title: string; subject: string | null; created_at: string }>>([]);
  const [conversations, setConversations] = useState<Array<{ id: string; title: string; updated_at: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [t, n, c] = await Promise.all([
        supabase.from('tasks').select('id,title,priority,due_date,status').neq('status','completed').order('due_date').limit(5),
        supabase.from('notes').select('id,title,subject,created_at').order('created_at', { ascending: false }).limit(4),
        supabase.from('chat_conversations').select('id,title,updated_at').order('updated_at', { ascending: false }).limit(3),
      ]);
      setTasks(t.data ?? []);
      setNotes(n.data ?? []);
      setConversations(c.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const xpToNextLevel = (profile?.level ?? 1) * 1000;
  const xpProgress = Math.min(((profile?.xp ?? 0) % xpToNextLevel) / xpToNextLevel * 100, 100);
  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900 via-primary-800 to-surface-800 p-6 border border-primary-700/30"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-radial from-primary-500/20 to-transparent" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-primary-300 text-sm font-medium mb-1">{greeting},</p>
            <h2 className="text-2xl font-bold text-white mb-2">{profile?.display_name ?? 'Scholar'} 👋</h2>
            <p className="text-slate-400 text-sm max-w-lg">
              You've studied <span className="text-white font-medium">12.5 hours</span> this week. You're in the top{' '}
              <span className="text-accent-400 font-medium">15%</span> of learners. Keep going!
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Level {profile?.level ?? 1} Progress</span>
                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-400 rounded-full"
                  />
                </div>
                <span className="text-xs text-primary-400">{profile?.xp ?? 0} XP</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-glow text-3xl font-bold text-white border border-white/20">
                {profile?.level ?? 1}
              </div>
              <div className="absolute -top-2 -right-2 bg-warning-500 rounded-full px-2 py-0.5 text-xs font-bold text-white border-2 border-surface-900">
                LVL
              </div>
            </div>
            <span className="text-xs text-slate-400">Scholar Level</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard icon={Flame} label="Day Streak" value={`${profile?.streak_days ?? 0}d`} sub="Keep it up!" color="from-orange-600 to-red-600" delay={0.05} />
        <StatCard icon={Zap} label="XP Total" value={`${profile?.xp ?? 0}`} sub="Level up at 1000" color="from-primary-600 to-primary-700" delay={0.1} />
        <StatCard icon={Coins} label="Coins" value={profile?.coins ?? 0} sub="Spend in store" color="from-yellow-600 to-orange-600" delay={0.15} />
        <StatCard icon={Trophy} label="Achievements" value="7" sub="3 pending" color="from-violet-600 to-violet-700" delay={0.2} />
        <StatCard icon={Target} label="Focus Score" value={`${profile?.focus_score ?? 82}%`} sub="This week" color="from-accent-600 to-teal-600" delay={0.25} />
        <StatCard icon={TrendingUp} label="Productivity" value={`${profile?.productivity_score ?? 76}%`} sub="+8% vs last wk" color="from-blue-600 to-cyan-600" delay={0.3} />
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(({ icon: Icon, label, desc, path, color, glow }, i) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link
                to={path}
                className={`group relative flex flex-col gap-3 p-5 rounded-2xl bg-gradient-to-br ${color} border border-white/10 hover:scale-[1.02] transition-all duration-300 overflow-hidden ${glow ?? ''}`}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300" />
                <div className="p-2.5 bg-white/15 rounded-xl w-fit">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{label}</div>
                  <div className="text-white/60 text-xs mt-0.5">{desc}</div>
                </div>
                <ChevronRight className="absolute bottom-4 right-4 w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Charts + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Study Hours Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="section-title">Weekly Progress</h3>
              <p className="section-subtitle">Study hours & performance score</p>
            </div>
            <span className="badge bg-accent-500/20 text-accent-300 border border-accent-500/30">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} fill="url(#hoursGrad)" name="Study Hours" />
              <Area type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2} fill="url(#scoreGrad)" name="Score" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-5"
        >
          <h3 className="section-title mb-1">Subject Mastery</h3>
          <p className="section-subtitle mb-4">Performance by subject</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={subjectData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="Performance" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* AI Suggestions + Tasks + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-primary-600/20 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary-400" />
            </div>
            <h3 className="section-title text-base">AI Suggestions</h3>
          </div>
          <div className="space-y-3">
            {aiSuggestions.map((s, i) => (
              <div key={i} className={`flex gap-3 p-3 rounded-xl border transition-all hover:bg-white/5 cursor-pointer ${
                s.urgency === 'high' ? 'border-error-500/30 bg-error-500/5' :
                s.urgency === 'medium' ? 'border-warning-500/30 bg-warning-500/5' :
                'border-white/10 bg-white/3'
              }`}>
                <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  s.urgency === 'high' ? 'text-error-400' :
                  s.urgency === 'medium' ? 'text-warning-400' :
                  'text-slate-500'
                }`} />
                <p className="text-xs text-slate-300 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
          <Link to="/chat" className="btn-primary w-full mt-4 text-sm py-2">
            <Brain className="w-4 h-4" />
            Ask AI Tutor
          </Link>
        </motion.div>

        {/* Pending Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title text-base">Pending Tasks</h3>
            <Link to="/productivity" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl shimmer" />)}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-8 h-8 text-accent-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400">All tasks completed!</p>
              <Link to="/productivity" className="text-xs text-primary-400 mt-1 hover:underline">Add a task</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-all border border-white/5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.priority === 'urgent' ? 'bg-error-500' :
                    task.priority === 'high' ? 'bg-warning-500' :
                    task.priority === 'medium' ? 'bg-primary-500' : 'bg-slate-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{task.title}</p>
                    {task.due_date && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <Link to="/productivity" className="flex items-center gap-2 p-2.5 rounded-xl border border-dashed border-white/15 text-slate-500 hover:text-white hover:border-white/25 transition-all text-xs justify-center">
                <Plus className="w-3.5 h-3.5" />
                Add task
              </Link>
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <h3 className="section-title text-base mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {conversations.slice(0, 2).map(c => (
              <Link key={c.id} to="/chat" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-all border border-white/5 group">
                <div className="p-2 bg-primary-600/20 rounded-lg">
                  <MessageSquare className="w-3.5 h-3.5 text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate group-hover:text-primary-300 transition-colors">{c.title}</p>
                  <p className="text-xs text-slate-600">AI Chat</p>
                </div>
              </Link>
            ))}
            {notes.slice(0, 2).map(n => (
              <Link key={n.id} to="/notes" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-all border border-white/5 group">
                <div className="p-2 bg-accent-600/20 rounded-lg">
                  <FileText className="w-3.5 h-3.5 text-accent-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate group-hover:text-accent-300 transition-colors">{n.title}</p>
                  <p className="text-xs text-slate-600">{n.subject ?? 'General'}</p>
                </div>
              </Link>
            ))}
            {conversations.length === 0 && notes.length === 0 && (
              <div className="text-center py-6">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No recent activity</p>
                <p className="text-xs text-slate-600">Start learning to see activity here</p>
              </div>
            )}
          </div>
          <Link to="/analytics" className="btn-secondary w-full mt-4 text-xs py-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Full Analytics
          </Link>
        </motion.div>
      </div>

      {/* Pomodoro CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="relative overflow-hidden rounded-2xl border border-accent-700/30 bg-gradient-to-r from-accent-900/50 to-teal-900/30 p-6"
      >
        <div className="absolute right-0 top-0 w-48 h-full bg-gradient-radial from-accent-500/10 to-transparent" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-accent-600/20 border border-accent-500/30 rounded-2xl">
              <Timer className="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Ready to focus?</h3>
              <p className="text-sm text-slate-400">Start a Pomodoro session and earn XP for every completed session</p>
            </div>
          </div>
          <Link to="/productivity" className="btn-primary flex-shrink-0">
            <Play className="w-4 h-4" />
            Start Session
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
