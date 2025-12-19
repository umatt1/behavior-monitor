-- ================================================
-- BEHAVIOR MONITOR - COMPLETE DATABASE SETUP
-- ================================================
-- Run this entire file in Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/uvrrjzqlfdymyubtdjcw/sql/new
-- Copy all of this and click "Run"
-- ================================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  pin_hash TEXT,
  pin_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create behavior_logs table (renamed from incidents for neutral language)
CREATE TABLE IF NOT EXISTS behavior_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Broken promises',
    'Boundary violations', 
    'Sudden affection after conflict',
    'Gaslighting indicators',
    'Intimidation or pressure',
    'Emotional withdrawal',
    'Inconsistent communication',
    'Pattern interruption',
    'Other'
  )),
  intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 5),
  description TEXT NOT NULL,
  context TEXT,
  emotion_before TEXT,
  emotion_after TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  pin_hash TEXT,
  pin_enabled BOOLEAN DEFAULT FALSE,
  panic_exit_url TEXT DEFAULT 'https://www.weather.com',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own behavior logs" ON behavior_logs;
DROP POLICY IF EXISTS "Users can create own behavior logs" ON behavior_logs;
DROP POLICY IF EXISTS "Users can update own behavior logs" ON behavior_logs;
DROP POLICY IF EXISTS "Users can delete own behavior logs" ON behavior_logs;
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create policies for behavior_logs
CREATE POLICY "Users can view own behavior logs" 
  ON behavior_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own behavior logs" 
  ON behavior_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own behavior logs" 
  ON behavior_logs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own behavior logs" 
  ON behavior_logs FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for user_preferences
CREATE POLICY "Users can view own preferences" 
  ON user_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" 
  ON user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" 
  ON user_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create or replace function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- SETUP COMPLETE!
-- ================================================
-- Next steps:
-- 1. Go to Authentication > Providers
-- 2. Make sure Email provider is enabled
-- 3. (Optional) Customize email templates to be discrete
-- 4. Restart your Next.js dev server
-- ================================================
