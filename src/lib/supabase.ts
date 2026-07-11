import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'student' | 'teacher' | 'admin';

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  institution: string | null;
  subject_focus: string | null;
  xp: number;
  level: number;
  streak_days: number;
  coins: number;
  productivity_score: number;
  focus_score: number;
  last_active_date: string | null;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  model: string;
  subject: string | null;
  is_pinned: boolean;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  note_type: string;
  subject: string | null;
  tags: string[];
  source_type: string | null;
  source_url: string | null;
  is_pinned: boolean;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  user_id: string;
  title: string;
  subject: string | null;
  difficulty: string;
  quiz_type: string;
  questions: QuizQuestion[];
  time_limit_minutes: number | null;
  total_questions: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  type: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  subject: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  xp_reward: number;
  coin_reward: number;
  created_at: string;
}
