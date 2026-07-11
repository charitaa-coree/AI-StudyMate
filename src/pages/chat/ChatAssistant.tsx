import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Plus, Brain, Sparkles, Copy, ThumbsUp, ThumbsDown,
  RefreshCw, Code, FileText, Mic, MicOff, Paperclip,
  ChevronDown, MessageSquare, Trash2, Search,
  Bot, User, BookOpen, Calculator, Languages, Lightbulb
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
  message_count: number;
}

const AI_MODELS = [
  { id: 'gpt-4', label: 'GPT-4', color: 'text-green-400' },
  { id: 'gpt-3.5', label: 'GPT-3.5', color: 'text-blue-400' },
  { id: 'gemini', label: 'Gemini Pro', color: 'text-yellow-400' },
  { id: 'claude', label: 'Claude 3', color: 'text-violet-400' },
];

const PROMPT_STARTERS = [
  { icon: BookOpen, text: 'Explain quantum entanglement simply', category: 'Explain' },
  { icon: Calculator, text: 'Solve this integral: ∫x²·sin(x)dx', category: 'Math' },
  { icon: Code, text: 'Write a binary search algorithm in Python', category: 'Code' },
  { icon: Languages, text: 'Translate and explain this phrase', category: 'Language' },
  { icon: Lightbulb, text: 'Create a study plan for my exam in 3 days', category: 'Plan' },
  { icon: FileText, text: 'Summarize the key points of evolution theory', category: 'Summary' },
];

const AI_RESPONSES: Record<string, string> = {
  explain: `## Quantum Entanglement Explained Simply

Imagine you have two magical coins. When you flip one and it lands heads, the other one **instantly** lands tails — no matter how far apart they are.

**The key points:**
- Two particles become "entangled" when they interact
- Measuring one particle instantly affects the other
- This happens even across vast distances
- Einstein called it "spooky action at a distance"

**Why it matters:**
- Quantum computing uses entanglement to process information
- Quantum cryptography uses it for ultra-secure communication
- It challenges our understanding of reality itself

> "If quantum mechanics hasn't profoundly shocked you, you haven't understood it yet." — Niels Bohr

Want me to dive deeper into any aspect? I can explain the math, give more examples, or cover practical applications!`,
};

function formatMessage(content: string) {
  return content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => `<pre class="code-block my-3"><code class="language-${lang ?? 'text'} text-green-300">${code.trim()}</code></pre>`)
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/^## (.*)/gm, '<h2 class="text-lg font-bold text-white mt-4 mb-2">$1</h2>')
    .replace(/^### (.*)/gm, '<h3 class="text-base font-semibold text-white mt-3 mb-1.5">$1</h3>')
    .replace(/^> (.*)/gm, '<blockquote class="border-l-2 border-blue-500 pl-3 my-2 text-slate-400 italic">$1</blockquote>')
    .replace(/^- (.*)/gm, '<li class="ml-4 text-slate-300 text-sm list-disc">$1</li>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>');
}

