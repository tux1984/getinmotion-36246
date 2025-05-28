import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UserProject {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface UserAgent {
  id: string;
  user_id: string;
  agent_id: string;
  is_enabled: boolean;
  last_used_at: string | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface AgentMetrics {
  total_sessions: number;
  total_messages: number;
  avg_session_duration: number;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [agents, setAgents] = useState<UserAgent[]>([]);
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'
          })
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Error al cargar el perfil del usuario');
    }
  };

  const fetchUserProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching user projects:', err);
      setError('Error al cargar los proyectos');
    }
  };

  const fetchUserAgents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_agents')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setAgents(data || []);
    } catch (err) {
      console.error('Error fetching user agents:', err);
      setError('Error al cargar los agentes');
    }
  };

  const fetchAgentMetrics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agent_usage_metrics')
        .select('session_duration, messages_count')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalSessions = data?.length || 0;
      const totalMessages = data?.reduce((sum, metric) => sum + metric.messages_count, 0) || 0;
      const avgSessionDuration = totalSessions > 0 
        ? data?.reduce((sum, metric) => sum + (metric.session_duration || 0), 0) / totalSessions 
        : 0;

      setMetrics({
        total_sessions: totalSessions,
        total_messages: totalMessages,
        avg_session_duration: avgSessionDuration
      });
    } catch (err) {
      console.error('Error fetching agent metrics:', err);
    }
  };

  const createProject = async (title: string, description?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_projects')
        .insert({
          user_id: user.id,
          title,
          description
        })
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<UserProject>) => {
    try {
      const { data, error } = await supabase
        .from('user_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  const enableAgent = async (agentId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_agents')
        .upsert({
          user_id: user.id,
          agent_id: agentId,
          is_enabled: true
        })
        .select()
        .single();

      if (error) throw error;
      
      setAgents(prev => {
        const existing = prev.find(a => a.agent_id === agentId);
        if (existing) {
          return prev.map(a => a.agent_id === agentId ? data : a);
        } else {
          return [...prev, data];
        }
      });
    } catch (err) {
      console.error('Error enabling agent:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disableAgent = async (agentId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase.rpc('disable_agent', {
        p_user_id: user.id,
        p_agent_id: agentId
      });

      if (error) throw error;
      
      // Update local state
      setAgents(prev => prev.map(a => 
        a.agent_id === agentId 
          ? { ...a, is_enabled: false, updated_at: new Date().toISOString() }
          : a
      ));
    } catch (err) {
      console.error('Error disabling agent:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const trackAgentUsage = async (agentId: string, sessionDuration?: number, messagesCount: number = 1) => {
    if (!user) return;

    try {
      // Record usage metrics
      await supabase
        .from('agent_usage_metrics')
        .insert({
          user_id: user.id,
          agent_id: agentId,
          session_duration: sessionDuration,
          messages_count: messagesCount
        });

      // Update agent usage count and last used
      await supabase
        .from('user_agents')
        .upsert({
          user_id: user.id,
          agent_id: agentId,
          is_enabled: true,
          last_used_at: new Date().toISOString(),
          usage_count: 1 // This will be incremented by the trigger
        });

      // Refresh data
      await fetchUserAgents();
      await fetchAgentMetrics();
    } catch (err) {
      console.error('Error tracking agent usage:', err);
    }
  };

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        setError(null);
        
        await Promise.all([
          fetchUserProfile(),
          fetchUserProjects(),
          fetchUserAgents(),
          fetchAgentMetrics()
        ]);
        
        setLoading(false);
      };
      
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    profile,
    projects,
    agents,
    metrics,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    enableAgent,
    disableAgent,
    trackAgentUsage,
    refetch: () => {
      if (user) {
        fetchUserProfile();
        fetchUserProjects();
        fetchUserAgents();
        fetchAgentMetrics();
      }
    }
  };
};
