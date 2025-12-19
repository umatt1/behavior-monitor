import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'
import { OnboardingFlow } from '@/app/components/onboarding/OnboardingFlow'

export default async function OnboardingPage() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/login')
  }

  return <OnboardingFlow />
}
