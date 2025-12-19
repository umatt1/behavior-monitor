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
          .from('behavior_logs')
          .select('*')
          .eq('id', resolvedParams.id)
          .single()

        if (error) throw error
        setIncident(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entry')
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
      intensity: parseInt(formData.get('intensity') as string),
      description: formData.get('description') as string,
      context: formData.get('context') as string,
      emotion_before: formData.get('emotion_before') as string,
      emotion_after: formData.get('emotion_after') as string,
    }

    try {
      const supabase = createClient()
      const { error: submitError } = await supabase
        .from('behavior_logs')
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
              <div>Loading entry...</div>
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Edit Entry</h1>
          <p className="text-sm text-gray-600 mb-6">
            Update your observation with any additional details.
          </p>
          
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
                What happened?
              </label>
              <select
                id="category"
                name="category"
                defaultValue={incident.category}
                className="mt-1 block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option>Broken promises</option>
                <option>Boundary violations</option>
                <option>Sudden affection after conflict</option>
                <option>Gaslighting indicators</option>
                <option>Intimidation or pressure</option>
                <option>Emotional withdrawal</option>
                <option>Inconsistent communication</option>
                <option>Pattern interruption</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="intensity" className="block text-sm font-medium text-gray-900">
                How intense was this experience?
              </label>
              <input
                type="range"
                min="1"
                max="5"
                defaultValue={(incident as any).intensity || (incident as any).severity || 1}
                className="mt-1 block w-full accent-indigo-600"
                id="intensity"
                name="intensity"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Mild (1)</span>
                <span>Moderate (3)</span>
                <span>Intense (5)</span>
              </div>
            </div>

            <div>
              <label htmlFor="emotion_before" className="block text-sm font-medium text-gray-900">
                How did you feel before this?
              </label>
              <input
                type="text"
                name="emotion_before"
                id="emotion_before"
                defaultValue={(incident as any).emotion_before}
                className="mt-1 block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., calm, anxious, hopeful..."
              />
            </div>

            <div>
              <label htmlFor="emotion_after" className="block text-sm font-medium text-gray-900">
                How did you feel after?
              </label>
              <input
                type="text"
                name="emotion_after"
                id="emotion_after"
                defaultValue={(incident as any).emotion_after}
                className="mt-1 block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., confused, relieved, upset..."
              />
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
              <label htmlFor="context" className="block text-sm font-medium text-gray-900">
                Context (optional)
              </label>
              <input
                type="text"
                name="context"
                id="context"
                defaultValue={(incident as any).context || (incident as any).location || ''}
                className="mt-1 block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Where or when did this happen?"
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
