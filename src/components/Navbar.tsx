import React from 'react';
import { 
  Sparkles, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  FileText, 
  Bot, 
  CheckCircle2, 
  Briefcase 
} from 'lucide-react';
import { NavigationTab } from '../types';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  openSearch: () => void;
  openChatDrawer: () => void;
  toggleMobileMenu: () => void;
  atsScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  openSearch,
  openChatDrawer,
  toggleMobileMenu,
  atsScore,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  CareerCraft
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Resume & Career Strategist
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar Button */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={openSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border border-slate-200 dark:border-slate-700/80 rounded-xl transition shadow-xs group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <span>Search tasks, resume bullets, goals, projects...</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[11px] font-mono font-medium rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-xs">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right: Actions, AI Copilot, Theme Toggle & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search trigger */}
          <button
            onClick={openSearch}
            className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* ATS Score quick pill */}
          <button
            onClick={() => setActiveTab('resume')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-100/70 transition"
            title="Resume ATS Readiness Score"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>ATS: {atsScore}%</span>
          </button>

          {/* AI Copilot quick button */}
          <button
            onClick={openChatDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">AI Copilot</span>
            <span className="sm:hidden">Copilot</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Profile chip */}
          <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              AR
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                Alex Rivera
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Staff Candidate
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
