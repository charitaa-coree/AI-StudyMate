import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Star, Flame, Zap, Award, Lock, CheckCircle2,
  Crown, Shield, Target, BookOpen, Code2, MessageSquare,
  Timer, TrendingUp, Coins, ChevronUp
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Achievement } from '../../lib/supabase';
import { useAuth as useAuthCtx } from '../../contexts/AuthContext';

const ICON_MAP: Record<string, React.ElementType> = {
  zap: Zap, award: Award, 'message-circle': MessageSquare, 'file-text': BookOpen,
  flame: Flame, 'book-open': BookOpen, code: Code2, 'graduation-cap': Crown,
  timer: Timer, sunrise: Star,
};

const LEADERBOARD = [
  { rank: 1, name: 'Aditya K.', xp: 12400, streak: 42, avatar: 'A' },
  { rank: 2, name: 'Priya S.', xp: 11800, streak: 35, avatar: 'P' },
  { rank: 3, name: 'Alex M.', xp: 10600, streak: 28, avatar: 'A' },
  { rank: 4, name: 'Chen W.', xp: 9200, streak: 21, avatar: 'C' },
  { rank: 5, name: 'Maria G.', xp: 8700, streak: 19, avatar: 'M' },
  { rank: 6, name: 'James L.', xp: 7500, streak: 14, avatar: 'J' },
  { rank: 7, name: 'Sofia B.', xp: 6800, streak: 12, avatar: 'S' },
  { rank: 8, name: 'Ravi P.', xp: 5900, streak: 8, avatar: 'R' },
];

const LEVEL_TITLES = ['Beginner', 'Learner', 'Explorer', 'Scholar', 'Sage', 'Expert', 'Master', 'Grandmaster', 'Legend', 'AI Champion'];

