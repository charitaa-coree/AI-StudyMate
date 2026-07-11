import { motion } from 'framer-motion';
import {
  Users, Shield, BarChart3, TrendingUp, AlertCircle, DollarSign,
  Server, Activity, Eye, Settings, Flag, MessageSquare, Trash2,
  CheckCircle2, Clock, Database, Cpu, Globe, ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const userGrowth = [
  { month: 'Jan', users: 1200 }, { month: 'Feb', users: 2100 }, { month: 'Mar', users: 3400 },
  { month: 'Apr', users: 4800 }, { month: 'May', users: 6200 }, { month: 'Jun', users: 8900 },
  { month: 'Jul', users: 12400 },
];

const aiUsage = [
  { day: 'Mon', calls: 3200 }, { day: 'Tue', calls: 4100 }, { day: 'Wed', calls: 3800 },
  { day: 'Thu', calls: 5200 }, { day: 'Fri', calls: 4800 }, { day: 'Sat', calls: 2900 },
  { day: 'Sun', calls: 2100 },
];

const recentReports = [
  { id: 1, type: 'bug', title: 'Quiz timer not stopping', user: 'aditya@email.com', status: 'open', time: '2h ago' },
  { id: 2, type: 'feedback', title: 'Great AI chat experience!', user: 'priya@email.com', status: 'reviewed', time: '4h ago' },
  { id: 3, type: 'content', title: 'Incorrect answer in CS quiz', user: 'alex@email.com', status: 'pending', time: '6h ago' },
];

export default function AdminPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
          <p className="text-sm text-slate-400">Platform management and analytics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-accent-500/10 border border-accent-500/20 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
          <span className="text-xs text-accent-300">All Systems Operational</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { icon: Users, label: 'Total Users', value: '12,400', change: '+34%', color: 'from-primary-600 to-primary-700' },
          { icon: Activity, label: 'Active Now', value: '847', change: 'live', color: 'from-accent-600 to-teal-600' },
          { icon: MessageSquare, label: 'AI Calls Today', value: '18.4K', change: '+12%', color: 'from-warning-600 to-orange-600' },
          { icon: DollarSign, label: 'MRR', value: '$24,800', change: '+8%', color: 'from-emerald-600 to-teal-600' },
          { icon: Flag, label: 'Open Reports', value: '3', change: 'needs action', color: 'from-error-600 to-red-600' },
          { icon: Server, label: 'Server Load', value: '42%', change: 'healthy', color: 'from-violet-600 to-violet-700' },
        ].map(({ icon: Icon, label, value, change, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-400">{label}</div>
              <div className="text-xs text-accent-400 mt-0.5">{change}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-1">User Growth</h3>
          <p className="text-xs text-slate-400 mb-4">Total registered users over time</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#userGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-1">AI API Usage</h3>
          <p className="text-xs text-slate-400 mb-4">Daily AI calls (this week)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={aiUsage}>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 12 }} />
              <Bar dataKey="calls" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports & System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Reports */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Reports</h3>
            <span className="badge bg-error-500/20 text-error-300 border-error-500/20">3 open</span>
          </div>
          <div className="space-y-3">
            {recentReports.map(r => (
              <div key={r.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/8 transition-all border border-white/5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.type === 'bug' ? 'bg-error-500/20' : r.type === 'feedback' ? 'bg-accent-500/20' : 'bg-warning-500/20'}`}>
                  {r.type === 'bug' ? <AlertCircle className="w-4 h-4 text-error-400" /> : r.type === 'feedback' ? <MessageSquare className="w-4 h-4 text-accent-400" /> : <Flag className="w-4 h-4 text-warning-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{r.title}</p>
                  <p className="text-xs text-slate-500">{r.user} • {r.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge text-xs ${r.status === 'open' ? 'bg-error-500/20 text-error-300 border-error-500/20' : r.status === 'pending' ? 'bg-warning-500/20 text-warning-300 border-warning-500/20' : 'bg-accent-500/20 text-accent-300 border-accent-500/20'}`}>
                    {r.status}
                  </span>
                  <button className="btn-ghost p-1.5">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-accent-400" />
            System Health
          </h3>
          <div className="space-y-4">
            {[
              { label: 'API Response Time', value: 145, unit: 'ms', status: 'good', max: 500 },
              { label: 'CPU Usage', value: 42, unit: '%', status: 'good', max: 100 },
              { label: 'Memory Usage', value: 68, unit: '%', status: 'warning', max: 100 },
              { label: 'Database', value: 23, unit: '%', status: 'good', max: 100 },
              { label: 'AI Model Uptime', value: 99.9, unit: '%', status: 'excellent', max: 100 },
            ].map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">{s.label}</span>
                  <span className={`text-xs font-medium ${s.status === 'good' || s.status === 'excellent' ? 'text-accent-400' : 'text-warning-400'}`}>
                    {s.value}{s.unit}
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${s.status === 'good' || s.status === 'excellent' ? 'bg-accent-500' : 'bg-warning-500'}`}
                    style={{ width: `${(s.value / s.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
