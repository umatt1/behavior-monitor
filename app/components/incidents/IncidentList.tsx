'use client'

import { createClient } from '@/app/utils/supabase/client'
import { Incident } from '@/app/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface IncidentListProps {
  incidents: Incident[]
}

export function IncidentList({ incidents: initialIncidents }: IncidentListProps) {
  const [incidents, setIncidents] = useState(initialIncidents)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this incident?')) {
      return
    }

    setLoading(id)
    setError(null)

    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Update local state
      setIncidents(incidents.filter(incident => incident.id !== id))
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete incident')
    } finally {
      setLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (incidents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No incidents recorded yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      <ul role="list" className="divide-y divide-gray-200">
        {incidents.map((incident) => (
          <li key={incident.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="truncate text-sm font-medium text-indigo-600">
                    {incident.category}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">{incident.description}</p>
                  <div className="mt-2 flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Severity: {incident.severity}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(incident.date)}</span>
                    </div>
                  </div>
                  {incident.location && (
                    <p className="mt-1 text-sm text-gray-500">
                      Location: {incident.location}
                    </p>
                  )}
                  {incident.witnesses && (
                    <p className="mt-1 text-sm text-gray-500">
                      Witnesses: {incident.witnesses}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => router.push(`/incidents/${incident.id}/edit`)}
                    className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(incident.id)}
                    disabled={loading === incident.id}
                    className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    {loading === incident.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
