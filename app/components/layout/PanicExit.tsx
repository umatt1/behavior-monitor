'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function PanicExit() {
  const router = useRouter()

  const handlePanicExit = () => {
    // Clear recent history and redirect to a neutral site
    window.location.replace('https://www.weather.com')
  }

  useEffect(() => {
    // Keyboard shortcut: Ctrl+Shift+E or Cmd+Shift+E
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.ctrlKey || e.metaKey) && e.key === 'E') {
        e.preventDefault()
        handlePanicExit()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <button
      onClick={handlePanicExit}
      className="fixed bottom-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs px-3 py-1.5 rounded shadow-sm transition-colors"
      title="Quick exit (Ctrl+Shift+E)"
      aria-label="Quick exit to weather.com"
    >
      ⌨
    </button>
  )
}
