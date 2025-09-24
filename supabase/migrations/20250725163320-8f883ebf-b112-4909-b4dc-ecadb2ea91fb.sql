-- Update RLS policies for funnels table to allow anonymous access temporarily
DROP POLICY IF EXISTS "Users can view their own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can insert their own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can update their own funnels" ON public.funnels;

-- Create new policies that allow anonymous access
CREATE POLICY "Anyone can view funnels" 
ON public.funnels 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create funnels" 
ON public.funnels 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update funnels" 
ON public.funnels 
FOR UPDATE 
USING (true);