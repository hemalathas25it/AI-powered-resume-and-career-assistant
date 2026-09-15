import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  FolderGit2, 
  Target, 
  BarChart3, 
  Sparkles, 
  HelpCircle,
  MessageSquareCode,
  X,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  pendingTasksCount: number;
  atsScore: number;
  openChatDrawer: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  pendingTasksCount,
  atsScore,
  openChatDrawer,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'resume' as NavigationTab,
      label: 'Resume & ATS',
      icon: FileText,
      badge: `${atsScore}%`,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    {
      id: 'tasks' as NavigationTab,
      label: 'Task Priorities',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : null,
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300',
    },
    {
      id: 'projects' as NavigationTab,
      label: 'Projects Portfolio',
      icon: FolderGit2,
      badge: null,
    },
    {
      id: 'goals' as NavigationTab,
      label: 'Career Roadmap',
      icon: Target,
      badge: '68%',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
    },
    {
      id: 'interview' as NavigationTab,
      label: 'Interview Coach',
      icon: MessageSquareCode,
      badge: 'STAR',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    },
    {
      id: 'analytics' as NavigationTab,
      label: 'Progress Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'copilot' as NavigationTab,
      label: 'AI Career Copilot',
      icon: Sparkles,
      badge: 'Gemini',
      badgeColor: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white',
    },
  ];

  const handleSelect = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const navContent = (
    <div className="h-full flex flex-col justify-between py-5 px-4">
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Career Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-colors ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Career Strategist Card */}
      <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/30 border border-indigo-100/80 dark:border-indigo-800/50">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 mb-1.5">
            <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">
              Target Level
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Staff Software Engineer
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5 line-clamp-2">
            Targeting $210k-$260k with distributed systems & team leadership mastery.
          </p>
          <button
            onClick={() => {
              openChatDrawer();
              setMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
          >
            <span>Ask Copilot Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm min-h-[calc(100vh-4rem)] no-print">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden no-print">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  CC
                </div>
                <span className="font-display font-bold text-slate-900 dark:text-white">
                  CareerCraft AI
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{navContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
