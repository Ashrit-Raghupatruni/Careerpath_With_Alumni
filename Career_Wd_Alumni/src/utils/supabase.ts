import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Alumni {
  id: string;
  name: string;
  company: string;
  role: string;
  batch: string;
  email: string;
  linkedin_url?: string;
  skills: string[];
  interests: string[];
  summary?: string;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  graduation_year?: string;
  current_education?: string;
  bio?: string;
  skills: string[];
  interests: string[];
  experience: any[];
  education: any[];
  certifications: string[];
  resume_text?: string;
  created_at: string;
  updated_at: string;
}

export interface QuizResponse {
  id: string;
  user_id?: string;
  answers: Record<string, any>;
  matched_alumni_ids: string[];
  score: number;
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id?: string;
  message: string;
  rating: number;
  date: string;
}

export interface SkillPathway {
  id: string;
  skill_name: string;
  category: string;
  difficulty: string;
  prerequisites: string[];
  resources: any[];
  duration: string;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  payment_id?: string;
  created_at: string;
  expires_at?: string;
}

export interface PaymentHistory {
  id: string;
  user_id: string;
  plan: string;
  amount: number;
  status: string;
  date: string;
}
