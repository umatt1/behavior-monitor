'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function OnboardingFlow() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const totalSteps = 4

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
            <button
              onClick={handleComplete}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome to Your Personal Reflection Tool
            </h2>
            <p className="text-gray-600">
              This is a private space designed to help you notice patterns in your experiences and relationships.
            </p>
            <p className="text-gray-600">
              Think of it as a journal that helps you see the bigger picture over time.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Understanding Memory in Stressful Situations
            </h2>
            <p className="text-gray-600">
              When we're in confusing or emotionally intense situations, our memory can become less reliable. 
              We might question what really happened or doubt our own experiences.
            </p>
            <p className="text-gray-600">
              This tool helps you create a consistent record, so you can look back and see patterns 
              you might not notice day-to-day.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> This is for personal clarity, not for building legal cases 
                or confronting others.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Privacy & Safety First
            </h2>
            <p className="text-gray-600">
              We've designed this tool with your safety in mind:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>All data is private and visible only to you</li>
              <li>No sharing features or partner access</li>
              <li>Use the quick exit button (⌨) to safely close at any time</li>
              <li>Keyboard shortcut: <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl+Shift+E</kbd></li>
              <li>You can delete all your data anytime from Settings</li>
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> If you're concerned about device access, consider using 
                private browsing mode or clearing your history after each session.
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              What to Expect
            </h2>
            <p className="text-gray-600">
              This tool will help you:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Log behaviors and situations as they happen</li>
              <li>Track your emotions before and after these events</li>
              <li>See patterns emerge over weeks and months</li>
              <li>Identify clustering of certain behaviors</li>
            </ul>
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <p className="text-sm text-gray-700">
                <strong>This tool does not:</strong>
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600">
                <li>Diagnose anyone with anything</li>
                <li>Tell you what decisions to make</li>
                <li>Provide legal or medical advice</li>
                <li>Share your data with anyone</li>
              </ul>
            </div>
            <p className="text-gray-600 font-medium">
              You're in control. Use this tool in whatever way helps you gain clarity.
            </p>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button
            onClick={() => step === totalSteps ? handleComplete() : setStep(step + 1)}
            className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {step === totalSteps ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
