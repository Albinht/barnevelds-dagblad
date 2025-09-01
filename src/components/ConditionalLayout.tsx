'use client'

import { usePathname } from 'next/navigation'
import HeaderContainer from '@/components/HeaderContainer'
import Footer from '@/components/Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    // For admin routes, just render children (admin layout will handle header)
    return <>{children}</>
  }

  // For public routes, render with header and footer
  return (
    <>
      <HeaderContainer />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}