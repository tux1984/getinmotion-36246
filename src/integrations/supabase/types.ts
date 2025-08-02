export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      agent_conversations: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          is_archived: boolean
          task_id: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          is_archived?: boolean
          task_id?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          is_archived?: boolean
          task_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_conversations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "agent_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_deliverables: {
        Row: {
          agent_id: string
          content: string | null
          conversation_id: string | null
          created_at: string
          description: string | null
          file_type: string
          file_url: string | null
          id: string
          metadata: Json | null
          task_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id: string
          content?: string | null
          conversation_id?: string | null
          created_at?: string
          description?: string | null
          file_type?: string
          file_url?: string | null
          id?: string
          metadata?: Json | null
          task_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          content?: string | null
          conversation_id?: string | null
          created_at?: string
          description?: string | null
          file_type?: string
          file_url?: string | null
          id?: string
          metadata?: Json | null
          task_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_deliverables_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_deliverables_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "agent_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string
          metadata: Json | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type: string
          metadata?: Json | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_tasks: {
        Row: {
          agent_id: string
          completed_at: string | null
          conversation_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          notes: string | null
          priority: number
          progress_percentage: number
          relevance: string
          resources: Json | null
          status: string
          steps_completed: Json | null
          subtasks: Json | null
          time_spent: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id: string
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: number
          progress_percentage?: number
          relevance?: string
          resources?: Json | null
          status?: string
          steps_completed?: Json | null
          subtasks?: Json | null
          time_spent?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          completed_at?: string | null
          conversation_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: number
          progress_percentage?: number
          relevance?: string
          resources?: Json | null
          status?: string
          steps_completed?: Json | null
          subtasks?: Json | null
          time_spent?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_tasks_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_usage_metrics: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          messages_count: number
          session_duration: number | null
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          messages_count?: number
          session_duration?: number | null
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          messages_count?: number
          session_duration?: number | null
          user_id?: string
        }
        Relationships: []
      }
      calculator_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          step_name: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          step_name: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          step_name?: string
        }
        Relationships: []
      }
      site_images: {
        Row: {
          alt_text: string | null
          context: string
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          key: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          context: string
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          key: string
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          context?: string
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_agents: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          is_enabled: boolean
          last_used_at: string | null
          updated_at: string
          usage_count: number
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_used_at?: string | null
          updated_at?: string
          usage_count?: number
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_used_at?: string | null
          updated_at?: string
          usage_count?: number
          user_id?: string
        }
        Relationships: []
      }
      user_chat_context: {
        Row: {
          created_at: string
          id: string
          message: string
          question_id: string | null
          role: string
          session_id: string
          step_context: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          question_id?: string | null
          role: string
          session_id: string
          step_context?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          question_id?: string | null
          role?: string
          session_id?: string
          step_context?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_master_context: {
        Row: {
          business_context: Json | null
          context_version: number | null
          conversation_insights: Json | null
          created_at: string | null
          goals_and_objectives: Json | null
          id: string
          last_updated: string | null
          preferences: Json | null
          technical_details: Json | null
          user_id: string
        }
        Insert: {
          business_context?: Json | null
          context_version?: number | null
          conversation_insights?: Json | null
          created_at?: string | null
          goals_and_objectives?: Json | null
          id?: string
          last_updated?: string | null
          preferences?: Json | null
          technical_details?: Json | null
          user_id: string
        }
        Update: {
          business_context?: Json | null
          context_version?: number | null
          conversation_insights?: Json | null
          created_at?: string | null
          goals_and_objectives?: Json | null
          id?: string
          last_updated?: string | null
          preferences?: Json | null
          technical_details?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_maturity_scores: {
        Row: {
          created_at: string
          id: string
          idea_validation: number
          market_fit: number
          monetization: number
          profile_data: Json | null
          user_experience: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_validation: number
          market_fit: number
          monetization: number
          profile_data?: Json | null
          user_experience: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_validation?: number
          market_fit?: number
          monetization?: number
          profile_data?: Json | null
          user_experience?: number
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          city: string | null
          copilots_interest: string[] | null
          country: string | null
          created_at: string
          description: string | null
          email: string
          full_name: string
          id: string
          language: string | null
          phone: string | null
          problem_to_solve: string | null
          role: string | null
          sector: string | null
        }
        Insert: {
          city?: string | null
          copilots_interest?: string[] | null
          country?: string | null
          created_at?: string
          description?: string | null
          email: string
          full_name: string
          id?: string
          language?: string | null
          phone?: string | null
          problem_to_solve?: string | null
          role?: string | null
          sector?: string | null
        }
        Update: {
          city?: string | null
          copilots_interest?: string[] | null
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string
          full_name?: string
          id?: string
          language?: string | null
          phone?: string | null
          problem_to_solve?: string | null
          role?: string | null
          sector?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      disable_agent: {
        Args: { p_user_id: string; p_agent_id: string }
        Returns: undefined
      }
      get_latest_maturity_scores: {
        Args: { user_uuid: string }
        Returns: {
          idea_validation: number
          user_experience: number
          market_fit: number
          monetization: number
          created_at: string
          profile_data: Json
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_authorized_user: {
        Args: { user_email: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
