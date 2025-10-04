-- Add missing columns to ai_tools table
ALTER TABLE public.ai_tools 
ADD COLUMN IF NOT EXISTS requires_login boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_watermark boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS curated boolean DEFAULT false;

-- Create remote_config table for dynamic ad configuration
CREATE TABLE IF NOT EXISTS public.remote_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key text UNIQUE NOT NULL,
  config_value jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on remote_config
ALTER TABLE public.remote_config ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read remote_config
CREATE POLICY "Anyone can view remote_config"
ON public.remote_config
FOR SELECT
USING (true);

-- Only admins can update remote_config
CREATE POLICY "Admins can update remote_config"
ON public.remote_config
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default ad configuration
INSERT INTO public.remote_config (config_key, config_value)
VALUES (
  'ads_config',
  '{
    "ads": {
      "interstitialEveryNDetails": 2,
      "interstitialMinSeconds": 120,
      "rewardedEveryNSearches": 10,
      "rewardedMinSeconds": 300,
      "bannersEnabled": true,
      "interstitialEnabled": true,
      "rewardedEnabled": true
    },
    "ui": {
      "showTrending": true
    }
  }'::jsonb
)
ON CONFLICT (config_key) DO NOTHING;

-- Add trigger to update updated_at on remote_config
CREATE TRIGGER update_remote_config_updated_at
BEFORE UPDATE ON public.remote_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();