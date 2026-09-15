import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  ResumeData, 
  Task, 
  CareerGoal, 
  PortfolioProject, 
  ATSAnalysis 
} from './types';
import { 
  loadResume, 
  saveResume, 
  loadTasks, 
  saveTasks, 
  loadCareerGoal, 
  saveCareerGoal, 
  loadProjects, 
  saveProjects, 
  loadATSAnalysis, 
  saveATSAnalysis,
  loadDarkMode,
  saveDarkMode
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ToastProvider } from './components/Toast';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { ResumeBuilder } from './components/resume/ResumeBuilder';
import { TaskManager } from './components/tasks/TaskManager';
import { ProjectsTracker } from './components/projects/ProjectsTracker';
import { GoalsAndAnalytics } from './components/goals/GoalsAndAnalytics';
import { InterviewPrep } from './components/interview/InterviewPrep';
import { AiChatbot } from './components/chat/AiChatbot';
import { Sparkles, X } from 'lucide-react';

export function AppContent() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => loadDarkMode());

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveDarkMode(darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Core App States
  const [resume, setResume] = useState<ResumeData>(() => loadResume());
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [careerGoal, setCareerGoal] = useState<CareerGoal>(() => loadCareerGoal());
  const [projects, setProjects] = useState<PortfolioProject[]>(() => loadProjects());
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis>(() => loadATSAnalysis());

  // Auto-persist on state change
  useEffect(() => { saveResume(resume); }, [resume]);
  useEffect(() => { saveTasks(tasks); }, [tasks]);
  useEffect(() => { saveCareerGoal(careerGoal); }, [careerGoal]);
  useEffect(() => { saveProjects(projects); }, [projects]);
  useEffect(() => { saveATSAnalysis(atsAnalysis); }, [atsAnalysis]);

  // Global search shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        openSearch={() => setSearchOpen(true)}
        openChatDrawer={() => setChatDrawerOpen(true)}
        atsScore={atsAnalysis.atsScore}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Responsive Desktop & Drawer Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          pendingTasksCount={pendingTasksCount}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Dynamic Main Page Content */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              resume={resume}
              tasks={tasks}
              setTasks={setTasks}
              careerGoal={careerGoal}
              projects={projects}
              atsAnalysis={atsAnalysis}
              setActiveTab={setActiveTab}
              openChatDrawer={() => setChatDrawerOpen(true)}
            />
          )}

          {activeTab === 'resume' && (
            <ResumeBuilder
              resume={resume}
              setResume={setResume}
              atsAnalysis={atsAnalysis}
              setAtsAnalysis={setAtsAnalysis}
              targetRole={careerGoal.targetRole}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskManager
              tasks={tasks}
              setTasks={setTasks}
              careerGoal={careerGoal}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsTracker
              projects={projects}
              setProjects={setProjects}
              resume={resume}
              setResume={setResume}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsAndAnalytics
              careerGoal={careerGoal}
              setCareerGoal={setCareerGoal}
            />
          )}

          {activeTab === 'interview' && (
            <InterviewPrep
              targetRole={careerGoal.targetRole}
            />
          )}

          {activeTab === 'chat' && (
            <AiChatbot
              resume={resume}
              tasks={tasks}
              careerGoal={careerGoal}
            />
          )}
        </main>
      </div>

      {/* Slide-out AI Assistant Drawer (accessible from any page via Navbar trigger) */}
      {chatDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden no-print">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
            onClick={() => setChatDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
              <AiChatbot
                resume={resume}
                tasks={tasks}
                careerGoal={careerGoal}
                isDrawer
                onCloseDrawer={() => setChatDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Copilot Button (bottom right for fast access) */}
      {!chatDrawerOpen && activeTab !== 'chat' && (
        <button
          onClick={() => setChatDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white font-semibold text-xs shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all no-print border border-indigo-400/30"
          title="Open AI Career Copilot"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>
      )}

      {/* Global Cmd+K Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        setActiveTab={setActiveTab}
        resume={resume}
        tasks={tasks}
        projects={projects}
        careerGoal={careerGoal}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
