import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeadCaptureProps {
  funnel_name: string;
  session_id: string;
  onComplete: () => void;
}

export const LeadCapture: React.FC<LeadCaptureProps> = ({
  funnel_name,
  session_id,
  onComplete,
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    opt_in_marketing: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('leads').insert({
        funnel_name,
        session_id,
        ...formData,
        user_agent: navigator.userAgent,
      });

      if (error) throw error;

      toast({
        title: "Vielen Dank!",
        description: "Ihre Daten wurden erfolgreich übermittelt.",
      });

      onComplete();
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Übermitteln Ihrer Daten.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Kontakt Informationen</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Vorname *</Label>
              <Input
                id="first_name"
                required
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Nachname *</Label>
              <Input
                id="last_name"
                required
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">E-Mail *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="company">Unternehmen</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="opt_in_marketing"
              checked={formData.opt_in_marketing}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, opt_in_marketing: checked === true }))
              }
            />
            <Label htmlFor="opt_in_marketing" className="text-sm">
              Ich möchte weitere Informationen per E-Mail erhalten
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Wird übermittelt...' : 'Absenden'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};