export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getDateRange = (days: number): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
};

export const calculateTrend = (incidents: { severity: number; date: string }[]): 'improving' | 'worsening' | 'stable' => {
  if (incidents.length < 2) return 'stable';

  const sortedIncidents = [...incidents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const recentIncidents = sortedIncidents.slice(-5);
  
  let trend = 0;
  for (let i = 1; i < recentIncidents.length; i++) {
    const diff = recentIncidents[i].severity - recentIncidents[i - 1].severity;
    trend += diff;
  }

  if (trend > 1) return 'worsening';
  if (trend < -1) return 'improving';
  return 'stable';
};
