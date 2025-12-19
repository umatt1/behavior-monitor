'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/app/utils/supabase/client'

interface PinLockProps {
  onUnlock: () => void
}

export function PinLock({ onUnlock }: PinLockProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Session expired')
        return
      }

      // Hash the PIN on client side using Web Crypto API
      const encoder = new TextEncoder()
      const data = encoder.encode(pin)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      // Check against stored hash
      const { data: preferences, error: prefError } = await supabase
        .from('user_preferences')
        .select('pin_hash')
        .eq('user_id', user.id)
        .single()

      if (prefError || !preferences) {
        setError('Unable to verify PIN')
        return
      }

      if (preferences.pin_hash === hashHex) {
        sessionStorage.setItem('pin_unlocked', 'true')
        onUnlock()
      } else {
        setError('Incorrect PIN')
        setPin('')
      }
    } catch {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Enter PIN
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter your PIN"
              className="block w-full text-center text-2xl tracking-widest appearance-none rounded-md border border-gray-300 px-3 py-4 placeholder-gray-400 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || pin.length < 4}
            className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Unlock'}
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-500 text-center">
          This adds an extra layer of privacy to your journal
        </p>
      </div>
    </div>
  )
}
