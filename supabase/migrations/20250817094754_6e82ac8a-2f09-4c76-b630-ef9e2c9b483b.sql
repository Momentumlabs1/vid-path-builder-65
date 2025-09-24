-- Create leads table for contact data collection
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_name TEXT NOT NULL,
  session_id TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  lead_score INTEGER DEFAULT 0,
  opt_in_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address TEXT
);

-- Create lead status tracking table
CREATE TABLE public.lead_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'new', -- new, contacted, scheduled, converted, lost
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create lead notes table for follow-up tracking
CREATE TABLE public.lead_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

-- RLS policies for leads (anyone can submit, funnel owners can view)
CREATE POLICY "Anyone can submit leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Funnel owners can view leads" 
ON public.leads 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM funnels 
  WHERE funnels.name = leads.funnel_name 
  AND funnels.user_id = auth.uid()
));

CREATE POLICY "Funnel owners can update leads" 
ON public.leads 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM funnels 
  WHERE funnels.name = leads.funnel_name 
  AND funnels.user_id = auth.uid()
));

-- RLS policies for lead status
CREATE POLICY "Funnel owners can manage lead status" 
ON public.lead_status 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM leads 
  JOIN funnels ON funnels.name = leads.funnel_name 
  WHERE leads.id = lead_status.lead_id 
  AND funnels.user_id = auth.uid()
));

-- RLS policies for lead notes
CREATE POLICY "Funnel owners can manage lead notes" 
ON public.lead_notes 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM leads 
  JOIN funnels ON funnels.name = leads.funnel_name 
  WHERE leads.id = lead_notes.lead_id 
  AND funnels.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on leads
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_leads_funnel_name ON public.leads(funnel_name);
CREATE INDEX idx_leads_session_id ON public.leads(session_id);
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_lead_status_lead_id ON public.lead_status(lead_id);
CREATE INDEX idx_lead_notes_lead_id ON public.lead_notes(lead_id);