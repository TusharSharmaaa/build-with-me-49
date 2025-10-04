-- =====================================================
-- COMPREHENSIVE SCHEMA UPGRADE FOR AI TOOLS 2026
-- =====================================================

-- Add new fields to ai_tools table
ALTER TABLE public.ai_tools
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS modalities text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS use_cases text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS free_requires_login boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS pricing_model text,
ADD COLUMN IF NOT EXISTS pricing_url text,
ADD COLUMN IF NOT EXISTS rate_limit_note text,
ADD COLUMN IF NOT EXISTS pros text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cons text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tips text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS quickstart text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sample_prompts text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS input_examples text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS output_examples text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS privacy_note text,
ADD COLUMN IF NOT EXISTS security_note text,
ADD COLUMN IF NOT EXISTS region_limits text,
ADD COLUMN IF NOT EXISTS screenshots text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS editors_pick boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_verified_at timestamptz,
ADD COLUMN IF NOT EXISTS description_hi text;

-- Generate slugs for existing tools
UPDATE public.ai_tools
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Create collections table
CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  cover_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view collections"
ON public.collections FOR SELECT
USING (true);

-- Create collection_items table
CREATE TABLE IF NOT EXISTS public.collection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  tool_id uuid REFERENCES public.ai_tools(id) ON DELETE CASCADE NOT NULL,
  rank int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view collection items"
ON public.collection_items FOR SELECT
USING (true);

-- Create workflows table
CREATE TABLE IF NOT EXISTS public.workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  steps jsonb DEFAULT '[]'::jsonb,
  professions text[] DEFAULT '{}',
  cover_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view workflows"
ON public.workflows FOR SELECT
USING (true);

-- Create track_usage table
CREATE TABLE IF NOT EXISTS public.track_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  tool_id uuid REFERENCES public.ai_tools(id) ON DELETE CASCADE NOT NULL,
  opens int DEFAULT 0,
  favorites int DEFAULT 0,
  last_opened_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

ALTER TABLE public.track_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage"
ON public.track_usage FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
ON public.track_usage FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
ON public.track_usage FOR UPDATE
USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_tools_slug ON public.ai_tools(slug);
CREATE INDEX IF NOT EXISTS idx_ai_tools_verified ON public.ai_tools(verified) WHERE verified = true;
CREATE INDEX IF NOT EXISTS idx_ai_tools_editors_pick ON public.ai_tools(editors_pick) WHERE editors_pick = true;
CREATE INDEX IF NOT EXISTS idx_ai_tools_last_verified ON public.ai_tools(last_verified_at DESC);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON public.collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_track_usage_tool ON public.track_usage(tool_id);
CREATE INDEX IF NOT EXISTS idx_track_usage_last_opened ON public.track_usage(last_opened_at DESC);

-- Insert sample collections
INSERT INTO public.collections (name, slug, description, cover_url)
VALUES
  ('Top Free Tools for Data Analysts', 'free-data-analyst-tools', 'Essential free AI tools every data analyst should know', null),
  ('Best Free Design Tools', 'free-design-tools', 'Create stunning visuals without spending a dime', null),
  ('Founder Stack under ₹0', 'free-founder-stack', 'Build your startup with zero tool costs', null),
  ('AI Writing Assistant Suite', 'ai-writing-tools', 'Professional content creation tools', null)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample workflows
INSERT INTO public.workflows (name, slug, description, professions, steps)
VALUES
  (
    'Quick Market Research', 
    'quick-market-research',
    'Fast competitive analysis using AI',
    ARRAY['analyst', 'founder', 'marketer'],
    '[
      {"title": "Research with AI", "text": "Use Perplexity to gather market insights", "tip": "Ask specific questions about competitors"},
      {"title": "Organize findings", "text": "Structure your research in Notion", "tip": "Use databases for comparison tables"},
      {"title": "Create presentation", "text": "Generate slides with Gamma or Beautiful.ai", "tip": "Focus on key insights"}
    ]'::jsonb
  ),
  (
    'Social Media Content Pack',
    'social-media-pack',
    'Complete workflow from idea to scheduled post',
    ARRAY['marketer', 'creator'],
    '[
      {"title": "Generate ideas", "text": "Brainstorm with ChatGPT", "tip": "Ask for 10 variations"},
      {"title": "Create visuals", "text": "Design with Canva or Midjourney", "tip": "Maintain brand colors"},
      {"title": "Write captions", "text": "Polish copy with Jasper", "tip": "Include CTAs"},
      {"title": "Schedule", "text": "Queue posts in Buffer", "tip": "Optimal posting times"}
    ]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;