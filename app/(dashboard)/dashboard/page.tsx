import { createClient } from '@/app/utils/supabase/server'
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader'
import { redirect } from 'next/navigation'
import { IncidentList } from '@/app/components/incidents/IncidentList'
import { IncidentHeatmap } from '@/app/components/dashboard/IncidentHeatmap'
import { PatternSummary } from '@/app/components/dashboard/PatternSummary'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/login')
  }

  // Use behavior_logs table with neutral language
  const { data: behaviorLogs } = await supabase
    .from('behavior_logs')
    .select('*')
    .order('date', { ascending: false })

  const stats = {
    totalLogs: behaviorLogs?.length || 0,
    recentLogs: behaviorLogs || [],
  }

  const isAnonymous = user.is_anonymous || !user.email

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardHeader />
          
          {isAnonymous && (
            <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-800">
                    <strong>Anonymous Session:</strong> Your data will be lost if you clear cookies or use another device. 
                    <a href="/settings" className="font-medium underline hover:text-amber-900 ml-1">
                      Add an email in Settings
                    </a> to protect your entries.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <PatternSummary logs={stats.recentLogs} />
          
          <div className="mt-4">
            <IncidentHeatmap incidents={stats.recentLogs} />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Entries</h2>
            <IncidentList incidents={stats.recentLogs} />
          </div>
        </div>
      </main>
    </div>
  )
}
