import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Sparkles, 
  Clock, 
  Trash2, 
  Edit3, 
  Filter, 
  Kanban, 
  List, 
  Grid, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  X,
  Calendar,
  Tag
} from 'lucide-react';
import { Task, PriorityLevel, TaskCategory, TaskStatus, CareerGoal } from '../../types';
import { useToast } from '../Toast';

interface TaskManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  careerGoal: CareerGoal;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ tasks, setTasks, careerGoal }) => {
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'matrix'>('board');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isPrioritizing, setIsPrioritizing] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'application' as TaskCategory,
    priority: 'high' as PriorityLevel,
    status: 'todo' as TaskStatus,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    estimatedMinutes: 45,
  });

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  // AI Task Prioritization
  const handleAiPrioritize = async () => {
    setIsPrioritizing(true);
    try {
      const res = await fetch('/api/ai/prioritize-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          careerGoals: [careerGoal.title, careerGoal.targetRole],
        }),
      });

      if (!res.ok) throw new Error('AI Prioritization failed');
      const data = await res.json();

      if (data.prioritizedTasks && Array.isArray(data.prioritizedTasks)) {
        setTasks((prev) =>
          prev.map((t) => {
            const match = data.prioritizedTasks.find((p: any) => p.id === t.id);
            if (match) {
              return {
                ...t,
                priority: match.suggestedPriority || t.priority,
                aiSuggested: true,
                aiReasoning: match.aiReasoning || t.aiReasoning,
              };
            }
            return t;
          })
        );
      }

      showToast(data.summary || 'Tasks reorganized by hiring impact & deadlines!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Prioritized using local strategist rules.', 'info');
    } finally {
      setIsPrioritizing(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTaskId(null);
    setFormData({
      title: '',
      description: '',
      category: 'application',
      priority: 'high',
      status: 'todo',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      estimatedMinutes: 45,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      estimatedMinutes: task.estimatedMinutes || 45,
    });
    setModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTaskId ? { ...t, ...formData } : t))
      );
      showToast('Task updated', 'success');
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('New career task created', 'success');
    }
    setModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task deleted', 'info');
  };

  const handleUpdateStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
              Career Task Management & Priorities
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
              {tasks.filter((t) => t.status !== 'completed').length} Pending
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Keep applications, networking, mock loops, and portfolio milestones moving with AI triage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
              title="Eisenhower Priority Matrix"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          {/* AI Prioritize Button */}
          <button
            onClick={handleAiPrioritize}
            disabled={isPrioritizing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isPrioritizing ? 'animate-spin' : ''}`} />
            <span>{isPrioritizing ? 'Analyzing...' : 'AI Auto-Prioritize'}</span>
          </button>

          {/* Add Task Button */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>

        {/* Category Pills */}
        {['all', 'application', 'interview', 'skill', 'networking', 'portfolio'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-full font-medium transition capitalize ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Priority Filter */}
        {['all', 'urgent', 'high', 'medium', 'low'].map((prio) => (
          <button
            key={prio}
            onClick={() => setFilterPriority(prio)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition uppercase ${
              filterPriority === prio
                ? 'bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {prio}
          </button>
        ))}
      </div>

      {/* VIEW: KANBAN BOARD */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(['todo', 'in-progress', 'completed'] as TaskStatus[]).map((statusCol) => {
            const colTasks = filteredTasks.filter((t) => t.status === statusCol);
            return (
              <div
                key={statusCol}
                className="bg-slate-50/70 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col min-h-[500px]"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        statusCol === 'todo'
                          ? 'bg-slate-400'
                          : statusCol === 'in-progress'
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span>
                      {statusCol === 'todo'
                        ? 'To Do'
                        : statusCol === 'in-progress'
                        ? 'In Progress'
                        : 'Completed'}
                    </span>
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-xs text-slate-400 italic">
                      No tasks in this stage
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl bg-white dark:bg-slate-800 border shadow-xs transition hover:shadow-md space-y-2.5 ${
                          task.priority === 'urgent'
                            ? 'border-rose-300 dark:border-rose-900/70'
                            : 'border-slate-200/80 dark:border-slate-700/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                              task.priority === 'urgent'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : task.priority === 'high'
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {task.priority}
                          </span>

                          <div className="flex items-center gap-1 text-slate-400">
                            <button
                              onClick={() => handleOpenEditModal(task)}
                              className="p-1 hover:text-indigo-600 transition"
                              title="Edit task"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 hover:text-rose-600 transition"
                              title="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                          {task.title}
                        </h4>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {task.description}
                        </p>

                        {task.aiReasoning && (
                          <div className="p-2 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-start gap-1.5 font-medium">
                            <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                            <span>{task.aiReasoning}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3" />
                            <span>{task.dueDate}</span>
                          </div>

                          {/* Quick move selector */}
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateStatus(task.id, e.target.value as TaskStatus)}
                            className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-700 border-none rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Done</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: LIST TABLE */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-10">Status</th>
                <th className="py-3.5 px-4">Task Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleUpdateStatus(task.id, task.status === 'completed' ? 'todo' : 'completed')}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        task.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">
                      {task.title}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 line-clamp-1">
                      {task.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 capitalize text-slate-600 dark:text-slate-300 font-medium">
                    {task.category}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        task.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : task.priority === 'high'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {task.dueDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEditModal(task)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW: EISENHOWER PRIORITY MATRIX */}
      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Q1: Urgent & High Priority */}
          <div className="p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Quadrant 1: Urgent & Critical Impact</span>
              </span>
              <span className="text-xs font-bold text-rose-700">DO IMMEDIATELY</span>
            </div>
            <div className="space-y-2">
              {filteredTasks
                .filter((t) => t.priority === 'urgent' && t.status !== 'completed')
                .map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900 shadow-xs">
                    <div className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-slate-500">Due: {t.dueDate}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Q2: High Impact, Long-term Strategic */}
          <div className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span>Quadrant 2: High Leverage Strategic</span>
              </span>
              <span className="text-xs font-bold text-indigo-700">SCHEDULE & FOCUS</span>
            </div>
            <div className="space-y-2">
              {filteredTasks
                .filter((t) => t.priority === 'high' && t.status !== 'completed')
                .map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900 shadow-xs">
                    <div className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-slate-500">Due: {t.dueDate}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Q3: Medium Priority */}
          <div className="p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Quadrant 3: Medium Priority / Prep
              </span>
              <span className="text-xs font-bold text-amber-700">BATCH PROCESS</span>
            </div>
            <div className="space-y-2">
              {filteredTasks
                .filter((t) => t.priority === 'medium' && t.status !== 'completed')
                .map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900 shadow-xs">
                    <div className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-slate-500">Due: {t.dueDate}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Q4: Completed / Low */}
          <div className="p-5 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Quadrant 4: Low Priority / Completed
              </span>
              <span className="text-xs font-bold text-emerald-600">ARCHIVED / DONE</span>
            </div>
            <div className="space-y-2">
              {filteredTasks
                .filter((t) => t.priority === 'low' || t.status === 'completed')
                .slice(0, 4)
                .map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs opacity-75">
                    <div className="font-semibold text-xs text-slate-900 dark:text-white line-through">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-slate-400">Status: {t.status}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Task Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {editingTaskId ? 'Edit Task' : 'Create New Career Task'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Schedule mock interview with calibrated bar raiser"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Description & Execution Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Specific links, recruiter details, or topics to practice..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="application">Application</option>
                    <option value="interview">Interview Prep</option>
                    <option value="skill">Skill Building</option>
                    <option value="networking">Networking & Referrals</option>
                    <option value="portfolio">Portfolio Project</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as PriorityLevel })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
