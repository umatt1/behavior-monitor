export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Incident {
  id: string;
  user_id: string;
  date: string;
  category: 'Verbal' | 'Physical' | 'Emotional' | 'Financial' | 'Other';
  severity: number;
  description: string;
  location?: string;
  witnesses?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalIncidents: number;
  recentIncidents: Incident[];
  severityTrend: 'improving' | 'worsening' | 'stable';
  mostCommonCategory: string;
}
