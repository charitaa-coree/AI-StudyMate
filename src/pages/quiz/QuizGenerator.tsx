import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, ClipboardList, Sparkles, Play, Trophy, Clock,
  CheckCircle2, XCircle, ChevronRight, ChevronLeft, X,
  BarChart3, Zap, Target, RefreshCw, Lightbulb, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Quiz, QuizQuestion } from '../../lib/supabase';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert'];
const QUIZ_TYPES = [
  { value: 'mcq', label: 'Multiple Choice' },
  { value: 'true_false', label: 'True / False' },
  { value: 'fill_blank', label: 'Fill in the Blank' },
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'coding', label: 'Coding Challenge' },
  { value: 'interview', label: 'Interview Q&A' },
];

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'English', 'Economics'];

const SAMPLE_QUESTIONS: QuizQuestion[] = [
  {
    id: '1',
    type: 'mcq',
    question: 'What is the time complexity of Binary Search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correct_answer: 'O(log n)',
    explanation: 'Binary search divides the search space in half each step, resulting in O(log n) time complexity.',
  },
  {
    id: '2',
    type: 'mcq',
    question: 'Which data structure uses LIFO (Last In, First Out) order?',
    options: ['Queue', 'Linked List', 'Stack', 'Tree'],
    correct_answer: 'Stack',
    explanation: 'A stack follows LIFO — the last element added is the first to be removed.',
  },
  {
    id: '3',
    type: 'true_false',
    question: 'A binary tree can have at most 2 children per node.',
    options: ['True', 'False'],
    correct_answer: 'True',
    explanation: 'By definition, a binary tree node can have 0, 1, or at most 2 child nodes.',
  },
  {
    id: '4',
    type: 'mcq',
    question: 'What does SQL stand for?',
    options: ['Structured Query Language', 'Simple Query Logic', 'Standard Question Language', 'Sequential Queue Logic'],
    correct_answer: 'Structured Query Language',
    explanation: 'SQL stands for Structured Query Language, used to manage relational databases.',
  },
  {
    id: '5',
    type: 'mcq',
    question: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble Sort', 'Quick Sort', 'Insertion Sort', 'Selection Sort'],
    correct_answer: 'Quick Sort',
    explanation: 'QuickSort has an average-case time complexity of O(n log n), making it the most efficient among these.',
  },
];

interface ActiveQuiz {
  quiz: Quiz;
  currentIndex: number;
  answers: Record<string, string>;
  submitted: boolean;
  score: number;
  startTime: number;
}

