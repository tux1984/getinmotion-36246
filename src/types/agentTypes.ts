
export interface AgentFilter {
  searchTerm: string;
  selectedCategories: string[];
  selectedStatus: 'all' | 'active' | 'inactive' | 'recommended';
  selectedPriority: 'all' | 'Alta' | 'Media' | 'Baja';
  sortBy: 'name' | 'usage' | 'impact';
}

export interface AgentStats {
  totalAgents: number;
  activeAgents: number;
  recommendedAgents: number;
  efficiencyRate: number;
}

export interface AgentToggleState {
  togglingAgents: Set<string>;
  isToggling: (agentId: string) => boolean;
  startToggle: (agentId: string) => void;
  endToggle: (agentId: string) => void;
}

export interface FilteredAgent {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: string;
  impact: number;
  color: string;
  icon: React.ReactNode;
}

export interface GroupedAgents {
  [category: string]: FilteredAgent[];
}
