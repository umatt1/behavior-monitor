'use client'

import Script from 'next/script'
import { createClient } from '@/app/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback } from 'react'

declare global {
  interface Window {
    google: any
  }
}

const GoogleSignIn = () => {
  const supabase = createClient()
  const router = useRouter()

  // Generate nonce for security
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return [nonce, hashedNonce]
  }

  const initializeGoogleSignIn = useCallback(async () => {
    const [nonce, hashedNonce] = await generateNonce()

    // Check for existing session
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData.session) {
      router.push('/dashboard')
      return
    }

    if (window.google?.accounts) {
      console.log('Current origin:', window.location.origin)
      console.log('Initializing with client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce,
            })

            if (error) throw error
            router.push('/dashboard')
          } catch (error) {
            console.error('Error signing in with Google:', error)
          }
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
      })

      const buttonElement = document.getElementById('googleSignInButton')
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'pill',
        })
      }

      // Also initialize One Tap
      window.google.accounts.id.prompt()
    }
  }, [router])

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      window.google?.accounts?.id?.cancel()
    }
  }, [])

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        onLoad={() => initializeGoogleSignIn()}
      />
      <div id="googleSignInButton" className="flex justify-center mt-4" />
    </>
  )
}

export default GoogleSignIn
