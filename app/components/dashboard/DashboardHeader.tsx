'use client'

import { useAuth } from '@/app/components/auth/AuthProvider'
import Link from 'next/link'

export function DashboardHeader() {
  const { signOut } = useAuth()

  return (
    <div className="sm:flex sm:items-center justify-between mb-8">
      <div className="sm:flex-auto">
        <h1 className="text-3xl font-semibold text-gray-900">Your Reflections</h1>
        <p className="mt-2 text-sm text-gray-700">
          Notice patterns in your experiences over time
        </p>
      </div>
      <div className="mt-4 sm:mt-0 sm:flex space-x-4 items-center">
        <Link
          href="/incidents/new"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          Log new entry
        </Link>
        <Link
          href="/settings"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          Settings
        </Link>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
