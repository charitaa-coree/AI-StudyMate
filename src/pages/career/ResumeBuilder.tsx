import { useState, useRef } from 'react';
import { Download, Sparkles, User, Briefcase, Plus, Trash2, Check, AlertCircle, Loader2, GraduationCap, Wrench } from 'lucide-react';

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  skills: string;
  experiences: Experience[];
  education: Education[];
}

const DEFAULT_DATA: ResumeData = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  linkedin: '',
  portfolio: '',
  summary: '',
  skills: '',
  experiences: [{ id: '1', jobTitle: '', company: '', startDate: '', endDate: '', description: '' }],
  education: [{ id: '1', degree: '', institution: '', year: '' }],
};

function enhanceSummary(summary: string, jobTitle: string): string {
  if (!summary.trim()) {
    return `Results-driven ${jobTitle || 'professional'} with a proven track record of delivering high-quality solutions. Passionate about leveraging technology to solve complex problems and drive business impact. Strong collaborator with excellent communication skills and a commitment to continuous learning.`;
  }
  // Enhance existing summary
  let enhanced = summary.trim();
  if (!enhanced.endsWith('.')) enhanced += '.';
  if (!enhanced.toLowerCase().includes('experience') && jobTitle) {
    enhanced += ` Specialized in ${jobTitle.toLowerCase()} with hands-on experience in the field.`;
  }
  if (!enhanced.toLowerCase().includes('team')) {
    enhanced += ' Proven ability to work effectively in cross-functional teams and deliver results.';
  }
  return enhanced;
}

