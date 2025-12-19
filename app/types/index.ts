export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Neutral language: behavior_log instead of incident
export interface BehaviorLog {
  id: string;
  user_id: string;
  date: string;
  category: 
    | 'Broken promises'
    | 'Boundary violations'
    | 'Sudden affection after conflict'
    | 'Gaslighting indicators'
    | 'Intimidation or pressure'
    | 'Emotional withdrawal'
    | 'Inconsistent communication'
    | 'Pattern interruption'
    | 'Other';
  intensity: number; // 1-5 scale, renamed from severity
  description: string;
  context?: string; // renamed from location for broader use
  emotion_before?: string;
  emotion_after?: string;
  created_at: string;
  updated_at: string;
}

// Keep Incident as alias for backward compatibility during migration
export type Incident = BehaviorLog;

export interface DashboardStats {
  totalLogs: number;
  recentLogs: BehaviorLog[];
  intensityTrend: 'improving' | 'worsening' | 'stable';
  mostCommonCategory: string;
}
