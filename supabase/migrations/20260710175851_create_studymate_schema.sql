
/*
# AI StudyMate – Core Schema

## Overview
Creates the complete database schema for AI StudyMate, an enterprise-grade AI-powered learning platform.

## New Tables

### 1. profiles
- Extends auth.users with user profile data (display name, avatar, role, bio, XP, level, streak, coins)
- role: 'student' | 'teacher' | 'admin'

### 2. chat_conversations
- Stores AI chat sessions per user with title and model preference

### 3. chat_messages
- Stores individual messages within conversations (role: user/assistant, content, metadata)

### 4. notes
- User-generated or AI-generated study notes with tags and subject classification

### 5. quizzes
- AI-generated quizzes with settings (difficulty, type, subject)

### 6. quiz_attempts
- Records of user quiz attempts with scores and answers

### 7. study_sessions
- Pomodoro/study session tracking per user

### 8. tasks
- User tasks and to-dos with due dates and priority

### 9. achievements
- Catalogue of all available badges/achievements

### 10. user_achievements
- Records of which achievements each user has earned

### 11. leaderboard_entries
- Weekly/monthly leaderboard snapshots

### 12. uploaded_documents
- PDFs, images, and other documents uploaded by users

## Security
- RLS enabled on all tables
- All policies scoped to authenticated users via auth.uid()
- Owner columns default to auth.uid() for safe inserts
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  bio text,
  institution text,
  subject_focus text,
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  streak_days integer NOT NULL DEFAULT 0,
  coins integer NOT NULL DEFAULT 0,
  productivity_score integer NOT NULL DEFAULT 0,
  focus_score integer NOT NULL DEFAULT 0,
  last_active_date date,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- CHAT CONVERSATIONS
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New Conversation',
  model text NOT NULL DEFAULT 'gpt-4',
  subject text,
  is_pinned boolean NOT NULL DEFAULT false,
  message_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_conversations" ON chat_conversations;
CREATE POLICY "select_own_conversations" ON chat_conversations FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_conversations" ON chat_conversations;
CREATE POLICY "insert_own_conversations" ON chat_conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_conversations" ON chat_conversations;
CREATE POLICY "update_own_conversations" ON chat_conversations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_conversations" ON chat_conversations;
CREATE POLICY "delete_own_conversations" ON chat_conversations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- CHAT MESSAGES
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_messages" ON chat_messages;
CREATE POLICY "select_own_messages" ON chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_messages" ON chat_messages;
CREATE POLICY "insert_own_messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_messages" ON chat_messages;
CREATE POLICY "update_own_messages" ON chat_messages FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_messages" ON chat_messages;
CREATE POLICY "delete_own_messages" ON chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- NOTES
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  note_type text NOT NULL DEFAULT 'long' CHECK (note_type IN ('short','long','bullet','mindmap','flashcard','revision','cheatsheet','formula','concept','infographic')),
  subject text,
  tags text[] DEFAULT '{}',
  source_type text CHECK (source_type IN ('manual','pdf','image','youtube','audio','website','docx','ppt')),
  source_url text,
  is_pinned boolean NOT NULL DEFAULT false,
  is_favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notes" ON notes;
CREATE POLICY "select_own_notes" ON notes FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notes" ON notes;
CREATE POLICY "insert_own_notes" ON notes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notes" ON notes;
CREATE POLICY "update_own_notes" ON notes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notes" ON notes;
CREATE POLICY "delete_own_notes" ON notes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- QUIZZES
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  subject text,
  difficulty text NOT NULL DEFAULT 'intermediate' CHECK (difficulty IN ('beginner','intermediate','advanced','expert')),
  quiz_type text NOT NULL DEFAULT 'mcq' CHECK (quiz_type IN ('mcq','true_false','fill_blank','coding','short_answer','long_answer','interview','viva','case_study')),
  questions jsonb NOT NULL DEFAULT '[]',
  time_limit_minutes integer DEFAULT 30,
  total_questions integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_quizzes" ON quizzes;
CREATE POLICY "select_own_quizzes" ON quizzes FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_quizzes" ON quizzes;
CREATE POLICY "insert_own_quizzes" ON quizzes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_quizzes" ON quizzes;
CREATE POLICY "update_own_quizzes" ON quizzes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_quizzes" ON quizzes;
CREATE POLICY "delete_own_quizzes" ON quizzes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- QUIZ ATTEMPTS
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  time_taken_seconds integer DEFAULT 0,
  answers jsonb DEFAULT '[]',
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_attempts" ON quiz_attempts;
CREATE POLICY "select_own_attempts" ON quiz_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_attempts" ON quiz_attempts;
CREATE POLICY "insert_own_attempts" ON quiz_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_attempts" ON quiz_attempts;
CREATE POLICY "update_own_attempts" ON quiz_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_attempts" ON quiz_attempts;
CREATE POLICY "delete_own_attempts" ON quiz_attempts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- STUDY SESSIONS
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text,
  session_type text NOT NULL DEFAULT 'pomodoro' CHECK (session_type IN ('pomodoro','deep_work','review','exam_prep')),
  duration_minutes integer NOT NULL DEFAULT 25,
  completed boolean NOT NULL DEFAULT false,
  notes text,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_sessions" ON study_sessions;
CREATE POLICY "select_own_sessions" ON study_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_sessions" ON study_sessions;
CREATE POLICY "insert_own_sessions" ON study_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_sessions" ON study_sessions;
CREATE POLICY "update_own_sessions" ON study_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_sessions" ON study_sessions;
CREATE POLICY "delete_own_sessions" ON study_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  subject text,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','cancelled')),
  due_date date,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_tasks" ON tasks;
CREATE POLICY "select_own_tasks" ON tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_tasks" ON tasks;
CREATE POLICY "insert_own_tasks" ON tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_tasks" ON tasks;
CREATE POLICY "update_own_tasks" ON tasks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_tasks" ON tasks;
CREATE POLICY "delete_own_tasks" ON tasks FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  category text,
  xp_reward integer NOT NULL DEFAULT 50,
  coin_reward integer NOT NULL DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone_can_read_achievements" ON achievements;
CREATE POLICY "anyone_can_read_achievements" ON achievements FOR SELECT TO authenticated USING (true);

-- USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_user_achievements" ON user_achievements;
CREATE POLICY "select_own_user_achievements" ON user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_user_achievements" ON user_achievements;
CREATE POLICY "insert_own_user_achievements" ON user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_user_achievements" ON user_achievements;
CREATE POLICY "update_own_user_achievements" ON user_achievements FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_user_achievements" ON user_achievements;
CREATE POLICY "delete_own_user_achievements" ON user_achievements FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- UPLOADED DOCUMENTS
CREATE TABLE IF NOT EXISTS uploaded_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint,
  storage_path text,
  public_url text,
  subject text,
  tags text[] DEFAULT '{}',
  ai_summary text,
  page_count integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE uploaded_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_documents" ON uploaded_documents;
CREATE POLICY "select_own_documents" ON uploaded_documents FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_documents" ON uploaded_documents;
CREATE POLICY "insert_own_documents" ON uploaded_documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_documents" ON uploaded_documents;
CREATE POLICY "update_own_documents" ON uploaded_documents FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_documents" ON uploaded_documents;
CREATE POLICY "delete_own_documents" ON uploaded_documents FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- SEED ACHIEVEMENTS
INSERT INTO achievements (name, description, icon, category, xp_reward, coin_reward) VALUES
  ('First Steps', 'Complete your first study session', 'zap', 'study', 100, 20),
  ('Chat Master', 'Send 50 messages to the AI assistant', 'message-circle', 'chat', 200, 40),
  ('Note Taker', 'Create 10 notes', 'file-text', 'notes', 150, 30),
  ('Quiz Ace', 'Score 100% on a quiz', 'award', 'quiz', 300, 60),
  ('Streak Warrior', 'Maintain a 7-day study streak', 'flame', 'streak', 500, 100),
  ('Bookworm', 'Read 5 PDFs', 'book-open', 'pdf', 200, 40),
  ('Code Ninja', 'Use the coding assistant 20 times', 'code', 'coding', 250, 50),
  ('Scholar', 'Reach Level 10', 'graduation-cap', 'level', 1000, 200),
  ('Productivity Pro', 'Complete 30 Pomodoro sessions', 'timer', 'productivity', 400, 80),
  ('Early Bird', 'Study before 8am three days in a row', 'sunrise', 'streak', 300, 60)
ON CONFLICT (name) DO NOTHING;

-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_documents_user_id ON uploaded_documents(user_id);
