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
      profiles: {
        Row: {
          id: string
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          dietary_preferences: string[]
          allergies: string[]
          fitness_goals: string[]
          budget: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dietary_preferences?: string[]
          allergies?: string[]
          fitness_goals?: string[]
          budget?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          dietary_preferences?: string[]
          allergies?: string[]
          fitness_goals?: string[]
          budget?: number
          created_at?: string
          updated_at?: string
        }
      }
      grocery_items: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          expiration_date: string | null
          purchased: boolean
          price: number | null
          store: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category?: string
          expiration_date?: string | null
          purchased?: boolean
          price?: number | null
          store?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          expiration_date?: string | null
          purchased?: boolean
          price?: number | null
          store?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stores: {
        Row: {
          id: string
          name: string
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string | null
          created_at?: string
        }
      }
    }
  }
}