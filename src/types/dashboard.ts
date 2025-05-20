
import { ReactNode } from 'react';

export type AgentStatus = 'active' | 'paused' | 'inactive';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  category: string;
  activeTasks: number;
  lastUsed?: string;
  color: string;
  icon: ReactNode;
}

export type ProfileType = 'idea' | 'solo' | 'team';

export type CategoryScore = {
  ideaValidation: number;
  userExperience: number;
  marketFit: number;
  monetization: number;
};

export interface RecommendedAgents {
  admin: boolean;
  accounting: boolean;
  legal: boolean;
  operations: boolean;
  cultural: boolean;
}
