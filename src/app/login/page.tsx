import { Suspense } from 'react'
import LoginForm from '@/components/admin/LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}