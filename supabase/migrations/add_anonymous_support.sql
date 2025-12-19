-- Migration to support anonymous users
-- Run this in Supabase SQL Editor if you already ran SETUP_ALL.sql

-- Make email nullable for anonymous users
ALTER TABLE profiles ALTER COLUMN email DROP NOT NULL;

-- Add is_anonymous flag
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;

-- Update the trigger function to handle anonymous users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_anonymous)
  VALUES (new.id, new.email, new.is_anonymous)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add INSERT policy for profiles if it doesn't exist
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);
