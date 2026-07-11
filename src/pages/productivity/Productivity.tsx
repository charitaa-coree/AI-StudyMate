import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Timer, Play, Pause, Square, RotateCcw, Plus, CheckCircle2,
  Circle, Trash2, Target, Flame, Clock, Coffee, Brain,
  TrendingUp, ListTodo, Calendar, ChevronRight, Edit3,
  X, Check, AlertTriangle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Task } from '../../lib/supabase';

type PomodoroMode = 'focus' | 'short_break' | 'long_break';

const MODES: Record<PomodoroMode, { label: string; duration: number; color: string; icon: React.ElementType }> = {
  focus: { label: 'Focus', duration: 25 * 60, color: 'text-primary-400', icon: Brain },
  short_break: { label: 'Short Break', duration: 5 * 60, color: 'text-accent-400', icon: Coffee },
  long_break: { label: 'Long Break', duration: 15 * 60, color: 'text-warning-400', icon: Coffee },
};

function formatTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

const PRIORITY_COLORS = {
  low: 'text-slate-400',
  medium: 'text-primary-400',
  high: 'text-warning-400',
  urgent: 'text-error-400',
};

const PRIORITY_BG = {
  low: 'bg-slate-500/10 border-slate-500/20',
  medium: 'bg-primary-500/10 border-primary-500/20',
  high: 'bg-warning-500/10 border-warning-500/20',
  urgent: 'bg-error-500/10 border-error-500/20',
};

