-- Seed data for testing and demonstrations
INSERT INTO public.applications (application_id, full_name, roll_number, areas_of_interest, application_status, created_at)
VALUES 
    ('CF27-VOL-982143', 'Aadarsh Sharma', '160123733045', ARRAY['Technical', 'Events'], 'Pending', NOW() - INTERVAL '3 hours'),
    ('CF27-VOL-847291', 'Sneha Reddy', '160123737089', ARRAY['Design', 'Video Editing'], 'Shortlisted', NOW() - INTERVAL '1 day'),
    ('CF27-VOL-651239', 'Rohit Varma', '160122748012', ARRAY['Public Relations (PR)', 'External Affairs'], 'Selected', NOW() - INTERVAL '2 days'),
    ('CF27-VOL-432890', 'Ananya Gupta', '160124733102', ARRAY['Technical', 'Documentation'], 'Pending', NOW() - INTERVAL '5 hours'),
    ('CF27-VOL-771923', 'Karthik Rao', '160123735067', ARRAY['Sponsorship', 'External Affairs'], 'Pending', NOW() - INTERVAL '6 hours')
ON CONFLICT (roll_number) DO NOTHING;
