import { redirect } from 'next/navigation'

export default async function Home() {
  redirect('/dashboard')
  // This return is just for TypeScript, the redirect will happen first
  return null
}