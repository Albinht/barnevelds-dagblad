'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')
  const email = searchParams?.get('email')

  let errorMessage = 'An error occurred during authentication.'
  let errorDetails = ''

  switch (error) {
    case 'AccessDenied':
      errorMessage = 'Access Denied'
      errorDetails = email 
        ? `The email "${email}" is not authorized to access the admin panel. Only whitelisted editorial accounts can login.`
        : 'Your email is not authorized to access the admin panel.'
      break
    case 'NoEmail':
      errorMessage = 'No Email Provided'
      errorDetails = 'Google did not provide an email address. Please ensure you are using a valid Google account.'
      break
    case 'Configuration':
      errorMessage = 'Configuration Error'
      errorDetails = 'There is a problem with the authentication configuration. Please contact the administrator.'
      break
    case 'Default':
      errorMessage = 'Authentication Failed'
      errorDetails = 'Unable to sign in. Please try again or contact the administrator.'
      break
    default:
      if (error) {
        errorMessage = 'Authentication Error'
        errorDetails = `Error code: ${error}`
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Barnevelds Dagblad
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Authentication Error
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            {errorMessage}
          </h3>
          
          <p className="text-sm text-gray-600 text-center mb-6">
            {errorDetails}
          </p>

          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </Link>
            
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Homepage
            </Link>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Authorized Emails Only
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Only the following emails can access the admin panel:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>al.hasan.al@gmail.com</li>
                    <li>schilderenopnummerwinkel@gmail.com</li>
                    <li>editor@barneveldsdagblad.nl</li>
                    <li>redacteur@barneveldsdagblad.nl</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}