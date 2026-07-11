import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Mail, Lock, Eye, EyeOff, Github, Chrome,
  ArrowRight, Sparkles, BookOpen, Zap, Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const features = [
  { icon: Brain, text: 'AI-powered learning assistant' },
  { icon: BookOpen, text: 'Smart notes & PDF reader' },
  { icon: Zap, text: 'Adaptive quiz generation' },
  { icon: Star, text: 'Gamified progress tracking' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogle = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  const handleGithub = async () => {
    setError('');
    const { error } = await signInWithGithub();
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-900 via-surface-900 to-surface-950 items-center justify-center p-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="relative z-10 max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-primary-600 rounded-2xl shadow-glow">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">AI StudyMate</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Your personal<br />
              <span className="ai-gradient">AI Learning</span><br />
              companion
            </h1>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              The world's smartest study platform combining AI chat, adaptive quizzes, smart notes, and career coaching.
            </p>
            <div className="space-y-4">
              {features.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 bg-primary-600/20 rounded-lg border border-primary-500/30">
                    <Icon className="w-4 h-4 text-primary-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="p-2.5 bg-primary-600 rounded-xl shadow-glow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AI StudyMate</span>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400 mb-8">Sign in to continue your learning journey</p>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={handleGoogle} className="btn-secondary text-sm py-2.5">
                <Chrome className="w-4 h-4" />
                Google
              </button>
              <button onClick={handleGithub} className="btn-secondary text-sm py-2.5">
                <Github className="w-4 h-4" />
                GitHub
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface-900 px-3 text-slate-500 rounded-full border border-white/10">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                  <>Sign in <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Create account
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
