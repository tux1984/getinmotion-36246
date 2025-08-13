
import { AgentTask, TaskSubtask, TaskResource } from '../types/agentTaskTypes';

// Helper function to safely parse JSON data from database
export const parseJsonField = <T>(field: any, defaultValue: T): T => {
  if (field === null || field === undefined) return defaultValue;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return defaultValue;
    }
  }
  if (Array.isArray(field) || typeof field === 'object') {
    return field as T;
  }
  return defaultValue;
};

// Goal labels and sanitization helpers
const GOAL_LABELS: Record<string, string> = {
  scale_operations: 'Scale operations',
  automate_processes: 'Automate processes',
  expand_market: 'Expand market',
  improve_efficiency: 'Improve efficiency',
  build_brand: 'Build brand',
  increase_revenue: 'Increase revenue',
  reduce_costs: 'Reduce costs',
  improve_ux: 'Improve UX',
  launch_mvp: 'Launch MVP'
};

const toTitleCase = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase());

export const replaceGoalArrayInText = (text: any): string => {
  if (text === null || text === undefined) return '';
  const str = String(text);
  
  // Updated regex to match the actual JSON array format from database
  const pattern = /\['[a-z_]+'(?:,'[a-z_]+')*\]|\["[a-z_]+"(?:,"[a-z_]+")*\]/g;
  
  return str.replace(pattern, (match) => {
    try {
      const arr = JSON.parse(match) as string[];
      if (Array.isArray(arr)) {
        return arr
          .map(key => GOAL_LABELS[key] || toTitleCase(key.replace(/_/g, ' ')))
          .join(', ');
      }
      return match;
    } catch {
      // If JSON.parse fails, try to extract the values manually
      const values = match.match(/[a-z_]+/g);
      if (values) {
        return values
          .map(key => GOAL_LABELS[key] || toTitleCase(key.replace(/_/g, ' ')))
          .join(', ');
      }
      return match;
    }
  });
};

// Format task titles for display - replace goal arrays with brand name
export const formatTaskTitleForDisplay = (title: string, brandName?: string): string => {
  // First, clean the title from any remaining JSON arrays or goal lists
  let cleanTitle = replaceGoalArrayInText(title);
  
  if (!brandName) return cleanTitle;
  
  // Replace goal lists with brand name
  const goalPattern = /\b(Scale operations|Automate processes|Expand market|Improve efficiency|Build brand|Increase revenue|Reduce costs|Improve UX|Launch MVP)(?:,\s*[A-Z][a-z\s,]+)*\b/g;
  
  return cleanTitle.replace(goalPattern, brandName);
};

// Helper function to convert database row to AgentTask
export const convertToAgentTask = (data: any): AgentTask => ({
  ...data,
  title: replaceGoalArrayInText(data.title),
  description: replaceGoalArrayInText(data.description || ''),
  relevance: data.relevance as 'low' | 'medium' | 'high',
  status: data.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
  subtasks: parseJsonField<TaskSubtask[]>(data.subtasks, []),
  notes: data.notes || '',
  steps_completed: parseJsonField<Record<string, boolean>>(data.steps_completed, {}),
  resources: parseJsonField<TaskResource[]>(data.resources, []),
  time_spent: data.time_spent || 0,
  is_archived: data.is_archived || false
});

// Helper function to convert AgentTask fields to database format
export const convertForDatabase = (data: Partial<AgentTask>) => {
  const dbData: any = { ...data };
  
  // Remove fields that are auto-generated or managed by the database
  delete dbData.id;
  delete dbData.created_at;
  delete dbData.updated_at;
  
  return dbData;
};