export default function Productivity() {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [running, setRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium' as Task['priority'], due_date: '' });
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  const progress = 1 - timeLeft / MODES[mode].duration;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setRunning(false);
            handleTimerComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const handleTimerComplete = useCallback(async () => {
    if (mode === 'focus') {
      setSessionsCompleted(s => s + 1);
      if (currentSession) {
        await supabase.from('study_sessions').update({ completed: true, ended_at: new Date().toISOString() }).eq('id', currentSession);
        setCurrentSession(null);
      }
      const newMode = sessionsCompleted > 0 && (sessionsCompleted + 1) % 4 === 0 ? 'long_break' : 'short_break';
      setMode(newMode);
      setTimeLeft(MODES[newMode].duration);
    } else {
      setMode('focus');
      setTimeLeft(MODES.focus.duration);
    }
  }, [mode, currentSession, sessionsCompleted]);

  const handleStart = async () => {
    if (mode === 'focus' && !currentSession) {
      const { data } = await supabase.from('study_sessions').insert({
        session_type: 'pomodoro',
        duration_minutes: 25,
      }).select().single();
      if (data) setCurrentSession(data.id);
    }
    setRunning(true);
  };

  const handlePause = () => setRunning(false);

  const handleReset = () => {
    setRunning(false);
    setTimeLeft(MODES[mode].duration);
    setCurrentSession(null);
  };

  const switchMode = (m: PomodoroMode) => {
    setMode(m);
    setTimeLeft(MODES[m].duration);
    setRunning(false);
    setCurrentSession(null);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').order('due_date', { ascending: true, nullsFirst: false });
    setTasks(data ?? []);
    setLoadingTasks(false);
  };

  const addTask = async () => {
    if (!taskForm.title.trim()) return;
    const { data, error } = await supabase.from('tasks').insert({
      title: taskForm.title,
      description: taskForm.description || null,
      priority: taskForm.priority,
      due_date: taskForm.due_date || null,
    }).select().single();
    if (!error && data) {
      setTasks(prev => [...prev, data]);
      setTaskForm({ title: '', description: '', priority: 'medium', due_date: '' });
      setShowAddTask(false);
    }
  };

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await supabase.from('tasks').update({ status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null }).eq('id', task.id);
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t =>
    filterStatus === 'all' ? true : filterStatus === 'completed' ? t.status === 'completed' : t.status !== 'completed'
  );

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Pomodoro Timer */}
      <div className="lg:col-span-2 space-y-4">
        <div className="glass-card p-6 flex flex-col items-center">
          <h2 className="text-lg font-bold text-white mb-4">Focus Timer</h2>

          {/* Mode Selector */}
          <div className="flex gap-1.5 mb-8 bg-white/5 p-1 rounded-xl">
            {(Object.keys(MODES) as PomodoroMode[]).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === m ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {MODES[m].label}
              </button>
            ))}
          </div>

          {/* Circular Timer */}
          <div className="relative w-56 h-56 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <motion.circle
                cx="100" cy="100" r="90"
                fill="none"
                stroke={mode === 'focus' ? '#3b82f6' : mode === 'short_break' ? '#22c55e' : '#f59e0b'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-5xl font-bold tabular-nums ${MODES[mode].color}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-slate-400 mt-1 capitalize">{MODES[mode].label}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={handleReset} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={running ? handlePause : handleStart}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white shadow-glow hover:shadow-glow-lg transition-all hover:scale-105"
            >
              {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
            <button onClick={() => { setRunning(false); setTimeLeft(MODES[mode].duration); }} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-error-400 hover:bg-error-500/10 transition-all">
              <Square className="w-4 h-4" />
            </button>
          </div>

          {/* Session dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full border-2 transition-all ${i < sessionsCompleted % 4 ? 'bg-primary-500 border-primary-400' : 'border-white/20'}`} />
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">{sessionsCompleted} sessions completed today</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Flame, label: 'Focus Time', value: `${sessionsCompleted * 25}min`, color: 'text-orange-400' },
            { icon: TrendingUp, label: 'Productivity', value: '76%', color: 'text-primary-400' },
            { icon: Target, label: 'Goals Today', value: '3/5', color: 'text-accent-400' },
            { icon: Clock, label: 'Avg Session', value: '24min', color: 'text-warning-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card p-4 flex items-center gap-3">
              <Icon className={`w-5 h-5 ${color}`} />
              <div>
                <div className="text-sm font-semibold text-white">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Manager */}
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Task Manager</h2>
          <button onClick={() => setShowAddTask(true)} className="btn-primary text-sm py-2">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl w-fit">
          {(['all', 'pending', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterStatus === f ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {f} {f === 'all' ? `(${tasks.length})` : f === 'pending' ? `(${tasks.filter(t => t.status !== 'completed').length})` : `(${tasks.filter(t => t.status === 'completed').length})`}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="glass-card p-4 space-y-2">
          {loadingTasks ? (
            <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl shimmer" />)}</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-10">
              <ListTodo className="w-10 h-10 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-400">No tasks here</p>
              <p className="text-sm text-slate-600">Add tasks to stay organized</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group flex items-center gap-3 p-4 rounded-xl border transition-all ${PRIORITY_BG[task.priority]} hover:bg-white/8`}
              >
                <button onClick={() => toggleTask(task)} className="flex-shrink-0">
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-accent-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 hover:text-accent-400 transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium transition-all ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs ${PRIORITY_COLORS[task.priority]} capitalize`}>{task.priority}</span>
                    {task.due_date && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                    {task.subject && <span className="text-xs text-slate-600">· {task.subject}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => deleteTask(task.id)} className="p-1.5 text-slate-500 hover:text-error-400 hover:bg-error-500/10 rounded-lg transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowAddTask(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-card p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white">Add New Task</h3>
                <button onClick={() => setShowAddTask(false)} className="btn-ghost p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Task Title *</label>
                  <input value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} placeholder="What needs to be done?" className="input-field" autoFocus />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional details..." rows={2} className="input-field resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                    <select value={taskForm.priority} onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value as Task['priority'] }))} className="input-field">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
                    <input type="date" value={taskForm.due_date} onChange={e => setTaskForm(f => ({ ...f, due_date: e.target.value }))} className="input-field" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowAddTask(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={addTask} disabled={!taskForm.title.trim()} className="btn-primary flex-1">
                    <Check className="w-4 h-4" />
                    Add Task
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
