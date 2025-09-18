export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      access_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          current_uses: number
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          current_uses?: number
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          updated_at?: string
        }
        Relationships: []
      }
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
          is_archived: boolean
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
          is_archived?: boolean
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
          is_archived?: boolean
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
      artisan_analytics: {
        Row: {
          created_at: string
          date: string
          id: string
          orders: number | null
          products_added: number | null
          revenue: number | null
          shop_id: string
          views: number | null
          visitors: number | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          orders?: number | null
          products_added?: number | null
          revenue?: number | null
          shop_id: string
          views?: number | null
          visitors?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          orders?: number | null
          products_added?: number | null
          revenue?: number | null
          shop_id?: string
          views?: number | null
          visitors?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "artisan_analytics_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "artisan_shops"
            referencedColumns: ["id"]
          },
        ]
      }
      artisan_shops: {
        Row: {
          active: boolean
          banner_url: string | null
          certifications: Json | null
          contact_info: Json | null
          craft_type: string | null
          created_at: string
          creation_status: string | null
          creation_step: number | null
          data_classification: Json | null
          description: string | null
          featured: boolean
          id: string
          logo_url: string | null
          privacy_level: string | null
          public_profile: Json | null
          region: string | null
          seo_data: Json | null
          shop_name: string
          shop_slug: string
          social_links: Json | null
          story: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          banner_url?: string | null
          certifications?: Json | null
          contact_info?: Json | null
          craft_type?: string | null
          created_at?: string
          creation_status?: string | null
          creation_step?: number | null
          data_classification?: Json | null
          description?: string | null
          featured?: boolean
          id?: string
          logo_url?: string | null
          privacy_level?: string | null
          public_profile?: Json | null
          region?: string | null
          seo_data?: Json | null
          shop_name: string
          shop_slug: string
          social_links?: Json | null
          story?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          banner_url?: string | null
          certifications?: Json | null
          contact_info?: Json | null
          craft_type?: string | null
          created_at?: string
          creation_status?: string | null
          creation_step?: number | null
          data_classification?: Json | null
          description?: string | null
          featured?: boolean
          id?: string
          logo_url?: string | null
          privacy_level?: string | null
          public_profile?: Json | null
          region?: string | null
          seo_data?: Json | null
          shop_name?: string
          shop_slug?: string
          social_links?: Json | null
          story?: string | null
          updated_at?: string
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
      cart_items: {
        Row: {
          created_at: string
          id: string
          price: number
          product_id: string
          quantity: number
          session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          product_id: string
          quantity?: number
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          product_id?: string
          quantity?: number
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      data_access_audit: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          currency: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          fulfillment_status: string | null
          id: string
          items: Json
          notes: string | null
          order_number: string
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json
          shipping_cost: number | null
          shop_id: string
          status: string
          subtotal: number
          tax: number | null
          total: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          currency?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          fulfillment_status?: string | null
          id?: string
          items: Json
          notes?: string | null
          order_number: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address: Json
          shipping_cost?: number | null
          shop_id: string
          status?: string
          subtotal: number
          tax?: number | null
          total: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          currency?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          fulfillment_status?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json
          shipping_cost?: number | null
          shop_id?: string
          status?: string
          subtotal?: number
          tax?: number | null
          total?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "artisan_shops"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          category: string | null
          category_id: string | null
          compare_price: number | null
          created_at: string
          customizable: boolean | null
          description: string | null
          dimensions: Json | null
          featured: boolean
          id: string
          images: Json | null
          inventory: number | null
          materials: Json | null
          name: string
          price: number
          production_time: string | null
          seo_data: Json | null
          shop_id: string
          short_description: string | null
          sku: string | null
          subcategory: string | null
          tags: Json | null
          techniques: Json | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          active?: boolean
          category?: string | null
          category_id?: string | null
          compare_price?: number | null
          created_at?: string
          customizable?: boolean | null
          description?: string | null
          dimensions?: Json | null
          featured?: boolean
          id?: string
          images?: Json | null
          inventory?: number | null
          materials?: Json | null
          name: string
          price: number
          production_time?: string | null
          seo_data?: Json | null
          shop_id: string
          short_description?: string | null
          sku?: string | null
          subcategory?: string | null
          tags?: Json | null
          techniques?: Json | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          active?: boolean
          category?: string | null
          category_id?: string | null
          compare_price?: number | null
          created_at?: string
          customizable?: boolean | null
          description?: string | null
          dimensions?: Json | null
          featured?: boolean
          id?: string
          images?: Json | null
          inventory?: number | null
          materials?: Json | null
          name?: string
          price?: number
          production_time?: string | null
          seo_data?: Json | null
          shop_id?: string
          short_description?: string | null
          sku?: string | null
          subcategory?: string | null
          tags?: Json | null
          techniques?: Json | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "artisan_shops"
            referencedColumns: ["id"]
          },
        ]
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
      step_validations: {
        Row: {
          ai_feedback: string | null
          created_at: string
          id: string
          step_id: string
          user_confirmation: string | null
          user_id: string
          validation_data: Json | null
          validation_result: string
          validation_type: string
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string
          id?: string
          step_id: string
          user_confirmation?: string | null
          user_id: string
          validation_data?: Json | null
          validation_result: string
          validation_type: string
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string
          id?: string
          step_id?: string
          user_confirmation?: string | null
          user_id?: string
          validation_data?: Json | null
          validation_result?: string
          validation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "step_validations_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "task_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      task_generation_history: {
        Row: {
          created_at: string
          generation_context: Json | null
          generation_source: string
          id: string
          tasks_created: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          generation_context?: Json | null
          generation_source: string
          id?: string
          tasks_created?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          generation_context?: Json | null
          generation_source?: string
          id?: string
          tasks_created?: number | null
          user_id?: string
        }
        Relationships: []
      }
      task_steps: {
        Row: {
          ai_assistance_log: Json | null
          ai_context_prompt: string | null
          completion_status: string
          created_at: string
          description: string
          id: string
          input_type: string
          step_number: number
          task_id: string
          title: string
          updated_at: string
          user_input_data: Json | null
          validation_criteria: Json | null
        }
        Insert: {
          ai_assistance_log?: Json | null
          ai_context_prompt?: string | null
          completion_status?: string
          created_at?: string
          description: string
          id?: string
          input_type?: string
          step_number: number
          task_id: string
          title: string
          updated_at?: string
          user_input_data?: Json | null
          validation_criteria?: Json | null
        }
        Update: {
          ai_assistance_log?: Json | null
          ai_context_prompt?: string | null
          completion_status?: string
          created_at?: string
          description?: string
          id?: string
          input_type?: string
          step_number?: number
          task_id?: string
          title?: string
          updated_at?: string
          user_input_data?: Json | null
          validation_criteria?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "task_steps_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "agent_tasks"
            referencedColumns: ["id"]
          },
        ]
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
          business_profile: Json | null
          context_version: number | null
          conversation_insights: Json | null
          created_at: string | null
          goals_and_objectives: Json | null
          id: string
          language_preference: string | null
          last_assessment_date: string | null
          last_updated: string | null
          preferences: Json | null
          task_generation_context: Json | null
          technical_details: Json | null
          user_id: string
        }
        Insert: {
          business_context?: Json | null
          business_profile?: Json | null
          context_version?: number | null
          conversation_insights?: Json | null
          created_at?: string | null
          goals_and_objectives?: Json | null
          id?: string
          language_preference?: string | null
          last_assessment_date?: string | null
          last_updated?: string | null
          preferences?: Json | null
          task_generation_context?: Json | null
          technical_details?: Json | null
          user_id: string
        }
        Update: {
          business_context?: Json | null
          business_profile?: Json | null
          context_version?: number | null
          conversation_insights?: Json | null
          created_at?: string | null
          goals_and_objectives?: Json | null
          id?: string
          language_preference?: string | null
          last_assessment_date?: string | null
          last_updated?: string | null
          preferences?: Json | null
          task_generation_context?: Json | null
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
          brand_name: string | null
          business_description: string | null
          business_goals: string[] | null
          business_location: string | null
          business_type: string | null
          created_at: string
          current_challenges: string[] | null
          current_stage: string | null
          full_name: string | null
          id: string
          initial_investment_range: string | null
          language_preference: string | null
          monthly_revenue_goal: number | null
          primary_skills: string[] | null
          sales_channels: string[] | null
          social_media_presence: Json | null
          target_market: string | null
          team_size: string | null
          time_availability: string | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"] | null
          years_in_business: number | null
        }
        Insert: {
          avatar_url?: string | null
          brand_name?: string | null
          business_description?: string | null
          business_goals?: string[] | null
          business_location?: string | null
          business_type?: string | null
          created_at?: string
          current_challenges?: string[] | null
          current_stage?: string | null
          full_name?: string | null
          id?: string
          initial_investment_range?: string | null
          language_preference?: string | null
          monthly_revenue_goal?: number | null
          primary_skills?: string[] | null
          sales_channels?: string[] | null
          social_media_presence?: Json | null
          target_market?: string | null
          team_size?: string | null
          time_availability?: string | null
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          years_in_business?: number | null
        }
        Update: {
          avatar_url?: string | null
          brand_name?: string | null
          business_description?: string | null
          business_goals?: string[] | null
          business_location?: string | null
          business_type?: string | null
          created_at?: string
          current_challenges?: string[] | null
          current_stage?: string | null
          full_name?: string | null
          id?: string
          initial_investment_range?: string | null
          language_preference?: string | null
          monthly_revenue_goal?: number | null
          primary_skills?: string[] | null
          sales_channels?: string[] | null
          social_media_presence?: Json | null
          target_market?: string | null
          team_size?: string | null
          time_availability?: string | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
          years_in_business?: number | null
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
          status: string | null
          updated_at: string | null
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
          status?: string | null
          updated_at?: string | null
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
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      audit_data_inconsistencies: {
        Args: Record<PropertyKey, never>
        Returns: {
          affected_count: number
          issue_description: string
          issue_type: string
          severity: string
          table_name: string
        }[]
      }
      check_user_exists_and_type: {
        Args: { user_email: string }
        Returns: Json
      }
      cleanup_obsolete_tasks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_secure_admin_user: {
        Args: { invited_by_admin_email: string; user_email: string }
        Returns: Json
      }
      create_user_by_type: {
        Args: {
          additional_data?: Json
          full_name: string
          selected_user_type: Database["public"]["Enums"]["user_type"]
          user_email: string
          user_password: string
        }
        Returns: Json
      }
      disable_agent: {
        Args: { p_agent_id: string; p_user_id: string }
        Returns: undefined
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_public_profile: {
        Args: {
          shop_record: Database["public"]["Tables"]["artisan_shops"]["Row"]
        }
        Returns: Json
      }
      get_all_users_combined: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          shop_name: string
          user_type: string
        }[]
      }
      get_latest_maturity_scores: {
        Args: { user_uuid: string }
        Returns: {
          created_at: string
          idea_validation: number
          market_fit: number
          monetization: number
          profile_data: Json
          user_experience: number
        }[]
      }
      get_validation_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_authorized_user: {
        Args: { user_email: string }
        Returns: boolean
      }
      repair_data_inconsistencies: {
        Args: Record<PropertyKey, never>
        Returns: {
          action_taken: string
          details: string
          records_affected: number
        }[]
      }
      sanitize_text_input: {
        Args: { max_length?: number; text_input: string }
        Returns: string
      }
      sync_active_task_limits: {
        Args: Record<PropertyKey, never>
        Returns: {
          action_taken: string
          active_count: number
          user_id: string
        }[]
      }
      validate_date_range: {
        Args: { end_date: string; start_date: string }
        Returns: boolean
      }
      validate_email_format: {
        Args: { email_input: string }
        Returns: boolean
      }
      validate_json_structure: {
        Args: { json_input: Json; required_keys: string[] }
        Returns: boolean
      }
    }
    Enums: {
      user_type: "admin" | "shop_owner" | "regular"
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
    Enums: {
      user_type: ["admin", "shop_owner", "regular"],
    },
  },
} as const
