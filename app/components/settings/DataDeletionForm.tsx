'use client'

import { useState } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface DataDeletionFormProps {
  userId: string
}

export function DataDeletionForm({ userId }: DataDeletionFormProps) {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteType, setDeleteType] = useState<'logs' | 'account'>('logs')

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      if (deleteType === 'logs') {
        // Delete all behavior logs
        const { error: deleteError } = await supabase
          .from('behavior_logs')
          .delete()
          .eq('user_id', userId)

        if (deleteError) throw deleteError

        alert('All behavior logs have been deleted')
        setConfirmText('')
        router.refresh()
      } else {
        // Delete account and all data
        const { error: logsError } = await supabase
          .from('behavior_logs')
          .delete()
          .eq('user_id', userId)

        const { error: prefsError } = await supabase
          .from('user_preferences')
          .delete()
          .eq('user_id', userId)

        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId)

        if (logsError || prefsError || profileError) {
          throw new Error('Failed to delete all data')
        }

        // Sign out
        await supabase.auth.signOut()
        router.push('/login')
      }
    } catch (err) {
      setError('An error occurred during deletion: ' + err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What would you like to delete?
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="deleteType"
              value="logs"
              checked={deleteType === 'logs'}
              onChange={() => setDeleteType('logs')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">
              Delete all behavior logs (keep account)
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="deleteType"
              value="account"
              checked={deleteType === 'account'}
              onChange={() => setDeleteType('account')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">
              Delete entire account and all data (cannot be undone)
            </span>
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        <p className="text-sm text-gray-600 mb-4">
          {deleteType === 'logs' 
            ? 'This will permanently delete all your behavior logs. Your account will remain active.'
            : 'This will permanently delete your account and all associated data. This action cannot be undone.'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-mono font-bold">DELETE</span> to confirm
          </label>
          <input
            id="confirm"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
            placeholder="DELETE"
          />
        </div>

        <button
          onClick={handleDelete}
          disabled={loading || confirmText !== 'DELETE'}
          className="w-full flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Deleting...' : `Delete ${deleteType === 'logs' ? 'Logs' : 'Account'}`}
        </button>
      </div>
    </div>
  )
}
