import { getCurrentSession } from '@/lib/auth'
import AdminHeader from '@/components/admin/AdminHeader'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getCurrentSession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader username={session.username} />
      <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        {children}
      </main>
    </div>
  )
}