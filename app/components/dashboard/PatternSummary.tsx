'use client'

import { BehaviorLog } from '@/app/types'
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'

interface PatternSummaryProps {
  logs: BehaviorLog[]
}

export function PatternSummary({ logs }: PatternSummaryProps) {
  if (logs.length === 0) {
    return null
  }

  // Get current week
  const now = new Date()
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)

  // Get last week
  const lastWeekStart = subDays(weekStart, 7)
  const lastWeekEnd = subDays(weekEnd, 7)

  const thisWeekLogs = logs.filter(log => 
    isWithinInterval(new Date(log.date), { start: weekStart, end: weekEnd })
  )

  const lastWeekLogs = logs.filter(log => 
    isWithinInterval(new Date(log.date), { start: lastWeekStart, end: lastWeekEnd })
  )

  // Calculate category frequency
  const categoryCounts: Record<string, number> = {}
  logs.forEach(log => {
    categoryCounts[log.category] = (categoryCounts[log.category] || 0) + 1
  })

  const mostCommonCategory = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  // Calculate average intensity
  const avgIntensity = logs.length > 0
    ? (logs.reduce((sum, log) => sum + log.intensity, 0) / logs.length).toFixed(1)
    : 0

  // Check for clustering (3+ logs within 7 days)
  const recentLogs = logs.filter(log => 
    isWithinInterval(new Date(log.date), { start: subDays(now, 7), end: now })
  )
  const isClustering = recentLogs.length >= 3

  // Emotion comparison
  const emotionBefore = logs
    .filter(l => l.emotion_before)
    .map(l => l.emotion_before?.toLowerCase() || '')
  
  const emotionAfter = logs
    .filter(l => l.emotion_after)
    .map(l => l.emotion_after?.toLowerCase() || '')

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-medium text-gray-900 mb-4">Pattern Observations</h2>
      <p className="text-sm text-gray-600 mb-4">
        These are descriptive patterns based on your logged entries. They are observations, not conclusions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-l-4 border-indigo-500 pl-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">This Week</h3>
          <p className="text-2xl font-semibold text-gray-900">{thisWeekLogs.length}</p>
          <p className="text-sm text-gray-500">
            entries ({lastWeekLogs.length} last week)
          </p>
        </div>

        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Most Frequent</h3>
          <p className="text-lg font-medium text-gray-900">
            {mostCommonCategory || 'N/A'}
          </p>
          <p className="text-sm text-gray-500">
            {categoryCounts[mostCommonCategory] || 0} times total
          </p>
        </div>

        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Average Intensity</h3>
          <p className="text-2xl font-semibold text-gray-900">{avgIntensity}</p>
          <p className="text-sm text-gray-500">out of 5</p>
        </div>

        {isClustering && (
          <div className="border-l-4 border-amber-500 pl-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h3>
            <p className="text-sm text-gray-900">
              You've logged {recentLogs.length} entries in the past week
            </p>
            <p className="text-sm text-gray-500">
              This shows increased frequency recently
            </p>
          </div>
        )}
      </div>

      {(emotionBefore.length > 0 || emotionAfter.length > 0) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Emotional Patterns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {emotionBefore.length > 0 && (
              <div>
                <p className="text-gray-600 mb-1">Common feelings before:</p>
                <p className="text-gray-900">
                  {Array.from(new Set(emotionBefore)).slice(0, 5).join(', ')}
                </p>
              </div>
            )}
            {emotionAfter.length > 0 && (
              <div>
                <p className="text-gray-600 mb-1">Common feelings after:</p>
                <p className="text-gray-900">
                  {Array.from(new Set(emotionAfter)).slice(0, 5).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          Remember: These are patterns in your observations, not diagnoses or judgments. 
          Use this information for personal reflection and clarity.
        </p>
      </div>
    </div>
  )
}
