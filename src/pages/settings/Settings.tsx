import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, Bell, Palette, Globe, Shield, Brain,
  Sparkles, Save, Check, Moon, Sun, Monitor, Eye, EyeOff,
  Smartphone, ChevronRight, Trash2, Download, Upload
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai', label: 'AI Preferences', icon: Brain },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

const AI_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', desc: 'Most capable, best for complex tasks' },
  { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', provider: 'OpenAI', desc: 'Fast and efficient for most tasks' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', desc: 'Great for research and analysis' },
  { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', desc: 'Excellent at writing and reasoning' },
];

export default function Settings() {
  const { profile, updateProfile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    display_name: profile?.display_name ?? '',
    bio: profile?.bio ?? '',
    institution: profile?.institution ?? '',
    subject_focus: profile?.subject_focus ?? '',
  });

  const [notifications, setNotifications] = useState({
    study_reminder: true,
    achievement_alerts: true,
    exam_reminder: true,
    daily_motivation: true,
    assignment_reminder: false,
    email_notifications: true,
  });

  const [aiPrefs, setAiPrefs] = useState({
    default_model: 'gpt-4',
    explanation_style: 'balanced',
    response_language: 'English',
    citation_style: 'APA',
    code_language: 'Python',
  });

  const saveProfile = async () => {
    await updateProfile(profileForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-56 flex-shrink-0">
          <div className="glass-card p-3 space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${activeTab === id ? 'bg-primary-600/20 text-white border border-primary-500/30' : 'text-slate-400 hover:text-white hover:bg-white/8'}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 glass-card p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Profile Settings</h3>

              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white text-2xl font-bold shadow-glow">
                    {profile?.display_name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-xl border-2 border-surface-900 flex items-center justify-center hover:bg-primary-500 transition-all">
                    <Upload className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{profile?.display_name ?? 'User'}</p>
                  <p className="text-xs text-slate-500 capitalize">{profile?.role} • Level {profile?.level}</p>
                  <p className="text-xs text-slate-600 mt-1">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
                  <input value={profileForm.display_name} onChange={e => setProfileForm(f => ({ ...f, display_name: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Institution</label>
                  <input value={profileForm.institution} onChange={e => setProfileForm(f => ({ ...f, institution: e.target.value }))} placeholder="University or School" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject Focus</label>
                  <input value={profileForm.subject_focus} onChange={e => setProfileForm(f => ({ ...f, subject_focus: e.target.value }))} placeholder="e.g., Computer Science" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                  <input value={profile?.role ?? ''} disabled className="input-field opacity-50 cursor-not-allowed capitalize" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                  <textarea value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself..." rows={3} className="input-field resize-none" />
                </div>
              </div>

              <button onClick={saveProfile} className="btn-primary">
                {saved ? <><Check className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />Save Changes</>}
              </button>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Account Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input value={user?.email ?? ''} disabled className="input-field opacity-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPassword ? 'text' : 'password'} placeholder="Enter current password" className="input-field pr-10" />
                    <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3.5 top-3.5 text-slate-500">
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                  <input type="password" placeholder="Enter new password" className="input-field" />
                </div>
                <button className="btn-primary">
                  <Lock className="w-4 h-4" />
                  Update Password
                </button>
              </div>

              <div className="divider pt-4">
                <div className="pt-4 space-y-3">
                  <h4 className="text-sm font-semibold text-white">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-sm font-medium text-white">Authenticator App</p>
                      <p className="text-xs text-slate-500">Add an extra layer of security</p>
                    </div>
                    <button className="btn-secondary text-sm py-2">Enable 2FA</button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-error-500/10 border border-error-500/20 rounded-xl">
                <h4 className="text-sm font-semibold text-error-400 mb-2">Danger Zone</h4>
                <p className="text-xs text-slate-400 mb-3">Deleting your account is permanent and cannot be undone.</p>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error-500/10 border border-error-500/30 text-error-400 hover:bg-error-500/20 text-sm transition-all">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/8">
                    <div>
                      <p className="text-sm font-medium text-white capitalize">{key.replace(/_/g, ' ')}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(n => ({ ...n, [key]: !val }))}
                      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${val ? 'bg-primary-600' : 'bg-white/15'}`}
                    >
                      <motion.div
                        animate={{ x: val ? 20 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">AI Preferences</h3>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Default AI Model</label>
                <div className="space-y-2">
                  {AI_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setAiPrefs(p => ({ ...p, default_model: m.id }))}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${aiPrefs.default_model === m.id ? 'bg-primary-600/15 border-primary-500/40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center ${aiPrefs.default_model === m.id ? 'from-primary-600 to-primary-700' : 'from-white/10 to-white/5'}`}>
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{m.name}</span>
                          <span className="badge bg-white/10 text-slate-400 text-xs">{m.provider}</span>
                        </div>
                        <p className="text-xs text-slate-500">{m.desc}</p>
                      </div>
                      {aiPrefs.default_model === m.id && <Check className="w-4 h-4 text-primary-400 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Explanation Style</label>
                  <select value={aiPrefs.explanation_style} onChange={e => setAiPrefs(p => ({ ...p, explanation_style: e.target.value }))} className="input-field">
                    <option value="simple">Simple (ELI5)</option>
                    <option value="balanced">Balanced</option>
                    <option value="technical">Technical</option>
                    <option value="academic">Academic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Citation Style</label>
                  <select value={aiPrefs.citation_style} onChange={e => setAiPrefs(p => ({ ...p, citation_style: e.target.value }))} className="input-field">
                    <option>APA</option>
                    <option>MLA</option>
                    <option>IEEE</option>
                    <option>Chicago</option>
                  </select>
                </div>
              </div>
              <button className="btn-primary">
                <Save className="w-4 h-4" />
                Save AI Preferences
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Appearance</h3>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', icon: Moon, label: 'Dark' },
                    { id: 'light', icon: Sun, label: 'Light' },
                    { id: 'auto', icon: Monitor, label: 'System' },
                  ].map(({ id, icon: Icon, label }) => (
                    <button key={id} className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${id === 'dark' ? 'bg-primary-600/20 border-primary-500/40 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}>
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Accent Color</label>
                <div className="flex gap-3">
                  {['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'].map(color => (
                    <button key={color} className="w-8 h-8 rounded-full border-2 border-white/20 hover:scale-110 transition-transform" style={{ background: color }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Font Size</label>
                <select className="input-field w-40">
                  <option>Small</option>
                  <option selected>Medium</option>
                  <option>Large</option>
                  <option>Extra Large</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
