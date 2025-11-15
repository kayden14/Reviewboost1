/*
  # ReviewBoost Database Schema

  ## Overview
  Creates the complete database structure for ReviewBoost platform including user management,
  freelancer profiles, review requests, matching system, and notifications.

  ## New Tables
  
  ### `profiles`
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `role` (text) - User role: 'freelancer' or 'admin'
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `freelancer_profiles`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `skills` (text[]) - Array of skills
  - `portfolio_url` (text) - Portfolio link
  - `credentials` (text) - Uploaded credentials info
  - `preferences` (jsonb) - Freelancer preferences
  - `status` (text) - Status: 'onboarded', 'matched', 'reviewed', 'rejected'
  - `vetting_score` (integer) - AI vetting score (0-100)
  - `rejection_reasons` (text[]) - Reasons if rejected
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `review_requests`
  - `id` (uuid, primary key)
  - `freelancer_id` (uuid) - References freelancer_profiles
  - `explanation` (text) - What kind of reviews needed
  - `amount` (decimal) - Payment amount
  - `platforms` (text[]) - Target platforms (Upwork, Fiverr, etc)
  - `additional_info` (text) - Optional special requests
  - `payment_status` (text) - Status: 'pending', 'completed', 'failed'
  - `payment_id` (text) - External payment reference
  - `request_status` (text) - Status: 'submitted', 'approved', 'rejected', 'issued'
  - `admin_notes` (text) - Admin comments
  - `approved_by` (uuid) - References profiles (admin)
  - `approved_at` (timestamptz)
  - `issued_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `matches`
  - `id` (uuid, primary key)
  - `freelancer_id` (uuid) - References freelancer_profiles
  - `match_score` (integer) - AI match score (0-100)
  - `match_criteria` (jsonb) - Criteria used for matching
  - `status` (text) - Status: 'pending', 'approved', 'rejected'
  - `reviewed_by` (uuid) - References profiles (admin)
  - `reviewed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### `notifications`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References profiles
  - `title` (text) - Notification title
  - `message` (text) - Notification content
  - `type` (text) - Type: 'info', 'success', 'warning', 'error'
  - `read` (boolean) - Read status
  - `created_at` (timestamptz)

  ### `resources`
  - `id` (uuid, primary key)
  - `title` (text) - Resource title
  - `description` (text) - Resource description
  - `url` (text) - Resource link
  - `category` (text) - Category: 'course', 'mentorship', 'template', 'guide'
  - `skill_tags` (text[]) - Related skills
  - `created_at` (timestamptz)

  ### `contact_messages`
  - `id` (uuid, primary key)
  - `name` (text) - Sender name
  - `email` (text) - Sender email
  - `message_type` (text) - Type: 'support', 'general', 'partnership', 'other'
  - `message` (text) - Message content
  - `status` (text) - Status: 'new', 'in_progress', 'resolved'
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies restrict access based on user roles
  - Admins have elevated permissions
  - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'freelancer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS freelancer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skills text[] DEFAULT '{}',
  portfolio_url text,
  credentials text,
  preferences jsonb DEFAULT '{}',
  status text DEFAULT 'onboarded',
  vetting_score integer DEFAULT 0,
  rejection_reasons text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS review_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id uuid NOT NULL REFERENCES freelancer_profiles(id) ON DELETE CASCADE,
  explanation text NOT NULL,
  amount decimal(10,2) NOT NULL,
  platforms text[] NOT NULL,
  additional_info text,
  payment_status text DEFAULT 'pending',
  payment_id text,
  request_status text DEFAULT 'submitted',
  admin_notes text,
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz,
  issued_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id uuid NOT NULL REFERENCES freelancer_profiles(id) ON DELETE CASCADE,
  match_score integer DEFAULT 0,
  match_criteria jsonb DEFAULT '{}',
  status text DEFAULT 'pending',
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  category text NOT NULL,
  skill_tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message_type text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelancer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Freelancers can view own profile"
  ON freelancer_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Freelancers can insert own profile"
  ON freelancer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Freelancers can update own profile"
  ON freelancer_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all freelancer profiles"
  ON freelancer_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update freelancer profiles"
  ON freelancer_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Freelancers can view own review requests"
  ON review_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM freelancer_profiles
      WHERE freelancer_profiles.id = review_requests.freelancer_id
      AND freelancer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Freelancers can create review requests"
  ON review_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM freelancer_profiles
      WHERE freelancer_profiles.id = review_requests.freelancer_id
      AND freelancer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all review requests"
  ON review_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update review requests"
  ON review_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Freelancers can view own matches"
  ON matches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM freelancer_profiles
      WHERE freelancer_profiles.id = matches.freelancer_id
      AND freelancer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all matches"
  ON matches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage matches"
  ON matches FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can view resources"
  ON resources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage resources"
  ON resources FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can create contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_freelancer_profiles_user_id ON freelancer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_review_requests_freelancer_id ON review_requests(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_matches_freelancer_id ON matches(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
