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

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardHeader />
          
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
