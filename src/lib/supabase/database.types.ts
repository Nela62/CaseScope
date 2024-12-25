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
      documents: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      hearing_cases: {
        Row: {
          case_numbers: string[]
          created_at: string
          decision: string
          document_id: string
          hearing_dates: string[]
          hearing_officer: string
          id: string
          landlord_name: string
          length_of_tenancy: string
          property_address: Json
          reasoning: string
          total_relief_granted: number
          updated_at: string
          user_id: string
        }
        Insert: {
          case_numbers: string[]
          created_at?: string
          decision: string
          document_id: string
          hearing_dates: string[]
          hearing_officer: string
          id?: string
          landlord_name: string
          length_of_tenancy: string
          property_address: Json
          reasoning: string
          total_relief_granted: number
          updated_at?: string
          user_id: string
        }
        Update: {
          case_numbers?: string[]
          created_at?: string
          decision?: string
          document_id?: string
          hearing_dates?: string[]
          hearing_officer?: string
          id?: string
          landlord_name?: string
          length_of_tenancy?: string
          property_address?: Json
          reasoning?: string
          total_relief_granted?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hearing_cases_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          case_id: string
          category: string | null
          created_at: string
          decision: string | null
          document_id: string | null
          duration: string | null
          id: string
          issue_details: string | null
          landlord_counterarguments: string[] | null
          landlord_evidence: string[] | null
          name: string | null
          relief_amount: number | null
          relief_description: string | null
          relief_granted: boolean | null
          relief_reason: string | null
          tenant_evidence: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          case_id: string
          category?: string | null
          created_at?: string
          decision?: string | null
          document_id?: string | null
          duration?: string | null
          id?: string
          issue_details?: string | null
          landlord_counterarguments?: string[] | null
          landlord_evidence?: string[] | null
          name?: string | null
          relief_amount?: number | null
          relief_description?: string | null
          relief_granted?: boolean | null
          relief_reason?: string | null
          tenant_evidence?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          case_id?: string
          category?: string | null
          created_at?: string
          decision?: string | null
          document_id?: string | null
          duration?: string | null
          id?: string
          issue_details?: string | null
          landlord_counterarguments?: string[] | null
          landlord_evidence?: string[] | null
          name?: string | null
          relief_amount?: number | null
          relief_description?: string | null
          relief_granted?: boolean | null
          relief_reason?: string | null
          tenant_evidence?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "hearing_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

