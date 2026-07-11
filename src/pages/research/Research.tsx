import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, Brain, BookOpen, ExternalLink, Sparkles, X, Loader2, Check, AlertCircle } from 'lucide-react';

const RECENT_PAPERS = [
  { title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, citations: 82000, tags: ['NLP', 'Transformer'], url: 'https://arxiv.org/abs/1706.03762' },
  { title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, citations: 45000, tags: ['NLP', 'BERT'], url: 'https://arxiv.org/abs/1810.04805' },
  { title: 'An Image is Worth 16x16 Words', authors: 'Dosovitskiy et al.', year: 2020, citations: 18000, tags: ['Vision', 'ViT'], url: 'https://arxiv.org/abs/2010.11929' },
  { title: 'Language Models are Few-Shot Learners', authors: 'Brown et al.', year: 2020, citations: 35000, tags: ['GPT-3', 'LLM'], url: 'https://arxiv.org/abs/2005.14165' },
];

const ACTIONS = [
  { icon: FileSearch, label: 'Summarize Paper', desc: 'Upload a paper for AI summary', key: 'summarize' },
  { icon: Brain, label: 'Compare Papers', desc: 'Compare multiple research papers', key: 'compare' },
  { icon: BookOpen, label: 'Literature Review', desc: 'Generate a literature review', key: 'review' },
];

const AI_OUTPUTS: Record<string, string> = {
  summarize: `## Paper Summary

**Paper:** Attention Is All You Need (Vaswani et al., 2017)

**Key Contribution:**
Introduced the Transformer architecture, which relies entirely on self-attention mechanisms, eliminating the need for recurrence and convolution in sequence transduction tasks.

**Key Findings:**
1. Self-attention allows modeling dependencies regardless of distance
2. Multi-head attention captures different relationship types simultaneously
3. Positional encoding provides sequence order information
4. Achieves state-of-the-art results on translation tasks with significantly less training time

**Impact:**
This paper revolutionized NLP and became the foundation for models like BERT, GPT, and T5. The Transformer architecture has since been applied to vision, audio, and multimodal tasks.

**Citation (APA):**
Vaswani, A., et al. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30.`,

  compare: `## Paper Comparison

| Aspect | Transformer (2017) | BERT (2018) | GPT-3 (2020) |
|--------|-------------------|-------------|--------------|
| Architecture | Encoder-Decoder | Encoder-only | Decoder-only |
| Parameters | 65M | 340M | 175B |
| Training | Supervised | Self-supervised | Self-supervised |
| Task | Translation | Understanding | Generation |

**Key Differences:**
- **Transformer** introduced the attention mechanism
- **BERT** focused on bidirectional understanding via masked language modeling
- **GPT-3** scaled up the decoder-only architecture for few-shot generation

**Evolution:** Transformer → BERT (understanding) → GPT-3 (generation) shows the divergence of the original architecture into specialized models.`,

  review: `## Literature Review: Transformer Architectures

### Introduction
The introduction of the Transformer architecture by Vaswani et al. (2017) marked a paradigm shift in natural language processing, replacing recurrent neural networks with self-attention mechanisms.

### Key Developments

**1. Encoder-Decoder Models (2017-2018)**
The original Transformer used an encoder-decoder structure for sequence-to-sequence tasks like translation. This established the foundation for attention-based models.

**2. Encoder-Only Models (2018-2019)**
BERT (Devlin et al., 2018) demonstrated that bidirectional pre-training on masked language modeling produces powerful representations for understanding tasks.

**3. Decoder-Only Models (2019-2020)**
GPT series (Radford et al., 2019; Brown et al., 2020) showed that autoregressive language models, when scaled sufficiently, can perform few-shot learning across diverse tasks.

**4. Vision Transformers (2020-2021)**
ViT (Dosovitskiy et al., 2020) applied the Transformer to image classification, demonstrating that attention mechanisms generalize beyond text.

### Conclusion
The Transformer architecture has become the dominant paradigm across modalities. Future directions include efficiency improvements, multimodal integration, and scaling laws research.`,
};

export default function Research() {
  const [showModal, setShowModal] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleAction = async (key: string) => {
    setActiveAction(key);
    setShowModal(true);
    setLoading(true);
    setError('');
    setOutput('');
    try {
      await new Promise(r => setTimeout(r, 1500));
      setOutput(AI_OUTPUTS[key] ?? 'AI analysis complete. Results are ready for your review.');
    } catch {
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openPaper = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">AI Research Assistant</h2>
        <p className="text-sm text-slate-400">Summarize, compare, and cite research papers with AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ACTIONS.map(({ icon: Icon, label, desc, key }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleAction(key)}
            className={`flex flex-col gap-3 p-5 rounded-2xl border border-white/10 text-left transition-all ${
              key === 'summarize' ? 'bg-gradient-to-br from-blue-600 to-blue-700' :
              key === 'compare' ? 'bg-gradient-to-br from-green-600 to-teal-600' :
              'bg-gradient-to-br from-amber-600 to-orange-600'
            }`}
          >
            <div className="p-2.5 bg-white/15 rounded-xl w-fit">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white">{label}</div>
              <div className="text-white/60 text-sm mt-0.5">{desc}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-white">Trending Research Papers</h3>
        </div>
        <div className="space-y-3">
          {RECENT_PAPERS.map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{p.title}</p>
                <p className="text-xs text-slate-500">{p.authors} • {p.year} • {p.citations.toLocaleString()} citations</p>
              </div>
              <div className="hidden md:flex gap-1">
                {p.tags.map(t => <span key={t} className="badge bg-white/10 text-slate-400 text-xs">{t}</span>)}
              </div>
              <button
                onClick={() => handleAction('summarize')}
                className="btn-ghost p-2 text-xs"
                title="Summarize with AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </button>
              <button
                onClick={() => openPaper(p.url)}
                className="btn-ghost p-2"
                title="Open paper"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Output Modal */}
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
              className="w-full max-w-2xl glass-card p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-xl">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white capitalize">
                    {activeAction === 'summarize' ? 'Paper Summary' : activeAction === 'compare' ? 'Paper Comparison' : 'Literature Review'}
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

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  <p className="text-sm text-slate-400 animate-pulse">Analyzing research papers...</p>
                </div>
              ) : output ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    Analysis complete!
                  </div>
                  <div className="glass-card p-5">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed">{output}</pre>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(output)}
                    className="btn-secondary w-full text-sm"
                  >
                    <Check className="w-4 h-4" /> Copy to clipboard
                  </button>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
