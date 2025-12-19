'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function UpgradeAccount() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleUpgrade = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Update the anonymous user with email and password
      const { error: updateError } = await supabase.auth.updateUser({
        email,
        password,
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      setSuccess('Account upgraded! You can now sign in from any device with your email.')
      setEmail('')
      setPassword('')
      
      // Refresh to update UI
      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (err) {
      setError('An unexpected error occurred: ' + err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Add Email to Your Account
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            You&apos;re currently using an anonymous account. Add an email and password to:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Access your data from other devices</li>
            <li>Recover your account if you clear browser data</li>
            <li>Use the magic link feature</li>
          </ul>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
            {success}
          </div>
        )}

        <form className="mt-5 space-y-4" onSubmit={handleUpgrade}>
          <div>
            <label htmlFor="upgrade-email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="upgrade-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="upgrade-password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="upgrade-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Upgrading...' : 'Add Email & Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
