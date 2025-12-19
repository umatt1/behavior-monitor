-- Add PIN protection to profiles
ALTER TABLE profiles ADD COLUMN pin_hash TEXT;
ALTER TABLE profiles ADD COLUMN pin_enabled BOOLEAN DEFAULT FALSE;

-- Add user preferences
CREATE TABLE user_preferences (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  pin_hash TEXT,
  pin_enabled BOOLEAN DEFAULT FALSE,
  panic_exit_url TEXT DEFAULT 'https://www.weather.com',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" 
  ON user_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" 
  ON user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" 
  ON user_preferences FOR UPDATE 
  USING (auth.uid() = user_id);
