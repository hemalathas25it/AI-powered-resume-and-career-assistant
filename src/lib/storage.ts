import { 
  ResumeData, 
  Task, 
  CareerGoal, 
  PortfolioProject, 
  ATSAnalysis 
} from '../types';
import { 
  initialResumeData, 
  initialTasks, 
  initialCareerGoal, 
  initialProjects, 
  initialATSAnalysis 
} from './initialData';

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`careercraft_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`careercraft_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to storage:`, e);
  }
}

export function loadResume(): ResumeData {
  return loadFromStorage<ResumeData>('resume', initialResumeData);
}

export function saveResume(data: ResumeData): void {
  saveToStorage<ResumeData>('resume', data);
}

export function loadTasks(): Task[] {
  return loadFromStorage<Task[]>('tasks', initialTasks);
}

export function saveTasks(data: Task[]): void {
  saveToStorage<Task[]>('tasks', data);
}

export function loadCareerGoal(): CareerGoal {
  return loadFromStorage<CareerGoal>('careerGoal', initialCareerGoal);
}

export function saveCareerGoal(data: CareerGoal): void {
  saveToStorage<CareerGoal>('careerGoal', data);
}

export function loadProjects(): PortfolioProject[] {
  return loadFromStorage<PortfolioProject[]>('projects', initialProjects);
}

export function saveProjects(data: PortfolioProject[]): void {
  saveToStorage<PortfolioProject[]>('projects', data);
}

export function loadATSAnalysis(): ATSAnalysis {
  return loadFromStorage<ATSAnalysis>('atsAnalysis', initialATSAnalysis);
}

export function saveATSAnalysis(data: ATSAnalysis): void {
  saveToStorage<ATSAnalysis>('atsAnalysis', data);
}

export function loadDarkMode(): boolean {
  return loadFromStorage<boolean>('darkMode', false);
}

export function saveDarkMode(isDark: boolean): void {
  saveToStorage<boolean>('darkMode', isDark);
}
