'use client'

import { AuthProvider } from '../auth/AuthProvider'

interface ProvidersProps {
  children: React.ReactNode
  initialSession: any
}

export function Providers({ children, initialSession }: ProvidersProps) {
  return (
    <AuthProvider initialSession={initialSession}>
      {children}
    </AuthProvider>
  )
}
