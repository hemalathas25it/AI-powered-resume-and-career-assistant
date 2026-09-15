export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskCategory = 'application' | 'interview' | 'skill' | 'networking' | 'portfolio' | 'general';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: PriorityLevel;
  status: TaskStatus;
  dueDate: string;
  estimatedMinutes?: number;
  aiSuggested?: boolean;
  aiReasoning?: string;
  createdAt: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ResumeProject {
  id: string;
  title: string;
  role?: string;
  description: string;
  techStack: string[];
  link?: string;
  github?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: SkillGroup[];
  projects: ResumeProject[];
  certifications: Certification[];
}

export interface ATSAnalysis {
  atsScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  actionVerbScore: number;
  quantifiableMetricsScore: number;
  formattingScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  bulletEnhancements: Array<{
    original: string;
    suggested: string;
    rationale: string;
  }>;
}

export interface GoalMilestone {
  id: string;
  title: string;
  targetQuarter: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
  keyDeliverables: string[];
  skillsCovered?: string[];
}

export type Milestone = GoalMilestone;

export interface SkillGap {
  skill: string;
  currentLevel: number; // 1 - 10
  targetLevel: number; // 1 - 10
  priority: 'critical' | 'high' | 'medium';
}

export interface CareerGoal {
  id: string;
  title: string;
  targetRole: string;
  currentRole: string;
  targetSalary?: string;
  targetCompensation?: string;
  timeline?: string;
  targetDate?: string;
  overallProgress: number;
  milestones: GoalMilestone[];
  skillGaps?: SkillGap[];
}

export interface PortfolioProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  status: 'completed' | 'in-development' | 'planned';
  demoUrl?: string;
  githubUrl?: string;
  stars?: number;
  impactMetrics: string[];
  resumeBullets: string[];
}

export interface ChatMessage {
  id: string;
  sender?: 'user' | 'assistant';
  role?: 'user' | 'assistant';
  text?: string;
  content: string;
  timestamp: string;
  suggestions?: string[];
  mode?: 'resume' | 'prioritization' | 'interview' | 'goals' | 'summary' | 'general';
}

export interface InterviewQuestion {
  id: string;
  type: string;
  question: string;
  starTips: string;
  sampleAnswer: string;
  keyEvaluationCriteria: string[];
}

export type NavigationTab =
  | 'dashboard'
  | 'resume'
  | 'tasks'
  | 'projects'
  | 'goals'
  | 'analytics'
  | 'interview'
  | 'copilot'
  | 'chat';
