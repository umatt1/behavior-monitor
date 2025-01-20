'use client'

import { createClient } from '@/app/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { Incident } from '@/app/types'
import { use } from 'react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditIncidentPage({ params }: PageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [incident, setIncident] = useState<Incident | null>(null)
  const resolvedParams = use(params)

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .eq('id', resolvedParams.id)
          .single()

        if (error) throw error
        setIncident(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load incident')
      }
    }

    fetchIncident()
  }, [resolvedParams.id])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const rawDate = formData.get('date') as string
    
    if (!rawDate) {
      setError('Date is required')
      setLoading(false)
      return
    }

    let date: string
    try {
      const dateObj = new Date(rawDate)
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date format')
      }
      date = dateObj.toISOString()
    } catch (err) {
      setError('Please enter a valid date and time' + err)
      setLoading(false)
      return
    }
    
    const data = {
      date,
      category: formData.get('category') as string,
      severity: parseInt(formData.get('severity') as string),
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      witnesses: formData.get('witnesses') as string,
    }

    try {
      const supabase = createClient()
      const { error: submitError } = await supabase
        .from('incidents')
        .update(data)
        .eq('id', resolvedParams.id)

      if (submitError) throw submitError

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            {error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <div>Loading incident...</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Incident</h1>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-900">
                Date and Time
              </label>
              <input
                type="datetime-local"
                name="date"
                id="date"
                required
                defaultValue={new Date(incident.date).toISOString().slice(0, 16)}
                className="mt-1 block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-900">
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue={incident.category}
                className="mt-1 block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option>Verbal</option>
                <option>Physical</option>
                <option>Emotional</option>
                <option>Financial</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-900">
                Severity Level
              </label>
              <input
                type="range"
                min="1"
                max="5"
                defaultValue={incident.severity}
                className="mt-1 block w-full accent-indigo-600"
                id="severity"
                name="severity"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Minor (1)</span>
                <span>Moderate (3)</span>
                <span>Severe (5)</span>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                defaultValue={incident.description}
                className="mt-1 block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Describe what happened..."
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                defaultValue={incident.location}
                className="mt-1 block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Where did this occur?"
              />
            </div>

            <div>
              <label htmlFor="witnesses" className="block text-sm font-medium text-gray-900">
                Witnesses
              </label>
              <input
                type="text"
                name="witnesses"
                id="witnesses"
                defaultValue={incident.witnesses}
                className="mt-1 block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Were there any witnesses? (Optional)"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
