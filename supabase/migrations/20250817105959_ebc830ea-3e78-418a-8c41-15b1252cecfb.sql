-- Fix security vulnerability: Restrict funnel access to owners only
-- Remove the overly permissive "Anyone can view funnels" policy
DROP POLICY IF EXISTS "Anyone can view funnels" ON public.funnels;

-- Add policy to allow users to view only their own funnels
CREATE POLICY "Users can view their own funnels" 
ON public.funnels 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add a public sharing mechanism for funnels that need to be embedded/shared
-- Add is_public column to funnels table
ALTER TABLE public.funnels 
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Create policy for public funnels that are explicitly marked as shareable
CREATE POLICY "Anyone can view public funnels" 
ON public.funnels 
FOR SELECT 
USING (is_public = true);

-- Update the overly permissive INSERT and UPDATE policies to be more secure
DROP POLICY IF EXISTS "Anyone can create funnels" ON public.funnels;
DROP POLICY IF EXISTS "Anyone can update funnels" ON public.funnels;

-- Only authenticated users can create funnels
CREATE POLICY "Authenticated users can create funnels" 
ON public.funnels 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only funnel owners can update their funnels
CREATE POLICY "Users can update their own funnels" 
ON public.funnels 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);