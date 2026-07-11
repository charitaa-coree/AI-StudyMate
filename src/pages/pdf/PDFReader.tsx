import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileUp, Search, Sparkles, BookOpen, MessageSquare, Highlighter,
  List, Globe, Download, ChevronRight, Bookmark, X, Maximize2,
  ZoomIn, ZoomOut, RotateCcw, FileText, Brain, ChevronDown
} from 'lucide-react';

const AI_ACTIONS = [
  { icon: List, label: 'Summarize', key: 'summarize' },
  { icon: BookOpen, label: 'Explain', key: 'explain' },
  { icon: MessageSquare, label: 'Ask AI', key: 'ask' },
  { icon: Globe, label: 'Translate', key: 'translate' },
  { icon: Highlighter, label: 'Highlight', key: 'highlight' },
  { icon: Bookmark, label: 'Bookmark', key: 'bookmark' },
];

const SAMPLE_PDF_TEXT = `Chapter 3: Neural Networks and Deep Learning

3.1 Introduction to Artificial Neural Networks

Artificial Neural Networks (ANNs) are computational systems inspired by biological neural networks. They consist of interconnected nodes (neurons) organized in layers that process information using connectionist approaches.

3.2 Architecture

The typical neural network consists of:
• Input Layer: Receives raw data
• Hidden Layers: Intermediate processing layers
• Output Layer: Produces the final prediction

3.3 Backpropagation

Backpropagation is the key algorithm for training neural networks. It computes the gradient of the loss function with respect to each weight using the chain rule.

The weight update formula: w = w - α · ∇L(w)

where α is the learning rate and ∇L(w) is the gradient of the loss.

3.4 Activation Functions

Common activation functions include:
• ReLU: f(x) = max(0, x)
• Sigmoid: f(x) = 1/(1+e^-x)
• Tanh: f(x) = (e^x - e^-x)/(e^x + e^-x)

3.5 Regularization Techniques

To prevent overfitting:
• Dropout: Randomly deactivates neurons during training
• L1/L2 Regularization: Adds penalty to weights
• Batch Normalization: Normalizes layer inputs`;

const AI_RESPONSES: Record<string, string> = {
  summarize: `## Chapter 3 Summary

**Topic:** Neural Networks and Deep Learning

**Key Points:**
1. ANNs are inspired by biological neural networks with interconnected nodes
2. Architecture: Input → Hidden Layers → Output
3. **Backpropagation** trains networks using gradient descent: w = w - α·∇L(w)
4. Common activations: ReLU, Sigmoid, Tanh
5. Regularization prevents overfitting: Dropout, L1/L2, Batch Norm

**Reading Time:** ~8 minutes
**Difficulty:** Intermediate`,
  explain: `## Explanation: Selected Text

**Backpropagation** is like giving feedback to a student after an exam:

1. **Forward Pass**: The network makes a prediction
2. **Calculate Error**: Compare prediction to actual answer
3. **Backward Pass**: Trace back through the network, adjusting each weight based on its contribution to the error

**The key formula: w = w - α · ∇L(w)**
- w = current weight
- α = learning rate (how big each step is)
- ∇L(w) = direction of steepest error increase

Think of it as rolling a ball downhill to find the lowest point (minimum loss).`,
  ask: `**Q: What is the difference between ReLU and Sigmoid?**

**ReLU (Rectified Linear Unit):**
- Formula: f(x) = max(0, x)
- Output range: [0, ∞)
- **Pros:** Fast to compute, no vanishing gradient for positive inputs
- **Cons:** Can cause "dying ReLU" problem (neurons output 0 and stop learning)
- **Best for:** Hidden layers in most deep networks

**Sigmoid:**
- Formula: f(x) = 1/(1+e^-x)
- Output range: (0, 1)
- **Pros:** Smooth gradient, outputs probabilities
- **Cons:** Vanishing gradient problem for very large/small values
- **Best for:** Binary classification output layers

**Modern preference:** ReLU in hidden layers, Sigmoid only at output for binary classification.`,
};

