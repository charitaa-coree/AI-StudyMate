import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Clock, Target, BookOpen, Brain,
  Code2, ClipboardList, Calendar, Download, Sparkles
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar,
  LineChart, Line, Legend, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';

const weeklyHours = [
  { week: 'W1', Math: 4, CS: 6, Science: 3, English: 2 },
  { week: 'W2', Math: 5, CS: 8, Science: 4, English: 3 },
  { week: 'W3', Math: 3, CS: 5, Science: 6, English: 2 },
  { week: 'W4', Math: 6, CS: 7, Science: 5, English: 4 },
  { week: 'W5', Math: 7, CS: 9, Science: 4, English: 5 },
  { week: 'W6', Math: 5, CS: 6, Science: 7, English: 3 },
];

const monthlyScore = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 72 },
  { month: 'Mar', score: 78 },
  { month: 'Apr', score: 75 },
  { month: 'May', score: 84 },
  { month: 'Jun', score: 89 },
  { month: 'Jul', score: 92 },
];

const subjectRadar = [
  { subject: 'Math', score: 85 },
  { subject: 'CS', score: 92 },
  { subject: 'Physics', score: 78 },
  { subject: 'Chemistry', score: 65 },
  { subject: 'English', score: 72 },
  { subject: 'History', score: 58 },
];

const activityPie = [
  { name: 'AI Chat', value: 35, color: '#3b82f6' },
  { name: 'Notes', value: 25, color: '#22c55e' },
  { name: 'Quizzes', value: 20, color: '#f59e0b' },
  { name: 'PDF Read', value: 15, color: '#8b5cf6' },
  { name: 'Coding', value: 5, color: '#06b6d4' },
];

const heatmapData = Array.from({ length: 52 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({
    week, day,
    value: Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0,
  }))
).flat();

function StatBox({ icon: Icon, label, value, change, color }: {
  icon: React.ElementType; label: string; value: string; change?: string; color: string;
}) {
  return (
    <div className="stat-card">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
        {change && <div className="text-xs text-accent-400 mt-0.5">{change}</div>}
      </div>
    </div>
  );
}

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Learning Analytics</h2>
          <p className="text-sm text-slate-400">Detailed insights into your study performance</p>
        </div>
        <div className="flex gap-2">
          <select className="input-field py-2 text-sm w-36">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="btn-secondary text-sm py-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatBox icon={Clock} label="Total Study Time" value="124h" change="+18% vs last month" color="from-primary-600 to-primary-700" />
        <StatBox icon={Target} label="Quiz Avg Score" value="84%" change="+12 points" color="from-accent-600 to-teal-600" />
        <StatBox icon={ClipboardList} label="Quizzes Taken" value="47" change="This month" color="from-warning-600 to-orange-600" />
        <StatBox icon={BookOpen} label="Notes Created" value="83" change="+15 this week" color="from-violet-600 to-violet-700" />
        <StatBox icon={Brain} label="AI Chats" value="312" change="Total sessions" color="from-blue-600 to-cyan-600" />
        <StatBox icon={Code2} label="Code Sessions" value="28" change="Problems solved" color="from-emerald-600 to-teal-600" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-white">Performance Trend</h3>
              <p className="text-xs text-slate-400">Monthly quiz score average</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-accent-400 bg-accent-500/10 px-2.5 py-1 rounded-full border border-accent-500/20">
              <TrendingUp className="w-3 h-3" />
              +41% YTD
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyScore}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 100]} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2.5} fill="url(#grad1)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-white">Study Hours by Subject</h3>
              <p className="text-xs text-slate-400">Weekly breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyHours}>
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Bar dataKey="Math" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="CS" stackId="a" fill="#22c55e" />
              <Bar dataKey="Science" stackId="a" fill="#f59e0b" />
              <Bar dataKey="English" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Skill Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-5"
        >
          <h3 className="font-semibold text-white mb-1">Skill Radar</h3>
          <p className="text-xs text-slate-400 mb-4">Subject proficiency levels</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={subjectRadar}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <h3 className="font-semibold text-white mb-1">Activity Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">How you spend study time</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={activityPie} cx="50%" cy="50%" outerRadius={65} dataKey="value" strokeWidth={0}>
                {activityPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {activityPie.map(a => (
              <div key={a.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: a.color }} />
                <span className="text-slate-400">{a.name}</span>
                <span className="text-slate-300 font-medium ml-auto">{a.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <h3 className="font-semibold text-white">AI Recommendations</h3>
          </div>
          <div className="space-y-3">
            {[
              { tip: 'Increase Chemistry study time — it\'s your weakest subject at 65%', type: 'warning' },
              { tip: 'Your CS performance is excellent! Consider taking the advanced quiz.', type: 'success' },
              { tip: 'Try studying History with spaced repetition for better retention.', type: 'info' },
              { tip: 'Your productivity peaks on Thursdays — schedule hard topics then.', type: 'info' },
            ].map((r, i) => (
              <div key={i} className={`p-3 rounded-xl text-xs leading-relaxed border ${
                r.type === 'warning' ? 'bg-warning-500/5 border-warning-500/20 text-warning-300' :
                r.type === 'success' ? 'bg-accent-500/5 border-accent-500/20 text-accent-300' :
                'bg-primary-500/5 border-primary-500/20 text-primary-300'
              }`}>
                {r.tip}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Study Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-white">Study Heatmap</h3>
            <p className="text-xs text-slate-400">Daily study activity over the past year</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Less</span>
            {['bg-white/5', 'bg-primary-900', 'bg-primary-700', 'bg-primary-500', 'bg-primary-400'].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span>More</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {Array.from({ length: 52 }, (_, week) => (
              <div key={week} className="flex flex-col gap-1">
                {Array.from({ length: 7 }, (_, day) => {
                  const d = heatmapData.find(h => h.week === week && h.day === day);
                  return (
                    <div
                      key={day}
                      className={`w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer ${
                        !d?.value ? 'bg-white/5' :
                        d.value === 1 ? 'bg-primary-900' :
                        d.value === 2 ? 'bg-primary-700' :
                        d.value === 3 ? 'bg-primary-600' :
                        d.value === 4 ? 'bg-primary-500' : 'bg-primary-400'
                      }`}
                      title={`${d?.value ?? 0} sessions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
