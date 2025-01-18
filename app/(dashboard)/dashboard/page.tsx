import { createClient } from '@/app/utils/supabase/server'
import { formatDate } from '@/app/utils/dates'
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader'
import { redirect } from 'next/navigation'

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
    .limit(5)

  const stats = {
    totalIncidents: incidents?.length || 0,
    recentIncidents: incidents || [],
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardHeader />
          
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Summary Cards */}
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-indigo-900">Total Incidents</h3>
                <p className="mt-2 text-3xl font-semibold text-indigo-600">{stats.totalIncidents}</p>
              </div>
            </div>
            
            {/* Recent Incidents List */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Recent Incidents</h3>
              <div className="mt-4 border-t border-gray-200">
                {stats.recentIncidents.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {stats.recentIncidents.map((incident) => (
                      <div key={incident.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {incident.category}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(incident.date)}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${incident.severity >= 4 ? 'bg-red-100 text-red-800' :
                              incident.severity >= 3 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'}`}>
                            Severity: {incident.severity}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {incident.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-gray-500 text-center">No incidents recorded yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