export default function PDFReader() {
  const [uploaded, setUploaded] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [activeAction, setActiveAction] = useState('');
  const [zoom, setZoom] = useState(100);
  const [question, setQuestion] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);

  const handleAction = async (key: string) => {
    setAiLoading(true);
    setActiveAction(key);
    setShowAiPanel(true);
    await new Promise(r => setTimeout(r, 1500));
    setAiResponse(AI_RESPONSES[key] ?? `## AI Analysis\n\nAnalysis complete for the selected section.\n\nKey insights extracted and ready for your review.`);
    setAiLoading(false);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setAiLoading(true);
    setShowAiPanel(true);
    await new Promise(r => setTimeout(r, 1500));
    setAiResponse(`**Q: ${question}**\n\n${AI_RESPONSES.ask}`);
    setQuestion('');
    setAiLoading(false);
  };

  if (!uploaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-primary-600/20 border border-primary-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
            <FileUp className="w-10 h-10 text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Smart PDF Reader</h2>
          <p className="text-slate-400 mb-8">Upload any PDF and our AI will help you understand, summarize, and interact with the content.</p>
          <div
            onClick={() => setUploaded(true)}
            className="border-2 border-dashed border-white/20 rounded-2xl p-10 cursor-pointer hover:border-primary-500/50 hover:bg-primary-600/5 transition-all group"
          >
            <FileUp className="w-8 h-8 text-slate-500 group-hover:text-primary-400 mx-auto mb-3 transition-colors" />
            <p className="text-slate-400 mb-1">Click to upload or drag & drop</p>
            <p className="text-xs text-slate-600">PDF, DOCX, PPT up to 50MB</p>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {['Summarize Chapters', 'Ask Questions', 'Translate Content'].map(f => (
              <div key={f} className="glass-card p-3 text-center">
                <Sparkles className="w-4 h-4 text-primary-400 mx-auto mb-1.5" />
                <p className="text-xs text-slate-300">{f}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setUploaded(true)} className="btn-secondary mt-4 text-sm">
            Try with sample document
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* PDF Viewer */}
      <div className="flex-1 flex flex-col glass-card min-w-0">
        {/* PDF Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm">
              <FileText className="w-4 h-4 text-primary-400" />
              <span className="text-white font-medium truncate max-w-48">Deep Learning Fundamentals.pdf</span>
            </div>
            <span className="text-xs text-slate-500">Chapter 3 • Page 47</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="btn-ghost p-2">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="btn-ghost p-2">
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/10" />
            <button className="btn-ghost p-2"><Download className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Quick AI Actions */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 overflow-x-auto">
          {AI_ACTIONS.map(({ icon: Icon, label, key }) => (
            <button
              key={key}
              onClick={() => handleAction(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeAction === key && showAiPanel ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="max-w-2xl mx-auto"
            style={{ fontSize: zoom / 100 + 'rem' }}
          >
            <div className="glass-card p-8 text-slate-300 leading-relaxed whitespace-pre-line text-sm font-sans">
              {SAMPLE_PDF_TEXT}
            </div>
          </div>
        </div>

        {/* Ask Question Bar */}
        <div className="p-4 border-t border-white/8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Brain className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
                placeholder="Ask AI anything about this document..."
                className="input-field pl-10 py-3 text-sm"
              />
            </div>
            <button onClick={handleAsk} disabled={!question.trim()} className="btn-primary">
              <Sparkles className="w-4 h-4" />
              Ask
            </button>
          </div>
        </div>
      </div>

      {/* AI Panel */}
      {showAiPanel && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 glass-card flex flex-col flex-shrink-0"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/8">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-600/20 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              </div>
              <span className="text-sm font-semibold text-white">AI Analysis</span>
            </div>
            <button onClick={() => setShowAiPanel(false)} className="btn-ghost p-1.5">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {aiLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-sm text-slate-400 animate-pulse">Analyzing...</p>
              </div>
            ) : (
              <div className="text-sm text-slate-300 leading-relaxed">
                <pre className="whitespace-pre-wrap font-sans">{aiResponse}</pre>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
