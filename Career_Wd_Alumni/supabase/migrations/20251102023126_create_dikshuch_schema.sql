/*
  # Dikshuch Alumni Career Recommendation System - Database Schema

  ## Overview
  Complete database schema for the Dikshuch Alumni Career Recommendation System
  
  ## Tables Created
  
  1. **alumni** - Stores alumni information including career details and skills
     - id (uuid, primary key)
     - name (text) - Alumni full name
     - company (text) - Current company
     - role (text) - Current job role
     - batch (text) - Graduation batch/year
     - email (text, unique) - Contact email
     - linkedin_url (text) - LinkedIn profile URL
     - skills (text array) - Technical and soft skills
     - interests (text array) - Professional interests
     - summary (text) - Professional summary
     - created_at (timestamptz) - Record creation timestamp
  
  2. **student_profiles** - Student information and profiles
     - id (uuid, primary key)
     - user_id (uuid, references auth.users) - Connected to authenticated user
     - name (text) - Student name
     - email (text) - Student email
     - linkedin_url (text) - LinkedIn profile
     - github_url (text) - GitHub profile
     - skills (text array) - Student skills
     - interests (text array) - Career interests
     - experience (jsonb) - Work experience details
     - education (jsonb) - Education details
     - certifications (text array) - Professional certifications
     - resume_text (text) - Parsed resume content
     - created_at, updated_at (timestamptz)
  
  3. **quiz_responses** - Career quiz responses and matching results
     - id (uuid, primary key)
     - user_id (uuid) - Student who took quiz
     - answers (jsonb) - Quiz answers
     - matched_alumni_ids (uuid array) - Matched alumni IDs
     - score (integer) - Overall matching score
     - created_at (timestamptz)
  
  4. **feedback** - User feedback and contact messages
     - id (uuid, primary key)
     - user_id (uuid) - User who submitted feedback
     - message (text) - Feedback message
     - rating (integer) - Rating (1-5)
     - date (timestamptz) - Submission date
  
  5. **analytics_events** - System analytics and user activity tracking
     - id (uuid, primary key)
     - event_type (text) - Type of event
     - user_id (uuid) - Associated user
     - timestamp (timestamptz) - Event timestamp
     - metadata (jsonb) - Additional event data
  
  6. **moderation_logs** - Admin moderation action logs
     - id (uuid, primary key)
     - action (text) - Action taken
     - target (text) - Target of action
     - admin_id (uuid) - Admin who performed action
     - timestamp (timestamptz)
  
  7. **skill_pathways** - Learning path recommendations
     - id (uuid, primary key)
     - skill_name (text) - Name of skill
     - category (text) - Skill category
     - difficulty (text) - Difficulty level
     - prerequisites (text array) - Required prerequisites
     - resources (jsonb) - Learning resources
     - duration (text) - Estimated completion time
     - created_at (timestamptz)
  
  8. **mentor_connections** - Student-alumni mentorship connections
     - id (uuid, primary key)
     - student_id (uuid) - Student user ID
     - alumni_id (uuid, references alumni) - Alumni ID
     - status (text) - Connection status
     - created_at (timestamptz)
  
  9. **admin_users** - Admin user accounts
     - id (uuid, primary key)
     - email (text, unique) - Admin email
     - role (text) - Admin role
     - password_hash (text) - Hashed password
     - created_at (timestamptz)
  
  10. **student_goals** - Student career goals and progress
      - id (uuid, primary key)
      - user_id (uuid) - Student user ID
      - title (text) - Goal title
      - category (text) - Goal category
      - progress (integer) - Progress percentage
      - completed (boolean) - Completion status
      - created_at, updated_at (timestamptz)
  
  11. **user_subscriptions** - User subscription plans
      - id (uuid, primary key)
      - user_id (uuid) - Subscribed user
      - plan (text) - Plan type (Free, Pro, Enterprise)
      - status (text) - Subscription status
      - payment_id (text) - Payment reference
      - created_at, expires_at (timestamptz)
  
  12. **payment_history** - Payment transaction history
      - id (uuid, primary key)
      - user_id (uuid) - User who made payment
      - plan (text) - Purchased plan
      - amount (decimal) - Payment amount
      - status (text) - Payment status
      - date (timestamptz) - Payment date
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies created for authenticated user access
  - Admin-only access for sensitive tables
  - Users can only view/edit their own data
*/

-- Create alumni table
CREATE TABLE IF NOT EXISTS alumni (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL,
  role text NOT NULL,
  batch text NOT NULL,
  email text UNIQUE NOT NULL,
  linkedin_url text,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  summary text,
  created_at timestamptz DEFAULT now()
);

-- Create student_profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  linkedin_url text,
  github_url text,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  experience jsonb DEFAULT '[]',
  education jsonb DEFAULT '[]',
  certifications text[] DEFAULT '{}',
  resume_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quiz_responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  answers jsonb NOT NULL DEFAULT '{}',
  matched_alumni_ids uuid[] DEFAULT '{}',
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  message text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  date timestamptz DEFAULT now()
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- Create moderation_logs table
CREATE TABLE IF NOT EXISTS moderation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  target text NOT NULL,
  admin_id uuid,
  timestamp timestamptz DEFAULT now()
);

-- Create skill_pathways table
CREATE TABLE IF NOT EXISTS skill_pathways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL,
  prerequisites text[] DEFAULT '{}',
  resources jsonb DEFAULT '[]',
  duration text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create mentor_connections table
CREATE TABLE IF NOT EXISTS mentor_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  alumni_id uuid REFERENCES alumni(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text DEFAULT 'admin',
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create student_goals table
CREATE TABLE IF NOT EXISTS student_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan text DEFAULT 'Free',
  status text DEFAULT 'active',
  payment_id text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan text NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'completed',
  date timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Alumni policies (public read, admin write)
CREATE POLICY "Alumni visible to all users"
  ON alumni FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert alumni"
  ON alumni FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Admins can update alumni"
  ON alumni FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Admins can delete alumni"
  ON alumni FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- Student profiles policies
CREATE POLICY "Users can view own profile"
  ON student_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON student_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON student_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON student_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- Quiz responses policies
CREATE POLICY "Users can view own quiz responses"
  ON quiz_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert quiz responses"
  ON quiz_responses FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Users can update own quiz responses"
  ON quiz_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Feedback policies
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can submit feedback"
  ON feedback FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Admins can view all feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- Analytics events policies
CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Admins can view all analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- Moderation logs policies
CREATE POLICY "Admins can view moderation logs"
  ON moderation_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Admins can insert moderation logs"
  ON moderation_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- Skill pathways policies (public read)
CREATE POLICY "Skill pathways visible to all"
  ON skill_pathways FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage skill pathways"
  ON skill_pathways FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- Mentor connections policies
CREATE POLICY "Users can view own mentor connections"
  ON mentor_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Users can create mentor connections"
  ON mentor_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update own connections"
  ON mentor_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Admin users policies
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- Student goals policies
CREATE POLICY "Users can view own goals"
  ON student_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON student_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON student_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON student_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User subscriptions policies
CREATE POLICY "Users can view own subscription"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscription"
  ON user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- Payment history policies
CREATE POLICY "Users can view own payment history"
  ON payment_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert payment history"
  ON payment_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON payment_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email')
  );
