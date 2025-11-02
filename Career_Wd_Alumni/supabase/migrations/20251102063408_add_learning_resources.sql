/*
  # Add Learning Resources System

  ## Summary
  Creates a comprehensive learning resources system with free educational content
  organized by career paths. Resources are matched to users based on their quiz results.

  ## New Tables
  
  ### `learning_resources`
  - `id` (uuid, primary key) - Unique resource identifier
  - `title` (text) - Resource title
  - `description` (text) - Detailed description of the resource
  - `url` (text) - Link to the resource
  - `type` (text) - Type: video, article, course, tutorial, documentation, book
  - `career_paths` (text[]) - Array of career paths this resource supports
  - `level` (text) - Difficulty: beginner, intermediate, advanced
  - `duration` (text) - Estimated time to complete
  - `provider` (text) - Platform/provider name (YouTube, Coursera, freeCodeCamp, etc.)
  - `thumbnail_url` (text, nullable) - Optional thumbnail image
  - `is_free` (boolean) - Whether the resource is free (default: true)
  - `rating` (numeric, nullable) - Average rating 0-5
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `user_saved_resources`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - Reference to auth.users
  - `resource_id` (uuid) - Reference to learning_resources
  - `saved_at` (timestamptz) - When resource was saved
  - `completed` (boolean) - Whether user completed this resource
  - `notes` (text, nullable) - User's personal notes

  ## Security
  - Enable RLS on both tables
  - Public read access for learning_resources
  - Users can only manage their own saved resources
  - Only authenticated users can save resources

  ## Indexes
  - Index on career_paths for fast filtering
  - Index on type for resource type queries
  - Index on user_id for user resource lookups
*/

-- Create learning_resources table
CREATE TABLE IF NOT EXISTS learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('video', 'article', 'course', 'tutorial', 'documentation', 'book', 'interactive')),
  career_paths text[] NOT NULL DEFAULT '{}',
  level text NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration text NOT NULL DEFAULT '1 hour',
  provider text NOT NULL,
  thumbnail_url text,
  is_free boolean DEFAULT true,
  rating numeric(3,2) CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_saved_resources table
CREATE TABLE IF NOT EXISTS user_saved_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
  saved_at timestamptz DEFAULT now(),
  completed boolean DEFAULT false,
  notes text,
  UNIQUE(user_id, resource_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_learning_resources_career_paths ON learning_resources USING GIN (career_paths);
CREATE INDEX IF NOT EXISTS idx_learning_resources_type ON learning_resources(type);
CREATE INDEX IF NOT EXISTS idx_learning_resources_level ON learning_resources(level);
CREATE INDEX IF NOT EXISTS idx_user_saved_resources_user_id ON user_saved_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_resources_resource_id ON user_saved_resources(resource_id);

-- Enable Row Level Security
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_resources
CREATE POLICY "Anyone can view learning resources"
  ON learning_resources FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert resources"
  ON learning_resources FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update resources"
  ON learning_resources FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for user_saved_resources
CREATE POLICY "Users can view own saved resources"
  ON user_saved_resources FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save resources"
  ON user_saved_resources FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved resources"
  ON user_saved_resources FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved resources"
  ON user_saved_resources FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample learning resources
INSERT INTO learning_resources (title, description, url, type, career_paths, level, duration, provider, is_free, rating) VALUES
('Complete Web Development Bootcamp', 'Comprehensive course covering HTML, CSS, JavaScript, React, Node.js, and more', 'https://www.youtube.com/watch?v=erEgovG9WBs', 'course', ARRAY['Software Development', 'Web Development'], 'beginner', '40 hours', 'freeCodeCamp', true, 4.8),
('JavaScript Algorithms and Data Structures', 'Master algorithms and data structures in JavaScript', 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', 'interactive', ARRAY['Software Development'], 'intermediate', '300 hours', 'freeCodeCamp', true, 4.9),
('React Documentation', 'Official React documentation and tutorials', 'https://react.dev/learn', 'documentation', ARRAY['Software Development', 'Web Development'], 'beginner', 'Self-paced', 'React Team', true, 4.7),
('CS50: Introduction to Computer Science', 'Harvard''s introduction to computer science and programming', 'https://cs50.harvard.edu/x/', 'course', ARRAY['Software Development'], 'beginner', '100 hours', 'Harvard University', true, 4.9),
('Python for Data Science', 'Complete Python data science tutorial', 'https://www.youtube.com/watch?v=LHBE6Q9XlzI', 'video', ARRAY['Data Science', 'Machine Learning'], 'beginner', '12 hours', 'freeCodeCamp', true, 4.7),
('Machine Learning Crash Course', 'Google''s fast-paced practical introduction to ML', 'https://developers.google.com/machine-learning/crash-course', 'course', ARRAY['Machine Learning', 'Data Science'], 'intermediate', '15 hours', 'Google', true, 4.8),
('Kaggle Learn', 'Practical data science and ML micro-courses', 'https://www.kaggle.com/learn', 'interactive', ARRAY['Data Science', 'Machine Learning'], 'beginner', 'Varies', 'Kaggle', true, 4.6),
('UI/UX Design Tutorial', 'Complete guide to UI/UX design principles', 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU', 'video', ARRAY['Design', 'UI/UX'], 'beginner', '3 hours', 'YouTube', true, 4.5),
('Figma Tutorial for Beginners', 'Learn Figma from scratch', 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', 'tutorial', ARRAY['Design', 'UI/UX'], 'beginner', '2 hours', 'Figma', true, 4.7),
('SQL for Data Analysis', 'Complete SQL course for analysts', 'https://mode.com/sql-tutorial/', 'tutorial', ARRAY['Business Analytics', 'Data Science'], 'beginner', '10 hours', 'Mode', true, 4.6),
('Google Analytics Academy', 'Learn Google Analytics for business', 'https://analytics.google.com/analytics/academy/', 'course', ARRAY['Business Analytics', 'Digital Marketing'], 'beginner', '20 hours', 'Google', true, 4.7),
('Product Management Fundamentals', 'Introduction to product management', 'https://www.youtube.com/watch?v=C27RVio2rOs', 'video', ARRAY['Product Management', 'Business'], 'beginner', '2 hours', 'YouTube', true, 4.5),
('Digital Marketing Course', 'Complete digital marketing guide', 'https://www.youtube.com/watch?v=nU-IIXBWlS4', 'video', ARRAY['Digital Marketing', 'Marketing'], 'beginner', '8 hours', 'Simplilearn', true, 4.6),
('SEO Training Course', 'Search engine optimization fundamentals', 'https://moz.com/beginners-guide-to-seo', 'tutorial', ARRAY['Digital Marketing', 'Marketing'], 'beginner', '5 hours', 'Moz', true, 4.7),
('Startup School', 'YC''s free startup course', 'https://www.startupschool.org/', 'course', ARRAY['Entrepreneurship', 'Business'], 'beginner', '20 hours', 'Y Combinator', true, 4.8),
('Resume Writing Guide', 'Create an outstanding resume', 'https://www.indeed.com/career-advice/resumes-cover-letters', 'article', ARRAY['Career Development'], 'beginner', '1 hour', 'Indeed', true, 4.5),
('Interview Preparation', 'Ace your next interview', 'https://www.youtube.com/watch?v=1mHjMNZZvFo', 'video', ARRAY['Career Development'], 'beginner', '2 hours', 'YouTube', true, 4.6);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_learning_resources_updated_at BEFORE UPDATE ON learning_resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
