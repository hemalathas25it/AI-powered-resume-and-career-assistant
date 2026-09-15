import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  CheckSquare, 
  FileText, 
  FolderGit2, 
  Target, 
  Sparkles, 
  ArrowRight,
  MessageSquareCode,
  SlidersHorizontal
} from 'lucide-react';
import { Task, ResumeData, CareerGoal, PortfolioProject, NavigationTab } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  resume: ResumeData;
  careerGoal: CareerGoal;
  projects: PortfolioProject[];
  setActiveTab: (tab: NavigationTab) => void;
  openChatDrawer: () => void;
}

interface SearchResult {
  id: string;
  category: 'Tasks' | 'Resume' | 'Projects' | 'Goals' | 'Quick Actions';
  title: string;
  subtitle: string;
  tab: NavigationTab;
  action?: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  tasks,
  resume,
  careerGoal,
  projects,
  setActiveTab,
  openChatDrawer,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    const results: SearchResult[] = [];

    // Quick Actions
    const quickActions: SearchResult[] = [
      {
        id: 'qa-copilot',
        category: 'Quick Actions',
        title: 'Launch AI Career Copilot',
        subtitle: 'Ask about resume enhancements, task prioritization, or mock interview',
        tab: 'copilot',
        action: () => openChatDrawer(),
      },
      {
        id: 'qa-ats',
        category: 'Quick Actions',
        title: 'Run ATS Resume Audit',
        subtitle: 'Evaluate keyword matches and Google XYZ impact metrics',
        tab: 'resume',
      },
      {
        id: 'qa-tasks-ai',
        category: 'Quick Actions',
        title: 'Prioritize Pending Tasks with AI',
        subtitle: 'Automatically organize tasks by hiring payoff and deadlines',
        tab: 'tasks',
      },
      {
        id: 'qa-interview',
        category: 'Quick Actions',
        title: 'Practice STAR Mock Interview',
        subtitle: 'Leadership and technical architecture scenario questions',
        tab: 'interview',
      },
    ];

    if (!q) {
      return quickActions;
    }

    // Filter Quick Actions
    quickActions.forEach((qa) => {
      if (qa.title.toLowerCase().includes(q) || qa.subtitle.toLowerCase().includes(q)) {
        results.push(qa);
      }
    });

    // Search Tasks
    tasks.forEach((task) => {
      if (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        task.category.toLowerCase().includes(q) ||
        task.priority.toLowerCase().includes(q)
      ) {
        results.push({
          id: task.id,
          category: 'Tasks',
          title: task.title,
          subtitle: `[${task.priority.toUpperCase()}] • ${task.category} • Due ${task.dueDate}`,
          tab: 'tasks',
        });
      }
    });

    // Search Resume
    resume.experiences.forEach((exp) => {
      if (
        exp.company.toLowerCase().includes(q) ||
        exp.role.toLowerCase().includes(q) ||
        exp.highlights.some((h) => h.toLowerCase().includes(q))
      ) {
        results.push({
          id: exp.id,
          category: 'Resume',
          title: `${exp.role} @ ${exp.company}`,
          subtitle: `Experience (${exp.startDate} - ${exp.endDate})`,
          tab: 'resume',
        });
      }
    });

    // Search Skills
    resume.skills.forEach((group) => {
      const matched = group.items.filter((item) => item.toLowerCase().includes(q));
      if (matched.length > 0) {
        results.push({
          id: `skill-${group.category}`,
          category: 'Resume',
          title: `${group.category}: ${matched.join(', ')}`,
          subtitle: `Resume Skill Group (${group.items.length} items)`,
          tab: 'resume',
        });
      }
    });

    // Search Portfolio Projects
    projects.forEach((proj) => {
      if (
        proj.name.toLowerCase().includes(q) ||
        proj.tagline.toLowerCase().includes(q) ||
        proj.techStack.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push({
          id: proj.id,
          category: 'Projects',
          title: proj.name,
          subtitle: `${proj.tagline} • Stack: ${proj.techStack.slice(0, 3).join(', ')}`,
          tab: 'projects',
        });
      }
    });

    // Search Career Goals & Milestones
    if (
      careerGoal.title.toLowerCase().includes(q) ||
      careerGoal.targetRole.toLowerCase().includes(q)
    ) {
      results.push({
        id: careerGoal.id,
        category: 'Goals',
        title: careerGoal.title,
        subtitle: `Target: ${careerGoal.targetRole} (${careerGoal.overallProgress}% complete)`,
        tab: 'goals',
      });
    }

    careerGoal.milestones.forEach((m) => {
      if (m.title.toLowerCase().includes(q) || m.keyDeliverables.some((d) => d.toLowerCase().includes(q))) {
        results.push({
          id: m.id,
          category: 'Goals',
          title: `Milestone: ${m.title}`,
          subtitle: `${m.targetQuarter} • Status: ${m.status} (${m.progress}%)`,
          tab: 'goals',
        });
      }
    });

    return results;
  }, [query, tasks, resume, careerGoal, projects, openChatDrawer]);

  const handleSelectResult = (result: SearchResult) => {
    if (result.action) {
      result.action();
    } else {
      setActiveTab(result.tab);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(searchResults.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % Math.max(searchResults.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelectResult(searchResults[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 no-print">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks, resume highlights, tech skills, milestones, or prompt actions..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for keywords like "React", "Staff", "Kafka", or "Urgent".</p>
            </div>
          ) : (
            searchResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.category}-${item.id}-${idx}`}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        item.category === 'Tasks'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : item.category === 'Resume'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : item.category === 'Projects'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : item.category === 'Goals'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      }`}
                    >
                      {item.category === 'Tasks' && <CheckSquare className="w-4 h-4" />}
                      {item.category === 'Resume' && <FileText className="w-4 h-4" />}
                      {item.category === 'Projects' && <FolderGit2 className="w-4 h-4" />}
                      {item.category === 'Goals' && <Target className="w-4 h-4" />}
                      {item.category === 'Quick Actions' && <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-semibold truncate">{item.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 mr-1">↑</kbd>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 mr-1">↓</kbd>
              to navigate
            </span>
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 mr-1">↵</kbd>
              to open
            </span>
          </div>
          <span className="font-medium text-slate-500 dark:text-slate-400">
            CareerCraft Quick Search
          </span>
        </div>
      </div>
    </div>
  );
};
