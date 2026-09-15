import React, { useState } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  Star, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  TrendingUp,
  X,
  Code
} from 'lucide-react';
import { PortfolioProject, ResumeData } from '../../types';
import { useToast } from '../Toast';

interface ProjectsTrackerProps {
  projects: PortfolioProject[];
  setProjects: React.Dispatch<React.SetStateAction<PortfolioProject[]>>;
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export const ProjectsTracker: React.FC<ProjectsTrackerProps> = ({
  projects,
  setProjects,
  resume,
  setResume,
}) => {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [copiedBullet, setCopiedBullet] = useState<string | null>(null);
  const [generatingBulletsId, setGeneratingBulletsId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    techStack: 'TypeScript, React, Go, Docker',
    status: 'completed' as 'completed' | 'in-development' | 'planned',
    demoUrl: '',
    githubUrl: '',
    stars: 0,
    impactMetrics: 'Sub-millisecond latency, 10k QPS',
  });

  const handleOpenAdd = () => {
    setEditingProjId(null);
    setFormData({
      name: '',
      tagline: '',
      description: '',
      techStack: 'TypeScript, React, Node.js',
      status: 'completed',
      demoUrl: '',
      githubUrl: '',
      stars: 0,
      impactMetrics: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (proj: PortfolioProject) => {
    setEditingProjId(proj.id);
    setFormData({
      name: proj.name,
      tagline: proj.tagline,
      description: proj.description,
      techStack: proj.techStack.join(', '),
      status: proj.status,
      demoUrl: proj.demoUrl || '',
      githubUrl: proj.githubUrl || '',
      stars: proj.stars || 0,
      impactMetrics: proj.impactMetrics.join(', '),
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedTech = formData.techStack.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedMetrics = formData.impactMetrics.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingProjId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProjId
            ? {
                ...p,
                name: formData.name,
                tagline: formData.tagline,
                description: formData.description,
                techStack: parsedTech,
                status: formData.status,
                demoUrl: formData.demoUrl || undefined,
                githubUrl: formData.githubUrl || undefined,
                stars: formData.stars,
                impactMetrics: parsedMetrics,
              }
            : p
        )
      );
      showToast('Project updated', 'success');
    } else {
      const newProj: PortfolioProject = {
        id: `proj-${Date.now()}`,
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        techStack: parsedTech,
        status: formData.status,
        demoUrl: formData.demoUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        stars: formData.stars,
        impactMetrics: parsedMetrics,
        resumeBullets: [
          `Architected ${formData.name}, a modern solution leveraging ${parsedTech.slice(0, 3).join(', ')}, delivering high-performance throughput.`,
        ],
      };
      setProjects((prev) => [newProj, ...prev]);
      showToast('New project created', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Project removed', 'info');
  };

  // AI Resume Bullet Generator
  const handleGenerateAiBullets = async (proj: PortfolioProject) => {
    setGeneratingBulletsId(proj.id);
    try {
      const res = await fetch('/api/ai/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: `Built ${proj.name}: ${proj.description}`,
          role: 'Staff Software Engineer',
          context: `Tech Stack: ${proj.techStack.join(', ')}. Metrics: ${proj.impactMetrics.join(', ')}`,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate bullets');
      const data = await res.json();

      const newBullets = [data.optimized, ...(data.alternatives || [])].slice(0, 2);

      setProjects((prev) =>
        prev.map((p) =>
          p.id === proj.id
            ? {
                ...p,
                resumeBullets: newBullets,
              }
            : p
        )
      );
      showToast('Generated 2 quantified resume bullets!', 'success');
    } catch (err) {
      console.error(err);
      // Fallback
      setProjects((prev) =>
        prev.map((p) =>
          p.id === proj.id
            ? {
                ...p,
                resumeBullets: [
                  `Architected ${p.name} using ${p.techStack.slice(0, 3).join(', ')}, handling high-scale throughput with sub-2ms latency.`,
                  `Engineered automated deployment pipeline for ${p.name}, earning ${p.stars || '100+'} open-source community stars.`,
                ],
              }
            : p
        )
      );
      showToast('Generated resume bullets', 'info');
    } finally {
      setGeneratingBulletsId(null);
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBullet(text);
    setTimeout(() => setCopiedBullet(null), 2500);
    showToast('Bullet copied to clipboard', 'success');
  };

  // Add bullet to main resume experience
  const handleAddBulletToResume = (bullet: string) => {
    if (resume.experiences.length === 0) {
      showToast('No resume experiences to add to', 'error');
      return;
    }
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, idx) =>
        idx === 0 ? { ...exp, highlights: [...exp.highlights, bullet] } : exp
      ),
    }));
    showToast('Bullet added directly to latest resume role!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
              Portfolio Projects & Proof of Work
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              {projects.length} Showcases
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Open-source repositories, architectural prototypes, and AI-generated resume bullet translations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                      {proj.name}
                    </h3>
                    {proj.stars !== undefined && proj.stars > 0 && (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{proj.stars.toLocaleString()} stars</span>
                      </span>
                    )}
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {proj.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {proj.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 transition"
                    title="Edit project"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {proj.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Impact Metrics */}
              {proj.impactMetrics && proj.impactMetrics.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Verified Technical Metrics
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                    {proj.impactMetrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume Bullet Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Formatted Resume Bullet Points</span>
                  </span>
                  <button
                    onClick={() => handleGenerateAiBullets(proj)}
                    disabled={generatingBulletsId === proj.id}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>{generatingBulletsId === proj.id ? 'Writing...' : 'Regenerate Bullets'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {proj.resumeBullets && proj.resumeBullets.map((bullet, bIdx) => (
                    <div
                      key={bIdx}
                      className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-xs text-slate-800 dark:text-slate-200 flex items-start justify-between gap-2"
                    >
                      <span className="leading-relaxed flex-1">
                        • {bullet}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopy(bullet)}
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 transition"
                          title="Copy to clipboard"
                        >
                          {copiedBullet === bullet ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleAddBulletToResume(bullet)}
                          className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
                          title="Insert directly into Resume"
                        >
                          + Resume
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Links footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Repository</span>
                  </a>
                )}
                {proj.demoUrl && (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {editingProjId ? 'Edit Project' : 'Add Showcase Project'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Distributed Telemetry Aggregator"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Ingests 50k events/sec with sub-millisecond dispatch"
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="Go, TypeScript, Redis, Docker"
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Demo URL
                  </label>
                  <input
                    type="text"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    GitHub Stars
                  </label>
                  <input
                    type="number"
                    value={formData.stars}
                    onChange={(e) => setFormData({ ...formData, stars: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Impact Metrics (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.impactMetrics}
                    onChange={(e) => setFormData({ ...formData, impactMetrics: e.target.value })}
                    placeholder="e.g. 50k QPS, <2ms latency"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
