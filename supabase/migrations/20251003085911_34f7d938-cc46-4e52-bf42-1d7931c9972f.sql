-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update submissions table RLS for admin approval
CREATE POLICY "Admins can view all submissions"
ON public.submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submission status"
ON public.submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add featured column to ai_tools for premium lists
ALTER TABLE public.ai_tools
ADD COLUMN featured BOOLEAN DEFAULT false,
ADD COLUMN featured_order INTEGER DEFAULT 0;

-- Create index for featured tools
CREATE INDEX idx_ai_tools_featured ON public.ai_tools(featured, featured_order);

-- Insert more profession categories
INSERT INTO public.professions (name, slug, icon_url) VALUES
('Student', 'student', null),
('No-Code Founder', 'no-code-founder', null),
('Lawyer', 'lawyer', null),
('Teacher', 'teacher', null),
('Sales Professional', 'sales-professional', null),
('Researcher', 'researcher', null),
('Video Editor', 'video-editor', null),
('Photographer', 'photographer', null),
('Accountant', 'accountant', null),
('HR Manager', 'hr-manager', null),
('Entrepreneur', 'entrepreneur', null),
('Consultant', 'consultant', null)
ON CONFLICT (slug) DO NOTHING;