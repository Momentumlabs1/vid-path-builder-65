-- Create funnels table
CREATE TABLE public.funnels (
  name TEXT PRIMARY KEY,
  structure JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_id UUID,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write for demo purposes
CREATE POLICY "Allow public read access to funnels"
  ON public.funnels FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to funnels"
  ON public.funnels FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to funnels"
  ON public.funnels FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete to funnels"
  ON public.funnels FOR DELETE
  USING (true);

-- Create funnel_responses table
CREATE TABLE public.funnel_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_name TEXT NOT NULL,
  node_id TEXT NOT NULL,
  question TEXT,
  answer TEXT,
  answer_type TEXT,
  user_session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.funnel_responses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write
CREATE POLICY "Allow public insert to funnel_responses"
  ON public.funnel_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access to funnel_responses"
  ON public.funnel_responses FOR SELECT
  USING (true);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_name TEXT NOT NULL,
  session_id TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  age INTEGER,
  opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert and read
CREATE POLICY "Allow public insert to leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access to leads"
  ON public.leads FOR SELECT
  USING (true);

-- Create lead_status table
CREATE TABLE public.lead_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lead_status ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write
CREATE POLICY "Allow public insert to lead_status"
  ON public.lead_status FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access to lead_status"
  ON public.lead_status FOR SELECT
  USING (true);

CREATE POLICY "Allow public update to lead_status"
  ON public.lead_status FOR UPDATE
  USING (true);

-- Create Videos storage table for video metadata
CREATE TABLE public."Videos" (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_path TEXT,
  file_url TEXT,
  duration INTEGER,
  thumbnail_url TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public."Videos" ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write
CREATE POLICY "Allow public read access to Videos"
  ON public."Videos" FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to Videos"
  ON public."Videos" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to Videos"
  ON public."Videos" FOR UPDATE
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_funnels_updated_at
  BEFORE UPDATE ON public.funnels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_status_updated_at
  BEFORE UPDATE ON public.lead_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();