function calculateATSScore(data: ResumeData): number {
  let score = 0;
  if (data.fullName.trim()) score += 10;
  if (data.jobTitle.trim()) score += 10;
  if (data.email.trim()) score += 5;
  if (data.phone.trim()) score += 5;
  if (data.linkedin.trim()) score += 5;
  if (data.summary.trim()) score += 15;
  if (data.skills.trim()) score += 15;
  if (data.experiences.some(e => e.jobTitle.trim() && e.company.trim())) score += 20;
  if (data.experiences.some(e => e.description.trim())) score += 10;
  if (data.education.some(e => e.degree.trim() && e.institution.trim())) score += 5;
  return Math.min(score, 100);
}

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(DEFAULT_DATA);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [error, setError] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const update = (field: keyof ResumeData, value: string) => {
    setData(d => ({ ...d, [field]: value }));
    if (generated) setGenerated(false);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setData(d => ({
      ...d,
      experiences: d.experiences.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
    if (generated) setGenerated(false);
  };

  const addExperience = () => {
    setData(d => ({
      ...d,
      experiences: [...d.experiences, { id: crypto.randomUUID(), jobTitle: '', company: '', startDate: '', endDate: '', description: '' }],
    }));
  };

  const removeExperience = (id: string) => {
    setData(d => ({ ...d, experiences: d.experiences.filter(e => e.id !== id) }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData(d => ({
      ...d,
      education: d.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
    if (generated) setGenerated(false);
  };

  const addEducation = () => {
    setData(d => ({
      ...d,
      education: [...d.education, { id: crypto.randomUUID(), degree: '', institution: '', year: '' }],
    }));
  };

  const removeEducation = (id: string) => {
    setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));
  };

  const handleGenerate = async () => {
    if (!data.fullName.trim() || !data.jobTitle.trim()) {
      setError('Please enter at least your full name and job title to generate a resume.');
      return;
    }
    setError('');
    setGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setGenerated(true);
    } catch {
      setError('Failed to generate resume. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleEnhance = async () => {
    setGenerating(true);
    setError('');
    try {
      await new Promise(r => setTimeout(r, 1000));
      const enhancedSummary = enhanceSummary(data.summary, data.jobTitle);
      setData(d => ({ ...d, summary: enhancedSummary }));
      setEnhanced(true);
      setTimeout(() => setEnhanced(false), 2000);
    } catch {
      setError('Failed to enhance resume. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    // Use browser print to PDF
    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;

    const win = window.open('', '_blank', 'noopener,noreferrer');
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${data.fullName || 'Resume'} - Resume</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Georgia', serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
          h1 { font-size: 28px; margin-bottom: 4px; }
          h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #2c5282; margin-top: 20px; margin-bottom: 8px; border-bottom: 2px solid #2c5282; padding-bottom: 4px; }
          .subtitle { font-size: 16px; color: #2c5282; font-weight: 600; margin-bottom: 8px; }
          .contact { font-size: 12px; color: #555; margin-bottom: 16px; }
          .contact span { margin-right: 16px; }
          .section { margin-bottom: 16px; }
          .exp { margin-bottom: 12px; }
          .exp-title { font-weight: 700; font-size: 14px; }
          .exp-meta { font-size: 12px; color: #666; font-style: italic; margin-bottom: 4px; }
          .exp-desc { font-size: 13px; }
          .skills-list { font-size: 13px; }
          .edu { margin-bottom: 8px; }
          .edu-title { font-weight: 700; font-size: 14px; }
          .edu-meta { font-size: 12px; color: #666; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => {
      win.print();
    }, 500);
  };

  const atsScore = calculateATSScore(data);
  const skillsList = data.skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">AI Resume Builder</h2>
          <p className="text-sm text-slate-400">Generate ATS-optimized professional resumes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={!generated}
            className="btn-secondary text-sm py-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary text-sm py-2"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating...' : 'Generate Resume'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {generated && (
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
          <Check className="w-4 h-4 flex-shrink-0" />
          Resume generated successfully! Click "Download PDF" to save it.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          {/* Personal Info */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Info
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={data.fullName}
                onChange={e => update('fullName', e.target.value)}
                placeholder="Full Name *"
                className="input-field"
              />
              <input
                value={data.jobTitle}
                onChange={e => update('jobTitle', e.target.value)}
                placeholder="Job Title *"
                className="input-field"
              />
              <input
                value={data.email}
                onChange={e => update('email', e.target.value)}
                placeholder="Email"
                className="input-field"
              />
              <input
                value={data.phone}
                onChange={e => update('phone', e.target.value)}
                placeholder="Phone"
                className="input-field"
              />
              <input
                value={data.linkedin}
                onChange={e => update('linkedin', e.target.value)}
                placeholder="LinkedIn URL"
                className="input-field"
              />
              <input
                value={data.portfolio}
                onChange={e => update('portfolio', e.target.value)}
                placeholder="Portfolio URL"
                className="input-field"
              />
              <textarea
                value={data.summary}
                onChange={e => update('summary', e.target.value)}
                placeholder="Professional Summary"
                className="input-field col-span-2 resize-none"
                rows={3}
              />
            </div>
            <button
              onClick={handleEnhance}
              disabled={generating}
              className="btn-secondary text-xs mt-3 py-2"
            >
              {enhanced ? <><Check className="w-3.5 h-3.5 text-green-400" /> Enhanced!</> : <><Sparkles className="w-3.5 h-3.5" /> AI Enhance Summary</>}
            </button>
          </div>

          {/* Experience */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Experience
              </h3>
              <button onClick={addExperience} className="btn-ghost text-xs">
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            <div className="space-y-4">
              {data.experiences.map((exp, i) => (
                <div key={exp.id} className="space-y-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  {data.experiences.length > 1 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Experience {i + 1}</span>
                      <button onClick={() => removeExperience(exp.id)} className="btn-ghost p-1 text-xs">
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  )}
                  <input
                    value={exp.jobTitle}
                    onChange={e => updateExperience(exp.id, 'jobTitle', e.target.value)}
                    placeholder="Job Title"
                    className="input-field"
                  />
                  <input
                    value={exp.company}
                    onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Company Name"
                    className="input-field"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={exp.startDate}
                      onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                      placeholder="Start Date"
                      className="input-field"
                    />
                    <input
                      value={exp.endDate}
                      onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                      placeholder="End Date"
                      className="input-field"
                    />
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    className="input-field resize-none"
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Education
              </h3>
              <button onClick={addEducation} className="btn-ghost text-xs">
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="grid grid-cols-3 gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                  <input
                    value={edu.degree}
                    onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Degree"
                    className="input-field col-span-3"
                  />
                  <input
                    value={edu.institution}
                    onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                    placeholder="Institution"
                    className="input-field col-span-2"
                  />
                  <input
                    value={edu.year}
                    onChange={e => updateEducation(edu.id, 'year', e.target.value)}
                    placeholder="Year"
                    className="input-field"
                  />
                  {data.education.length > 1 && (
                    <button onClick={() => removeEducation(edu.id)} className="btn-ghost p-1 text-xs col-span-3 justify-end">
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Skills
            </h3>
            <input
              value={data.skills}
              onChange={e => update('skills', e.target.value)}
              placeholder="Comma-separated skills (e.g., Python, React, SQL, AWS)"
              className="input-field"
            />
            {skillsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {skillsList.map(skill => (
                  <span key={skill} className="badge bg-blue-600/20 text-blue-300 border border-blue-500/20 text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Live Preview</h3>
            <span className={`badge text-xs border ${
              atsScore >= 80 ? 'bg-green-500/20 text-green-300 border-green-500/20' :
              atsScore >= 50 ? 'bg-amber-500/20 text-amber-300 border-amber-500/20' :
              'bg-red-500/20 text-red-300 border-red-500/20'
            }`}>
              ATS Score: {atsScore}%
            </span>
          </div>
          <div ref={printRef} className="bg-white rounded-xl p-6 text-gray-800 text-sm">
            {/* Header */}
            <div className="border-b-2 border-blue-600 pb-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {data.fullName || 'Your Name'}
              </h1>
              <p className="text-blue-600 font-medium">
                {data.jobTitle || 'Your Job Title'}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                {data.email && <span>{data.email}</span>}
                {data.phone && <span>{data.phone}</span>}
                {data.linkedin && <span>{data.linkedin}</span>}
                {data.portfolio && <span>{data.portfolio}</span>}
              </div>
            </div>

            {/* Summary */}
            {data.summary && (
              <div className="mb-4">
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">Summary</h2>
                <p className="text-xs text-gray-600 leading-relaxed">{data.summary}</p>
              </div>
            )}

            {/* Experience */}
            {data.experiences.some(e => e.jobTitle.trim()) && (
              <div className="mb-4">
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">Experience</h2>
                {data.experiences.filter(e => e.jobTitle.trim()).map((exp) => (
                  <div key={exp.id} className="mb-3">
                    <p className="font-semibold text-sm text-gray-900">{exp.jobTitle}</p>
                    {exp.company && <p className="text-xs text-gray-700">{exp.company}</p>}
                    {(exp.startDate || exp.endDate) && (
                      <p className="text-xs text-gray-500 italic mb-1">
                        {exp.startDate} {exp.startDate && exp.endDate && '–'} {exp.endDate || 'Present'}
                      </p>
                    )}
                    {exp.description && (
                      <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {data.education.some(e => e.degree.trim()) && (
              <div className="mb-4">
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">Education</h2>
                {data.education.filter(e => e.degree.trim()).map(edu => (
                  <div key={edu.id} className="mb-2">
                    <p className="font-semibold text-sm text-gray-900">{edu.degree}</p>
                    {edu.institution && <p className="text-xs text-gray-700">{edu.institution}</p>}
                    {edu.year && <p className="text-xs text-gray-500">{edu.year}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {skillsList.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">Skills</h2>
                <p className="text-xs text-gray-600">{skillsList.join(' • ')}</p>
              </div>
            )}

            {/* Placeholder when empty */}
            {!data.fullName && !data.jobTitle && !data.summary && data.experiences.every(e => !e.jobTitle.trim()) && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">Fill in your details and click "Generate Resume" to see the preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
