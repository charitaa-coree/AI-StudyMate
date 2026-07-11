import { motion } from 'framer-motion';
import {
  Users, BookOpen, ClipboardList, BarChart3, Plus, Eye,
  TrendingUp, Award, Clock, CheckCircle2, AlertCircle,
  Upload, FileText, Sparkles, ChevronRight, UserCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const classPerformance = [
  { name: 'Aditya', score: 92 }, { name: 'Priya', score: 87 }, { name: 'Alex', score: 78 },
  { name: 'Chen', score: 95 }, { name: 'Maria', score: 83 }, { name: 'James', score: 71 },
];

const assignments = [
  { title: 'Data Structures Quiz', subject: 'CS', due: '2026-07-15', submitted: 22, total: 28, status: 'active' },
  { title: 'Calculus Assignment 3', subject: 'Math', due: '2026-07-20', submitted: 15, total: 28, status: 'active' },
  { title: 'Physics Lab Report', subject: 'Physics', due: '2026-07-12', submitted: 28, total: 28, status: 'completed' },
];

const recentStudents = [
  { name: 'Aditya K.', score: 92, streak: 42, status: 'excellent' },
  { name: 'Priya S.', score: 87, streak: 35, status: 'good' },
  { name: 'Alex M.', score: 68, streak: 5, status: 'needs-help' },
  { name: 'Chen W.', score: 95, streak: 28, status: 'excellent' },
  { name: 'Maria G.', score: 74, streak: 12, status: 'good' },
];

export default function TeacherPortal() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Teacher Portal</h2>
          <p className="text-sm text-slate-400">Manage your class and track student progress</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm py-2">
            <Upload className="w-4 h-4" />
            Upload Material
          </button>
          <button className="btn-primary text-sm py-2">
            <Plus className="w-4 h-4" />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Students', value: '28', color: 'from-primary-600 to-primary-700' },
          { icon: UserCheck, label: 'Active Today', value: '19', color: 'from-accent-600 to-teal-600' },
          { icon: ClipboardList, label: 'Assignments', value: '3', color: 'from-warning-600 to-orange-600' },
          { icon: TrendingUp, label: 'Class Avg', value: '81%', color: 'from-violet-600 to-violet-700' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Performance */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4">Student Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={classPerformance}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 12 }} />
              <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Assignments */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Assignments</h3>
            <button className="btn-primary text-xs py-1.5 px-3">
              <Plus className="w-3.5 h-3.5" />
              New
            </button>
          </div>
          <div className="space-y-3">
            {assignments.map(a => (
              <div key={a.title} className="p-4 bg-white/5 rounded-xl border border-white/8 hover:bg-white/8 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.subject} • Due: {new Date(a.due).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge text-xs ${a.status === 'completed' ? 'bg-accent-500/20 text-accent-300 border-accent-500/20' : 'bg-primary-600/20 text-primary-300 border-primary-500/20'}`}>
                    {a.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${(a.submitted/a.total)*100}%` }} />
                  </div>
                  <span className="text-xs text-slate-400">{a.submitted}/{a.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Student Overview</h3>
          <button className="btn-secondary text-xs py-1.5 px-3">
            <Eye className="w-3.5 h-3.5" />
            View All
          </button>
        </div>
        <div className="space-y-2">
          {recentStudents.map(s => (
            <div key={s.name} className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 hover:bg-white/8 transition-all border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {s.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{s.name}</p>
                <p className="text-xs text-slate-500">{s.streak}d streak</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${s.score >= 85 ? 'text-accent-400' : s.score >= 70 ? 'text-warning-400' : 'text-error-400'}`}>{s.score}%</p>
                <span className={`text-xs ${s.status === 'excellent' ? 'text-accent-400' : s.status === 'good' ? 'text-primary-400' : 'text-error-400'}`}>
                  {s.status.replace('-', ' ')}
                </span>
              </div>
              <button className="btn-ghost p-2">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
