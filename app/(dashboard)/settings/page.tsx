import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'
import { DataDeletionForm } from '@/app/components/settings/DataDeletionForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">Settings</h1>
          
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Privacy & Data</h2>
            <p className="text-sm text-gray-600 mb-6">
              Manage your data and privacy settings. All data is stored privately and securely.
            </p>
            
            <DataDeletionForm userId={user.id} />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">About This Tool</h2>
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                This is a private reflection tool designed to help you observe patterns in your experiences.
              </p>
              <p className="font-medium text-gray-700">
                Important Disclaimer:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>This tool is not a substitute for professional mental health care</li>
                <li>It is not designed to provide legal advice or evidence</li>
                <li>Observations recorded here are for personal reflection only</li>
                <li>If you are in immediate danger, please contact emergency services</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="font-medium text-gray-700 mb-2">Resources:</p>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="https://www.thehotline.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 underline"
                    >
                      National Domestic Violence Hotline
                    </a>
                    {' '}- Online chat available
                  </li>
                  <li>
                    <a 
                      href="https://www.rainn.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 underline"
                    >
                      RAINN
                    </a>
                    {' '}- Online support and resources
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
