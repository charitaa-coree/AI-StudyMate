import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Map, Award, ChevronRight, Sparkles, Loader2, AlertCircle, Check, Clock, BookOpen, TrendingUp } from 'lucide-react';

const ROADMAPS = [
  { title: 'Full Stack Developer', steps: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Database', 'Cloud'], color: 'from-blue-600 to-blue-700' },
  { title: 'Data Scientist', steps: ['Python', 'Statistics', 'ML', 'Deep Learning', 'Big Data', 'MLOps'], color: 'from-green-600 to-teal-600' },
  { title: 'Cloud Architect', steps: ['Linux', 'Networking', 'AWS/Azure', 'Docker', 'Kubernetes', 'Security'], color: 'from-amber-600 to-orange-600' },
];

const TECH_KEYWORDS: Record<string, string> = {
  'html': 'Full Stack Developer',
  'css': 'Full Stack Developer',
  'javascript': 'Full Stack Developer',
  'react': 'Full Stack Developer',
  'python': 'Data Scientist',
  'data': 'Data Scientist',
  'machine learning': 'Data Scientist',
  'ml': 'Data Scientist',
  'ai': 'Data Scientist',
  'cloud': 'Cloud Architect',
  'aws': 'Cloud Architect',
  'azure': 'Cloud Architect',
  'docker': 'Cloud Architect',
  'kubernetes': 'Cloud Architect',
  'java': 'Backend Developer',
  'c++': 'Systems Engineer',
  'mobile': 'Mobile Developer',
  'ios': 'Mobile Developer',
  'android': 'Mobile Developer',
  'security': 'Security Engineer',
  'devops': 'DevOps Engineer',
};

function generateRoadmap(careerInput: string): { title: string; description: string; phases: Array<{ phase: string; duration: string; topics: string[]; projects: string[] }> } {
  const input = careerInput.toLowerCase();
  let career = 'Software Developer';

  for (const [keyword, path] of Object.entries(TECH_KEYWORDS)) {
    if (input.includes(keyword)) {
      career = path;
      break;
    }
  }

  if (input.includes('data scien') || input.includes('data analyst')) career = 'Data Scientist';
  else if (input.includes('full stack') || input.includes('web dev')) career = 'Full Stack Developer';
  else if (input.includes('cloud') || input.includes('devops')) career = 'Cloud Architect';
  else if (input.includes('mobile') || input.includes('app')) career = 'Mobile Developer';
  else if (input.includes('security')) career = 'Security Engineer';
  else if (input.includes('game')) career = 'Game Developer';
  else if (input.includes('data') || input.includes('ml') || input.includes('ai')) career = 'Data Scientist';

  const roadmaps: Record<string, { title: string; description: string; phases: Array<{ phase: string; duration: string; topics: string[]; projects: string[] }> }> = {
    'Full Stack Developer': {
      title: 'Full Stack Developer Roadmap',
      description: 'A comprehensive path to becoming a full stack developer, covering both frontend and backend technologies.',
      phases: [
        { phase: 'Phase 1: Foundations', duration: '4-6 weeks', topics: ['HTML5 & CSS3', 'JavaScript ES6+', 'Git & GitHub', 'Responsive Design', 'DOM Manipulation'], projects: ['Personal portfolio website', 'Landing page clone'] },
        { phase: 'Phase 2: Frontend Framework', duration: '6-8 weeks', topics: ['React fundamentals', 'State management (Redux/Context)', 'React Router', 'API integration', 'Testing with Jest'], projects: ['Todo app with CRUD', 'Weather dashboard app'] },
        { phase: 'Phase 3: Backend Development', duration: '6-8 weeks', topics: ['Node.js & Express', 'REST API design', 'Authentication & JWT', 'Database (PostgreSQL/MongoDB)', 'API security'], projects: ['REST API with auth', 'Blog platform backend'] },
        { phase: 'Phase 4: Full Stack Integration', duration: '4-6 weeks', topics: ['Connecting frontend & backend', 'Deployment (Vercel/Netlify)', 'CI/CD basics', 'Performance optimization', 'Docker basics'], projects: ['Full stack e-commerce app', 'Real-time chat application'] },
      ],
    },
    'Data Scientist': {
      title: 'Data Scientist Roadmap',
      description: 'A structured path to mastering data science, from statistics to machine learning and deployment.',
      phases: [
        { phase: 'Phase 1: Python & Math', duration: '6-8 weeks', topics: ['Python programming', 'NumPy & Pandas', 'Statistics & Probability', 'Linear Algebra', 'Calculus basics'], projects: ['Data cleaning project', 'Statistical analysis notebook'] },
        { phase: 'Phase 2: Data Analysis', duration: '4-6 weeks', topics: ['Data visualization (Matplotlib/Seaborn)', 'Exploratory Data Analysis', 'SQL for data science', 'Feature engineering', 'Storytelling with data'], projects: ['EDA on real dataset', 'Interactive dashboard'] },
        { phase: 'Phase 3: Machine Learning', duration: '8-10 weeks', topics: ['Scikit-learn', 'Supervised learning', 'Unsupervised learning', 'Model evaluation', 'Hyperparameter tuning'], projects: ['House price prediction', 'Customer segmentation model'] },
        { phase: 'Phase 4: Deep Learning & MLOps', duration: '8-10 weeks', topics: ['TensorFlow/PyTorch', 'Neural networks', 'NLP or Computer Vision', 'Model deployment', 'ML pipelines'], projects: ['Image classification CNN', 'End-to-end ML pipeline'] },
      ],
    },
    'Cloud Architect': {
      title: 'Cloud Architect Roadmap',
      description: 'A path to mastering cloud architecture, infrastructure, and DevOps practices.',
      phases: [
        { phase: 'Phase 1: IT Fundamentals', duration: '4-6 weeks', topics: ['Linux administration', 'Networking basics', 'Security fundamentals', 'Scripting (Bash/Python)', 'System design basics'], projects: ['Linux server setup', 'Network topology design'] },
        { phase: 'Phase 2: Cloud Platform', duration: '8-10 weeks', topics: ['AWS or Azure core services', 'Compute (EC2/VMs)', 'Storage (S3/Blob)', 'Networking (VPC/VNet)', 'IAM & security'], projects: ['Multi-tier app deployment', 'Secure cloud infrastructure'] },
        { phase: 'Phase 3: Containerization', duration: '6-8 weeks', topics: ['Docker fundamentals', 'Docker Compose', 'Kubernetes basics', 'Helm charts', 'Service mesh'], projects: ['Containerized microservices', 'K8s cluster deployment'] },
        { phase: 'Phase 4: DevOps & Advanced', duration: '6-8 weeks', topics: ['CI/CD pipelines', 'Infrastructure as Code (Terraform)', 'Monitoring & logging', 'Cloud security', 'Cost optimization'], projects: ['Complete CI/CD pipeline', 'Terraform infrastructure'] },
      ],
    },
    'Mobile Developer': {
      title: 'Mobile Developer Roadmap',
      description: 'A path to building native and cross-platform mobile applications.',
      phases: [
        { phase: 'Phase 1: Programming Basics', duration: '6-8 weeks', topics: ['Dart or Swift/Kotlin', 'OOP principles', 'Mobile UI fundamentals', 'Version control', 'Mobile design patterns'], projects: ['Simple calculator app', 'Notes app'] },
        { phase: 'Phase 2: Framework', duration: '8-10 weeks', topics: ['Flutter or React Native', 'Navigation & routing', 'State management', 'API integration', 'Local storage'], projects: ['Weather app', 'Social media feed UI'] },
        { phase: 'Phase 3: Advanced Mobile', duration: '6-8 weeks', topics: ['Push notifications', 'Authentication', 'Camera & sensors', 'Animations', 'App store deployment'], projects: ['Chat app with real-time features', 'E-commerce mobile app'] },
        { phase: 'Phase 4: Polish & Publish', duration: '4-6 weeks', topics: ['Performance optimization', 'Testing mobile apps', 'App store optimization', 'Analytics integration', 'Monetization'], projects: ['Published app on store', 'Portfolio of 3 apps'] },
      ],
    },
    'Security Engineer': {
      title: 'Security Engineer Roadmap',
      description: 'A path to mastering cybersecurity, from fundamentals to advanced security engineering.',
      phases: [
        { phase: 'Phase 1: Security Fundamentals', duration: '6-8 weeks', topics: ['Network security basics', 'Cryptography fundamentals', 'Linux & Windows security', 'Security tools (Nmap, Wireshark)', 'OWASP Top 10'], projects: ['Network vulnerability scan', 'Security audit report'] },
        { phase: 'Phase 2: Offensive Security', duration: '8-10 weeks', topics: ['Penetration testing', 'Web app security', 'Burp Suite', 'Metasploit', 'Social engineering'], projects: ['CTF challenges', 'Web app pentest report'] },
        { phase: 'Phase 3: Defensive Security', duration: '6-8 weeks', topics: ['SIEM tools', 'Incident response', 'Threat hunting', 'Security monitoring', 'Forensics basics'], projects: ['SIEM dashboard setup', 'Incident response plan'] },
        { phase: 'Phase 4: Advanced Security', duration: '6-8 weeks', topics: ['Cloud security', 'DevSecOps', 'Reverse engineering', 'Malware analysis', 'Security automation'], projects: ['Secure CI/CD pipeline', 'Malware analysis report'] },
      ],
    },
    'Backend Developer': {
      title: 'Backend Developer Roadmap',
      description: 'A path to mastering server-side development, APIs, and database management.',
      phases: [
        { phase: 'Phase 1: Programming Language', duration: '6-8 weeks', topics: ['Java or Python or Go', 'OOP & design patterns', 'Data structures', 'Algorithms', 'Git workflow'], projects: ['CLI application', 'Data structure library'] },
        { phase: 'Phase 2: Web Backend', duration: '8-10 weeks', topics: ['HTTP & REST', 'Framework (Spring/Django/Gin)', 'Authentication & authorization', 'Database design (SQL)', 'API documentation'], projects: ['REST API with CRUD', 'Auth system with JWT'] },
        { phase: 'Phase 3: Databases & Caching', duration: '6-8 weeks', topics: ['PostgreSQL/MySQL', 'Redis caching', 'Database optimization', 'ORM (Hibernate/SQLAlchemy)', 'NoSQL (MongoDB)'], projects: ['Database optimization project', 'Caching layer implementation'] },
        { phase: 'Phase 4: Scalability & Deploy', duration: '6-8 weeks', topics: ['Microservices', 'Message queues (RabbitMQ/Kafka)', 'Docker & Kubernetes', 'Load balancing', 'Monitoring (Prometheus/Grafana)'], projects: ['Microservices architecture', 'Scalable API system'] },
      ],
    },
    'Game Developer': {
      title: 'Game Developer Roadmap',
      description: 'A path to creating games, from game engines to publishing.',
      phases: [
        { phase: 'Phase 1: Programming & Math', duration: '6-8 weeks', topics: ['C# or C++', 'Game math (vectors, matrices)', 'OOP for games', 'Game loop fundamentals', 'Version control'], projects: ['Console-based game', 'Simple 2D game'] },
        { phase: 'Phase 2: Game Engine', duration: '8-10 weeks', topics: ['Unity or Unreal Engine', 'Physics & collision', 'Sprite/3D model handling', 'Input systems', 'Audio integration'], projects: ['2D platformer game', '3D mini-game'] },
        { phase: 'Phase 3: Advanced Game Dev', duration: '6-8 weeks', topics: ['Game AI', 'Multiplayer networking', 'Shader programming', 'Performance optimization', 'Procedural generation'], projects: ['Multiplayer game prototype', 'Game with AI enemies'] },
        { phase: 'Phase 4: Polish & Ship', duration: '4-6 weeks', topics: ['UI/UX for games', 'Game testing', 'Steam/console publishing', 'Marketing basics', 'Post-launch support'], projects: ['Published game', 'Game portfolio'] },
      ],
    },
  };

  return roadmaps[career] ?? {
    title: `${career} Roadmap`,
    description: `A structured learning path to become a ${career}.`,
    phases: [
      { phase: 'Phase 1: Fundamentals', duration: '4-6 weeks', topics: ['Core concepts', 'Programming basics', 'Tools & setup', 'Best practices'], projects: ['Beginner project', 'Practice exercises'] },
      { phase: 'Phase 2: Intermediate', duration: '6-8 weeks', topics: ['Advanced concepts', 'Frameworks & libraries', 'Real-world patterns', 'Testing'], projects: ['Intermediate project', 'Group collaboration'] },
      { phase: 'Phase 3: Advanced', duration: '8-10 weeks', topics: ['Advanced techniques', 'Performance optimization', 'Architecture patterns', 'Industry standards'], projects: ['Advanced project', 'Open source contribution'] },
      { phase: 'Phase 4: Specialization', duration: '6-8 weeks', topics: ['Specialized topics', 'Industry tools', 'Portfolio building', 'Job preparation'], projects: ['Capstone project', 'Portfolio website'] },
    ],
  };
}

export default function CareerCoach() {
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<ReturnType<typeof generateRoadmap> | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('Please enter a career path or technology you\'re interested in.');
      return;
    }
    setError('');
    setGenerating(true);
    setRoadmap(null);
    try {
      await new Promise(r => setTimeout(r, 1500));
      const result = generateRoadmap(input);
      setRoadmap(result);
    } catch {
      setError('Failed to generate roadmap. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePresetClick = (title: string) => {
    setInput(title);
    handleGenerateWithTitle(title);
  };

  const handleGenerateWithTitle = async (title: string) => {
    setError('');
    setGenerating(true);
    setRoadmap(null);
    try {
      await new Promise(r => setTimeout(r, 1500));
      const result = generateRoadmap(title);
      setRoadmap(result);
    } catch {
      setError('Failed to generate roadmap. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">AI Career Coach</h2>
        <p className="text-sm text-slate-400">Personalized career roadmaps and skill guidance</p>
      </div>

      {/* Input Section */}
      <div className="glass-card p-6 border border-blue-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">Get your personalized career roadmap</h3>
            <p className="text-sm text-slate-400 mb-4">Tell AI your current skills, interests, and goals to get a tailored learning path</p>
            <div className="flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g., I know HTML and Python, want to be a Data Scientist"
                className="input-field flex-1 py-2.5"
              />
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-primary"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                {generating ? 'Generating...' : 'Generate'}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preset Roadmaps */}
      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3">Popular Career Paths</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROADMAPS.map(r => (
            <motion.button
              key={r.title}
              whileHover={{ scale: 1.02 }}
              onClick={() => handlePresetClick(r.title)}
              className="glass-card p-5 text-left transition-all"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r ${r.color} mb-4`}>
                <Map className="w-3.5 h-3.5 text-white" />
                <span className="text-sm font-semibold text-white">{r.title}</span>
              </div>
              <div className="space-y-2">
                {r.steps.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-slate-400 font-medium flex-shrink-0">{i + 1}</div>
                    <span className="text-sm text-slate-300">{step}</span>
                    {i < 2 && <Award className="w-3.5 h-3.5 text-yellow-400 ml-auto" />}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-4 text-xs text-blue-400 font-medium">
                Generate full roadmap <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generated Roadmap */}
      <AnimatePresence>
        {roadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            <div className="glass-card p-6 border border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">{roadmap.title}</h3>
              </div>
              <p className="text-sm text-slate-400">{roadmap.description}</p>
            </div>

            {roadmap.phases.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                      {i + 1}
                    </div>
                    <h4 className="font-semibold text-white">{phase.phase}</h4>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <Clock className="w-3 h-3" />
                    {phase.duration}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3" />
                      Topics to Learn
                    </p>
                    <div className="space-y-1.5">
                      {phase.topics.map(topic => (
                        <div key={topic} className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Award className="w-3 h-3" />
                      Projects to Build
                    </p>
                    <div className="space-y-1.5">
                      {phase.projects.map(project => (
                        <div key={project} className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                          {project}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="glass-card p-5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <h4 className="font-semibold text-white">Recommended Next Steps</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: 'Take a skill assessment', icon: Target },
                  { label: 'Find relevant courses', icon: BookOpen },
                  { label: 'Practice with projects', icon: Award },
                ].map(({ label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-2 p-3 bg-white/5 rounded-xl text-sm text-slate-300">
                    <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
