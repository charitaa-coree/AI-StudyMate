import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Mail, Lock, Eye, EyeOff, User, Github, Chrome,
  ArrowRight, GraduationCap, BookOpen, Briefcase
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const roles = [
  { value: 'student', label: 'Student', icon: GraduationCap, desc: 'Learn & grow with AI' },
  { value: 'teacher', label: 'Teacher', icon: BookOpen, desc: 'Manage & educate' },
  { value: 'admin', label: 'Admin', icon: Briefcase, desc: 'Platform management' },
];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    setError('');
    const { error } = await signUp(email, password, name, role);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="p-2.5 bg-primary-600 rounded-xl shadow-glow">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">AI StudyMate</span>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
          <p className="text-slate-400 mb-8">Start your AI-powered learning journey today</p>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => signInWithGoogle()} className="btn-secondary text-sm py-2.5">
              <Chrome className="w-4 h-4" />
              Google
            </button>
            <button onClick={() => signInWithGithub()} className="btn-secondary text-sm py-2.5">
              <Github className="w-4 h-4" />
              GitHub
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-900 px-3 text-slate-500 rounded-full border border-white/10">or create with email</span>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">I am a</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    role === value
                      ? 'bg-primary-600/20 border-primary-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1.5" />
                  <div className="text-xs font-medium">{label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    className="input-field pl-10 pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-500">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-error-500/10 border border-error-500/30 rounded-xl text-error-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
