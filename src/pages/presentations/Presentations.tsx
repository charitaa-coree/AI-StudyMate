import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Presentation, Sparkles, Plus, FileUp, FileText, Image as ImageIcon, X, Loader2, Check, AlertCircle, Download } from 'lucide-react';

const THEMES = ['Professional', 'Modern', 'Academic', 'Creative', 'Minimal', 'Bold'];

const SOURCES = [
  { icon: FileText, label: 'From Topic', key: 'topic' },
  { icon: FileUp, label: 'From PDF', key: 'pdf' },
  { icon: ImageIcon, label: 'From Notes', key: 'notes' },
];

const SAMPLE_SLIDES = [
  { title: 'Introduction to Machine Learning', content: 'What is ML? Why does it matter? Brief overview of the field.' },
  { title: 'Types of Machine Learning', content: 'Supervised, Unsupervised, and Reinforcement Learning explained.' },
  { title: 'Key Algorithms', content: 'Linear Regression, Decision Trees, Neural Networks, and more.' },
  { title: 'Real-World Applications', content: 'Healthcare, Finance, Autonomous vehicles, Recommendation systems.' },
  { title: 'Future of ML', content: 'Trends, challenges, and opportunities in the field.' },
];

export default function Presentations() {
  const [showModal, setShowModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState('topic');
  const [selectedTheme, setSelectedTheme] = useState('Professional');
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to generate a presentation.');
      return;
    }
    setError('');
    setGenerating(true);
    setGenerated(false);
    try {
      await new Promise(r => setTimeout(r, 2000));
      setGenerated(true);
      setCurrentSlide(0);
    } catch {
      setError('Failed to generate presentation. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const openModal = (sourceKey: string) => {
    setSelectedSource(sourceKey);
    setShowModal(true);
    setGenerated(false);
    setError('');
    setTopic('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">AI Presentation Builder</h2>
          <p className="text-sm text-slate-400">Generate beautiful presentations from any content</p>
        </div>
        <button onClick={() => openModal('topic')} className="btn-primary">
          <Plus className="w-4 h-4" />
          New Presentation
        </button>
      </div>

      <div className="glass-card p-8 text-center border border-blue-500/20">
        <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
          <Presentation className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Generate from any source</h3>
        <p className="text-slate-400 mb-6">Upload a topic, PDF, notes or document to instantly create a presentation</p>
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
          {SOURCES.map(({ icon: Icon, label, key }) => (
            <button
              key={key}
              onClick={() => openModal(key)}
              className="flex flex-col items-center gap-2 p-4 glass-card hover:bg-white/10 transition-all"
            >
              <Icon className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-slate-300">{label}</span>
            </button>
          ))}
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-3">Themes</p>
          <div className="flex flex-wrap justify-center gap-2">
            {THEMES.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTheme(t)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  selectedTheme === t
                    ? 'bg-blue-600/20 border border-blue-500/50 text-blue-300'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => openModal('topic')} className="btn-primary mt-6">
          <Sparkles className="w-4 h-4" />
          Generate Presentation
        </button>
      </div>

      {/* Generation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl glass-card p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-xl">
                    <Presentation className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {generated ? 'Presentation Preview' : 'Generate Presentation'}
                  </h3>
                </div>
                <button onClick={() => setShowModal(false)} className="btn-ghost p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {!generated ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {selectedSource === 'topic' ? 'Enter your topic' : selectedSource === 'pdf' ? 'Upload PDF' : 'Select notes'}
                    </label>
                    {selectedSource === 'topic' ? (
                      <input
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder="e.g., Introduction to Machine Learning"
                        className="input-field"
                        autoFocus
                      />
                    ) : (
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500/50 transition-all">
                        <FileUp className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">Click to upload</p>
                        <input
                          type="file"
                          className="hidden"
                          onChange={e => setTopic(e.target.files?.[0]?.name ?? '')}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Theme: {selectedTheme}</label>
                    <div className="flex flex-wrap gap-2">
                      {THEMES.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTheme(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                            selectedTheme === t
                              ? 'bg-blue-600/20 border border-blue-500/50 text-blue-300'
                              : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={generating || !topic.trim()}
                    className="btn-primary w-full"
                  >
                    {generating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Generating slides...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Generate Presentation</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    Generated {SAMPLE_SLIDES.length} slides on "{topic}"
                  </div>

                  {/* Slide Preview */}
                  <div className="glass-card p-8 min-h-48 flex flex-col items-center justify-center text-center">
                    <div className="text-xs text-slate-500 mb-2">Slide {currentSlide + 1} of {SAMPLE_SLIDES.length}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{SAMPLE_SLIDES[currentSlide].title}</h3>
                    <p className="text-sm text-slate-400 max-w-md">{SAMPLE_SLIDES[currentSlide].content}</p>
                  </div>

                  {/* Slide Navigation */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentSlide(s => Math.max(0, s - 1))}
                      disabled={currentSlide === 0}
                      className="btn-secondary text-sm disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1.5">
                      {SAMPLE_SLIDES.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                            i === currentSlide ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentSlide(s => Math.min(SAMPLE_SLIDES.length - 1, s + 1))}
                      disabled={currentSlide === SAMPLE_SLIDES.length - 1}
                      className="btn-secondary text-sm disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(SAMPLE_SLIDES.map((s, i) => `Slide ${i+1}: ${s.title}\n${s.content}`).join('\n\n'))}
                      className="btn-secondary flex-1 text-sm"
                    >
                      <Check className="w-4 h-4" /> Copy Outline
                    </button>
                    <button className="btn-primary flex-1 text-sm">
                      <Download className="w-4 h-4" /> Download PPTX
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
