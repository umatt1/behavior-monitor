export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      incidents: {
        Row: {
          id: string
          created_at: string
          user_id: string
          date: string
          category: 'Verbal' | 'Physical' | 'Emotional' | 'Financial' | 'Other'
          severity: number
          description: string
          location: string | null
          witnesses: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          date: string
          category: 'Verbal' | 'Physical' | 'Emotional' | 'Financial' | 'Other'
          severity: number
          description: string
          location?: string | null
          witnesses?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          date?: string
          category?: 'Verbal' | 'Physical' | 'Emotional' | 'Financial' | 'Other'
          severity?: number
          description?: string
          location?: string | null
          witnesses?: string | null
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          updated_at: string
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          updated_at?: string
        }
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
  }
}