export default function ChatAssistant() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const { data } = await supabase
      .from('chat_conversations')
      .select('id,title,updated_at,message_count')
      .order('updated_at', { ascending: false })
      .limit(20);
    setConversations(data ?? []);
  };

  const createNewConversation = async () => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({ title: 'New Conversation', model: selectedModel.id })
      .select()
      .single();
    if (!error && data) {
      setActiveConv(data);
      setMessages([]);
      await loadConversations();
    }
  };

  const loadMessages = async (convId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at');
    setMessages(data ?? []);
  };

  const selectConversation = async (conv: Conversation) => {
    setActiveConv(conv);
    await loadMessages(conv.id);
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    const lower = userMessage.toLowerCase();
    if (lower.includes('quantum') || (lower.includes('explain') && !lower.includes('code'))) return AI_RESPONSES.explain;
    if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey')) {
      return `Hello! I'm your AI StudyMate, powered by ${selectedModel.label}. I'm ready to help you learn anything — from quantum physics to Python coding to essay writing. What topic shall we explore today?`;
    }
    if (lower.includes('code') || lower.includes('python') || lower.includes('javascript') || lower.includes('binary') || lower.includes('algorithm')) {
      return `## Code Solution\n\nHere's a well-structured example:\n\n\`\`\`python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\n# Example usage\narr = [1, 3, 5, 7, 9, 11, 13]\nresult = binary_search(arr, 7)\nprint(f"Found at index: {result}")  # Output: 3\n\`\`\`\n\n**Time Complexity:** O(log n)\n**Space Complexity:** O(1)\n\nWould you like me to explain how this works step by step?`;
    }
    if (lower.includes('math') || lower.includes('calculus') || lower.includes('integral') || lower.includes('solve')) {
      return `## Math Solution\n\n**Problem:** ∫x²·sin(x)dx\n\nUsing **Integration by Parts** twice:\n\nLet u = x², dv = sin(x)dx\nThen du = 2x dx, v = -cos(x)\n\n**Step 1:**\n∫x²sin(x)dx = **-x²cos(x)** + 2∫x·cos(x)dx\n\n**Step 2:** Apply IBP again for ∫x·cos(x)dx\nLet u = x, dv = cos(x)dx\n∫x·cos(x)dx = **x·sin(x) + cos(x)** + C\n\n**Final Answer:**\n∫x²sin(x)dx = -x²cos(x) + 2x·sin(x) + 2cos(x) + C\n\n*Want me to verify this by differentiation?*`;
    }
    if (lower.includes('study plan') || lower.includes('plan') || lower.includes('exam')) {
      return `## 3-Day Study Plan\n\n**Day 1: Foundation**\n- Review core concepts (2 hours)\n- Create summary notes (1 hour)\n- Practice basic problems (1 hour)\n\n**Day 2: Deep Dive**\n- Focus on weak areas (2 hours)\n- Take practice quiz (1 hour)\n- Review mistakes (30 min)\n\n**Day 3: Final Review**\n- Quick review of all topics (2 hours)\n- Mock test under exam conditions (2 hours)\n- Last-minute formula review (30 min)\n\n**Tips:**\n- Use Pomodoro technique (25 min focus, 5 min break)\n- Get 8 hours of sleep each night\n- Stay hydrated and eat well\n\nGood luck with your exam!`;
    }
    if (lower.includes('summar') || lower.includes('evolution')) {
      return `## Summary: Theory of Evolution\n\n**Key Points:**\n- Evolution is the process by which species change over generations through natural selection\n- Proposed by Charles Darwin in "On the Origin of Species" (1859)\n- Organisms with favorable traits survive and reproduce more successfully\n- Genetic variations arise through mutation and recombination\n\n**Core Mechanisms:**\n1. **Natural Selection** — Traits that improve survival are passed on\n2. **Genetic Drift** — Random changes in gene frequency\n3. **Mutation** — Source of new genetic variation\n4. **Gene Flow** — Transfer of genes between populations\n\n**Evidence:**\n- Fossil record showing gradual changes\n- DNA similarities between species\n- Anatomical homologies (similar structures in different species)\n- Observed microevolution in real time\n\nWant me to elaborate on any of these points?`;
    }
    return `I understand your question about **"${userMessage.slice(0, 50)}..."**\n\nAs your AI tutor powered by ${selectedModel.label}, I can provide a comprehensive explanation.\n\n**Key concepts to understand:**\n- This is a fundamental topic that connects to broader principles\n- Understanding the context helps build a stronger foundation\n- Practice problems can reinforce this knowledge\n\n**My recommendation:** Break this topic into smaller parts and tackle each one systematically. Would you like me to create a structured study plan for this?\n\nFeel free to ask follow-up questions — I'm here to help!`;
  };

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    setInput('');

    let conv: Conversation | null = activeConv;
    if (!conv) {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({ title: text.slice(0, 50), model: selectedModel.id })
        .select()
        .single();
      if (error || !data) return;
      conv = data as Conversation;
      setActiveConv(data as Conversation);
    }
    if (!conv) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setAiTyping(true);
    setLoading(true);

    await supabase.from('chat_messages').insert({
      conversation_id: conv.id,
      role: 'user',
      content: text,
    });

    if (messages.length === 0) {
      await supabase.from('chat_conversations').update({
        title: text.slice(0, 60),
        updated_at: new Date().toISOString(),
        message_count: 1,
      }).eq('id', conv.id);
    }

    const aiResponse = await generateAIResponse(text);
    setAiTyping(false);

    const aiMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: aiResponse,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);

    await supabase.from('chat_messages').insert({
      conversation_id: conv.id,
      role: 'assistant',
      content: aiResponse,
    });

    await supabase.from('chat_conversations').update({
      updated_at: new Date().toISOString(),
      message_count: messages.length + 2,
    }).eq('id', conv.id);

    await loadConversations();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handlePromptClick = (promptText: string) => {
    setInput(promptText);
    sendMessage(promptText);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from('chat_conversations').delete().eq('id', id);
    if (!error) {
      if (activeConv?.id === id) {
        setActiveConv(null);
        setMessages([]);
      }
      await loadConversations();
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-3 -mt-2">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 overflow-hidden"
          >
            <div className="w-60 h-full glass-card flex flex-col">
              <div className="p-3 border-b border-white/10">
                <button onClick={createNewConversation} className="btn-primary w-full text-sm py-2.5">
                  <Plus className="w-4 h-4" />
                  New Chat
                </button>
              </div>
              <div className="p-3 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input placeholder="Search chats..." className="input-field pl-9 py-2 text-xs" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No conversations yet</p>
                  </div>
                ) : (
                  conversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => selectConversation(conv)}
                      className={`group flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all ${
                        activeConv?.id === conv.id ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{conv.title}</p>
                        <p className="text-xs text-slate-600">{conv.message_count} msgs</p>
                      </div>
                      <button
                        onClick={e => deleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col glass-card min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="btn-ghost p-2"
              title="Toggle conversations"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <div className="p-2 bg-blue-600/20 rounded-xl border border-blue-500/30">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {activeConv?.title ?? 'AI StudyMate Chat'}
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-slate-500">Online • {selectedModel.label}</span>
              </div>
            </div>
          </div>

          {/* Model Selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelMenu(!showModelMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10 transition-all"
            >
              <Sparkles className={`w-3 h-3 ${selectedModel.color}`} />
              <span className="text-slate-300">{selectedModel.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
            <AnimatePresence>
              {showModelMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute right-0 top-full mt-1 w-40 glass-card p-1.5 z-10"
                >
                  {AI_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m); setShowModelMenu(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${selectedModel.id === m.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                      <Sparkles className={`w-3 h-3 ${m.color}`} />
                      {m.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
          {messages.length === 0 && !activeConv && (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6"
              >
                <Brain className="w-8 h-8 text-blue-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">How can I help you learn today?</h3>
              <p className="text-slate-400 text-sm max-w-md mb-8">
                Ask me anything — I can explain concepts, solve problems, write code, help with essays, and much more.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                {PROMPT_STARTERS.map(({ icon: Icon, text, category }, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(text)}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left group"
                  >
                    <div className="p-2 bg-blue-600/20 rounded-lg flex-shrink-0 group-hover:bg-blue-600/30 transition-all">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-blue-400 mb-0.5">{category}</div>
                      <div className="text-xs text-slate-400 leading-relaxed">{text}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 border border-white/10'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-400" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] group ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-sm'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div
                        className="prose prose-invert prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                      />
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>

                  {/* Message actions */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => copyMessage(msg.content)} className="btn-ghost p-1.5 text-xs" title="Copy">
                        <Copy className="w-3 h-3" />
                      </button>
                      <button className="btn-ghost p-1.5 text-xs" title="Good response">
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button className="btn-ghost p-1.5 text-xs" title="Bad response">
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                      <button className="btn-ghost p-1.5 text-xs" title="Regenerate">
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* AI Typing Indicator */}
          {aiTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1.5 items-center h-5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-2.5 focus-within:border-blue-500/50 transition-all">
            <button className="btn-ghost p-2 flex-shrink-0 mb-0.5" title="Attach file">
              <Paperclip className="w-4 h-4" />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything... (Shift+Enter for new line)"
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-slate-500 resize-none focus:outline-none text-sm leading-relaxed max-h-32 overflow-y-auto"
              style={{ minHeight: 24 }}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 128) + 'px';
              }}
            />
            <div className="flex items-center gap-1.5 flex-shrink-0 mb-0.5">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`btn-ghost p-2 ${isRecording ? 'text-red-400 bg-red-500/10' : ''}`}
                title="Voice input"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all"
                title="Send message"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-slate-600 mt-2">
            AI responses are for educational purposes. Always verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
