-- Create professions table
CREATE TABLE public.professions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_tools table
CREATE TABLE public.ai_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  profession_tags TEXT[] DEFAULT '{}',
  free_tier BOOLEAN DEFAULT false,
  free_limit TEXT,
  pricing_note TEXT,
  logo_url TEXT,
  website_url TEXT,
  rating NUMERIC(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.professions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Professions policies (public read)
CREATE POLICY "Anyone can view professions"
  ON public.professions FOR SELECT
  USING (true);

-- AI Tools policies (public read)
CREATE POLICY "Anyone can view ai_tools"
  ON public.ai_tools FOR SELECT
  USING (true);

-- Favorites policies (user-specific)
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Reviews policies (public read, authenticated write)
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Submissions policies (user can see own, admins can see all - will handle admin check later)
CREATE POLICY "Users can view their own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on ai_tools
CREATE TRIGGER update_ai_tools_updated_at
  BEFORE UPDATE ON public.ai_tools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update tool rating
CREATE OR REPLACE FUNCTION public.update_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ai_tools
  SET 
    rating = (
      SELECT COALESCE(AVG(rating)::NUMERIC(3,2), 0)
      FROM public.reviews
      WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id)
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id)
    )
  WHERE id = COALESCE(NEW.tool_id, OLD.tool_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to update ratings when reviews change
CREATE TRIGGER update_rating_on_review_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tool_rating();

CREATE TRIGGER update_rating_on_review_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tool_rating();

CREATE TRIGGER update_rating_on_review_delete
  AFTER DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tool_rating();

-- Create storage bucket for tool logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('tool-logos', 'tool-logos', true);

-- Storage policies for tool logos (public read, authenticated write)
CREATE POLICY "Anyone can view tool logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'tool-logos');

CREATE POLICY "Authenticated users can upload tool logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'tool-logos' AND auth.role() = 'authenticated');