export default function Achievements() {
  const { profile } = useAuthCtx();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard' | 'levels'>('achievements');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [ach, earned] = await Promise.all([
      supabase.from('achievements').select('*').order('xp_reward'),
      supabase.from('user_achievements').select('achievement_id'),
    ]);
    setAchievements(ach.data ?? []);
    setEarnedIds(new Set((earned.data ?? []).map(e => e.achievement_id)));
    setLoading(false);
  };

  const level = profile?.level ?? 1;
  const xp = profile?.xp ?? 0;
  const xpToNext = level * 1000;
  const xpProgress = Math.min((xp % xpToNext) / xpToNext * 100, 100);
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  return (
    <div className="space-y-6">
      {/* Profile Banner */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 to-surface-900/20" />
        <div className="relative z-10 flex items-center gap-6">
          {/* Level Badge */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-glow border-2 border-white/20">
              <span className="text-3xl font-black text-white">{level}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-500 rounded-full border-2 border-surface-900 flex items-center justify-center">
              <Crown className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white">{profile?.display_name ?? 'Scholar'}</h2>
              <span className="badge bg-primary-600/30 text-primary-300 border border-primary-500/30">{levelTitle}</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">Level {level} Scholar • {xp} XP earned</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden max-w-xs">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full"
                />
              </div>
              <span className="text-xs text-slate-400">{xp % xpToNext} / {xpToNext} XP to Level {level + 1}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-5 flex-shrink-0">
            <div className="text-center">
              <div className="flex items-center gap-1 text-orange-400 font-bold text-xl">
                <Flame className="w-5 h-5" />
                {profile?.streak_days ?? 0}
              </div>
              <div className="text-xs text-slate-500">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-yellow-400 font-bold text-xl">
                <Coins className="w-4 h-4" />
                {profile?.coins ?? 0}
              </div>
              <div className="text-xs text-slate-500">Coins</div>
            </div>
            <div className="text-center">
              <div className="text-primary-400 font-bold text-xl">{earnedIds.size}/{achievements.length}</div>
              <div className="text-xs text-slate-500">Badges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl w-fit">
        {['achievements', 'leaderboard', 'levels'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'achievements' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">All Badges</h3>
            <span className="text-sm text-slate-400">{earnedIds.size} of {achievements.length} earned</span>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-36 glass-card shimmer" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {achievements.map((ach, i) => {
                const earned = earnedIds.has(ach.id);
                const Icon = ICON_MAP[ach.icon ?? 'award'] ?? Award;
                return (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`glass-card p-5 flex flex-col items-center text-center gap-3 transition-all duration-300 relative overflow-hidden ${earned ? 'border-primary-500/30 bg-primary-600/5 hover:bg-primary-600/10' : 'opacity-50 hover:opacity-60'}`}
                  >
                    {earned && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-accent-400" />
                      </div>
                    )}
                    {!earned && (
                      <div className="absolute top-2 right-2">
                        <Lock className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${earned ? 'bg-gradient-to-br from-primary-600 to-accent-500 shadow-glow-sm' : 'bg-white/10'}`}>
                      <Icon className={`w-6 h-6 ${earned ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${earned ? 'text-white' : 'text-slate-500'}`}>{ach.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{ach.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`flex items-center gap-1 ${earned ? 'text-primary-400' : 'text-slate-600'}`}>
                        <Zap className="w-3 h-3" />{ach.xp_reward} XP
                      </span>
                      <span className={`flex items-center gap-1 ${earned ? 'text-yellow-400' : 'text-slate-600'}`}>
                        <Coins className="w-3 h-3" />{ach.coin_reward}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="max-w-2xl mx-auto glass-card overflow-hidden">
          <div className="p-5 border-b border-white/8 flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Global Leaderboard
            </h3>
            <span className="badge bg-primary-600/20 text-primary-300 border border-primary-500/30">Weekly</span>
          </div>
          <div className="divide-y divide-white/5">
            {LEADERBOARD.map((entry, i) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-all ${entry.rank <= 3 ? 'bg-white/3' : ''}`}
              >
                <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                  entry.rank === 1 ? 'text-yellow-400' :
                  entry.rank === 2 ? 'text-slate-300' :
                  entry.rank === 3 ? 'text-orange-400' :
                  'text-slate-500'
                }`}>
                  {entry.rank <= 3 ? <Crown className="w-5 h-5" /> : `#${entry.rank}`}
                </div>
                <div className={`w-10 h-10 rounded-xl font-bold text-base flex items-center justify-center flex-shrink-0 ${
                  entry.rank === 1 ? 'bg-yellow-500 text-white' :
                  entry.rank === 2 ? 'bg-slate-400 text-white' :
                  entry.rank === 3 ? 'bg-orange-500 text-white' :
                  'bg-white/10 text-white'
                }`}>
                  {entry.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{entry.name}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-primary-400" />{entry.xp.toLocaleString()} XP</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{entry.streak}d streak</span>
                  </div>
                </div>
                {entry.rank <= 3 && (
                  <div className={`badge text-xs ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : entry.rank === 2 ? 'bg-slate-400/20 text-slate-300 border-slate-400/30' : 'bg-orange-500/20 text-orange-300 border-orange-500/30'}`}>
                    Top {entry.rank}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'levels' && (
        <div className="max-w-2xl mx-auto space-y-3">
          {LEVEL_TITLES.map((title, i) => {
            const lvl = i + 1;
            const isUnlocked = lvl <= level;
            const isCurrent = lvl === level;
            return (
              <motion.div
                key={lvl}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isCurrent ? 'bg-primary-600/10 border-primary-500/30' : isUnlocked ? 'bg-white/5 border-white/10' : 'opacity-40 border-white/5'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${isCurrent ? 'bg-primary-600 text-white shadow-glow-sm' : isUnlocked ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-600'}`}>
                  {lvl}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold ${isCurrent ? 'text-primary-300' : isUnlocked ? 'text-white' : 'text-slate-500'}`}>{title}</p>
                    {isCurrent && <span className="badge bg-primary-600/30 text-primary-300 border border-primary-500/30 text-xs">Current</span>}
                  </div>
                  <p className="text-xs text-slate-500">{lvl * 1000} XP required</p>
                </div>
                {isUnlocked ? (
                  <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
