-- Create table for storing funnel responses/analytics
CREATE TABLE public.funnel_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_name TEXT NOT NULL,
  node_id TEXT NOT NULL,
  question TEXT,
  answer TEXT NOT NULL,
  answer_type TEXT NOT NULL,
  user_session_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.funnel_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for funnel responses - public can insert, owners can view their funnel responses
CREATE POLICY "Anyone can submit funnel responses" 
ON public.funnel_responses 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Funnel owners can view responses" 
ON public.funnel_responses 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.funnels 
    WHERE funnels.name = funnel_responses.funnel_name 
    AND funnels.user_id = auth.uid()
  )
);

-- Create index for better performance
CREATE INDEX idx_funnel_responses_funnel_name ON public.funnel_responses(funnel_name);
CREATE INDEX idx_funnel_responses_created_at ON public.funnel_responses(created_at DESC);