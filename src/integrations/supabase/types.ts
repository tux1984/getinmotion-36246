export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          is_archived?: boolean
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          is_archived?: boolean
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          priority: number
          progress_percentage: number
          relevance: string
          status: string
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
          priority?: number
          progress_percentage?: number
          relevance?: string
          status?: string
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
          priority?: number
          progress_percentage?: number
          relevance?: string
          status?: string
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
        }[]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
