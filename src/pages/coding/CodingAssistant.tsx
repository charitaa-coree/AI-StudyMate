import { useState } from 'react';
import {
  Play, Copy, Save, Sparkles, Bug, Wand2,
  FileCode, BookOpen,
  Lightbulb, Terminal, Check, ArrowRight, Brain
} from 'lucide-react';

const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'Go', 'Rust', 'SQL', 'HTML/CSS'];

const ACTIONS = [
  { icon: Bug, label: 'Debug Code', key: 'debug', color: 'text-error-400' },
  { icon: Wand2, label: 'Optimize', key: 'optimize', color: 'text-primary-400' },
  { icon: BookOpen, label: 'Explain', key: 'explain', color: 'text-accent-400' },
  { icon: ArrowRight, label: 'Convert', key: 'convert', color: 'text-warning-400' },
  { icon: Lightbulb, label: 'Suggest', key: 'suggest', color: 'text-violet-400' },
  { icon: Check, label: 'Review', key: 'review', color: 'text-teal-400' },
];

const SAMPLE_CODE: Record<string, string> = {
  Python: `def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence up to n terms."""
    if n <= 0:
        return []
    if n == 1:
        return [0]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    
    return fib

# Generate first 10 Fibonacci numbers
result = fibonacci(10)
print(f"Fibonacci sequence: {result}")
# Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
  JavaScript: `// Async data fetcher with retry logic
async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return await response.json();
    } catch (error) {
      lastError = error;
      console.warn(\`Attempt \${attempt} failed: \${error.message}\`);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }
  throw new Error(\`Failed after \${maxRetries} attempts: \${lastError.message}\`);
}`,
};

const AI_OUTPUTS: Record<string, string> = {
  debug: `## Debug Analysis

**No critical bugs found!** Your code looks clean. Here are minor suggestions:

1. **Line 2**: Add input validation for negative numbers
   \`\`\`python
   if not isinstance(n, int) or n < 0:
       raise ValueError("n must be a non-negative integer")
   \`\`\`

2. **Performance**: For large n, consider using a generator:
   \`\`\`python
   def fibonacci_gen(n):
       a, b = 0, 1
       for _ in range(n):
           yield a
           a, b = b, a + b
   \`\`\`

**Code Quality Score: 8.5/10** ✓`,
  explain: `## Code Explanation

### What this code does:

This function generates the **Fibonacci sequence** — a series of numbers where each number is the sum of the two preceding ones.

**How it works:**
1. Handles edge cases (n ≤ 0, n = 1)
2. Seeds the list with [0, 1]
3. Iterates from index 2 to n-1
4. Each number is the sum of the previous two
5. Returns the complete sequence

**Example trace for n=5:**
- Start: [0, 1]
- i=2: [0, 1, 1] (0+1=1)
- i=3: [0, 1, 1, 2] (1+1=2)  
- i=4: [0, 1, 1, 2, 3] (1+2=3)

**Time Complexity:** O(n)
**Space Complexity:** O(n)`,
  optimize: `## Optimized Version

The original is good, but here's an optimized version using space-efficient approach:

\`\`\`python
def fibonacci_optimized(n: int) -> list[int]:
    """Space-optimized Fibonacci with memoization."""
    if n <= 0: return []
    if n == 1: return [0]
    
    result = [0] * n
    result[1] = 1
    
    for i in range(2, n):
        result[i] = result[i-1] + result[i-2]
    
    return result

# For very large n, use generator
from typing import Generator
def fib_stream(n: int) -> Generator[int, None, None]:
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
\`\`\`

**Improvements:**
- Pre-allocates list size (avoids append overhead)
- Generator version for O(1) space`,
};

export default function CodingAssistant() {
  const [language, setLanguage] = useState('Python');
  const [code, setCode] = useState(SAMPLE_CODE['Python']);
  const [aiOutput, setAiOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState('');
  const [copied, setCopied] = useState(false);

  const runAction = async (action: string) => {
    setLoading(true);
    setActiveAction(action);
    setAiOutput('');
    await new Promise(r => setTimeout(r, 1500));
    setAiOutput(AI_OUTPUTS[action] ?? `## ${action.charAt(0).toUpperCase() + action.slice(1)} Result\n\nAI analysis complete! Your code has been reviewed and optimized suggestions are ready.\n\n**Key Findings:**\n- Code structure is clean and readable\n- Logic is correct and efficient\n- Documentation could be improved\n\n**Suggestions:**\n1. Add type hints for better IDE support\n2. Consider adding unit tests\n3. Document edge cases`);
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={e => { setLanguage(e.target.value); setCode(SAMPLE_CODE[e.target.value] ?? '// Write your code here\n'); }}
            className="input-field py-2 text-sm w-40"
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            AI Ready
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={copyCode} className="btn-secondary text-xs py-2 px-3">
            {copied ? <><Check className="w-3.5 h-3.5 text-accent-400" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
          </button>
          <button className="btn-secondary text-xs py-2 px-3">
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button className="btn-primary text-xs py-2 px-3">
            <Play className="w-3.5 h-3.5" />
            Run
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-slate-400 font-mono">main.{language.toLowerCase() === 'python' ? 'py' : language.toLowerCase() === 'javascript' ? 'js' : language.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <FileCode className="w-3.5 h-3.5" />
              {language}
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-0 left-0 w-10 h-full bg-white/3 border-r border-white/5 flex flex-col pt-4 items-end pr-2 pointer-events-none">
              {code.split('\n').map((_, i) => (
                <span key={i} className="text-xs text-slate-700 leading-6 font-mono">{i + 1}</span>
              ))}
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full bg-transparent text-sm font-mono text-slate-200 p-4 pl-12 focus:outline-none resize-none leading-6"
              rows={Math.max(code.split('\n').length + 2, 20)}
              spellCheck={false}
            />
          </div>
        </div>

        {/* AI Output */}
        <div className="glass-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-600/20 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              </div>
              <span className="text-sm font-medium text-white">AI Assistant</span>
            </div>
            {aiOutput && (
              <button onClick={() => navigator.clipboard.writeText(aiOutput)} className="btn-ghost p-1.5 text-xs">
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex-1 p-4 overflow-y-auto min-h-64">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary-400" />
                  </div>
                </div>
                <p className="text-sm text-slate-400 animate-pulse">
                  {activeAction === 'debug' ? 'Analyzing for bugs...' :
                   activeAction === 'explain' ? 'Generating explanation...' :
                   activeAction === 'optimize' ? 'Optimizing code...' :
                   'Processing...'}
                </p>
              </div>
            ) : aiOutput ? (
              <div className="text-sm text-slate-300 leading-relaxed prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans">{aiOutput}</pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <Terminal className="w-10 h-10 text-slate-700" />
                <p className="text-slate-400 text-sm font-medium">Select an AI action</p>
                <p className="text-xs text-slate-600">Choose from the actions below to analyze your code</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Actions */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {ACTIONS.map(({ icon: Icon, label, key, color }) => (
          <button
            key={key}
            onClick={() => runAction(key)}
            disabled={loading}
            className={`flex flex-col items-center gap-2 p-4 glass-card-hover transition-all disabled:opacity-50 ${activeAction === key && aiOutput ? 'border-primary-500/40 bg-primary-600/10' : ''}`}
          >
            <div className={`p-2 rounded-lg bg-white/5 ${loading && activeAction === key ? 'animate-pulse' : ''}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <span className="text-xs font-medium text-slate-300">{label}</span>
          </button>
        ))}
      </div>

      {/* Practice Problems */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary-400" />
          Practice Problems
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Table'], xp: 50 },
            { title: 'Merge Sort', difficulty: 'Medium', tags: ['Sorting', 'Recursion'], xp: 100 },
            { title: 'LRU Cache', difficulty: 'Hard', tags: ['Design', 'Linked List'], xp: 200 },
          ].map(p => (
            <div key={p.title} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">{p.title}</h4>
                <span className={`badge text-xs ${p.difficulty === 'Easy' ? 'bg-accent-500/20 text-accent-300 border-accent-500/20' : p.difficulty === 'Medium' ? 'bg-warning-500/20 text-warning-300 border-warning-500/20' : 'bg-error-500/20 text-error-300 border-error-500/20'}`}>
                  {p.difficulty}
                </span>
              </div>
              <div className="flex gap-1 flex-wrap mb-2">
                {p.tags.map(t => <span key={t} className="badge bg-white/5 text-slate-500 text-xs">{t}</span>)}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>+{p.xp} XP</span>
                <span className="text-primary-400 hover:underline cursor-pointer">Solve →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
