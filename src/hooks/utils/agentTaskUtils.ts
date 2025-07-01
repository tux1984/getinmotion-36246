
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

// Helper function to convert database row to AgentTask
export const convertToAgentTask = (data: any): AgentTask => ({
  ...data,
  relevance: data.relevance as 'low' | 'medium' | 'high',
  status: data.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
  subtasks: parseJsonField<TaskSubtask[]>(data.subtasks, []),
  notes: data.notes || '',
  steps_completed: parseJsonField<Record<string, boolean>>(data.steps_completed, {}),
  resources: parseJsonField<TaskResource[]>(data.resources, []),
  time_spent: data.time_spent || 0
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
