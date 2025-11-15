import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'freelancer' | 'admin';
  created_at: string;
  updated_at: string;
};

export type FreelancerProfile = {
  id: string;
  user_id: string;
  skills: string[];
  portfolio_url: string | null;
  credentials: string | null;
  preferences: Record<string, unknown>;
  status: 'onboarded' | 'matched' | 'reviewed' | 'rejected';
  vetting_score: number;
  rejection_reasons: string[];
  created_at: string;
  updated_at: string;
};

export type ReviewRequest = {
  id: string;
  freelancer_id: string;
  explanation: string;
  amount: number;
  platforms: string[];
  additional_info: string | null;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_id: string | null;
  request_status: 'submitted' | 'approved' | 'rejected' | 'issued';
  admin_notes: string | null;
  approved_by: string | null;
  approved_at: string | null;
  issued_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Match = {
  id: string;
  freelancer_id: string;
  match_score: number;
  match_criteria: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'course' | 'mentorship' | 'template' | 'guide';
  skill_tags: string[];
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message_type: 'support' | 'general' | 'partnership' | 'other';
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  created_at: string;
};
