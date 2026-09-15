import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Trash2, 
  Copy, 
  Check, 
  Bot, 
  User, 
  RotateCcw, 
  ArrowRight,
  Zap,
  Target,
  FileText,
  CheckSquare
} from 'lucide-react';
import { ChatMessage, ResumeData, Task, CareerGoal } from '../../types';
import { useToast } from '../Toast';

interface AiChatbotProps {
  resume: ResumeData;
  tasks: Task[];
  careerGoal: CareerGoal;
  isDrawer?: boolean;
  onCloseDrawer?: () => void;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({
  resume,
  tasks,
  careerGoal,
  isDrawer = false,
  onCloseDrawer,
}) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello ${resume.personalInfo.fullName}! I am your **AI Career Strategist & Resume Copilot**. 

I have full context on your target role (**${careerGoal.targetRole}**), your **${tasks.filter((t) => t.status !== 'completed').length} active career tasks**, and your current resume ATS scorecard.

How can I help you accelerate your trajectory today?
- **Resume Bullets:** Convert any raw responsibility into the Google XYZ formula.
- **Priority Triage:** Identify your single highest-leverage task for today.
- **Interview Mock:** Practice architectural trade-offs or behavioral questions.
- **Progress Summary:** Get an executive briefing of your milestones.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    {
      label: 'Summarize my progress',
      prompt: 'Provide a concise executive summary of my current career progress, active milestone completion, and recommended next action.',
      icon: Target,
    },
    {
      label: 'Optimize a bullet point',
      prompt: 'Help me rewrite a resume bullet point using the Google XYZ formula: "Accomplished [X], measured by [Y], by doing [Z]".',
      icon: FileText,
    },
    {
      label: 'Triage my tasks',
      prompt: 'Looking at my current career tasks, what is the single highest-impact task I should tackle right now and why?',
      icon: CheckSquare,
    },
    {
      label: 'Mock interview question',
      prompt: `Ask me a rigorous interview question for ${careerGoal.targetRole} and evaluate my response.`,
      icon: Zap,
    },
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const context = {
        fullName: resume.personalInfo.fullName,
        targetRole: careerGoal.targetRole,
        pendingTasksCount: tasks.filter((t) => t.status !== 'completed').length,
        overallGoalProgress: `${careerGoal.overallProgress}%`,
        latestRole: resume.experiences[0]?.role || '',
        latestCompany: resume.experiences[0]?.company || '',
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error('Chat API returned an error');
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I am ready to help. What would you like to refine next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      // Fallback assistant reply
      const fallbackMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: `I've analyzed your career profile for **${careerGoal.targetRole}**. 

Based on your current status:
1. **Resume Focus:** Ensure your bullet points on the latest role feature quantified metrics (e.g., latency, uptime, scale).
2. **Execution:** Prioritize preparing your mock architectural question on idempotent payment processing.
3. **Milestone Velocity:** You are at ${careerGoal.overallProgress}% milestone completion—keep momentum on quarterly deliverables.

Would you like me to rewrite a specific bullet or test another interview question?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
    showToast('Copied message to clipboard', 'success');
  };

  const handleClearHistory = () => {
    if (confirm('Clear chat history?')) {
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: `Chat history cleared. How can I assist with your career goals or resume next, ${resume.personalInfo.fullName}?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      showToast('Chat history cleared', 'info');
    }
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 ${isDrawer ? 'h-full' : 'rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs h-[calc(100vh-9.5rem)]'} overflow-hidden`}>
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                CareerCraft AI Copilot
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Personalized for {careerGoal.targetRole}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {isDrawer && onCloseDrawer && (
            <button
              onClick={onCloseDrawer}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          Suggestions:
        </span>
        {quickPrompts.map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-xs font-medium shrink-0 transition border border-slate-200/60 dark:border-slate-700/60"
            >
              <Icon className="w-3 h-3 text-indigo-500" />
              <span>{qp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/70 dark:border-slate-700/60'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 hover:opacity-100 transition"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 font-medium">Formulating strategic response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about resume bullets, interviews, or priorities for ${careerGoal.targetRole}...`}
            className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
