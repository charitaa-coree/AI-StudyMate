import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, Mic, MicOff, Play, Pause, RotateCcw, CheckCircle2,
  XCircle, Star, Brain, MessageSquare, Code2, Users, FileText,
  ChevronRight, Award, TrendingUp, Clock, Sparkles, X
} from 'lucide-react';

const INTERVIEW_TYPES = [
  { icon: Users, label: 'HR Interview', desc: 'Behavioral & situational questions', color: 'from-primary-600 to-primary-700' },
  { icon: Code2, label: 'Technical', desc: 'DSA, system design, coding', color: 'from-accent-600 to-teal-600' },
  { icon: MessageSquare, label: 'Group Discussion', desc: 'Communication & leadership skills', color: 'from-warning-600 to-orange-600' },
  { icon: FileText, label: 'Resume Review', desc: 'AI feedback on your resume', color: 'from-violet-600 to-violet-700' },
];

const HR_QUESTIONS = [
  'Tell me about yourself.',
  'What are your greatest strengths and weaknesses?',
  'Why do you want to work here?',
  'Where do you see yourself in 5 years?',
  'Describe a challenging situation you handled.',
  'How do you handle pressure and tight deadlines?',
];

const AI_FEEDBACK = `## Interview Performance Analysis

**Overall Score: 7.8/10** — Good performance!

---

### Strengths
- Clear and structured responses
- Good use of STAR method for behavioral questions
- Confident delivery and appropriate pace

### Areas for Improvement
1. **Specificity**: Add more concrete metrics to your examples
   - Instead of "improved performance", say "improved performance by 40%"
2. **Body Language**: Maintain more consistent eye contact
3. **Question Preparation**: Prepare 3-4 questions to ask the interviewer

### Question-by-Question Feedback

**Q1: Tell me about yourself**
- Rating: 8/10
- Feedback: Good structure, could be shorter (aim for 2 minutes)

**Q2: Strengths and Weaknesses**
- Rating: 7/10
- Feedback: Weakness was genuine but could show more steps taken to improve

### Recommended Study Topics
- STAR method for behavioral answers
- Researching the company and role deeply
- Preparing specific impact metrics from your experience`;

export default function InterviewCoach() {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recording, setRecording] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answer, setAnswer] = useState('');

  const startSession = (type: string) => {
    setActiveType(type);
    setCurrentQuestion(0);
    setSessionDone(false);
    setShowFeedback(false);
    setAnswer('');
  };

  const nextQuestion = () => {
    if (currentQuestion < HR_QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
      setAnswer('');
      setRecording(false);
    } else {
      setSessionDone(true);
    }
  };

  if (showFeedback) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Interview Feedback</h2>
          <button onClick={() => { setActiveType(null); setShowFeedback(false); }} className="btn-secondary text-sm">
            <RotateCcw className="w-4 h-4" />
            New Session
          </button>
        </div>
        <div className="glass-card p-6">
          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed">{AI_FEEDBACK}</pre>
        </div>
      </div>
    );
  }

  if (activeType && !sessionDone) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Session Header */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-white">{activeType} Interview Session</h2>
              <p className="text-xs text-slate-400">Question {currentQuestion + 1} of {HR_QUESTIONS.length}</p>
            </div>
            <button onClick={() => setActiveType(null)} className="btn-ghost p-2">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full"
              animate={{ width: `${((currentQuestion + 1) / HR_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
              <span className="text-lg">🎤</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Interview Question</p>
              <h3 className="text-xl font-semibold text-white mt-1">{HR_QUESTIONS[currentQuestion]}</h3>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Your Answer</label>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here, or use voice recording..."
              rows={5}
              className="input-field resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setRecording(!recording)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${recording ? 'bg-error-500/10 border-error-500/30 text-error-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
            >
              {recording ? <><MicOff className="w-4 h-4" />Stop Recording</> : <><Mic className="w-4 h-4" />Voice Answer</>}
            </button>
            <button onClick={nextQuestion} className="btn-primary ml-auto">
              {currentQuestion === HR_QUESTIONS.length - 1 ? 'Finish' : 'Next Question'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* AI Hint */}
        <div className="glass-card p-4 border border-primary-500/20 bg-primary-600/5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-medium text-primary-400">AI Tip</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Use the <strong className="text-white">STAR method</strong>: Situation, Task, Action, Result. This structures your answer clearly and demonstrates impact.
          </p>
        </div>
      </div>
    );
  }

  if (sessionDone) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="glass-card p-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-accent-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow"
          >
            <Award className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Session Complete!</h2>
          <p className="text-slate-400 mb-8">You've answered all {HR_QUESTIONS.length} questions. Get your AI feedback now.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setActiveType(null)} className="btn-secondary">Try Again</button>
            <button onClick={() => setShowFeedback(true)} className="btn-primary">
              <Sparkles className="w-4 h-4" />
              View AI Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">AI Interview Coach</h2>
        <p className="text-sm text-slate-400">Practice interviews with AI feedback and performance tracking</p>
      </div>

      {/* Interview Types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {INTERVIEW_TYPES.map(({ icon: Icon, label, desc, color }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.02 }}
            onClick={() => startSession(label)}
            className={`group relative flex flex-col gap-3 p-5 rounded-2xl bg-gradient-to-br ${color} border border-white/10 text-left overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
            <div className="p-2.5 bg-white/15 rounded-xl w-fit">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">{label}</div>
              <div className="text-white/60 text-xs mt-0.5">{desc}</div>
            </div>
            <Play className="absolute bottom-4 right-4 w-4 h-4 text-white/50" />
          </motion.button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: MessageSquare, label: 'Sessions Done', value: '12', color: 'from-primary-600 to-primary-700' },
          { icon: Star, label: 'Avg Score', value: '7.8/10', color: 'from-yellow-600 to-orange-600' },
          { icon: TrendingUp, label: 'Improvement', value: '+24%', color: 'from-accent-600 to-teal-600' },
          { icon: Clock, label: 'Practice Time', value: '4.5h', color: 'from-violet-600 to-violet-700' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Common Questions Bank */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary-400" />
          Common Interview Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {HR_QUESTIONS.map((q, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-all border border-white/5">
              <span className="w-6 h-6 rounded-lg bg-primary-600/20 text-primary-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-slate-300">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
