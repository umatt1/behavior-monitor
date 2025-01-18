
-- Insert test incidents for the test user
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get the test user's ID
    SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com';

    -- Insert test incidents with varying dates, categories, and severities
    INSERT INTO incidents (user_id, date, category, severity, description, location, witnesses) VALUES
    -- Recent incidents (last month)
    (test_user_id, NOW() - INTERVAL '2 days', 'Verbal', 3, 'Heated argument with colleague', 'Office', 'John, Sarah'),
    (test_user_id, NOW() - INTERVAL '5 days', 'Physical', 4, 'Aggressive behavior from stranger', 'Street', 'Police report filed'),
    (test_user_id, NOW() - INTERVAL '8 days', 'Emotional', 2, 'Passive-aggressive comments', 'Meeting room', 'Team members'),
    (test_user_id, NOW() - INTERVAL '12 days', 'Financial', 3, 'Unauthorized charges', 'Online', NULL),
    (test_user_id, NOW() - INTERVAL '15 days', 'Other', 1, 'Minor misunderstanding', 'Phone call', NULL),
    
    -- Incidents from 2-3 months ago
    (test_user_id, NOW() - INTERVAL '45 days', 'Verbal', 2, 'Disagreement over project timeline', 'Video call', 'Project team'),
    (test_user_id, NOW() - INTERVAL '50 days', 'Emotional', 4, 'Hostile work environment', 'Office', 'HR department'),
    (test_user_id, NOW() - INTERVAL '60 days', 'Physical', 5, 'Threatening behavior', 'Parking lot', 'Security footage'),
    (test_user_id, NOW() - INTERVAL '75 days', 'Financial', 2, 'Disputed transaction', 'Bank', 'Bank statement'),
    
    -- Older incidents (4-6 months ago)
    (test_user_id, NOW() - INTERVAL '100 days', 'Other', 3, 'Privacy violation', 'Social media', 'Screenshots'),
    (test_user_id, NOW() - INTERVAL '120 days', 'Verbal', 4, 'Public confrontation', 'Restaurant', 'Restaurant staff'),
    (test_user_id, NOW() - INTERVAL '140 days', 'Emotional', 3, 'Manipulative behavior', 'Email', 'Email thread'),
    (test_user_id, NOW() - INTERVAL '160 days', 'Physical', 2, 'Minor altercation', 'Gym', 'Gym staff'),
    
    -- Multiple incidents on same day to test heatmap intensity
    (test_user_id, NOW() - INTERVAL '25 days', 'Verbal', 3, 'Morning argument', 'Home', NULL),
    (test_user_id, NOW() - INTERVAL '25 days', 'Emotional', 4, 'Afternoon incident', 'Work', 'Coworkers'),
    (test_user_id, NOW() - INTERVAL '25 days', 'Other', 2, 'Evening incident', 'Store', 'Store camera'),
    
    -- High severity cluster to test heatmap
    (test_user_id, NOW() - INTERVAL '35 days', 'Physical', 5, 'Serious threat', 'Street', 'Police report'),
    (test_user_id, NOW() - INTERVAL '35 days', 'Verbal', 5, 'Severe verbal abuse', 'Phone', 'Recorded call'),
    
    -- Low severity cluster
    (test_user_id, NOW() - INTERVAL '90 days', 'Other', 1, 'Minor issue 1', 'Online', NULL),
    (test_user_id, NOW() - INTERVAL '90 days', 'Emotional', 1, 'Minor issue 2', 'Chat', 'Chat logs');
END $$;