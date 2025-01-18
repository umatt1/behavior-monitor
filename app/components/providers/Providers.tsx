'use client'

import { AuthProvider } from '../auth/AuthProvider'

export function Providers({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: any
}) {
  return <AuthProvider initialSession={initialSession}>{children}</AuthProvider>
}
