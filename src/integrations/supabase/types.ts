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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_tools: {
        Row: {
          category: string | null
          cons: string[] | null
          created_at: string
          curated: boolean | null
          description: string | null
          description_hi: string | null
          editors_pick: boolean | null
          featured: boolean | null
          featured_order: number | null
          features: string[] | null
          free_limit: string | null
          free_requires_login: boolean | null
          free_tier: boolean | null
          has_watermark: boolean | null
          id: string
          input_examples: string[] | null
          last_verified_at: string | null
          logo_url: string | null
          modalities: string[] | null
          name: string
          output_examples: string[] | null
          pricing_model: string | null
          pricing_note: string | null
          pricing_url: string | null
          privacy_note: string | null
          profession_tags: string[] | null
          pros: string[] | null
          quickstart: string[] | null
          rate_limit_note: string | null
          rating: number | null
          region_limits: string | null
          requires_login: boolean | null
          reviews_count: number | null
          sample_prompts: string[] | null
          screenshots: string[] | null
          security_note: string | null
          slug: string | null
          tips: string[] | null
          updated_at: string
          use_cases: string[] | null
          verified: boolean | null
          video_url: string | null
          website_url: string | null
        }
        Insert: {
          category?: string | null
          cons?: string[] | null
          created_at?: string
          curated?: boolean | null
          description?: string | null
          description_hi?: string | null
          editors_pick?: boolean | null
          featured?: boolean | null
          featured_order?: number | null
          features?: string[] | null
          free_limit?: string | null
          free_requires_login?: boolean | null
          free_tier?: boolean | null
          has_watermark?: boolean | null
          id?: string
          input_examples?: string[] | null
          last_verified_at?: string | null
          logo_url?: string | null
          modalities?: string[] | null
          name: string
          output_examples?: string[] | null
          pricing_model?: string | null
          pricing_note?: string | null
          pricing_url?: string | null
          privacy_note?: string | null
          profession_tags?: string[] | null
          pros?: string[] | null
          quickstart?: string[] | null
          rate_limit_note?: string | null
          rating?: number | null
          region_limits?: string | null
          requires_login?: boolean | null
          reviews_count?: number | null
          sample_prompts?: string[] | null
          screenshots?: string[] | null
          security_note?: string | null
          slug?: string | null
          tips?: string[] | null
          updated_at?: string
          use_cases?: string[] | null
          verified?: boolean | null
          video_url?: string | null
          website_url?: string | null
        }
        Update: {
          category?: string | null
          cons?: string[] | null
          created_at?: string
          curated?: boolean | null
          description?: string | null
          description_hi?: string | null
          editors_pick?: boolean | null
          featured?: boolean | null
          featured_order?: number | null
          features?: string[] | null
          free_limit?: string | null
          free_requires_login?: boolean | null
          free_tier?: boolean | null
          has_watermark?: boolean | null
          id?: string
          input_examples?: string[] | null
          last_verified_at?: string | null
          logo_url?: string | null
          modalities?: string[] | null
          name?: string
          output_examples?: string[] | null
          pricing_model?: string | null
          pricing_note?: string | null
          pricing_url?: string | null
          privacy_note?: string | null
          profession_tags?: string[] | null
          pros?: string[] | null
          quickstart?: string[] | null
          rate_limit_note?: string | null
          rating?: number | null
          region_limits?: string | null
          requires_login?: boolean | null
          reviews_count?: number | null
          sample_prompts?: string[] | null
          screenshots?: string[] | null
          security_note?: string | null
          slug?: string | null
          tips?: string[] | null
          updated_at?: string
          use_cases?: string[] | null
          verified?: boolean | null
          video_url?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      collection_items: {
        Row: {
          collection_id: string
          created_at: string | null
          id: string
          rank: number | null
          tool_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string | null
          id?: string
          rank?: number | null
          tool_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string | null
          id?: string
          rank?: number | null
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "ai_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          tool_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tool_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tool_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "ai_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      professions: {
        Row: {
          created_at: string
          icon_url: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          icon_url?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          icon_url?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      remote_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value: Json
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          id: string
          rating: number
          review_text: string | null
          tool_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          tool_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          tool_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "ai_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          status: string | null
          tool_name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          tool_name: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          tool_name?: string
          user_id?: string
        }
        Relationships: []
      }
      track_usage: {
        Row: {
          favorites: number | null
          id: string
          last_opened_at: string | null
          opens: number | null
          tool_id: string
          user_id: string | null
        }
        Insert: {
          favorites?: number | null
          id?: string
          last_opened_at?: string | null
          opens?: number | null
          tool_id: string
          user_id?: string | null
        }
        Update: {
          favorites?: number | null
          id?: string
          last_opened_at?: string | null
          opens?: number | null
          tool_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "track_usage_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "ai_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflows: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          professions: string[] | null
          slug: string
          steps: Json | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          professions?: string[] | null
          slug: string
          steps?: Json | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          professions?: string[] | null
          slug?: string
          steps?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
