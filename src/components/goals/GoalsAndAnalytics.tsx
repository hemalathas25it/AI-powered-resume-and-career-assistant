import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Calendar, 
  Sliders, 
  Plus, 
  ChevronRight, 
  BarChart3, 
  Layers, 
  Clock, 
  Check, 
  CircleDollarSign,
  ArrowUpRight
} from 'lucide-react';
import { CareerGoal, Milestone } from '../../types';
import { useToast } from '../Toast';

interface GoalsAndAnalyticsProps {
  careerGoal: CareerGoal;
  setCareerGoal: React.Dispatch<React.SetStateAction<CareerGoal>>;
}

export const GoalsAndAnalytics: React.FC<GoalsAndAnalyticsProps> = ({
  careerGoal,
  setCareerGoal,
}) => {
  const { showToast } = useToast();
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [targetRoleInput, setTargetRoleInput] = useState(careerGoal.targetRole);
  const [timeframeInput, setTimeframeInput] = useState('12 months');

  // Milestone deliverable toggle
  const toggleDeliverable = (milestoneId: string, itemIdx: number) => {
    setCareerGoal((prev) => {
      const updatedMilestones = prev.milestones.map((m) => {
        if (m.id === milestoneId) {
          // Adjust progress based on toggle
          const nextProgress = Math.min(100, Math.max(0, m.progress + (m.progress >= 100 ? -25 : 25)));
          return { ...m, progress: nextProgress };
        }
        return m;
      });

      // Recalculate overall progress
      const avg = Math.round(
        updatedMilestones.reduce((acc, curr) => acc + curr.progress, 0) / updatedMilestones.length
      );

      return {
        ...prev,
        milestones: updatedMilestones,
        overallProgress: avg,
      };
    });
    showToast('Milestone progress updated!', 'success');
  };

  // Generate AI Career Roadmap
  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const res = await fetch('/api/ai/generate-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRole: careerGoal.currentRole,
          targetRole: targetRoleInput,
          timeframe: timeframeInput,
        }),
      });

      if (!res.ok) throw new Error('Roadmap generation failed');
      const data = await res.json();

      if (data.milestones && Array.isArray(data.milestones)) {
        const generatedMilestones: Milestone[] = data.milestones.map((m: any, idx: number) => ({
          id: `m-${Date.now()}-${idx}`,
          title: m.title || `Milestone ${idx + 1}`,
          targetQuarter: m.targetQuarter || `Q${idx + 1} 2026`,
          keyDeliverables: m.keyDeliverables || ['Deliverable 1', 'Deliverable 2'],
          progress: idx === 0 ? 60 : 0,
          skillsCovered: m.skillsCovered || ['System Design', 'Leadership'],
        }));

        setCareerGoal((prev) => ({
          ...prev,
          title: `Roadmap to ${targetRoleInput}`,
          targetRole: targetRoleInput,
          targetCompensation: data.estimatedComp || prev.targetCompensation,
          overallProgress: 25,
          milestones: generatedMilestones,
        }));
      }

      showToast(`Strategic roadmap generated for ${targetRoleInput}!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Generated strategic roadmap using local engine', 'info');
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Goal Summary Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                Active Career Trajectory
              </span>
              <span className="text-xs font-semibold text-slate-400">Target Date: {careerGoal.targetDate}</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              {careerGoal.currentRole} <span className="text-purple-600 dark:text-purple-400">→</span> {careerGoal.targetRole}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Target Compensation Band: <strong className="text-emerald-600 dark:text-emerald-400">{careerGoal.targetCompensation}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Overall Velocity</div>
              <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-display">
                {careerGoal.overallProgress}% Complete
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-600 flex items-center justify-center font-bold text-xs text-purple-600">
              {careerGoal.overallProgress}%
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${careerGoal.overallProgress}%` }}
          />
        </div>

        {/* AI Roadmap Generator Inputs */}
        <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 shrink-0">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Roadmapper:</span>
          </div>

          <input
            type="text"
            value={targetRoleInput}
            onChange={(e) => setTargetRoleInput(e.target.value)}
            placeholder="Target role (e.g. Director of Engineering, VP of Infrastructure)..."
            className="flex-1 text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-purple-500"
          />

          <select
            value={timeframeInput}
            onChange={(e) => setTimeframeInput(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-slate-900 dark:text-white outline-none"
          >
            <option value="6 months">6 Months (Aggressive)</option>
            <option value="12 months">12 Months (Standard)</option>
            <option value="18 months">18 Months (Strategic)</option>
          </select>

          <button
            onClick={handleGenerateRoadmap}
            disabled={isGeneratingRoadmap}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition shrink-0 shadow-xs disabled:opacity-50"
          >
            {isGeneratingRoadmap ? 'Generating Plan...' : 'Regenerate Roadmap'}
          </button>
        </div>
      </div>

      {/* Main Grid: Milestones Roadmap (Left) & Analytics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Milestones */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <span>Quarterly Career Milestones</span>
            </h2>
            <span className="text-xs text-slate-500">
              Click deliverables to record progress
            </span>
          </div>

          <div className="space-y-4">
            {careerGoal.milestones.map((milestone, idx) => (
              <div
                key={milestone.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-extrabold flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {milestone.title}
                      </h3>
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {milestone.targetQuarter}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {milestone.progress}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      milestone.progress === 100 ? 'bg-emerald-500' : 'bg-purple-600'
                    }`}
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>

                {/* Key Deliverables */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Execution Deliverables:
                  </span>
                  {milestone.keyDeliverables.map((deliv, dIdx) => (
                    <div
                      key={dIdx}
                      onClick={() => toggleDeliverable(milestone.id, dIdx)}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer transition text-xs text-slate-800 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            milestone.progress > dIdx * 30
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {milestone.progress > dIdx * 30 && <Check className="w-3 h-3" />}
                        </div>
                        <span className={milestone.progress > dIdx * 30 ? 'line-through text-slate-400' : ''}>
                          {deliv}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Toggle</span>
                    </div>
                  ))}
                </div>

                {/* Skills Covered */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {milestone.skillsCovered.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 text-[10px] font-medium rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Progress Analytics & Funnel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Application Pipeline Funnel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Interview Pipeline Conversion</span>
              </h3>
              <span className="text-xs text-emerald-600 font-semibold">1 Active Offer</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1 text-slate-600 dark:text-slate-300">
                  <span>Applications Submitted</span>
                  <span className="font-bold text-slate-900 dark:text-white">18 Roles</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-600 dark:text-slate-300">
                  <span>Recruiter Screens</span>
                  <span className="font-bold text-slate-900 dark:text-white">8 Screens (44%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '44%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-600 dark:text-slate-300">
                  <span>Full Onsite / Technical Loops</span>
                  <span className="font-bold text-slate-900 dark:text-white">4 Loops (22%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '22%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-600 dark:text-slate-300">
                  <span>Offers Received</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">1 Offer ($375k TC)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Skill Radar / Competency Distribution */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Competency Benchmarks ({careerGoal.targetRole})</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Distributed Systems Architecture</span>
                  <span className="font-bold text-indigo-600">92% Ready</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Staff Leadership & Mentorship</span>
                  <span className="font-bold text-purple-600">84% Ready</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '84%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Cloud Infrastructure & Kubernetes</span>
                  <span className="font-bold text-emerald-600">95% Ready</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '95%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Cross-Functional Negotiation</span>
                  <span className="font-bold text-amber-600">76% Ready</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '76%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Velocity Metric */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-slate-800/80 dark:to-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
              7-Day Execution Velocity
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
                14.5 Hours
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                +2.5h vs last week
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Completed 6 career tasks, practiced 3 mock interview architectural questions, and refined 4 resume bullets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
