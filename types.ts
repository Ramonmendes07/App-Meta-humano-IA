export enum Screen {
  Home = 'HOME',
  Running = 'RUNNING',
  Community = 'COMMUNITY',
  Dashboard = 'DASHBOARD',
  Challenges = 'CHALLENGES',
  CommunityChallenges = 'COMMUNITY_CHALLENGES',
}

export interface RunData {
  distance: number; // in km
  time: number; // in seconds
  avgPace: number; // in seconds per km
  date: string;
  elevationGain: number; // in meters
  source?: 'app' | 'strava';
  stravaId?: string;
}

export interface CommunityPost {
  id: number;
  author: string;
  avatar: string;
  content: string;
  run?: {
    distance: string;
    time: string;
    pace: string;
  };
  likes: number;
  comments: number;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  progress: number;
  goal: number;
  unit: string;
  reward: string;
}

export interface LeaderboardUser {
    rank: number;
    name: string;
    level: string;
    distance: number;
}

export interface CommunityChallenge {
  id: number;
  title: string;
  description: string;
  currentProgress: number;
  goal: number;
  unit: string;
  contributors: number;
  topContributor?: {
      name: string;
      distance: number;
  };
}

// --- AI Coach Types ---

export type AIRiskLevel = 'low' | 'moderate' | 'high';
export type AIFlag = 'injury_flag' | 'low_sleep' | 'low_hrv' | 'high_soreness' | 'high_stress';
export type AITrainingType = 'easy' | 'interval' | 'tempo' | 'long' | 'deload' | 'recovery_only';

export interface AIDiagnostics {
  delta_pace_percent: number;
  acwr: number;
  recovery_signal_0_3: number;
  risk_level: AIRiskLevel;
  flags: AIFlag[];
}

export interface AITodayPlan {
  type: AITrainingType;
  duration_min: number;
  structure: string[];
  notes: string;
  mental_protocol: string[];
  recovery: string[];
}

export interface AINeurotechMessage {
  short_push: string;
  storytelling: string;
  cta: string;
}

export interface AIOutput {
  summary: string;
  diagnostics: AIDiagnostics;
  today_plan: AITodayPlan;
  neurotech_message: AINeurotechMessage;
  educational_bits: string[];
}
