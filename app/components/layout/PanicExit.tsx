'use client'

import { useEffect } from 'react'

export function PanicExit() {
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
      className="fixed bottom-4 right-4 z-50 bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs px-3 py-2 rounded-md shadow-md hover:shadow-lg transition-all border border-gray-400"
      title="Quick exit (Ctrl+Shift+E)"
      aria-label="Quick exit to weather.com"
    >
      <span className="flex items-center gap-1.5">
        <span>⌨</span>
        <span className="text-[10px] opacity-75">ESC</span>
      </span>
    </button>
  )
}
