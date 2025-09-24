-- Fix security vulnerability: Restrict video access to owners only
-- Currently all videos are publicly readable, which is a security risk

-- Drop the overly permissive policy that allows all users to read all videos
DROP POLICY IF EXISTS "Enable read access for all users" ON "Videos";

-- Create a new policy that only allows users to see their own videos
CREATE POLICY "Users can view their own videos" 
ON "Videos" 
FOR SELECT 
USING (auth.uid() = user_id);

-- For funnel functionality, we might need public access to videos used in published funnels
-- Add a public flag to videos table for controlled public access
ALTER TABLE "Videos" ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Create policy for public videos (when explicitly marked as public)
CREATE POLICY "Anyone can view public videos" 
ON "Videos" 
FOR SELECT 
USING (is_public = true);

-- Update existing videos to maintain current funnel functionality
-- Mark videos that are currently referenced in funnels as public
-- Fix: Cast JSON to JSONB for jsonb_each function
UPDATE "Videos" 
SET is_public = true 
WHERE file_url IN (
  SELECT DISTINCT (node_data.value->>'videoUrl')::text
  FROM funnels,
       jsonb_each((structure::jsonb)->'nodes') AS node_data
  WHERE (node_data.value->>'videoUrl') IS NOT NULL
    AND (node_data.value->>'videoUrl') != ''
);