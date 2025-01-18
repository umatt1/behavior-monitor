import { createClient } from '@/app/utils/supabase/server'
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader'
import { redirect } from 'next/navigation'
import { IncidentList } from '@/app/components/incidents/IncidentList'
import { IncidentHeatmap } from '@/app/components/dashboard/IncidentHeatmap'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/login')
  }

  const { data: incidents } = await supabase
    .from('incidents')
    .select('*')
    .order('date', { ascending: false })

  const stats = {
    totalIncidents: incidents?.length || 0,
    recentIncidents: incidents || [],
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardHeader />
          
          <div className="mt-4">
            <IncidentHeatmap incidents={stats.recentIncidents} />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Incidents</h2>
            <IncidentList incidents={stats.recentIncidents} />
          </div>
        </div>
      </main>
    </div>
  )
}
