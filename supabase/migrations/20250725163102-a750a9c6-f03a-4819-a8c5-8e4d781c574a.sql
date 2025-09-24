-- Create funnels table for storing funnel structures
CREATE TABLE public.funnels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  structure JSONB NOT NULL,
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

-- Create policies for funnel access
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

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_funnels_updated_at
BEFORE UPDATE ON public.funnels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();