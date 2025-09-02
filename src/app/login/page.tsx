import { Suspense } from 'react'
import GoogleLoginForm from '@/components/admin/GoogleLoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <GoogleLoginForm />
    </Suspense>
  )
}