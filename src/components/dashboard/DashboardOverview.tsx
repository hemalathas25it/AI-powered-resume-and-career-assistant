import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  AlertTriangle, 
  FileText, 
  Target, 
  FolderGit2, 
  TrendingUp, 
  Calendar,
  CheckSquare,
  Zap,
  ChevronRight,
  MessageSquareCode
} from 'lucide-react';
import { Task, ResumeData, CareerGoal, PortfolioProject, ATSAnalysis, NavigationTab } from '../../types';

interface DashboardOverviewProps {
  resume: ResumeData;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  careerGoal: CareerGoal;
  projects: PortfolioProject[];
  atsAnalysis: ATSAnalysis;
  setActiveTab: (tab: NavigationTab) => void;
  openChatDrawer: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  resume,
  tasks,
  setTasks,
  careerGoal,
  projects,
  atsAnalysis,
  setActiveTab,
  openChatDrawer,
}) => {
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed');
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Career Strategist Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              Good morning, {resume.personalInfo.fullName}
            </h1>
            <p className="text-sm text-indigo-100/90 max-w-2xl leading-relaxed">
              You are on track for <strong className="text-white underline decoration-indigo-400 font-semibold">{careerGoal.targetRole}</strong>. Your ATS Resume score is calibrated at <strong className="text-emerald-300 font-semibold">{atsAnalysis.atsScore}%</strong> with <strong className="text-white font-semibold">{pendingTasks.length} pending high-impact tasks</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('resume')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Audit Resume ATS</span>
            </button>
            <button
              onClick={openChatDrawer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-sm border border-indigo-400/40 backdrop-blur-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>

        {/* Subtle background ambient circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: ATS Score */}
        <div 
          onClick={() => setActiveTab('resume')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">ATS Readiness</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {atsAnalysis.atsScore}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              +4% vs benchmark
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${atsAnalysis.atsScore}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            <span>Action Verbs: {atsAnalysis.actionVerbScore}%</span>
            <span>Metrics: {atsAnalysis.quantifiableMetricsScore}%</span>
          </div>
        </div>

        {/* Card 2: Pending Tasks */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Priority Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {pendingTasks.length}
            </span>
            {urgentTasks.length > 0 && (
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {urgentTasks.length} urgent
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {completedTasksCount} completed this cycle
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
            <span>Manage priorities</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Career Goal Progress */}
        <div 
          onClick={() => setActiveTab('goals')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Goal Progress</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {careerGoal.overallProgress}%
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              Q1-Q3 2027
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${careerGoal.overallProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
            Target: {careerGoal.targetRole}
          </p>
        </div>

        {/* Card 4: Portfolio Projects */}
        <div 
          onClick={() => setActiveTab('projects')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Portfolio Assets</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {projects.length}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              1,900+ stars
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            PulseFlow & SynapseDoc live
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:underline">
            <span>View portfolio bullets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* AI Daily Strategic Focus Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                AI Strategic Recommendation
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-200/60 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                High Leverage
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              Your Stripe application window closes in 48 hours. Tailor your resume summary with <strong>payment idempotency & distributed consensus</strong> keywords, and practice 1 mock STAR question on multi-team leadership.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('interview')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition"
          >
            Practice Question
          </button>
          <button
            onClick={openChatDrawer}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs"
          >
            Execute Plan
          </button>
        </div>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Priority Tasks & Goal Milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent & High Priority Action Items */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    High-Impact Action Items
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tasks organized by hiring return-on-investment
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({tasks.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((task) => {
                const isDone = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                        : task.priority === 'urgent'
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                        : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80'
                    }`}
                  >
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {task.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                            task.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : task.priority === 'high'
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {task.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {task.description}
                      </p>
                      {task.aiReasoning && (
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-300 mt-1 flex items-center gap-1 font-medium">
                          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>AI: {task.aiReasoning}</span>
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Career Milestones Road */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Milestones Roadmap
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Quarterly execution toward {careerGoal.targetRole}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('goals')}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Full Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {careerGoal.milestones.slice(0, 3).map((m, idx) => (
                <div key={m.id} className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {m.title}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {m.targetQuarter}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden my-2">
                    <div
                      className={`h-full rounded-full ${
                        m.progress === 100
                          ? 'bg-emerald-500'
                          : 'bg-purple-500'
                      }`}
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{m.keyDeliverables[0]}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{m.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: ATS Highlights, Portfolio Snapshot & Mock Interview */}
        <div className="space-y-6">
          {/* ATS Insights Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>ATS Keyword Match</span>
              </h2>
              <button
                onClick={() => setActiveTab('resume')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Scan Details
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">
                Matched Keywords ({atsAnalysis.matchedKeywords.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {atsAnalysis.matchedKeywords.slice(0, 6).map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">
                Recommended Keywords to Add
              </p>
              <div className="flex flex-wrap gap-1.5">
                {atsAnalysis.missingKeywords.slice(0, 4).map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 text-xs font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                "{atsAnalysis.summary}"
              </p>
            </div>
          </div>

          {/* Mock Interview Prompt Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800/90 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <MessageSquareCode className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Interview Prep Spotlight
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              "How would you design an idempotent distributed payment pipeline that prevents double charges?"
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Practice answering with the STAR formula and get instant AI feedback on architectural completeness.
            </p>

            <button
              onClick={() => setActiveTab('interview')}
              className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition"
            >
              Start Mock Answer
            </button>
          </div>

          {/* Portfolio Projects Snapshot */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-indigo-500" />
                <span>Featured Project</span>
              </h2>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                All Projects
              </button>
            </div>

            {projects[0] && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {projects[0].name}
                  </span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    ★ {projects[0].stars}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {projects[0].tagline}
                </p>
                <div className="flex flex-wrap gap-1">
                  {projects[0].techStack.slice(0, 3).map((st) => (
                    <span key={st} className="px-1.5 py-0.5 text-[10px] rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
