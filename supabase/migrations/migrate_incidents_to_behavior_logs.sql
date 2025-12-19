-- Migration script to transition from incidents to behavior_logs
-- Run this AFTER creating the new behavior_logs table

-- If you have existing data in the incidents table, migrate it:
-- (If you don't have existing data, you can skip this and just use the new schema)

-- Step 1: Copy data from incidents to behavior_logs
-- Note: This assumes you want to keep your existing data. 
-- If starting fresh, just drop the incidents table and use the new schema.

-- Map old categories to new categories:
-- Verbal -> Inconsistent communication
-- Physical -> Intimidation or pressure
-- Emotional -> Emotional withdrawal
-- Financial -> Boundary violations
-- Other -> Other

-- Uncomment and run if you have existing data to migrate:
/*
INSERT INTO behavior_logs (
  id,
  user_id,
  date,
  category,
  intensity,
  description,
  context,
  emotion_before,
  emotion_after,
  created_at,
  updated_at
)
SELECT 
  id,
  user_id,
  date,
  CASE category
    WHEN 'Verbal' THEN 'Inconsistent communication'
    WHEN 'Physical' THEN 'Intimidation or pressure'
    WHEN 'Emotional' THEN 'Emotional withdrawal'
    WHEN 'Financial' THEN 'Boundary violations'
    ELSE 'Other'
  END as category,
  severity as intensity,
  description,
  location as context,
  NULL as emotion_before,
  NULL as emotion_after,
  created_at,
  updated_at
FROM incidents;

-- Step 2: Once you've verified the migration, you can drop the old table
-- DROP TABLE incidents;
*/

-- For fresh installations, the new schema is already in schema.sql
-- This file is just for reference if migrating existing data
