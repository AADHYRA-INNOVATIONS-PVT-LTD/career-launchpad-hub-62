-- Create Portfolio Projects Table
CREATE TABLE IF NOT EXISTS freelancer_portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    freelancer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    image_url TEXT,
    live_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE freelancer_portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view freelancer portfolios" 
ON freelancer_portfolio_projects FOR SELECT USING (true);

CREATE POLICY "Freelancers can manage their own portfolio projects" 
ON freelancer_portfolio_projects FOR ALL USING (auth.uid() = freelancer_id);