export default function QuizGenerator() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const [form, setForm] = useState({
    title: '',
    subject: '',
    difficulty: 'intermediate',
    quiz_type: 'mcq',
    num_questions: 5,
    topic: '',
  });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    const { data } = await supabase.from('quizzes').select('*').order('created_at', { ascending: false });
    setQuizzes(data ?? []);
    setLoading(false);
  };

  const generateQuiz = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));

    const { data, error } = await supabase.from('quizzes').insert({
      title: form.title || `${form.subject} ${form.difficulty} Quiz`,
      subject: form.subject || null,
      difficulty: form.difficulty,
      quiz_type: form.quiz_type,
      questions: SAMPLE_QUESTIONS.slice(0, form.num_questions),
      total_questions: form.num_questions,
      time_limit_minutes: form.num_questions * 2,
    }).select().single();

    if (!error && data) {
      setQuizzes(prev => [data, ...prev]);
      setShowCreate(false);
      setForm({ title: '', subject: '', difficulty: 'intermediate', quiz_type: 'mcq', num_questions: 5, topic: '' });
    }
    setGenerating(false);
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz({
      quiz,
      currentIndex: 0,
      answers: {},
      submitted: false,
      score: 0,
      startTime: Date.now(),
    });
    setShowResult(false);
  };

  const answerQuestion = (answer: string) => {
    if (!activeQuiz || activeQuiz.submitted) return;
    setActiveQuiz(prev => prev ? {
      ...prev,
      answers: { ...prev.answers, [prev.currentIndex]: answer },
    } : null);
  };

  const nextQuestion = () => {
    if (!activeQuiz) return;
    if (activeQuiz.currentIndex < activeQuiz.quiz.questions.length - 1) {
      setActiveQuiz(prev => prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : null);
    } else {
      submitQuiz();
    }
  };

  const prevQuestion = () => {
    if (!activeQuiz || activeQuiz.currentIndex === 0) return;
    setActiveQuiz(prev => prev ? { ...prev, currentIndex: prev.currentIndex - 1 } : null);
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    const questions = activeQuiz.quiz.questions;
    let correct = 0;
    questions.forEach((q, i) => {
      if (activeQuiz.answers[i] === q.correct_answer) correct++;
    });
    const score = Math.round((correct / questions.length) * 100);
    const timeTaken = Math.round((Date.now() - activeQuiz.startTime) / 1000);

    setActiveQuiz(prev => prev ? { ...prev, submitted: true, score } : null);
    setShowResult(true);

    await supabase.from('quiz_attempts').insert({
      quiz_id: activeQuiz.quiz.id,
      score,
      total_questions: questions.length,
      time_taken_seconds: timeTaken,
      answers: Object.values(activeQuiz.answers),
    });
  };

  if (activeQuiz && !showResult) {
    const q = activeQuiz.quiz.questions[activeQuiz.currentIndex];
    const currentAnswer = activeQuiz.answers[activeQuiz.currentIndex];
    const progress = ((activeQuiz.currentIndex + 1) / activeQuiz.quiz.questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Quiz Header */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-white">{activeQuiz.quiz.title}</h2>
              <p className="text-xs text-slate-400 capitalize">{activeQuiz.quiz.difficulty} • {activeQuiz.quiz.quiz_type.replace('_', ' ')}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Q {activeQuiz.currentIndex + 1}/{activeQuiz.quiz.questions.length}</span>
              </div>
              <button onClick={() => setActiveQuiz(null)} className="btn-ghost p-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={activeQuiz.currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8"
        >
          <div className="flex items-start gap-4 mb-8">
            <div className="w-8 h-8 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary-400">{activeQuiz.currentIndex + 1}</span>
            </div>
            <h3 className="text-lg font-semibold text-white leading-relaxed">{q.question}</h3>
          </div>

          <div className="space-y-3">
            {q.options?.map((option, i) => (
              <button
                key={i}
                onClick={() => answerQuestion(option)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                  currentAnswer === option
                    ? 'bg-primary-600/20 border-primary-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/8 hover:border-white/20'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                  currentAnswer === option
                    ? 'border-primary-500 bg-primary-600 text-white'
                    : 'border-white/20 text-slate-500'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-sm">{option}</span>
                {currentAnswer === option && (
                  <CheckCircle2 className="w-4 h-4 text-primary-400 ml-auto flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={prevQuestion} disabled={activeQuiz.currentIndex === 0} className="btn-secondary">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <div className="flex gap-1">
            {activeQuiz.quiz.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveQuiz(prev => prev ? { ...prev, currentIndex: i } : null)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                  i === activeQuiz.currentIndex ? 'bg-primary-600 text-white' :
                  activeQuiz.answers[i] ? 'bg-accent-600/30 text-accent-300 border border-accent-500/30' :
                  'bg-white/5 text-slate-500 hover:bg-white/10'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={nextQuestion}
            disabled={!currentAnswer}
            className={activeQuiz.currentIndex === activeQuiz.quiz.questions.length - 1 ? 'btn-primary' : 'btn-primary'}
          >
            {activeQuiz.currentIndex === activeQuiz.quiz.questions.length - 1 ? (
              <><Trophy className="w-4 h-4" />Submit Quiz</>
            ) : (
              <>Next<ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (activeQuiz && showResult) {
    const questions = activeQuiz.quiz.questions;
    const correct = questions.filter((q, i) => activeQuiz.answers[i] === q.correct_answer).length;
    const scoreColor = activeQuiz.score >= 80 ? 'text-accent-400' : activeQuiz.score >= 60 ? 'text-warning-400' : 'text-error-400';

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center"
        >
          <div className={`text-6xl font-bold mb-2 ${scoreColor}`}>{activeQuiz.score}%</div>
          <h2 className="text-xl font-bold text-white mb-1">
            {activeQuiz.score >= 80 ? 'Excellent Work!' : activeQuiz.score >= 60 ? 'Good Effort!' : 'Keep Practicing!'}
          </h2>
          <p className="text-slate-400 mb-6">{correct} of {questions.length} correct answers</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">{correct}</div>
              <div className="text-xs text-accent-400">Correct</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">{questions.length - correct}</div>
              <div className="text-xs text-error-400">Incorrect</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">+{correct * 20}</div>
              <div className="text-xs text-primary-400">XP Earned</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => startQuiz(activeQuiz.quiz)} className="btn-secondary">
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            <button onClick={() => setActiveQuiz(null)} className="btn-primary">
              <BarChart3 className="w-4 h-4" />
              View All Quizzes
            </button>
          </div>
        </motion.div>

        {/* Answer Review */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-warning-400" />
            Answer Review
          </h3>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const isCorrect = activeQuiz.answers[i] === q.correct_answer;
              return (
                <div key={i} className={`p-4 rounded-xl border ${isCorrect ? 'bg-accent-500/5 border-accent-500/30' : 'bg-error-500/5 border-error-500/30'}`}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? <CheckCircle2 className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-error-400 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-2">{q.question}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-white/10 rounded-lg text-slate-400">Your answer: <span className={isCorrect ? 'text-accent-400' : 'text-error-400'}>{activeQuiz.answers[i] ?? 'Not answered'}</span></span>
                        {!isCorrect && <span className="px-2 py-1 bg-accent-500/10 border border-accent-500/20 rounded-lg text-slate-400">Correct: <span className="text-accent-400">{q.correct_answer}</span></span>}
                      </div>
                      {q.explanation && (
                        <p className="text-xs text-slate-500 mt-2 flex gap-1.5 items-start">
                          <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-primary-400" />
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">AI Quiz Generator</h2>
          <p className="text-sm text-slate-400">{quizzes.length} quizzes created</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Generate Quiz
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: ClipboardList, label: 'Total Quizzes', value: quizzes.length, color: 'from-primary-600 to-primary-700' },
          { icon: Trophy, label: 'Best Score', value: '96%', color: 'from-yellow-600 to-orange-600' },
          { icon: Target, label: 'Avg Score', value: '78%', color: 'from-accent-600 to-teal-600' },
          { icon: Zap, label: 'XP from Quizzes', value: '1,240', color: 'from-violet-600 to-violet-700' },
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

      {/* Quiz Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-44 glass-card shimmer" />)}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ClipboardList className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No quizzes yet</p>
          <p className="text-sm text-slate-600 mb-4">Generate your first AI quiz to test your knowledge</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Sparkles className="w-4 h-4" />
            Generate First Quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map(quiz => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-hover p-5 flex flex-col gap-4"
            >
              <div>
                <h3 className="font-semibold text-white mb-1">{quiz.title}</h3>
                <div className="flex items-center gap-2">
                  {quiz.subject && <span className="badge bg-primary-600/20 text-primary-300 border border-primary-500/20 text-xs">{quiz.subject}</span>}
                  <span className={`badge text-xs capitalize ${
                    quiz.difficulty === 'expert' ? 'bg-error-500/20 text-error-300 border border-error-500/20' :
                    quiz.difficulty === 'advanced' ? 'bg-warning-500/20 text-warning-300 border border-warning-500/20' :
                    quiz.difficulty === 'intermediate' ? 'bg-primary-600/20 text-primary-300 border border-primary-500/20' :
                    'bg-accent-600/20 text-accent-300 border border-accent-500/20'
                  }`}>{quiz.difficulty}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><ClipboardList className="w-3 h-3" />{quiz.total_questions} questions</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{quiz.time_limit_minutes}min</span>
                <span className="capitalize">{quiz.quiz_type.replace('_', ' ')}</span>
              </div>
              <button onClick={() => startQuiz(quiz)} className="btn-primary w-full text-sm py-2.5">
                <Play className="w-4 h-4" />
                Start Quiz
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Quiz Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowCreate(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-600/20 rounded-xl">
                    <Sparkles className="w-5 h-5 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Generate AI Quiz</h3>
                </div>
                <button onClick={() => setShowCreate(false)} className="btn-ghost p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Quiz Title</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g., CS Data Structures" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                    <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-field">
                      <option value="">Select subject</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Topic / Prompt</label>
                  <input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="e.g., Binary search trees and their operations" className="input-field" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {DIFFICULTIES.map(d => (
                        <button key={d} onClick={() => setForm(f => ({ ...f, difficulty: d }))}
                          className={`p-2 rounded-lg text-xs capitalize font-medium transition-all ${form.difficulty === d ? 'bg-primary-600/30 border border-primary-500/50 text-primary-300' : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Quiz Type</label>
                    <select value={form.quiz_type} onChange={e => setForm(f => ({ ...f, quiz_type: e.target.value }))} className="input-field">
                      {QUIZ_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Number of Questions: {form.num_questions}</label>
                  <input type="range" min="3" max="20" value={form.num_questions} onChange={e => setForm(f => ({ ...f, num_questions: +e.target.value }))} className="w-full accent-primary-500" />
                  <div className="flex justify-between text-xs text-slate-500 mt-1"><span>3</span><span>20</span></div>
                </div>

                <button onClick={generateQuiz} disabled={generating || !form.title} className="btn-primary w-full">
                  {generating ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {generating ? 'Generating Quiz...' : 'Generate Quiz with AI'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
